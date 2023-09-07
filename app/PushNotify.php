<?php

namespace App;

use App\Alert;
use App\PushToken;
use App\Translation;
use Ixudra\Curl\Facades\Curl;

class PushNotify
{
    /**
     * @param $orderstatus_id
     * @param $user_id
     */
    public function sendPushNotification($orderstatus_id, $user_id, $unique_order_id = null)
    {

        //check if admin has set a default translation?
        $translation = Translation::where('is_default', 1)->first();
        if ($translation) {
            //if yes, then take the default translation and use instread of translations from config
            $translation = json_decode($translation->data);

            $runningOrderPreparingTitle = $translation->runningOrderPreparingTitle;
            $runningOrderPreparingSub = $translation->runningOrderPreparingSub;
            $runningOrderDeliveryAssignedTitle = $translation->runningOrderDeliveryAssignedTitle;
            $runningOrderDeliveryAssignedSub = $translation->runningOrderDeliveryAssignedSub;
            $runningOrderOnwayTitle = $translation->runningOrderOnwayTitle;
            $runningOrderOnwaySub = $translation->runningOrderOnwaySub;
            $runningOrderDelivered = !empty($translation->runningOrderDelivered) ? $translation->runningOrderDelivered : config('setting.runningOrderDelivered');
            $runningOrderDeliveredSub = !empty($translation->runningOrderDeliveredSub) ? $translation->runningOrderDeliveredSub : config('setting.runningOrderDeliveredSub');
            $runningOrderCanceledTitle = $translation->runningOrderCanceledTitle;
            $runningOrderCanceledSub = $translation->runningOrderCanceledSub;
            $runningOrderReadyForPickup = $translation->runningOrderReadyForPickup;
            $runningOrderReadyForPickupSub = $translation->runningOrderReadyForPickupSub;
            $deliveryGuyNewOrderNotificationMsg = $translation->deliveryGuyNewOrderNotificationMsg;
            $deliveryGuyNewOrderNotificationMsgSub = $translation->deliveryGuyNewOrderNotificationMsgSub;
        } else {
            //else use from config
            $runningOrderPreparingTitle = config('setting.runningOrderPreparingTitle');
            $runningOrderPreparingSub = config('setting.runningOrderPreparingSub');
            $runningOrderDeliveryAssignedTitle = config('setting.runningOrderDeliveryAssignedTitle');
            $runningOrderDeliveryAssignedSub = config('setting.runningOrderDeliveryAssignedSub');
            $runningOrderOnwayTitle = config('setting.runningOrderOnwayTitle');
            $runningOrderOnwaySub = config('setting.runningOrderOnwaySub');
            $runningOrderDelivered = config('setting.runningOrderDelivered');
            $runningOrderDeliveredSub = config('setting.runningOrderDeliveredSub');
            $runningOrderCanceledTitle = config('setting.runningOrderCanceledTitle');
            $runningOrderCanceledSub = config('setting.runningOrderCanceledSub');
            $runningOrderReadyForPickup = config('setting.runningOrderReadyForPickup');
            $runningOrderReadyForPickupSub = config('setting.runningOrderReadyForPickupSub');
            $deliveryGuyNewOrderNotificationMsg = config('setting.deliveryGuyNewOrderNotificationMsg');
            $deliveryGuyNewOrderNotificationMsgSub = config('setting.deliveryGuyNewOrderNotificationMsgSub');
        }

        $secretKey = 'key=' . config('setting.firebaseSecret');

        $pushTokens = PushToken::where('user_id', $user_id)->get();

        if (count($pushTokens) > 0) {
            if ($orderstatus_id == '2') {
                $msgTitle = $runningOrderPreparingTitle;
                $msgMessage = $runningOrderPreparingSub;
                $click_action = config('setting.storeUrl') . '/running-order/' . $unique_order_id;
            }
            if ($orderstatus_id == '3') {
                $msgTitle = $runningOrderDeliveryAssignedTitle;
                $msgMessage = $runningOrderDeliveryAssignedSub;
                $click_action = config('setting.storeUrl') . '/running-order/' . $unique_order_id;
            }
            if ($orderstatus_id == '4') {
                $msgTitle = $runningOrderOnwayTitle;
                $msgMessage = $runningOrderOnwaySub;
                $click_action = config('setting.storeUrl') . '/running-order/' . $unique_order_id;
            }
            if ($orderstatus_id == '5') {
                $msgTitle = $runningOrderDelivered;
                $msgMessage = $runningOrderDeliveredSub;
                $click_action = config('setting.storeUrl') . '/my-orders/';
            }
            if ($orderstatus_id == '6') {
                $msgTitle = $runningOrderCanceledTitle;
                $msgMessage = $runningOrderCanceledSub;
                $click_action = config('setting.storeUrl') . '/my-orders/';
            }
            if ($orderstatus_id == '7') {
                $msgTitle = $runningOrderReadyForPickup;
                $msgMessage = $runningOrderReadyForPickupSub;
                $click_action = config('setting.storeUrl') . '/running-order/' . $unique_order_id;
            }
            if ($orderstatus_id == 'TO_DELIVERY') {
                $msgTitle = $deliveryGuyNewOrderNotificationMsg;
                $msgMessage = $deliveryGuyNewOrderNotificationMsgSub;
                $click_action = config('setting.storeUrl') . '/delivery/orders/' . $unique_order_id;
            }
            if ($orderstatus_id == 'TO_STOREOWNER') {
                $msgTitle = config('setting.restaurantNewOrderNotificationMsg');
                $msgMessage = "";
                $click_action = null;
            }

            $msg = array(
                'title' => $msgTitle,
                'message' => $msgMessage,
                'badge' => '/assets/img/favicons/favicon-96x96.png',
                'icon' => '/assets/img/favicons/favicon-512x512.png',
                'click_action' => $click_action,
                'unique_order_id' => $unique_order_id,
            );

            $alert = new Alert();
            $alert->data = json_encode($msg);
            $alert->user_id = $user_id;
            $alert->is_read = 0;
            $alert->save();

            $tokens = $pushTokens->pluck('token')->toArray();

            $fullData = array(
                'registration_ids' => $tokens,
                'data' => $msg,
            );

            Curl::to('https://fcm.googleapis.com/fcm/send')
                ->withHeader('Content-Type: application/json')
                ->withHeader("Authorization: $secretKey")
                ->withData(json_encode($fullData))
                ->post();
        }
    }

