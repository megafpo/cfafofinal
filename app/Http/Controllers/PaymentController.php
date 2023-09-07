<?php

namespace App\Http\Controllers;

use App\Helpers\TranslationHelper;
use App\Order;
use App\PaymentGateway;
use App\PushNotify;
use App\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Ixudra\Curl\Facades\Curl;
use Nwidart\Modules\Facades\Module;
use PaytmWallet;
use App\User;

class PaymentController extends Controller
{
    /**
     * @param Request $request
     */
    public function getPaymentGateways(Request $request)
    {
        if (config('setting.allowPaymentGatewaySelection') == 'true') {
            $restaurant = Restaurant::where('id', $request->restaurant_id)->first();
            if ($restaurant) {
                if (count($restaurant->payment_gateways) > 0) {
                    $paymentGateways = $restaurant->payment_gateways_active;
                } else {
                    $paymentGateways = PaymentGateway::where('is_active', 1)->get();
                }
                return response()->json($paymentGateways);
            } else {
                return 'Store Not Found';
            }
        } else {
            $paymentGateways = PaymentGateway::where('is_active', 1)->get();
            return response()->json($paymentGateways);
        }
    }

    /**
     * @param Request $request
     */
    public function togglePaymentGateways(Request $request)
    {
        $paymentGateway = PaymentGateway::where('id', $request->id)->first();

        $activeGateways = PaymentGateway::where('is_active', '1')->get();

        if (!$paymentGateway->is_active || count($activeGateways) > 1) {
            $paymentGateway->toggleActive()->save();
            $success = true;
            return response()->json($success, 200);
        } else {
            $success = false;
            return response()->json($success, 401);
        }
    }


    /**
     * @param Request $request
     * @param $id
     */
    public function processMercadoPago(Request $request, $id)
    {
        $order = Order::where('id', $id)->where('orderstatus_id', '8')->where('payment_mode', 'MERCADOPAGO')->first();

        if ($order == null) {
            echo 'Order not found, already paid or payment method is different.';
        } else {

            if ($order->wallet_amount != 0) {
                $orderTotal = $order->total - $order->wallet_amount;
            } else {
                if ($order->payable == 0) {
                    $orderTotal = $order->total;
                } else {
                    $orderTotal = $order->payable;
                }
            }

            $amount = number_format((float) $orderTotal, 2, '.', '');

            \MercadoPago\SDK::setAccessToken(config('setting.mercadopagoAccessToken'));

            $preference = new \MercadoPago\Preference();

            // Crea un ítem en la preferencia
            $item = new \MercadoPago\Item();
            $item->title = 'Online Service';
            $item->quantity = 1;
            $item->unit_price = $amount;
            $preference->items = array($item);

            // $preference->back_urls = array(
            //     'success' => 'http://localhost/swiggy-laravel-react/public/api/payment/return-mercado-pago',
            //     'pending' => 'http://localhost/swiggy-laravel-react/public/api/payment/return-mercado-pago',
            //     'failure' => 'http://localhost/swiggy-laravel-react/public/api/payment/return-mercado-pago',
            // );

            $preference->back_urls = array(
                'success' => 'https://' . $request->getHttpHost() . '/public/api/payment/return-mercado-pago',
                'pending' => 'https://' . $request->getHttpHost() . '/public/api/payment/return-mercado-pago',
                'failure' => 'https://' . $request->getHttpHost() . '/public/api/payment/return-mercado-pago',
            );

            $preference->auto_return = 'all';
            $preference->save();

            // Save preference ID in database
            $order->transaction_id = $preference->id;
            $order->save();
            // dd($preference);
            return redirect()->away($preference->init_point);
        }
    }
    /**
     * @param Request $request
     */
    public function returnMercadoPago(Request $request)
    {
        $order = Order::where('transaction_id', $request->preference_id)->where('orderstatus_id', '8')->where('payment_mode', 'MERCADOPAGO')->with('restaurant')->first();

        $txnStatus = $request->collection_status;

        if ($order == null) {
            echo 'Order not found, already paid or payment method is different.';
        } else {

            if ($txnStatus == 'approved') {

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

                $redirectUrl = 'https://' . $request->getHttpHost() . '/running-order/' . $order->unique_order_id;
                // $redirectUrl = 'http://localhost:3000/running-order/' . $order->unique_order_id;
                return redirect()->away($redirectUrl);
            } else {
                $order->orderstatus_id = 9;
                $order->save();
                activity()
                    ->performedOn($order)
                    ->withProperties(['type' => 'Order_Payment_Failed'])->log('Order payment failed');

                $redirectUrl = 'https://' . $request->getHttpHost() . '/my-orders';

                return redirect()->away($redirectUrl);
            }
        }
    }

