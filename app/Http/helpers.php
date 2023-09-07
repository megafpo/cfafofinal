<?php

use App\PushNotify;
use App\Restaurant;
use Carbon\CarbonInterval;
use Illuminate\Support\Facades\DB;

/**
 * @param $t1
 * @param $t2
 */
function timeStampDiffFormatted($t1, $t2)
{
    $days = $t1->diffInDays($t2);
    $hours = $t1->diffInHours($t2->subDays($days));
    $minutes = $t1->diffInMinutes($t2->subHours($hours));
    $seconds = $t1->diffInSeconds($t2->subMinutes($minutes));
    return CarbonInterval::days($days)->hours($hours)->minutes($minutes)->seconds($seconds)->forHumans();
};

/**
 * @param $t1
 * @param $t2
 * @return mixed
 */
function diffInMins($t1, $t2)
{
    $minutes = $t1->diffInMinutes($t2);
    return $minutes;
}

/**
 * @param $string
 * @return mixed
 */
function returnAcronym($string)
{
    $words = explode(' ', "$string");
    $acronym = '';
    foreach ($words as $w) {
        if (isset($w[0])) {
            $acronym .= $w[0];
        }
    }
    $firstTwoChars = strtoupper(mb_substr($acronym, 0, 2, 'UTF-8'));
    return $firstTwoChars;
}

/**
 * @param $collection
 */
function storeAvgRating($collection)
{
    $rating = number_format((float) $collection->avg('rating_store'), 1, '.', '');
    return str_replace('.0', '', (string) number_format($rating, 1, '.', ''));
}

/**
 * @param $collection
 */
function deliveryAvgRating($collection)
{
    $rating = number_format((float) $collection->avg('rating_delivery'), 1, '.', '');
    return str_replace('.0', '', (string) number_format($rating, 1, '.', ''));
}

/**
 * @return mixed
 */
function ratingColorClass($rating)
{
    $rating = (float) $rating;
    $classColor = 'rating-green';
    if ($rating <= 3) {
        $classColor = 'rating-orange';
    }
    if ($rating <= 2) {
        $classColor = 'rating-red';
    }

    return $classColor;
}

function fancyNumberFormat($number, $precision = 2)
{
    $suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
    $index = (int) log(abs($number), 1000);
    $index = max(0, min(count($suffixes) - 1, $index)); // Clamps to a valid suffixes' index
    return number_format($number / 1000 ** $index, $precision) . $suffixes[$index];
}

function properDateFormat($date)
{
    // return $date->format('d-m-Y - h:ia');

    return $date->format('d F, Y');
}
function properDateFormatTime($date)
{
    // return $date->format('d-m-Y - h:ia');

    return $date->format('d F, Y - h:ia');
}

/**
 * @param $latitudeFrom
 * @param $longitudeFrom
 * @param $latitudeTo
 * @param $longitudeTo
 * @return mixed
 */
function getDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo)
{
    $latFrom = deg2rad($latitudeFrom);
    $lonFrom = deg2rad($longitudeFrom);
    $latTo = deg2rad($latitudeTo);
    $lonTo = deg2rad($longitudeTo);

    $latDelta = $latTo - $latFrom;
    $lonDelta = $lonTo - $lonFrom;

    $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
        cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
    return $angle * 6371;
}