    /**
     * @param $user_id
     * @param $amount
     * @param $message
     * @param $type
     */
    public function sendWalletAlert($user_id, $amount, $message, $type)
    {

        $amountWithCurrency = config('setting.currencySymbolAlign') == 'left' ? config('setting.currencyFormat') . $amount : $amount . config('setting.currencyFormat');

        $msg = array(
            'title' => config('setting.walletName'),
            'message' => $amountWithCurrency . ' ' . $message,
            'is_wallet_alert' => true,
            'transaction_type' => $type,
        );

        $alert = new Alert();
        $alert->data = json_encode($msg);
        $alert->user_id = $user_id;
        $alert->is_read = 0;
        $alert->save();
    }

    public function stopPlayingNotificationSoundDeliveryApp($unique_order_id)
    {
        $secretKey = 'key=' . config('setting.firebaseSecret');

        $deliveryGuys = User::role('Delivery Guy')->get(['id'])->pluck('id')->toArray();
        $tokens = PushToken::whereIn('user_id', $deliveryGuys)->get(['token'])->pluck('token')->toArray();

        $msg = array(
            'title' => "Order Missed",
            'message' => "Order already accepted by other delivery guy.",
            'badge' => '/assets/img/favicons/favicon-96x96.png',
            'icon' => '/assets/img/favicons/favicon-512x512.png',
            'click_action' => null,
            'unique_order_id' => $unique_order_id,
            'stop_playing' => "yes",
        );


        $fullData = array(
            'registration_ids' => $tokens,
            'data' => $msg,
        );

        Curl::to('https://fcm.googleapis.com/fcm/send')
            ->withHeader('Content-Type: application/json')
            ->withHeader("Authorization: $secretKey")
            ->withData(json_encode($fullData))
            ->post();
    }

    public function stopPlayingNotificationSoundStoreApp($order_id)
    {
        $secretKey = 'key=' . config('setting.firebaseSecret');

        $storeOwners = User::role('Store Owner')->get(['id'])->pluck('id')->toArray();
        $tokens = PushToken::whereIn('user_id', $storeOwners)->get(['token'])->pluck('token')->toArray();

        $msg = array(
            'title' => "Order Notification",
            'message' => "Order already accepted or cancelled",
            'badge' => '/assets/img/favicons/favicon-96x96.png',
            'icon' => '/assets/img/favicons/favicon-512x512.png',
            'click_action' => null,
            'unique_order_id' => $order_id,
            'stop_playing' => "yes",
        );


        $fullData = array(
            'registration_ids' => $tokens,
            'data' => $msg,
        );

        Curl::to('https://fcm.googleapis.com/fcm/send')
            ->withHeader('Content-Type: application/json')
            ->withHeader("Authorization: $secretKey")
            ->withData(json_encode($fullData))
            ->post();
    }
}