    /**
     * @param Request $request
     */
    public function acceptStripePayment(Request $request)
    {
        $user = auth()->user();

        if (in_array('ideal', $request->payment_method_types)) {
            //some logic later to be added
        }

        if ($user) {
            \Stripe\Stripe::setApiKey(config('setting.stripeSecretKey'));

            $intent = \Stripe\PaymentIntent::create([
                'amount' => $request->amount,
                'payment_method' => $request->id,
                'payment_method_types' => $request->payment_method_types,
                'currency' => $request->currency,
                // 'return_url' => route('stripeRedirectCapture'),
            ]);

            return response()->json($intent);
        } else {
            return response()->json(['success' => false], 401);
        }
    }

    /**
     * @param Request $request
     */
    public function stripeRedirectCapture(Request $request)
    {
        // \Log::info($request->all());
        \Stripe\Stripe::setApiKey(config('setting.stripeSecretKey'));
        $intent = \Stripe\PaymentIntent::retrieve($request->payment_intent);

        if ($request->has('order_id')) {
            //get the order ID from url params
            $order = Order::where('id', $request->order_id)->with('restaurant')->first();

            if ($intent->status == 'succeeded') {
                // dd('Success');
                //check if the order id of that order is 8 (waiting payment)
                if ($order && $order->orderstatus_id == 8) {

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

                    if ($order->restaurant->auto_acceptable) {
                        if ($orderstatus_id == '2') {
                            //to user
                            $notify = new PushNotify();
                            $notify->sendPushNotification('2', $order->user_id, $order->unique_order_id);
                            //to delivery
                            sendSmsToDelivery($order->restaurant_id);
                            sendPushNotificationToDelivery($order->restaurant_id, $order);
                        }

                        sendPushNotificationToStoreOwner($order->restaurant_id, $order->unique_order_id);
                    } else {
                        sendSmsToStoreOwner($order->restaurant_id, $order->total);
                        sendPushNotificationToStoreOwner($order->restaurant_id, $order->unique_order_id);
                    }

                    if ($order->orderstatus_id == '2') {
                        activity()
                            ->performedOn($order)
                            ->causedBy(User::find(1))
                            ->withProperties(['type' => 'Order_Accepted_Auto'])->log('Order auto accepted');
                    }

                    //redirect to running order page
                    $redirectUrl = 'https://' . $request->getHttpHost() . '/running-order/' . $order->unique_order_id;
                    // $redirectUrl = 'http://localhost:3000/running-order/' . $order->unique_order_id;

                    return redirect()->away($redirectUrl);
                }
            } else {
                // dd("Failed");
                $order->orderstatus_id = 9; //payment failed
                $order->save();

                activity()
                    ->performedOn($order)
                    ->withProperties(['type' => 'Order_Payment_Failed'])->log('Order payment failed');

                $redirectUrl = 'https://' . $request->getHttpHost() . '/running-order/' . $order->unique_order_id;
                // $redirectUrl = 'http://localhost:3000/running-order/' . $order->unique_order_id;

                return redirect()->away($redirectUrl);
            }
        }
    }