function syncRestaurantZoneIdToItsProperties($ids)
{
    $restaurants = Restaurant::whereIn('id', $ids)->with('items', 'orders', 'restaurant_earnings', 'restaurant_payouts')->get();
    foreach ($restaurants as $restaurant) {
        $restaurantItemIds = [];
        //restaurant items
        foreach ($restaurant->items as $restaurantItem) {
            array_push($restaurantItemIds, $restaurantItem->id);
        }

        $restaurantOrderIds = [];
        //restaurant orders
        foreach ($restaurant->orders as $restaurantOrder) {
            array_push($restaurantOrderIds, $restaurantOrder->id);
        }

        $restaurantEarningsIds = [];
        //restaurant earnings
        foreach ($restaurant->restaurant_earnings as $restaurantEarning) {
            array_push($restaurantEarningsIds, $restaurantEarning->id);
        }

        $restaurantPayoutsIds = [];
        //restaurant payouts
        foreach ($restaurant->restaurant_payouts as $restaurantPayout) {
            array_push($restaurantPayoutsIds, $restaurantPayout->id);
        }

        DB::table('items')->whereIn('id', $restaurantItemIds)->update(['zone_id' => $restaurant->zone_id]);
        DB::table('orders')->whereIn('id', $restaurantOrderIds)->update(['zone_id' => $restaurant->zone_id]);
        DB::table('restaurant_earnings')->whereIn('id', $restaurantEarningsIds)->update(['zone_id' => $restaurant->zone_id]);
        DB::table('restaurant_payouts')->whereIn('id', $restaurantPayoutsIds)->update(['zone_id' => $restaurant->zone_id]);

        Artisan::call("cache:clear");
    }
}

function sendNotificationAccordingToOrderRules($order)
{
    switch ($order->orderstatus_id) {
        case '2':
            $notify = new PushNotify();
            $notify->sendPushNotification('2', $order->user_id, $order->unique_order_id);

            sendSmsToDelivery($order->restaurant_id);
            sendPushNotificationToDelivery($order->restaurant_id, $order);

            sendSmsToStoreOwner($order->restaurant_id, $order->total);
            sendPushNotificationToStoreOwner($order->restaurant_id, $order->unique_order_id);
            break;

        case '1':
            sendSmsToStoreOwner($order->restaurant_id, $order->total);
            sendPushNotificationToStoreOwner($order->restaurant_id, $order->unique_order_id);
            break;

        case "10":
            sendSmsToStoreOwner($order->restaurant_id, $order->total);
            sendPushNotificationToStoreOwner($order->restaurant_id, $order->unique_order_id);
            break;
    }
}


function dailyTargetPercentage($todayRevenue)
{
    $target = floatval(config('setting.adminDailyTargetRevenue'));
    $percentageCompleted = $todayRevenue / $target * 100;

    return round($percentageCompleted);
}

function revenueTargetColorHelper($todayRevenue)
{
    $target = floatval(config('setting.adminDailyTargetRevenue'));
    $percentageCompleted = $todayRevenue / $target * 100;

    if ($percentageCompleted < 20) {
        return "bg-danger";
    }

    if ($percentageCompleted < 30) {
        return "bg-warning";
    }

    if ($percentageCompleted < 100) {
        return "bg-success";
    }

    return "bg-primary";
}

function calculatePercentIncreaseDecrease($today, $yesterday)
{
    if ($yesterday == 0) {
        return '<i class="icon-stats-growth2 mr-1"></i>' . round($today * 100, 0);
    }

    if ($today >= $yesterday) {
        $diff = $today - $yesterday;
        $percentage = $diff / $yesterday * 100;
        return '<i class="icon-stats-growth2 mr-1"></i>' . round($percentage, 0);
    } else {
        $diff =  $yesterday - $today;
        $percentage = $diff / $yesterday * 100;
        return '<i class="icon-stats-decline2 mr-1"></i>' . round($percentage, 0);
    }
}

function getOrderStatusName($orderstatus_id)
{
    switch ($orderstatus_id) {
        case '1':
            return "Order Placed";
            break;
        case '2':
            return "Order Accepted";
            break;
        case '3':
            return "Delivery Assigned";
            break;
        case '4':
            return "Picked Up";
            break;
        case '5':
            return "Completed";
            break;
        case '6':
            return "Canceled";
            break;
        case '7':
            return "Ready to Pickup";
            break;
        case '8':
            return "Awaiting Payment";
            break;
        case '9':
            return "Payment Failed";
            break;
        case '10':
            return "Scheduled Order";
            break;
        case '11':
            return "Confirmed Scheduled Order";
            break;
    }
}
