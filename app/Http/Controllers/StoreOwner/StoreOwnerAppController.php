<?php

namespace App\Http\Controllers\StoreOwner;

use Auth;
use Lang;
use Image;
use JWTAuth;
use App\Item;
use App\Page;
use App\User;
use App\Order;
use App\Rating;
use App\Orderitem;
use Carbon\Carbon;
use App\PushNotify;
use App\Restaurant;
use App\ItemCategory;
use JWTAuthException;
use App\RestaurantPayout;
use App\RestaurantEarning;
use Illuminate\Http\Request;
use App\Helpers\TranslationHelper;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class StoreOwnerAppController extends Controller
{

    public function getAllLanguage()
    {
        $languages = [];
        $jsonFiles = glob(storage_path('storeapp-language') . '/*');
        foreach ($jsonFiles as $file) {
            $fileContents = file_get_contents($file);
            if ($this->isValidJson($fileContents)) {
                $fileName = basename($file);
                $fileName = str_replace(".json", "", $fileName);
                array_push($languages, $fileName);
            }
        }
        return response()->json($languages);
    }

    public function getSingleLanguage($language_code)
    {
        $path = '/storeapp-language/' . $language_code . '.json';
        $data = json_decode(File::get(storage_path($path)), true);
        return response()->json($data);
    }

    /**
     * @param $email
     * @param $password
     * @return mixed
     */
    private function getToken($email, $password)
    {
        $token = null;
        try {
            if (!$token = JWTAuth::attempt(['email' => $email, 'password' => $password])) {
                return response()->json([
                    'response' => 'error',
                    'message' => 'Password or email is invalid..',
                    'token' => $token,
                ]);
            }
        } catch (JWTAuthException $e) {
            return response()->json([
                'response' => 'error',
                'message' => 'Token creation failed',
            ]);
        }
        return $token;
    }


    /**
     * @param Request $request
     */
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->get()->first();
        if ($user && Hash::check($request->password, $user->password)) {

            if ($user->hasRole('Store Owner')) {
                $token = self::getToken($request->email, $request->password);
                $user->auth_token = $token;
                $user->save();

                $response = [
                    'success' => true,
                    'data' => [
                        'id' => $user->id,
                        'auth_token' => $user->auth_token,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'stores' => $user->restaurants,
                    ],
                ];
            } else {
                $response = ['success' => false, 'data' => 'Record doesnt exists'];
            }
        } else {
            $response = ['success' => false, 'data' => 'Record doesnt exists...'];
        }
        return response()->json($response, 201);
    }


    public function dashboard(Request $request)
    {
        $user = Auth::user();

        $store = Restaurant::where('id', $request->store_id)->first();

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $newOrders = Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['1', '10'])
            ->orderBy('id', 'DESC')
            ->with('restaurant')
            ->get();

        // dd($newOrders);

        $newOrdersIds = $newOrders->pluck('id')->toArray();

        $preparingOrders = Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['2', '3', '11'])
            ->where('delivery_type', '<>', 2)
            ->orderBy('orderstatus_id', 'ASC')
            ->with('restaurant')
            ->get();

        $selfpickupOrders = Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['2', '7'])
            ->where('delivery_type', 2)
            ->orderBy('orderstatus_id', 'DESC')
            ->with('restaurant')
            ->get();

        $ongoingOrders = Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['4'])
            ->orderBy('orderstatus_id', 'DESC')
            ->with('restaurant')
            ->get();

        $ordersCount = Order::where('restaurant_id', $request->store_id)
            ->where('orderstatus_id', '5')->count();

        $allCompletedOrders = Order::where('restaurant_id', $request->store_id)
            ->where('orderstatus_id', '5')
            ->with('orderitems')
            ->get();

        $orderItemsCount = 0;
        foreach ($allCompletedOrders as $cO) {
            foreach ($cO->orderitems as $orderItem) {
                $orderItemsCount += $orderItem->quantity;
            }
        }

        $totalEarning = 0;
        settype($var, 'float');

        foreach ($allCompletedOrders as $completedOrder) {
            $totalEarning += $completedOrder->total - ($completedOrder->delivery_charge + $completedOrder->tip_amount);
        }

        $todayOrders = Order::where('orderstatus_id', 5)
            ->where('restaurant_id', $request->store_id)
            ->select('id', 'orderstatus_id', 'created_at', 'total', 'delivery_charge', 'tip_amount')
            ->whereBetween('created_at', [
                Carbon::now()->startOfDay(),
                Carbon::now(),
            ])->get();

        $todayOrdersCount = $todayOrders->count();

        $todayEarning = 0;
        foreach ($todayOrders as $todayOrder) {
            $todayEarning += $todayOrder->total - ($todayOrder->delivery_charge + $todayOrder->tip_amount);
        }

        $orderIdsToday = $todayOrders->pluck('id');

        $topItemsToday = Orderitem::whereIn('order_id', $orderIdsToday)
            ->select('item_id', 'name', 'price', DB::raw('SUM(quantity) as qty'))
            ->groupBy('item_id')
            ->orderBy('qty', 'DESC')
            ->take(3)
            ->get();

        $inactiveItemCount = Item::where('restaurant_id', $request->store_id)
            ->where('is_active', 0)->count();

        $arrayData = [
            'store' => $store,
            'restaurantsCount' => count($user->restaurants),
            'ordersCount' => $ordersCount,
            'orderItemsCount' => $orderItemsCount,
            'totalEarning' => number_format((float) $totalEarning, 2, '.', ','),
            'newOrders' => $newOrders,
            'newOrdersIds' => $newOrdersIds,
            'preparingOrders' => $preparingOrders,
            'ongoingOrders' => $ongoingOrders,
            'selfpickupOrders' => $selfpickupOrders,
            'todayOrdersCount' => $todayOrdersCount,
            'todayEarning' => $todayEarning,
            'topItemsToday' => $topItemsToday,
            'inactiveItemCount' => $inactiveItemCount
        ];

        return response()->json($arrayData, 200);
    }

    public function toggleStoreStatus(Request $request)
    {
        $user = Auth::user();
        $store = Restaurant::where('id', $request->store_id)->first();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $store->is_schedulable = false;
        $store->toggleActive();
        $store->save();

        $response = [
            'success' => true,
            'status' => $store->is_active,
        ];
        return response()->json($response, 200);
    }


    public function getOrders(Request $request)
    {
        // sleep(1000);
        $storeOwner = Auth::user();
        $storeOwnerId = $storeOwner->id;
        $storeOwner = User::where('id', $storeOwnerId)->first();
        $restaurantIds = $storeOwner->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $newOrders = Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['1', '10'])
            ->orderBy('id', 'DESC')
            ->with('restaurant')
            ->with('orderitems')
            ->withCount('orderitems')
            ->get();

        $preparingOrders = Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['2', '3', '11'])
            ->where('delivery_type', '<>', 2)
            ->orderBy('orderstatus_id', 'ASC')
            ->with('restaurant')
            ->with('orderitems')
            ->withCount('orderitems')
            ->get();

        $selfpickupOrders = Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['2', '7'])
            ->where('delivery_type', 2)
            ->orderBy('orderstatus_id', 'DESC')
            ->with('restaurant')
            ->with('orderitems')
            ->withCount('orderitems')
            ->get();

        $ongoingOrders = Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['4'])
            ->orderBy('orderstatus_id', 'DESC')
            ->with('restaurant')
            ->with('orderitems')
            ->withCount('orderitems')
            ->get();

        $response = [
            'new_orders' => $newOrders,
            'preparing_orders' => $preparingOrders,
            'selfpickup_orders' => $selfpickupOrders,
            'ongoing_orders' => $ongoingOrders,
        ];
        return response()->json($response, 200);
    }

    public function getSingleOrder(Request $request)
    {
        $user = Auth::user();

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $order = Order::where('id', $request->order_id)
            ->with('orderitems.order_item_addons')
            ->with(array('user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone');
            }))
            ->with(array('restaurant' => function ($query) {
                $query->select('id', 'name', 'address');
            }))
            ->with(array('accept_delivery.user' => function ($query) {
                $query->select('id', 'name');
            }))
            ->first();

        if ($order) {
            return response()->json($order, 200);
        }

        $response = [
            'success' => false,
            'message' => 'Order not found',
        ];
        return response()->json($response, 401);
    }

    public function cancelOrder(Request $request, TranslationHelper $translationHelper)
    {
        $keys = ['orderRefundWalletComment', 'orderPartialRefundWalletComment'];
        $translationData = $translationHelper->getDefaultLanguageValuesForKeys($keys);

        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $order = Order::where('id', $request->order_id)->where('restaurant_id', $request->store_id)
            ->with('orderitems.order_item_addons')
            ->with(array('user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone');
            }))
            ->with(array('restaurant' => function ($query) {
                $query->select('id', 'name', 'address');
            }))->first();

        $customer = User::where('id', $order->user_id)->first();
        $storeOwner = Auth::user();

        if ($order && $user) {
            if ($order->orderstatus_id == '1') {
                //change order status to 6 (Canceled)
                $order->orderstatus_id = 6;
                $order->save();

                //if COD, then check if wallet is present
                if ($order->payment_mode == 'COD') {
                    if ($order->wallet_amount != null) {
                        //refund wallet amount
                        $customer->deposit($order->wallet_amount * 100, ['description' => $translationData->orderPartialRefundWalletComment . $order->unique_order_id]);
                    }
                    activity()
                        ->performedOn($order)
                        ->causedBy($storeOwner)
                        ->withProperties(['type' => 'Order_Canceled_Store'])->log('Order canceled');
                } else {
                    //if online payment, refund the total to wallet
                    $customer->deposit(($order->total) * 100, ['description' => $translationData->orderRefundWalletComment . $order->unique_order_id]);
                    activity()
                        ->performedOn($order)
                        ->causedBy($storeOwner)
                        ->withProperties(['type' => 'Order_Canceled_Store'])->log('Order canceled with Full Refund');
                }

                //show notification to user
                if (config('setting.enablePushNotificationOrders') == 'true') {
                    //to user
                    $notify = new PushNotify();
                    $notify->sendPushNotification('6', $order->user_id, $order->unique_order_id);
                }

                return response()->json($order, 200);
            }
        } else {
            $response = [
                'success' => false,
                'message' => 'Order not found',
            ];
            return response()->json($response, 401);
        }
    }

    public function acceptOrder(Request $request)
    {
        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $order = Order::where('id', $request->order_id)->where('restaurant_id', $request->store_id)
            ->with('orderitems.order_item_addons')
            ->with(array('user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone');
            }))
            ->with(array('restaurant' => function ($query) {
                $query->select('id', 'name', 'address');
            }))->first();

        if ($order->orderstatus_id == '1') {
            $order->orderstatus_id = 2;
            $order->save();

            if (config('setting.enablePushNotificationOrders') == 'true') {
                //to user
                $notify = new PushNotify();
                $notify->sendPushNotification('2', $order->user_id, $order->unique_order_id);
            }

            //send notification and sms to delivery only when order type is Delivery...
            if ($order->delivery_type == '1') {

                sendPushNotificationToDelivery($order->restaurant->id, $order);
                sendSmsToDelivery($order->restaurant->id);
            }

            activity()
                ->performedOn($order)
                ->causedBy($user)
                ->withProperties(['type' => 'Order_Accepted_Store'])->log('Order accepted');

            return response()->json($order, 200);
        } else {
            $order->already_action = true;
            return response()->json($order, 200);
        }
    }

    public function markSelfpickupOrderReady(Request $request)
    {
        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $order = Order::where('id', $request->order_id)->where('restaurant_id', $request->store_id)
            ->with('orderitems.order_item_addons')
            ->with(array('user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone');
            }))
            ->with(array('restaurant' => function ($query) {
                $query->select('id', 'name', 'address');
            }))->first();

        if ($order->orderstatus_id == '2') {
            $order->orderstatus_id = 7;
            $order->save();

            if (config('setting.enablePushNotificationOrders') == 'true') {

                //to user
                $notify = new PushNotify();
                $notify->sendPushNotification('7', $order->user_id, $order->unique_order_id);
            }

            activity()
                ->performedOn($order)
                ->causedBy($user)
                ->withProperties(['type' => 'Order_Ready_Store'])->log('Order prepared');

            return response()->json($order, 200);
        } else {
            $response = [
                'success' => false,
                'message' => 'Order not found',
            ];
            return response()->json($response, 401);
        }
    }

    public function markSelfpickupOrderCompleted(Request $request)
    {
        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $order = Order::where('id', $request->order_id)->where('restaurant_id', $request->store_id)
            ->with('orderitems.order_item_addons')
            ->with(array('user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone');
            }))
            ->with(array('restaurant' => function ($query) {
                $query->select('id', 'name', 'address');
            }))->first();

        if ($order->orderstatus_id == '7') {
            $order->orderstatus_id = 5;
            $order->save();

            //if selfpickup add amount to restaurant earnings if not COD then add order total
            if ($order->payment_mode == 'STRIPE' || $order->payment_mode == 'PAYPAL' || $order->payment_mode == 'PAYSTACK' || $order->payment_mode == 'RAZORPAY' || $order->payment_mode == 'PAYMONGO' || $order->payment_mode == 'MERCADOPAGO' || $order->payment_mode == 'PAYTM' || $order->payment_mode == 'FLUTTERWAVE' || $order->payment_mode == 'KHALTI' || $order->payment_mode == 'WALLET') {
                $restaurant_earning = RestaurantEarning::where('restaurant_id', $order->restaurant->id)
                    ->where('is_requested', 0)
                    ->first();
                if ($restaurant_earning) {
                    $restaurant_earning->amount += $order->total;
                    $restaurant_earning->zone_id = $order->restaurant->zone_id ? $order->restaurant->zone_id : null;
                    $restaurant_earning->save();
                } else {
                    $restaurant_earning = new RestaurantEarning();
                    $restaurant_earning->restaurant_id = $order->restaurant->id;
                    $restaurant_earning->amount = $order->total;
                    $restaurant_earning->zone_id = $order->restaurant->zone_id ? $order->restaurant->zone_id : null;
                    $restaurant_earning->save();
                }
            }
            //if COD, then take the $total minus $payable amount
            if ($order->payment_mode == 'COD') {
                $restaurant_earning = RestaurantEarning::where('restaurant_id', $order->restaurant->id)
                    ->where('is_requested', 0)
                    ->first();
                if ($restaurant_earning) {
                    $restaurant_earning->amount += $order->total - $order->payable;
                    $restaurant_earning->zone_id = $order->restaurant->zone_id ? $order->restaurant->zone_id : null;
                    $restaurant_earning->save();
                } else {
                    $restaurant_earning = new RestaurantEarning();
                    $restaurant_earning->restaurant_id = $order->restaurant->id;
                    $restaurant_earning->amount = $order->total - $order->payable;
                    $restaurant_earning->zone_id = $order->restaurant->zone_id ? $order->restaurant->zone_id : null;
                    $restaurant_earning->save();
                }
            }

            if (config('setting.enablePushNotificationOrders') == 'true') {
                //to user
                $notify = new PushNotify();
                $notify->sendPushNotification('5', $order->user_id, $order->unique_order_id);
            }

            if (config('setting.sendOrderInvoiceOverEmail') == 'true') {
                Mail::send('emails.invoice', ['order' => $order], function ($email) use ($order) {
                    $email->subject(config('setting.orderInvoiceEmailSubject') . '#' . $order->unique_order_id);
                    $email->from(config('setting.sendEmailFromEmailAddress'), config('setting.sendEmailFromEmailName'));
                    $email->to($order->user->email);
                });
            }

            activity()
                ->performedOn($order)
                ->causedBy($user)
                ->withProperties(['type' => 'Order_Completed_Store'])->log('Order completed');

            return response()->json($order, 200);
        } else {
            $response = [
                'success' => false,
                'message' => 'Order not found',
            ];
            return response()->json($response, 401);
        }
    }

    public function confirmScheduledOrder(Request $request)
    {
        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $order = Order::where('id', $request->order_id)->where('restaurant_id', $request->store_id)
            ->with('orderitems.order_item_addons')
            ->with(array('user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone');
            }))
            ->with(array('restaurant' => function ($query) {
                $query->select('id', 'name', 'address');
            }))->first();

        if ($order->orderstatus_id == '10') {
            $order->orderstatus_id = 11;
            $order->save();

            activity()
                ->performedOn($order)
                ->causedBy($user)
                ->withProperties(['type' => 'Confirm_Scheduled_Order_Store'])->log('Scheduled order confirmed');

            return response()->json($order, 200);
        } else {
            $response = [
                'success' => false,
                'message' => 'Order not found',
            ];
            return response()->json($response, 401);
        }
    }

    public function getMenu(Request $request)
    {
        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $items = Item::where('restaurant_id', $request->store_id)->pluck('item_category_id')->toArray();
        $filteredItemCategoryIds = array_unique($items);

        $itemCategories = ItemCategory::whereIn('id', $filteredItemCategoryIds)
            ->with(array('items' => function ($query) use ($request) {
                $query->where('restaurant_id', $request->store_id);
            }))
            ->get();

        foreach ($itemCategories as $itemCategory) {
            if ($itemCategory->user_id == $user->id) {
                $itemCategory->canEdit = true;
            } else {
                $itemCategory->canEdit = false;
            }
        }

        return response()->json($itemCategories, 200);
    }

    public function toggleItemStatus(Request $request)
    {
        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        $item = Item::where('id', $request->item_id)
            ->where('restaurant_id', $request->store_id)
            ->first();

        if (!in_array($item->restaurant_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        if ($item) {
            $item->toggleActive()->save();
            $response = [
                'success' => true,
                'status' => $item->is_active,
            ];
            return response()->json($response, 200);
        } else {
            $response = [
                'success' => false,
                'message' => "Something went wrong"
            ];
            return response()->json($response, 400);
        }
    }

    public function searchItems(Request $request)
    {
        $user = Auth::user();

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $items = Item::where('restaurant_id', $request->store_id)
            ->where('name', 'LIKE', "%$request->q%")
            ->take(100)
            ->get();

        return response()->json($items, 200);
    }

    public function editItem(Request $request)
    {
        $user = Auth::user();

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $item = Item::where('id', $request->item_id)
            ->where('restaurant_id', $request->store_id)
            ->first();
        return response()->json($item, 200);
    }

    public function updateItem(Request $request)
    {
        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        $item = Item::where('id', $request->item_id)
            ->where('restaurant_id', $request->store_id)
            ->first();

        if (!in_array($item->restaurant_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        if ($item) {
            $item->name = $request->name;
            $item->price = $request->price;
            $item->save();

            $response = [
                'success' => true,
            ];
            return response()->json($response, 200);
        } else {
            $response = [
                'success' => false,
            ];
            return response()->json($response, 400);
        }
    }

    public function getPastOrders(Request $request)
    {
        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $orders =  Order::where('restaurant_id', $request->store_id)
            ->whereIn('orderstatus_id', ['1', '2', '3', '4', '5', '6', '7', '10', '11'])
            ->with(array('restaurant' => function ($query) {
                $query->select('id', 'name', 'address');
            }))
            ->with('orderitems')
            ->orderBy('created_at', 'DESC')
            ->select('id', 'unique_order_id', 'orderstatus_id', 'total', 'created_at', 'updated_at')
            ->paginate(10);

        return response()->json($orders, 200);
    }

    public function searchOrders(Request $request)
    {
        $user = Auth::user();

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $orders = Order::where('restaurant_id', $request->store_id)
            ->where('unique_order_id', 'LIKE', "%$request->q%")
            ->with('orderitems')
            ->withCount('orderitems')
            ->take(100)
            ->get();

        return response()->json($orders, 200);
    }

    public function updateItemImage(Request $request)
    {
        // \Log::info(json_encode($request->all()));
        $user = Auth::user();

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        $item = Item::where('id', $request->id)
            ->first();

        if (!in_array($item->restaurant_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        if ($item && $request->image != null) {
            $rand_name = time() . str_random(10);
            $filename = $rand_name . '.jpg';
            Image::make($request->image)
                ->resize(486, 355)
                ->save(base_path('assets/img/items/' . $filename), config('setting.uploadImageQuality '), 'jpg');
            $item->image = '/assets/img/items/' . $filename;
            $item->save();
        }

        return response()->json(['success' => true]);
    }

    public function getRatings(Request $request)
    {
        $user = Auth::user();

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if ($user) {
            if (!in_array($request->store_id, $restaurantIds)) {
                return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
            }

            $restaurant = Restaurant::where('id', $request->store_id)
                ->with(array('ratings' => function ($query) {
                    $query->orderBy('id', 'DESC');
                }))->first();

            $restaurant->avgRating = storeAvgRating($restaurant->ratings);
            $restaurant->makeHidden(['delivery_areas', 'ratings', 'schedule_data']);

            $reviews = Rating::where('restaurant_id', $restaurant->id)
                ->with('user')
                ->with(array('order' => function ($query) {
                    $query->select('id');
                }))
                ->orderBy('id', 'DESC')
                ->get();

            $reviews = $reviews->map(function ($review) {
                $review->username = $review->user->name;
                $review->order_id = $review->order->id;
                return $review->only(['id', 'username', 'rating_store', 'review_store', 'order_id']);
            });


            $response = [
                'restaurant' => $restaurant,
                'reviews' => $reviews,
            ];

            return response()->json($response, 200);
        }
    }

    public function getEarnings(Request $request)
    {
        $user = Auth::user();
        $restaurant = $user->restaurants;

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $restaurant = Restaurant::where('id', $request->store_id)->first();

        $allCompletedOrders = Order::where('restaurant_id', $restaurant->id)
            ->where('orderstatus_id', '5')
            ->get();

        $totalEarning = 0;
        settype($var, 'float');

        foreach ($allCompletedOrders as $completedOrder) {
            // $totalEarning += $completedOrder->total - $completedOrder->delivery_charge;
            $totalEarning += $completedOrder->total - ($completedOrder->delivery_charge + $completedOrder->tip_amount);
        }

        $totalEarning =  number_format((float) $totalEarning, 2, '.', '');

        $balance = RestaurantEarning::where('restaurant_id', $restaurant->id)
            ->where('is_requested', 0)
            ->first();

        if (!$balance) {
            $balanceBeforeCommission = 0;
            $balanceAfterCommission = 0;
        } else {
            $balanceBeforeCommission = $balance->amount;
            $balanceAfterCommission = ($balance->amount - ($restaurant->commission_rate / 100) * $balance->amount);
            $balanceAfterCommission = number_format((float) $balanceAfterCommission, 2, '.', '');
        }

        $payoutRequests = RestaurantPayout::where('restaurant_id', $request->store_id)->orderBy('id', 'DESC')->get();

        $minPayout = (float)config('setting.minPayout');
        if (!((float)$balanceAfterCommission > (float)$minPayout)) {
            $canRequestForPayout = false;
        } else {
            $canRequestForPayout = true;
        }


        $response = [
            'restaurant' => $restaurant,
            'totalEarning' => $totalEarning,
            'balanceBeforeCommission' => $balanceBeforeCommission,
            'balanceAfterCommission' => $balanceAfterCommission,
            'payoutRequests' => $payoutRequests,
            'canRequestForPayout' => $canRequestForPayout,
            'minPayout' => $minPayout,
        ];

        return response()->json($response, 200);
    }

    public function sendPayoutRequest(Request $request)
    {
        $user = Auth::user();

        $restaurant = $user->restaurants;

        $restaurantIds = $user->restaurants->pluck('id')->toArray();
        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $restaurant = Restaurant::where('id', $request->store_id)->first();

        $earning = RestaurantEarning::where('restaurant_id', $restaurant->id)
            ->where('is_requested', 0)
            ->first();

        $balanceAfterCommission = ($earning->amount - ($restaurant->commission_rate / 100) * $earning->amount);
        $balanceAfterCommission = number_format((float) $balanceAfterCommission, 2, '.', '');

        if ($earning) {
            $payoutRequest = new RestaurantPayout;
            $payoutRequest->restaurant_id = $restaurant->id;
            $payoutRequest->restaurant_earning_id = $earning->id;
            $payoutRequest->amount = $balanceAfterCommission;
            $payoutRequest->status = 'PENDING';
            $payoutRequest->zone_id = $restaurant->zone_id ? $restaurant->zone_id : null;

            $payoutRequest->save();
            $earning->is_requested = 1;
            $earning->restaurant_payout_id = $payoutRequest->id;
            $earning->save();

            $response = [
                'success' => true,
            ];

            return response()->json($response, 200);
        }
    }

    public function getInactiveItems(Request $request)
    {

        $user = Auth::user();
        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $items = Item::where('restaurant_id', $request->store_id)
            ->where('is_active', 0)
            ->join('item_categories', function ($join) {
                $join->on('items.item_category_id', '=', 'item_categories.id');
            })
            ->orderBy('item_categories.order_column', 'asc')
            ->ordered()
            ->get(array('items.*', 'item_categories.name as category_name'));

        $items = json_decode($items, true);

        $array = [];
        foreach ($items as $item) {
            $array[$item['category_name']][] = $item;
        }

        return response()->json($array, 200);
    }

    public function getStorePage(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $page = Page::where('slug', $request->slug)->first();
            if ($page) {
                return response()->json($page, 200);
            } else {
                $page = null;
                return response()->json($page, 200);
            }
        }
    }

    public function toggleCategoryStatus(Request $request)
    {
        $user = Auth::user();

        $restaurantIds = $user->restaurants->pluck('id')->toArray();

        if (!in_array($request->store_id, $restaurantIds)) {
            return response()->json(['success' => false, 'message' => "Unauthorized"], 401);
        }

        $itemCategory = ItemCategory::where('id', $request->category_id)->where('user_id', $user->id)->first();
        if ($itemCategory) {
            $itemCategory->toggleEnable()->save();
            return response()->json(['success' => true, 'status' => $itemCategory->is_enabled], 200);
        }
    }

    private function isValidJson($string)
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
}
