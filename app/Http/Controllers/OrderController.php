<?php

namespace App\Http\Controllers;

use Hashids;
use App\Item;
use App\User;
use App\Addon;
use App\Order;
use App\Coupon;
use App\Orderitem;
use App\PushNotify;
use App\Restaurant;
use App\OrderItemAddon;
use Illuminate\Http\Request;
use App\Helpers\TranslationHelper;
use Nwidart\Modules\Facades\Module;
use App\DeliveryTimeSlotAvailability;

class OrderController extends Controller
{
    /**
     * @param Request $request
     */
    public function placeOrder(Request $request, TranslationHelper $translationHelper)
    {
        $user = auth()->user();

        if ($user) {
            $keys = ['orderPaymentWalletComment', 'orderPartialPaymentWalletComment'];
            $translationData = $translationHelper->getDefaultLanguageValuesForKeys($keys);

            $newOrder = new Order();

            $lastOrder = Order::orderBy('id', 'desc')->first();

            if ($lastOrder) {
                $lastOrderId = $lastOrder->id;
                $newId = $lastOrderId + 1;
                $uniqueId = Hashids::encode($newId);
            } else {
                //first order
                $newId = 1;
            }

            $uniqueId = Hashids::encode($newId);
            $unique_order_id = 'OD' . '-' . date('m-d') . '-' . strtoupper(str_random(4)) . '-' . strtoupper($uniqueId);
            $newOrder->unique_order_id = $unique_order_id;

            $restaurant_id = $request['order'][0]['restaurant_id'];
            $restaurant = Restaurant::where('id', $restaurant_id)->first();

            $newOrder->user_id = $user->id;

            $newOrder->zone_id = $restaurant->zone_id ? $restaurant->zone_id : null;
            
            $newOrder->delivery_date=$request['delivery_datetime'] ? $request['delivery_datetime']['delivery_date']:0;	
            $newOrder->delivery_timeslot=$request['delivery_datetime'] ? $request['delivery_datetime']['delivery_timeslot']:0;

            if ($request['pending_payment'] || $request['method'] == 'MERCADOPAGO' || $request['method'] == 'PAYTM' || $request['method'] == 'RAZORPAY') {
                $newOrder->orderstatus_id = '8';

                if (Module::find('OrderSchedule') && Module::find('OrderSchedule')->isEnabled()) {
                    if (isset($request->schedule_date) && $request->schedule_date != null && isset($request->schedule_slot) && $request->schedule_slot != null) {
                        $newOrder->is_scheduled = true;
                        $newOrder->schedule_date = json_encode($request->schedule_date);
                        $newOrder->schedule_slot = json_encode($request->schedule_slot);
                    }
                }
            } elseif ($restaurant->auto_acceptable) {
                $newOrder->orderstatus_id = '2';

                if (Module::find('OrderSchedule') && Module::find('OrderSchedule')->isEnabled()) {
                    if (isset($request->schedule_date) && $request->schedule_date != null && isset($request->schedule_slot) && $request->schedule_slot != null) {
                        $newOrder->orderstatus_id = '10';
                        $newOrder->is_scheduled = true;
                        $newOrder->schedule_date = json_encode($request->schedule_date);
                        $newOrder->schedule_slot = json_encode($request->schedule_slot);
                    }
                }

                if ($request->delivery_type == 1) {
                    sendSmsToDelivery($restaurant_id);
                }
                if (config('setting.enablePushNotificationOrders') == 'true') {
                    //to user
                    $notify = new PushNotify();
                    $notify->sendPushNotification('2', $newOrder->user_id, $newOrder->unique_order_id);
                }
            } else {
                $newOrder->orderstatus_id = '1';

                if (Module::find('OrderSchedule') && Module::find('OrderSchedule')->isEnabled()) {
                    if (isset($request->schedule_date) && $request->schedule_date != null && isset($request->schedule_slot) && $request->schedule_slot != null) {
                        $newOrder->orderstatus_id = '10';
                        $newOrder->is_scheduled = true;
                        $newOrder->schedule_date = json_encode($request->schedule_date);
                        $newOrder->schedule_slot = json_encode($request->schedule_slot);
                    }
                }
            }

            $newOrder->location = json_encode($request['location']);

            if ($request->delivery_type == 2) {
                $full_address = "NA";
            } else {
                $full_address = $request['user']['data']['default_address']['house'] . ', ' . $request['user']['data']['default_address']['address'];
            }
            $newOrder->address = $full_address;

            //get restaurant charges
            $newOrder->restaurant_charge = $restaurant->restaurant_charges;

            $newOrder->transaction_id = $request->payment_token;

            if($request['delivery_datetime']){	
                $items = Order::where([['delivery_date', $request['delivery_datetime']['delivery_date']],['delivery_timeslot',$request['delivery_datetime']['delivery_timeslot']],['restaurant_id', $restaurant_id]])->count();	
                $restaurant_delivery_limit=$restaurant->delivery_limit;	
                if($items < $restaurant_delivery_limit-1){	
                    $unavailable=0;	
                }else{	
                    $unavailable=1;	
                }	
    	
                $deliveyTimeSlot = new DeliveryTimeSlotAvailability();	
                $deliveyTimeSlot->delivery_date = $request['delivery_datetime']['delivery_date'];	
                $deliveyTimeSlot->delivery_timeslot = $request['delivery_datetime']['delivery_timeslot'];	
                $deliveyTimeSlot->unavailable=$unavailable;	
                $deliveyTimeSlot->restaurant_id=$restaurant_id;	
                $deliveyTimeSlot->save();	
            }

            $orderTotal = 0;
            foreach ($request['order'] as $oI) {
                $originalItem = Item::where('id', $oI['id'])->first();
                $orderTotal += ($originalItem->price * $oI['quantity']);

                if (isset($oI['selectedaddons'])) {
                    foreach ($oI['selectedaddons'] as $selectedaddon) {
                        $addon = Addon::where('id', $selectedaddon['addon_id'])->first();
                        if ($addon) {
                            $orderTotal += $addon->price * $oI['quantity'];
                        }
                    }
                }
            }
            $newOrder->sub_total = $orderTotal;

            if ($request->coupon) {
                $coupon = Coupon::where('code', strtoupper($request['coupon']['code']))->first();
                if ($coupon) {
                    $newOrder->coupon_name = $request['coupon']['code'];
                    if ($coupon->discount_type == 'PERCENTAGE') {
                        $percentage_discount = (($coupon->discount / 100) * $orderTotal);
                        if ($coupon->max_discount) {
                            if ($percentage_discount >= $coupon->max_discount) {
                                $percentage_discount = $coupon->max_discount;
                            }
                        }
                        $newOrder->coupon_amount = $percentage_discount;
                        $orderTotal = $orderTotal - $percentage_discount;
                    }
                    if ($coupon->discount_type == 'AMOUNT') {
                        $newOrder->coupon_amount = $coupon->discount;
                        $orderTotal = $orderTotal - $coupon->discount;
                    }
                    $coupon->count = $coupon->count + 1;
                    $coupon->save();
                }
            }

            if ($request->delivery_type == 1) {
                if (config('setting.enGDMA') == 'true') {
                    $distance = (float) $request->dis;
                } else {
                    $distance = getDistance($request['user']['data']['default_address']['latitude'], $request['user']['data']['default_address']['longitude'], $restaurant->latitude, $restaurant->longitude);
                }

                if ($restaurant->delivery_charge_type == 'DYNAMIC') {
                    //get distance between user and restaurant,

                    if ($distance > $restaurant->base_delivery_distance) {
                        $extraDistance = $distance - $restaurant->base_delivery_distance;
                        $extraCharge = ($extraDistance / $restaurant->extra_delivery_distance) * $restaurant->extra_delivery_charge;
                        $dynamicDeliveryCharge = $restaurant->base_delivery_charge + $extraCharge;

                        if (config('setting.enDelChrRnd') == 'true') {
                            $dynamicDeliveryCharge = ceil($dynamicDeliveryCharge);
                        }

                        $newOrder->delivery_charge = $dynamicDeliveryCharge;
                        $newOrder->actual_delivery_charge = $dynamicDeliveryCharge;
                    } else {
                        $newOrder->delivery_charge = $restaurant->base_delivery_charge;
                        $newOrder->actual_delivery_charge = $restaurant->base_delivery_charge;
                    }
                } else {
                    $newOrder->delivery_charge = $restaurant->delivery_charges;
                    $newOrder->actual_delivery_charge = $restaurant->delivery_charges;
                }

                $newOrder->distance = $distance;
            } else {
                //for selfpickup...
                $newOrder->delivery_charge = 0;
                $newOrder->actual_delivery_charge = 0;
            }

            //for free delivery above x subtotal
            if ($restaurant->free_delivery_subtotal > 0) {
                if ($newOrder->sub_total >= $restaurant->free_delivery_subtotal) {
                    $newOrder->delivery_charge = 0;
                }
            }

            $orderTotal = $orderTotal + $newOrder->delivery_charge;

            $orderTotal = $orderTotal + $restaurant->restaurant_charges;

            if (config('setting.taxApplicable') == 'true') {
                $newOrder->tax = config('setting.taxPercentage');

                $taxAmount = (float) (((float) config('setting.taxPercentage') / 100) * $orderTotal);
            } else {
                $taxAmount = 0;
            }

            $newOrder->tax_amount = $taxAmount;

            $orderTotal = $orderTotal + $taxAmount;

            if (isset($request['tipAmount']) && !empty($request['tipAmount'])) {
                $orderTotal = $orderTotal + $request['tipAmount'];
            }

            //this is the final order total

            if ($request['method'] == 'COD') {
                if ($request->partial_wallet == true) {
                    //deduct all user amount and add
                    $newOrder->payable = $orderTotal - $user->balanceFloat;
                }
                if ($request->partial_wallet == false) {
                    $newOrder->payable = $orderTotal;
                }
            }

            $newOrder->total = $orderTotal;

            $newOrder->order_comment = $request['order_comment'];

            $newOrder->payment_mode = $request['method'];

            $newOrder->restaurant_id = $request['order'][0]['restaurant_id'];

            $newOrder->tip_amount = $request['tipAmount'];

            if ($request->delivery_type == 1) {
                //delivery
                $newOrder->delivery_type = 1;
            } else {
                //selfpickup
                $newOrder->delivery_type = 2;
            }

            $newOrder->cash_change_amount = $request['cash_change_amount'] ? $request['cash_change_amount'] : null;

            $newOrder->delivery_pin = substr(str_shuffle('123456789'), 0, 5);

            //process paypal payment
            if ($request['method'] == 'PAYPAL' || $request['method'] == 'PAYSTACK' || $request['method'] == 'RAZORPAY' || $request['method'] == 'STRIPE' || $request['method'] == 'PAYMONGO' || $request['method'] == 'MERCADOPAGO' || $request['method'] == 'PAYTM' || $request['method'] == 'FLUTTERWAVE' || $request['method'] == 'KHALTI') {
                //successfuly received payment
                $newOrder->save();
                if ($request->partial_wallet == true) {

                    $userWalletBalance = $user->balanceFloat;
                    $newOrder->wallet_amount = $userWalletBalance;
                    $newOrder->save();
                    //deduct all user amount and add
                    $user->withdraw($userWalletBalance * 100, ['description' => $translationData->orderPartialPaymentWalletComment . $newOrder->unique_order_id]);
                }
                foreach ($request['order'] as $orderItem) {
                    $item = new Orderitem();
                    $item->order_id = $newOrder->id;
                    $item->item_id = $orderItem['id'];
                    $item->name = $orderItem['name'];
                    $item->quantity = $orderItem['quantity'];
                    $item->price = $orderItem['price'];
                    $item->save();
                    if (isset($orderItem['selectedaddons'])) {
                        foreach ($orderItem['selectedaddons'] as $selectedaddon) {
                            $addon = new OrderItemAddon();
                            $addon->orderitem_id = $item->id;
                            $addon->addon_category_name = $selectedaddon['addon_category_name'];
                            $addon->addon_name = $selectedaddon['addon_name'];
                            $addon->addon_price = $selectedaddon['price'];
                            $addon->save();
                        }
                    }
                }

                //sms to Store Owner
                if (!$restaurant->auto_acceptable && $newOrder->orderstatus_id == '1' && config('setting.smsRestaurantNotify') == 'true') {
                    $restaurant_id = $request['order'][0]['restaurant_id'];
                    sendSmsToStoreOwner($restaurant_id, $orderTotal);
                }

                //push notification to Delivery Guy
                if ($restaurant->auto_acceptable && config('setting.enablePushNotification') && config('setting.enablePushNotificationOrders') == 'true') {
                    $restaurant_id = $request['order'][0]['restaurant_id'];
                    sendPushNotificationToDelivery($restaurant_id, $newOrder);
                }

                //push notification to Store Owner
                if (in_array($newOrder->orderstatus_id, ['1', '10'])) {
                    sendPushNotificationToStoreOwner($restaurant_id, $unique_order_id);
                }

                activity()
                    ->performedOn($newOrder)
                    ->causedBy($user)
                    ->withProperties(['type' => 'Order_Placed'])->log('Order placed');

                if ($newOrder->orderstatus_id == '2') {
                    activity()
                        ->performedOn($newOrder)
                        ->causedBy(User::find(1))
                        ->withProperties(['type' => 'Order_Accepted_Auto'])->log('Order auto accepted');
                }

                $response = [
                    'success' => true,
                    'data' => $newOrder,
                ];

                return response()->json($response);
            } else {
                $newOrder->save();
                if ($request['method'] == 'COD') {
                    if ($request->partial_wallet == true) {
                        $userWalletBalance = $user->balanceFloat;
                        $newOrder->wallet_amount = $userWalletBalance;
                        $newOrder->save();
                        //deduct all user amount and add
                        $user->withdraw($userWalletBalance * 100, ['description' => $translationData->orderPartialPaymentWalletComment . $newOrder->unique_order_id]);
                    }
                }

                //if method is WALLET, then deduct amount with appropriate description
                if ($request['method'] == 'WALLET') {
                    $userWalletBalance = $user->balanceFloat;
                    $newOrder->wallet_amount = $orderTotal;
                    $newOrder->save();
                    $user->withdraw($orderTotal * 100, ['description' => $translationData->orderPaymentWalletComment . $newOrder->unique_order_id]);
                }

                foreach ($request['order'] as $orderItem) {
                    $item = new Orderitem();
                    $item->order_id = $newOrder->id;
                    $item->item_id = $orderItem['id'];
                    $item->name = $orderItem['name'];
                    $item->quantity = $orderItem['quantity'];
                    $item->price = $orderItem['price'];
                    $item->save();
                    if (isset($orderItem['selectedaddons'])) {
                        foreach ($orderItem['selectedaddons'] as $selectedaddon) {
                            $addon = new OrderItemAddon();
                            $addon->orderitem_id = $item->id;
                            $addon->addon_category_name = $selectedaddon['addon_category_name'];
                            $addon->addon_name = $selectedaddon['addon_name'];
                            $addon->addon_price = $selectedaddon['price'];
                            $addon->save();
                        }
                    }
                }

                //sms to Store Owner
                if (!$restaurant->auto_acceptable && $newOrder->orderstatus_id == '1' && config('setting.smsRestaurantNotify') == 'true') {
                    $restaurant_id = $request['order'][0]['restaurant_id'];
                    sendSmsToStoreOwner($restaurant_id, $orderTotal);
                }

                //push notification to Delivery Guy
                if ($restaurant->auto_acceptable && config('setting.enablePushNotification') && config('setting.enablePushNotificationOrders') == 'true') {
                    $restaurant_id = $request['order'][0]['restaurant_id'];
                    sendPushNotificationToDelivery($restaurant_id, $newOrder);
                }

                //push notification to Store Owner
                if (in_array($newOrder->orderstatus_id, ['1', '10'])) {
                    sendPushNotificationToStoreOwner($restaurant_id, $unique_order_id);
                }

                activity()
                    ->performedOn($newOrder)
                    ->causedBy($user)
                    ->withProperties(['type' => 'Order_Placed'])->log('Order placed');

                if ($newOrder->orderstatus_id == '2') {
                    activity()
                        ->performedOn($newOrder)
                        ->causedBy(User::find(1))
                        ->withProperties(['type' => 'Order_Accepted_Auto'])->log('Order auto accepted');
                }

                $response = [
                    'success' => true,
                    'data' => $newOrder,
                ];

                return response()->json($response);
            }
        }
    }