    /**
     * @param Request $request
     */
    public function processPaymongo(Request $request)
    {
        $error = '';

        $paymongoPK = config('setting.paymongoPK');

        $validator = Validator::make($request->all(), [
            'ccNum' => 'required',
            'ccExp' => 'required',
            'ccCvv' => 'required|numeric',
            'amount' => 'required|numeric|min:100',
            'name' => 'required',
            'email' => 'required',
            'phone' => 'required',
        ]);

        if ($validator->fails()) {
            $error = 'Please check if you have filled in the form correctly. Minimum order amount is PHP 100.';
        }

        $ccNum = str_replace(' ', '', $request->ccNum);
        $ccExp = $request->ccExp;
        $ccCvv = $request->ccCvv;
        $amount = $request->amount;
        $name = $request->name;
        $email = $request->email;
        $phone = $request->phone;
        $ccExp = (explode('/', $ccExp));
        $ccMon = $ccExp[0];
        $ccYear = $ccExp[1];

        // Create payment method
        $paymentMethodData = array(
            'data' => array(
                'attributes' => array(
                    'details' => array(
                        'card_number' => $ccNum,
                        'exp_month' => intval($ccMon),
                        'exp_year' => intval($ccYear),
                        'cvc' => $ccCvv,
                    ),
                    'billing' => array(
                        'name' => $name,
                        'email' => $email,
                        'phone' => $phone,
                    ),
                    'type' => 'card',
                ),
            ),
        );

        $paymentMethodUrl = 'https://api.paymongo.com/v1/payment_methods';
        $paymentMethod = $this->apiPaymongo($paymentMethodUrl, $paymentMethodData);

        if ($paymentMethod->status == 200) {
            $paymentMethodId = $paymentMethod->content->data->id;
        } else {
            foreach ($paymentMethod->content->errors as $error) {
                $error = $error->detail . ' ';
            }
        }

        // Create payment intent
        if (isset($paymentMethodId)) {
            // Create payment intent
            $paymentIntentData = array(
                'data' => array(
                    'attributes' => array(
                        'amount' => $amount * 100,
                        'payment_method_allowed' => array(
                            0 => 'card',
                        ),
                        'payment_method_options' => array(
                            'card' => array(
                                'request_three_d_secure' => 'automatic',
                            ),
                        ),
                        'currency' => config('setting.currencyId'),
                        'description' => 'Food Delivery',
                        'statement_descriptor' => config('setting.storeName'),
                    ),
                ),
            );

            $paymentIntentUrl = 'https://api.paymongo.com/v1/payment_intents';
            $paymentIntent = $this->apiPaymongo($paymentIntentUrl, $paymentIntentData);

            if ($paymentIntent->status == 200) {
                $paymentIntentId = $paymentIntent->content->data->id;
            } else {
                foreach ($paymentIntent->content->errors as $error) {
                    $error = $error->detail . ' ';
                }
            }
        }

        // Attach payment method with payment intent
        if ((isset($paymentMethodId)) && (isset($paymentIntentId))) {
            $returnUrl = 'https://' . $request->getHttpHost() . '/public/api/payment/handle-process-paymongo/' . $paymentIntentId;
            // $returnUrl = 'http://127.0.0.1/frutri/public/api/payment/handle-process-paymongo/' . $paymentIntentId;
            $attachPiData = array(
                'data' => array(
                    'attributes' => array(
                        'payment_method' => $paymentMethodId,
                        'client_key' => $paymongoPK,
                        'return_url' => $returnUrl,
                    ),
                ),
            );

            // 'https://' . $request->getHttpHost() . '/my-orders'
            $attachPiUrl = 'https://api.paymongo.com/v1/payment_intents/' . $paymentIntentId . '/attach';
            $attachPi = $this->apiPaymongo($attachPiUrl, $attachPiData);

            if ($attachPi->status == 200) {
                $attachPiStatus = $attachPi->content->data->attributes->status;
            } else {
                foreach ($attachPi->content->errors as $error) {
                    $error = $error->detail . ' ';
                }
            }
        }

        if (($error == '') && ($attachPiStatus == 'succeeded')) {
            $response = [
                'paymongo_success' => true,
                'token' => $paymentIntentId,
                'status' => $attachPiStatus,
            ];
        } elseif (($error == '') && ($attachPiStatus == 'awaiting_next_action')) {
            $response = [
                'paymongo_success' => true,
                'token' => $paymentIntentId,
                'redirect_url' => $attachPi->content->data->attributes->next_action->redirect->url,
                'status' => $attachPiStatus,
            ];
        } else {
            $response = [
                'paymongo_success' => true,
                'error' => $error,
            ];
        }

        return response()->json($response);
    }

    /**
     * @param Request $request
     */
    public function handlePayMongoRedirect(Request $request, $id)
    {
        $order = Order::where('transaction_id', $id)->where('orderstatus_id', '8')->where('payment_mode', 'PAYMONGO')->with('restaurant')->first();
        if ($order == null) {
            echo 'Order not found, already paid or payment method is different.';
            die();
        }

        $paymentIntentUrl = 'https://api.paymongo.com/v1/payment_intents/' . $id;

        $paymongoSK = config('setting.paymongoSK');
        $response = Curl::to($paymentIntentUrl)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Basic ' . base64_encode($paymongoSK))
            ->returnResponseObject()
            ->get();

        $res = json_decode($response->content);

        if ($res && $res->data && $res->data->attributes) {
            if ($res->data->attributes->status == 'succeeded') {
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
            }
        }
        $redirectUrl = 'https://' . $request->getHttpHost() . '/running-order/' . $order->unique_order_id;
        // $redirectUrl = 'http://localhost:3000/running-order/' . $order->unique_order_id;
        return redirect()->away($redirectUrl);
    }

