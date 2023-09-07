<?php

namespace App\Http\Controllers;

use App\Order;
use App\Restaurant;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminPartialsController extends Controller
{
    /**
     * @param $dateRange
     */
    public function dashboardStats(Request $request)
    {

        $from = Carbon::parse($request->from)->startOfDay()->toDateTimeString();
        $to = Carbon::parse($request->to)->endOfDay()->toDateTimeString();

        $displayUsers = DB::table('users');
        $displayRestaurants = DB::table('restaurants');
        $orders = Order::where('orderstatus_id', 5);

        $displayUsers = $displayUsers->whereBetween('created_at', [$from, $to])->count();
        $displayRestaurants = $displayRestaurants->whereBetween('created_at', [$from, $to])->count();

        $salesAndEarnings = $orders->whereBetween('created_at', [$from, $to])
            ->selectRaw('COUNT(*) AS count, SUM(total) AS sum')
            ->first();

        $displaySales = $salesAndEarnings['count'];
        $displayEarnings = $salesAndEarnings['sum'];

        $dashboardStats = view('admin.partials.dashboardStats', [
            'displayUsers' => $displayUsers,
            'displayRestaurants' => $displayRestaurants,
            'displaySales' => $displaySales,
            'displayEarnings' => $displayEarnings,
        ])->render();

        //top stores
        $topStoresData = Order::where('orderstatus_id', '5')->whereBetween('created_at', [$from, $to])->select('restaurant_id', DB::raw('COUNT(*) AS sales_count, SUM(total) AS revenue'))->groupBy('restaurant_id')->orderByRaw('SUM(total) desc')->with('restaurant')->take(3)->get();
        foreach ($topStoresData as $topStore) {
            $topStore->data = $topStore->restaurant;
        }

        $topStores = view('admin.partials.dashboardTopStores', [
            'topStores' => $topStoresData,
        ])->render();


        $response = [
            'success' => true,
            'dashboardStats' => $dashboardStats,
            'topStores' => $topStores,
        ];

        return response()->json($response);
    }
}
