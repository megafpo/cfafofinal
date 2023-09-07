<?php

namespace App\Http\Controllers;

use App\User;
use App\Order;
use Throwable;
use App\RazorpayData;
use Razorpay\Api\Api;
use Illuminate\Http\Request;
use Ixudra\Curl\Facades\Curl;
use Illuminate\Support\Facades\DB;
use Nwidart\Modules\Facades\Module;
use Razorpay\Api\Errors\SignatureVerificationError;
use App\Helpers\TranslationHelper;

class RazorpayController extends Controller
{
    public function razorPayCreateOrder(Request $request)
    {
        $api_key = config('setting.razorpayKeyId');
        $api_secret = config('setting.razorpayKeySecret');

        $order = Order::where('id', $request->order_id)->first();

        if (!$order) {
            abort(404, 'Order not found');
        }
        if ($order->orderstatus_id == 5 || $order->orderstatus_id == 6 || $order->orderstatus_id == 9) {
            abort(404, 'Order already completed or cancelled');
        }

        if ($order->wallet_amount != 0) {
            $orderTotal = $order->total - $order->wallet_amount;
        } else {
            if ($order->payable == 0) {
                $orderTotal = $order->total;
            } else {
                $orderTotal = $order->payable;
            }
        }

        try {
            $uniqueOrderId = $order->unique_order_id;
            $notes = [
                'order_id' => $uniqueOrderId,
                'customer_name' => $order->user->name,
            ];

            $razorPayResponse = Curl::to('https://api.razorpay.com/v1/orders')
                ->withOption('USERPWD', "$api_key:$api_secret")
                ->withData(array(
                    'amount' => $orderTotal * 100,
                    'currency' => config('setting.currencyId'),
                    'payment_capture' => 1,
                    'notes' => $notes
                ))
                ->post();

            $razorPayResponse = json_decode($razorPayResponse);

            $response = [
                'razorpay_success' => true,
                'response' => [
                    'id' => $razorPayResponse->id,
                ],
            ];

            //save or update razorpay data for that particular order.
            if ($order->razorpay_data) {
                $order->razorpay_data->razorpay_order_id_first = $razorPayResponse->id;
                $order->razorpay_data->save();
            } else {
                $razorPayData = new RazorpayData();
                $razorPayData->order_id = $order->id;
                $razorPayData->razorpay_order_id_first = $razorPayResponse->id;
                $razorPayData->save();
            }

            return response()->json($response);
        } catch (\Throwable $th) {
            $response = [
                'razorpay_success' => false,
                'message' => $th->getMessage(),
            ];
            return response()->json($response);
        }
    }

    /**
     * @param Request $request
     */
    public function processRazorpayPayment(Request $request)
    {
        $api_key = config('setting.razorpayKeyId');
        $api_secret = config('setting.razorpayKeySecret');

        $razorpay_order_id = $request->razorpay_order_id;
        $razorpay_payment_id = $request->razorpay_payment_id;
        $razorpay_signature = $request->razorpay_signature;

        //internal razorpay response verification...
        try {
            $api = new Api($api_key, $api_secret);
            $attributes  = [
                'razorpay_order_id' => $razorpay_order_id,
                'razorpay_payment_id'  => $razorpay_payment_id,
                'razorpay_signature'  => $razorpay_signature
            ];
            $api->utility->verifyPaymentSignature($attributes);
        } catch (SignatureVerificationError $e) {
            dd("Payment verification failed");
        }

        DB::beginTransaction();

        try {
            $order = Order::where('id', $request->order_id)->with('restaurant')->lockForUpdate()->first();

            if (!$order) {
                abort(404, 'Order not found');
            }
            if ($order->orderstatus_id == '5' || $order->orderstatus_id == '6' || $order->orderstatus_id == '9') {
                abort(404, 'Order already completed or cancelled');
            }
            if ($order->razorpay_data == null) {
                abort(404, 'No razorpay data found for this order.');
            }

            $mySignature = hash_hmac('sha256', $order->razorpay_data->razorpay_order_id_first . '|' . $razorpay_payment_id, $api_secret);

            if ($mySignature == $razorpay_signature) {

                if ($order->orderstatus_id == '8') {

                    //save razorpay data on DB...
                    $order->razorpay_data->razorpay_order_id_second = $razorpay_order_id;
                    $order->razorpay_data->razorpay_payment_id = $razorpay_payment_id;
                    $order->razorpay_data->razorpay_signature = $razorpay_signature;
                    $order->razorpay_data->save();

                    if ($order->restaurant->auto_acceptable) {
                        $orderstatus_id = '2';
                        if (Module::find('OrderSchedule') && Module::find('OrderSchedule')->isEnabled() && $order->schedule_date != null && $order->schedule_slot != null) {
                            $orderstatus_id = '10';
                        }
                    } else {
                        $orderstatus_id = '1';
                        if (Module::find('OrderSchedule') && Module::find('OrderSchedule')->isEnabled()) {
                            if ($order->schedule_date != null && $order->schedule_slot != null) {
                                $orderstatus_id = '10';
                            }
                        }
                    }

                    $order->orderstatus_id = $orderstatus_id;
                    $order->save();

                    sendNotificationAccordingToOrderRules($order);

                    if ($order->orderstatus_id == '2') {
                        activity()
                            ->performedOn($order)
                            ->causedBy(User::find(1))
                            ->withProperties(['type' => 'Order_Accepted_Auto'])->log('Order auto accepted');
                    }
                    $response = [
                        'success' => true,
                    ];
                }
            } else {

                $order->orderstatus_id = 9;
                $order->save();

                activity()
                    ->performedOn($order)
                    ->withProperties(['type' => 'Order_Payment_Failed'])->log('Order payment failed');

                $response = [
                    'success' => false,
                ];
            }

            DB::commit();
            return response()->json($response, 200);
        } catch (Throwable $th) {
            DB::rollback();
            $response = [
                'success' => false,
            ];
            return response()->json($response, 200);
        }
    }