    /**
     * @param $url
     * @param $data
     * @return mixed
     */
    public function apiPaymongo($url, $data)
    {
        $paymongoSK = config('setting.paymongoSK');

        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Basic ' . base64_encode($paymongoSK))
            ->withData($data)
            ->returnResponseObject()
            ->asJson()
            ->post();
        return $response;
    }


    /**
     * @param Request $request
     */
    public function payWithPaytm($order_id, Request $request)
    {
        $order = Order::where('id', $order_id)->where('orderstatus_id', '8')->where('payment_mode', 'PAYTM')->first();

        if ($order) {
            $payment = PaytmWallet::with('receive');

            if ($order->wallet_amount != 0) {
                $orderTotal = $order->total - $order->wallet_amount;
            } else {
                if ($order->payable == 0) {
                    $orderTotal = $order->total;
                } else {
                    $orderTotal = $order->payable;
                }
            }

            $payment->prepare([
                'order' => $order->unique_order_id, // your order id taken from cart
                'user' => $order->user_id, // your user id
                'mobile_number' => $order->user->phone, // your customer mobile no
                'email' => $order->user->email, // your user email address
                'amount' => $orderTotal, // amount will be paid in INR.
                'callback_url' => 'https://' . $request->getHttpHost() . '/public/api/payment/process-paytm',
                // 'callback_url' => 'http://127.0.0.1/swiggy-laravel-react/public/api/payment/process-paytm',
            ]);

            return $payment->receive();
        } else {
            return 'Invalid operation';
        }
    }

    /**
     * @param Request $request
     */
    public function processPaytm(Request $request, TranslationHelper $translationHelper)
    {

        $keys = ['orderRefundWalletComment', 'orderPartialRefundWalletComment'];

        $translationData = $translationHelper->getDefaultLanguageValuesForKeys($keys);

        $transaction = PaytmWallet::with('receive');

        $response = $transaction->response(); // To get raw response as array
        //Check out response parameters sent by paytm here -> http://paywithpaytm.com/developer/paytm_api_doc?target=interpreting-response-sent-by-paytm

        $order = Order::where('unique_order_id', $response['ORDERID'])->where('orderstatus_id', '8')->where('payment_mode', 'PAYTM')->with('restaurant')->first();

        if ($order) {

            if ($transaction->isSuccessful()) {

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

                $redirectUrl = 'https://' . $request->getHttpHost() . '/running-order/' . $order->unique_order_id;
                // $redirectUrl = 'http://localhost:3000/running-order/' . $order->unique_order_id;
                return redirect()->away($redirectUrl);
            } else if ($transaction->isFailed()) {

                if ($order->wallet_amount != null) {
                    $user = $order->user;
                    $user->deposit($order->wallet_amount * 100, ['description' => $translationData->orderPartialRefundWalletComment . $order->unique_order_id]);
                }
                //Transaction Failed
                $order->orderstatus_id = '9';
                $order->save();

                activity()
                    ->performedOn($order)
                    ->withProperties(['type' => 'Order_Payment_Failed'])->log('Order payment failed');

                $redirectUrl = 'https://' . $request->getHttpHost() . '/running-order/' . $order->unique_order_id;
                // $redirectUrl = 'http://localhost:3000/running-order/' . $order->unique_order_id;
                return redirect()->away($redirectUrl);
            } else if ($transaction->isOpen()) {
                //Transaction Open/Processing
                $order->orderstatus_id = '8';
                $order->save();
                $redirectUrl = 'https://' . $request->getHttpHost() . '/running-order/' . $order->unique_order_id;
                // $redirectUrl = 'http://localhost:3000/running-order/' . $order->unique_order_id;
                return redirect()->away($redirectUrl);
            }
        } else {
            return 'Order Not Found';
        }
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function verifyKhaltiPayment(Request $request)
    {
        $data = [
            'token' => $request->token,
            'amount' => $request->amount,
        ];

        $url = 'https://khalti.com/api/v2/payment/verify/';

        $khaltiSecretKey = config('setting.khaltiSecretKey');

        $response = Curl::to($url)
            ->withHeader('Authorization: Key ' . $khaltiSecretKey)
            ->withData($data)
            ->post();

        $response = json_decode($response, true);
        if (isset($response['idx'])) {
            $data = [
                'success' => true,
                'idx' => $response['idx'],
            ];
            return response()->json($data);
        }

        if (isset($response['error_key']) && $response['error_key'] == 'already_verified') {
            $data = [
                'success' => true,
                'idx' => null,
            ];
            return response()->json($data);
        }

        $data = [
            'success' => false,
        ];
        return response()->json($data);
    }
}
