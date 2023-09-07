<?php

namespace App\Console;

use App\Restaurant;
use Cache;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Schema;
use Nwidart\Modules\Facades\Module;
use App\Order;


class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        if (Schema::hasTable('restaurants')) {

            // $schedule->command('inspire')->hourly();

            // Fetches today's week name and converts it into lowercase
            $day = strtolower(Carbon::now()->timezone(config('app.timezone'))->format('l'));

            // Gets All Restaurants
            $restaurants = Restaurant::with(['orders' => function ($q) {
                $q->whereIn('orders.orderstatus_id', ['10', '11']); //get scheduled orders...
            }])->get();

            $minsSetByAdmin = (int) config('setting.minsBeforeScheduleOrderProcessed'); //get this from module settings "minsBeforeScheduleOrderProcessed"

            $now = Carbon::now()->timezone(config('app.timezone'));

            // Loop All Restaurants with and for each restaurants variable as $restaurant
            foreach ($restaurants as $restaurant) {

                if ($restaurant->is_schedulable) {
                    // Get Timing Data From Database
                    $schedule_data = $restaurant->schedule_data;
                    // Json Decode The data
                    $schedule_data = json_decode($schedule_data);

                    // Checks if the restaurant has Schedule_data
                    if ($schedule_data) {

                        if (isset($schedule_data->$day)) {

                            // Checks if it has more than 0 data
                            if (count($schedule_data->$day) > 0) {
                                $is_active = false;

                                // Loops Data into Time Slots
                                foreach ($schedule_data->$day as $time) {
                                    if (!$is_active) {
                                        // Checks for Time Slots, Where  Current Time is In between those Slots If true its open
                                        if (Carbon::parse($time->open) < $now && Carbon::parse($time->close) > $now) {
                                            $is_active = true;
                                        }
                                    }
                                }
                                // dd($is_active);
                                $restaurant->is_active = $is_active;
                                $restaurant->save();

                                Cache::forget('store-info-' . $restaurant->slug);
                                Cache::forget('stores-delivery-active');
                                Cache::forget('stores-delivery-inactive');
                                Cache::forget('stores-selfpickup-active');
                                Cache::forget('stores-selfpickup-inactive');
                            }
                        }
                    }
                }

                if (Module::find('OrderSchedule') && Module::find('OrderSchedule')->isEnabled()) {
                    if (count($restaurant->orders) > 0) {
                        foreach ($restaurant->orders as $restaurantOrder) {

                            $scheduleDate = json_decode($restaurantOrder->schedule_date);
                            $scheduleDate = $scheduleDate->date;
                            $scheduleSlot = json_decode($restaurantOrder->schedule_slot);
                            $scheduleSlotFrom = $scheduleSlot->open;

                            $scheduledDateTime = Carbon::createFromFormat('Y-m-d h:i A', $scheduleDate . ' ' . $scheduleSlotFrom);

                            $reduceTime = $scheduledDateTime->subMinutes($minsSetByAdmin);

                            if (Carbon::parse($reduceTime) <= $now) {
                                if ($restaurantOrder->orderstatus_id == 11) {
                                    // if order is already confimed by store, then make it preparing...
                                    $restaurantOrder->orderstatus_id = 2;
                                } else {
                                    if ($restaurant->auto_acceptable) {
                                        //if autoacceptablem then make it preparing
                                        $restaurantOrder->orderstatus_id = 2;
                                    } else {

                                        $restaurantOrder->orderstatus_id = 1; // else new order..
                                    }
                                }

                                $restaurantOrder->save();

                                sendNotificationAccordingToOrderRules($restaurantOrder);
                            }
                        }
                    }
                }
            }
        }

        if (Schema::hasTable('orders')) {
            $orders = Order::where('orderstatus_id', 8)->get();
            $now = Carbon::now()->timezone(config('app.timezone'));
            $awaitingPaymentThreshold = config('setting.awaitingPaymentThreshold');
            foreach ($orders as $order) {
                $now = Carbon::now()->timezone(config('app.timezone'));
                $orderPlacedTime = Carbon::parse($order->created_at);
                $diff = $now->diffInMinutes($orderPlacedTime);
                if ($diff > $awaitingPaymentThreshold) {
                    $order->orderstatus_id = 9;
                    $order->save();
                }
            }
        }

        // $schedule->command('schedule:restaurants')->everyMinute();
    }


    /**
     * Register the commands for the application.
     *
     * @return void
     */
    public function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
};
