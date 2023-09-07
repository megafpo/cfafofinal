<?php

use App\Sms;
use App\PushNotify;
use App\Restaurant;
use App\SocketPush;
use App\Order;
use App\AcceptDelivery;
use Jackiedo\DotenvEditor\Facades\DotenvEditor;

function sendSmsToDelivery($restaurant_id)
{
    //get restaurant
    $restaurant = Restaurant::where('id', $restaurant_id)->first();
    if ($restaurant) {
        $pivotUsers = $restaurant->users()
            ->wherePivot('restaurant_id', $restaurant->id)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'Delivery Guy');
            })
            ->with('delivery_guy_detail', 'delivery_collections')
            ->get();
        foreach ($pivotUsers as $pU) {
            $max_accept_delivery_limit = $pU->delivery_guy_detail->max_accept_delivery_limit;
            $nonCompleteOrders = AcceptDelivery::where('user_id', $pU->id)->where('is_complete', 0)->with('order')->get();
            $countNonCompleteOrders = 0;
            if ($nonCompleteOrders) {
                foreach ($nonCompleteOrders as $nonCompleteOrder) {
                    if ($nonCompleteOrder->order && $nonCompleteOrder->order->orderstatus_id != 6) {
                        $countNonCompleteOrders++;
                    }
                }
            }
            $isUnderQueueLimit = false;
            if ($countNonCompleteOrders < $max_accept_delivery_limit) {
                $isUnderQueueLimit = true;
            }

            $inhand_cash = count($pU->delivery_collections) > 0 ? $pU->delivery_collections[0]->amount : 0;
            $cash_limit = $pU->delivery_guy_detail->cash_limit;
            if ($cash_limit == 0) {
                $isUnderCashLimit = true;
            } else {
                $inhand_cash < $cash_limit ? $isUnderCashLimit = true : $isUnderCashLimit = false;
            }

            if ($pU->delivery_guy_detail->is_notifiable && $pU->delivery_guy_detail->status && $isUnderCashLimit && $isUnderQueueLimit) {
                $message = config('setting.defaultSmsDeliveryMsg');
                // As its not an OTP based message Nulling OTP
                $otp = null;
                $smsForDelivery = true;
                $smsnotify = new Sms();
                $smsnotify->processSmsAction('OD_NOTIFY', $pU->phone, $otp, $message, $smsForDelivery);
            }
        }
    }
}

function sendPushNotificationToDelivery($restaurant_id, $order)
{
    if (config('setting.enablePushNotificationOrders') == 'true') {
        $restaurant = Restaurant::where('id', $restaurant_id)->first();
        $pivotUsers = $restaurant->users()
            ->wherePivot('restaurant_id', $restaurant->id)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'Delivery Guy');
            })
            ->with('delivery_guy_detail', 'delivery_collections')
            ->get();

        $deliveryGuyIds = [];
        foreach ($pivotUsers as $pU) {
            $inhand_cash = count($pU->delivery_collections) > 0 ? $pU->delivery_collections[0]->amount : 0;
            $cash_limit = $pU->delivery_guy_detail->cash_limit;
            if ($cash_limit == 0) {
                $is_in_limit = true;
            } else {
                $inhand_cash < $cash_limit ? $is_in_limit = true : $is_in_limit = false;
            }

            $max_accept_delivery_limit = $pU->delivery_guy_detail->max_accept_delivery_limit;
            $nonCompleteOrders = AcceptDelivery::where('user_id', $pU->id)->where('is_complete', 0)->with('order')->get();
            $countNonCompleteOrders = 0;
            if ($nonCompleteOrders) {
                foreach ($nonCompleteOrders as $nonCompleteOrder) {
                    if ($nonCompleteOrder->order && $nonCompleteOrder->order->orderstatus_id != 6) {
                        $countNonCompleteOrders++;
                    }
                }
            }
            $isUnderQueueLimit = false;
            if ($countNonCompleteOrders < $max_accept_delivery_limit) {
                $isUnderQueueLimit = true;
            }

            if ($pU->delivery_guy_detail->status && $is_in_limit && $isUnderQueueLimit) {
                if ($order->delivery_type == 1 && $order->orderstatus_id != '8') {
                    array_push($deliveryGuyIds, $pU->id);
                    if (config('setting.hasSocketPush') != 'true') {
                        //send Notification to Delivery Guy
                        $notify = new PushNotify();
                        $notify->sendPushNotification('TO_DELIVERY', $pU->id, $order->unique_order_id);
                    }
                }
            }
        }
        if (config('setting.iHavefrutriDeliveryApp') == "true" && config('setting.hasSocketPush') == 'true') {
            //push order with socket
            $notify = new SocketPush();
            $notify->pushNewOrder($order->unique_order_id, $deliveryGuyIds);
        }
    }
}