    public function webhook()
    {
        $post = file_get_contents('php://input');
        $data = json_decode($post, true);

        if (empty($data['event']) == true) {
            return;
        }

        if (config('setting.enableRazorpayWebhook') == "false") {
            return;
        }

        if (isset($_SERVER['HTTP_X_RAZORPAY_SIGNATURE']) === true) {
            if (config('setting.razorpayWebhookSecret') == '' || config('setting.razorpayWebhookSecret') == null) {
                return;
            }

            $webhook_secret =  config('setting.razorpayWebhookSecret');

            try {
                $api_key = config('setting.razorpayKeyId');
                $api_secret = config('setting.razorpayKeySecret');
                $api = new Api($api_key, $api_secret);
                $api->utility->verifyWebhookSignature(
                    $post,
                    $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'],
                    $webhook_secret
                );
            } catch (SignatureVerificationError $e) {
                $log = array(
                    'message'   => $e->getMessage(),
                    'data'      => $data,
                );
                \Log::error($log);
                return;
            }

            switch ($data['event']) {
                case "payment.captured":
                    return $this->razorPayPaymentCaptured($data);

                case "payment.failed":
                    return $this->razorPayPaymentFailed($data);

                default:
                    return;
            }
        }
    }

    private function razorPayPaymentCaptured($data)
    {
        $payment_id = $data['payload']['payment']['entity']['id'];
        $razorpay_order_id = $data['payload']['payment']['entity']['order_id'];

        $razorpayData = RazorpayData::where('razorpay_order_id_first', $razorpay_order_id)->first();
        if ($razorpayData) {

            DB::beginTransaction();

            try {
                $order = Order::where('id', $razorpayData->order_id)->with('restaurant')->lockForUpdate()->first();

                if ($order->orderstatus_id == '8' || $order->orderstatus_id == '9') {
                    $razorpayData->razorpay_payment_id = $payment_id;
                    $razorpayData->save();

                    if ($order->restaurant->auto_acceptable) {
                        $orderstatus_id = '2';

                        if (Module::find('OrderSchedule') && Module::find('OrderSchedule')->isEnabled() && $order->schedule_date != null && $order->schedule_slot != null) {
                            $orderstatus_id = '10';
                        }
                    } else {
                        $orderstatus_id = '1';
                        if (Module::find('OrderSchedule') && Module::find('OrderSchedule')->isEnabled()) {
                            if ($order->schedule_date != null && $order->schedule_slot != null) {
                                $orderstatus_id = '10';
                            }
                        }
                    }

                    $order->orderstatus_id = $orderstatus_id;
                    $order->save();

                    sendNotificationAccordingToOrderRules($order);
                }

                DB::commit();
            } catch (Throwable $th) {
                DB::rollback();
            }
        }
    }

    private function razorPayPaymentFailed($data)
    {
        $payment_id = $data['payload']['payment']['entity']['id'];
        $razorpay_order_id = $data['payload']['payment']['entity']['order_id'];

        DB::beginTransaction();

        try {

            $razorpayData = RazorpayData::where('razorpay_order_id_first', $razorpay_order_id)->first();
            if ($razorpayData) {
                $order = Order::where('id', $razorpayData->order_id)->with('user')->lockForUpdate()->first();
                if ($order->orderstatus_id == 8) {
                    $razorpayData->razorpay_payment_id = $payment_id;
                    $razorpayData->save();

                    $order->orderstatus_id = 9; //payment failed
                    $order->save();
                }
            }

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
        }
    }
}