    /**
     * @param Request $request
     */
    public function getOrders(Request $request)
    {
        $user = auth()->user();
        if ($user) {
            $orders = Order::where('user_id', $user->id)->with('orderitems', 'orderitems.order_item_addons', 'restaurant', 'rating')->orderBy('id', 'DESC')->paginate(10);

            foreach ($orders as $order) {
                $ratable = false;
                if ($order->orderstatus_id == 5 && !$order->rating) {
                    $ratable = true;
                }
                $order->is_ratable = $ratable;
                $order->makeHidden(['reviews']);
            }

            return response()->json($orders);
        }
        return response()->json(['success' => false], 401);
    }

    /**
     * @param Request $request
     */
    public function getOrderItems(Request $request)
    {
        $user = auth()->user();
        if ($user) {

            $items = Orderitem::where('order_id', $request->order_id)->get();
            return response()->json($items);
        }
        return response()->json(['success' => false], 401);
    }

    /**
     * @param Request $request
     */
    public function cancelOrder(Request $request, TranslationHelper $translationHelper)
    {

        $keys = ['orderRefundWalletComment', 'orderPartialRefundWalletComment'];

        $translationData = $translationHelper->getDefaultLanguageValuesForKeys($keys);

        $order = Order::where('id', $request->order_id)->first();

        $user = auth()->user();

        //check if user is cancelling their own order...
        if ($order->user_id == $user->id && ($order->orderstatus_id == 1 || $order->orderstatus_id == 10)) {

            //if payment method is not COD, and order status is 1 (Order placed) then refund to wallet
            $refund = false;

            //if COD, then check if wallet is present
            if ($order->payment_mode == 'COD') {
                if ($order->wallet_amount != null) {
                    //refund wallet amount
                    $user->deposit($order->wallet_amount * 100, ['description' => $translationData->orderPartialRefundWalletComment . $order->unique_order_id]);
                    $refund = true;
                }
            } else {
                //if online payment, refund the total to wallet
                $user->deposit(($order->total) * 100, ['description' => $translationData->orderRefundWalletComment . $order->unique_order_id]);
                $refund = true;
            }

            //cancel order
            $order->orderstatus_id = 6; //6 means canceled..
            $order->save();

            //throw notification to user
            if (config('setting.enablePushNotificationOrders') == 'true') {
                $notify = new PushNotify();
                $notify->sendPushNotification('6', $order->user_id);
            }

            activity()
                ->performedOn($order)
                ->causedBy($user)
                ->withProperties(['type' => 'Order_Canceled'])->log('Order canceled');

            $response = [
                'success' => true,
                'refund' => $refund,
            ];

            return response()->json($response);
        } else {
            $response = [
                'success' => false,
                'refund' => false,
            ];
            return response()->json($response);
        }
    }

    public function getDeliveryTimeSlot(Request $request)	
    {	
        try{	
            $items = DeliveryTimeSlotAvailability::where('restaurant_id', $request->restaurant_id)->get();	
            return response()->json($items);	
        }catch(\Exception $e){	
            return $e->getMessage();	
        }	
        	
    }
};