function stopPlayingNotificationSoundDeliveryAppHelper($order)
{
    if (config('setting.iHavefrutriDeliveryApp') == "true") {
        $restaurant = Restaurant::where('id', $order->restaurant_id)->first();
        $pivotUsers = $restaurant->users()
            ->wherePivot('restaurant_id', $restaurant->id)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'Delivery Guy');
            })
            ->with('delivery_guy_detail', 'delivery_collections')
            ->get();

        $deliveryGuyIds = [];
        foreach ($pivotUsers as $pU) {
            array_push($deliveryGuyIds, $pU->id);
        }
        $notify = new SocketPush();
        $notify->removeOrder($order->unique_order_id, $deliveryGuyIds);
    }
}


function sendSmsToStoreOwner($restaurant_id, $orderTotal)
{
    if (config('setting.smsRestaurantNotify') == 'true') {
        $restaurant = Restaurant::where('id', $restaurant_id)->first();
        if ($restaurant) {
            if ($restaurant->is_notifiable) {
                //get all pivot users of restaurant (Store Ownerowners)
                $pivotUsers = $restaurant->users()
                    ->wherePivot('restaurant_id', $restaurant_id)
                    ->get();
                //filter only res owner and send notification.
                foreach ($pivotUsers as $pU) {
                    if ($pU->hasRole('Store Owner')) {
                        // Include Order orderTotal or not ?
                        switch (config('setting.smsRestOrderValue')) {
                            case 'true':
                                $message = config('setting.defaultSmsRestaurantMsg') . round($orderTotal);
                                break;
                            case 'false':
                                $message = config('setting.defaultSmsRestaurantMsg');
                                break;
                        }
                        // As its not an OTP based message Nulling OTP
                        $otp = null;
                        $smsnotify = new Sms();
                        $smsnotify->processSmsAction('OD_NOTIFY', $pU->phone, $otp, $message);
                    }
                }
            }
        }
    }
}

function sendPushNotificationToStoreOwner($restaurant_id, $unique_order_id)
{

    $restaurant = Restaurant::where('id', $restaurant_id)->first();
    $order = Order::where('unique_order_id', $unique_order_id)->first();
    if ($restaurant && $order) {
        //get all pivot users of restaurant (Store Owners)
        $pivotUsers = $restaurant->users()
            ->wherePivot('restaurant_id', $restaurant_id)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'Store Owner');
            })
            ->get();

        $storeOrderIds = [];
        //filter only res owner and send notification.
        foreach ($pivotUsers as $pU) {
            array_push($storeOrderIds, $pU->id);
            if (config('setting.iHavefrutriStoreApp') == "true") {
                if (config('setting.hasSocketPush') != 'true') {
                    //send Notification to Store Owner for store app
                    $notify = new PushNotify();
                    $notify->sendPushNotification('TO_STOREOWNER', $pU->id, $order->id);
                }
            } else {
                if (config('setting.oneSignalAppId') != null && config('setting.oneSignalRestApiKey') != null) {
                    $message = config('setting.restaurantNewOrderNotificationMsg');

                    $url = config('setting.storeUrl') . '/public/store-owner/order/' . $unique_order_id;

                    $userId = (string) $pU->id;

                    $contents = array(
                        'en' => $message,
                    );

                    $appId = DotenvEditor::getValue('ONESIGNAL_APP_ID');
                    $apiKey = DotenvEditor::getValue('ONESIGNAL_REST_API_KEY');

                    $fields = array(
                        'app_id' => $appId,
                        'include_external_user_ids' => array($userId),
                        'channel_for_external_user_ids' => 'push',
                        'contents' => $contents,
                        'url' => $url,
                    );

                    $fields = json_encode($fields);

                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, 'https://onesignal.com/api/v1/notifications');
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: application/json; charset=utf-8',
                        'Authorization: Basic ' . $apiKey
                    ));
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_HEADER, false);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_exec($ch);
                    curl_close($ch);
                }
            }
        }
        if (config('setting.hasSocketPush') == 'true') {
            if (count($storeOrderIds) > 0) {
                //push order with socket
                $notify = new SocketPush();
                $notify->pushNewOrderStore($order->id, $storeOrderIds);
            }
        }
    }
}

function stopPlayingNotificationSoundStoreAppHelper($order)
{
    $restaurant = Restaurant::where('id', $order->restaurant_id)->first();
    $pivotUsers = $restaurant->users()
        ->wherePivot('restaurant_id', $order->restaurant_id)
        ->whereHas('roles', function ($query) {
            $query->where('name', 'Store Owner');
        })
        ->get();

    $storeOwnerIds = [];
    foreach ($pivotUsers as $pU) {
        array_push($storeOwnerIds, $pU->id);
    }

    if (count($storeOwnerIds) > 0) {
        $notify = new SocketPush();
        $notify->removeOrder($order->id, $storeOwnerIds);
    }
}
