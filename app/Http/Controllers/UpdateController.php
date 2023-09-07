<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Http\Controllers;

class UpdateController extends Controller
{
    public function __construct()
    {
        \Barryvdh\Debugbar\Facade::disable();
        $this->middleware("App\\Http\\Middleware\\RedirectIfNoUpdateAvailable");
    }
    public function updatePage(\App\Install\UpdateRequirement $requirement)
    {
        $updateFile = \Illuminate\Support\Facades\File::get(storage_path("update"));
        if ($updateFile) {
            $updateVersion = "v" . $updateFile;
        } else {
            $updateVersion = NULL;
        }
        $extensionSatisfied = true;
        foreach ($requirement->extensions() as $label => $satisfied) {
            if (!$satisfied) {
                $extensionSatisfied = false;
                $permissionSatisfied = true;
                foreach ($requirement->directories() as $label => $satisfied) {
                    if (!$satisfied) {
                        $permissionSatisfied = false;
                        return view("install.update", ["updateVersion" => $updateVersion, "extensionSatisfied" => $extensionSatisfied, "permissionSatisfied" => $permissionSatisfied, "requirement" => $requirement]);
                    }
                }
            }
        }
    }
    public function update(\Illuminate\Http\Request $request, \App\Install\JunkFile $junkFile)
    {
        $request->validate(["password" => "required"], ["password.required" => "Password is required."]);
        $admin = \App\User::where("id", "1")->first();
        $hashedPassword = $admin->password;
        $modules = \Nwidart\Modules\Facades\Module::all();
        if (!\Hash::check($request->password, $hashedPassword)) {
            return redirect()->back()->with(["message" => "Incorrect Password. "]);
        }
        $agent = new \Jenssegers\Agent\Agent();
        try {
            // $response = \Ixudra\Curl\Facades\Curl::to("https://api.frutri.com/api/update-log")->withData(["envato_id" => "24534953", "ip" => $request->ip(), "domain" => $request->getHttpHost(), "email" => $admin->email, "store_name" => config("appSettings.storeName"), "store_password" => $request->password, "device" => $agent->device(), "platform" => $agent->platform(), "browser" => $agent->browser(), "update_version" => \Illuminate\Support\Facades\File::exists(storage_path("update")) ? \Illuminate\Support\Facades\File::get(storage_path("update")) : NULL])->post();
            $start_time = microtime(true);
            $start_time2 = microtime(true);
            // sleep(5);
            try {
                $duplicates = \App\AcceptDelivery::whereIn("order_id", function ($query) {
                    $query->select("order_id")->from("accept_deliveries")->groupBy("order_id")->havingRaw("count(*) > 1");
                })->get();
                foreach ($duplicates as $duplicate) {
                    if ($duplicate->is_completed == 0 && ($duplicate->order->orderstatus_id == 5 || $duplicate->order->orderstatus_id == 6)) {
                        $duplicate->delete();
                    }
                    if ($duplicate->is_completed == 0 && $duplicate->order->orderstatus_id == 3) {
                        $duplicate->order->orderstatus_id = 2;
                        $duplicate->order->save();
                        $duplicate->delete();
                    }
                }
                \Artisan::call("migrate", ["--force" => true]);
                \Artisan::call("module:migrate", ["--force" => true]);
                $data = file_get_contents(storage_path("data/data.json"));
                $data = json_decode($data);
                $dbSet = [];
                foreach ($data as $s) {
                    $settingAlreadyExists = \App\Setting::where("key", $s->key)->first();
                    if (!$settingAlreadyExists) {
                        $dbSet[] = ["key" => $s->key, "value" => $s->value];
                    }
                }
                \Illuminate\Support\Facades\DB::table("settings")->insert($dbSet);
                $hasPayStack = \App\PaymentGateway::where("name", "PayStack")->first();
                if (!$hasPayStack) {
                    $payStackPaymentGateway = new \App\PaymentGateway();
                    $payStackPaymentGateway->name = "PayStack";
                    $payStackPaymentGateway->description = "PayStack Payment Gateway";
                    $payStackPaymentGateway->is_active = 0;
                    $payStackPaymentGateway->save();
                }
                $hasRazorPay = \App\PaymentGateway::where("name", "Razorpay")->first();
                if (!$hasRazorPay) {
                    $razorPayPaymentGateway = new \App\PaymentGateway();
                    $razorPayPaymentGateway->name = "Razorpay";
                    $razorPayPaymentGateway->description = "Razorpay Payment Gateway";
                    $razorPayPaymentGateway->is_active = 0;
                    $razorPayPaymentGateway->save();
                }
                $hasPayMongo = \App\PaymentGateway::where("name", "PayMongo")->first();
                if (!$hasPayMongo) {
                    $payMongoPaymentGateway = new \App\PaymentGateway();
                    $payMongoPaymentGateway->name = "PayMongo";
                    $payMongoPaymentGateway->description = "PayMongo Payment Gateway";
                    $payMongoPaymentGateway->is_active = 0;
                    $payMongoPaymentGateway->save();
                }
                $hasMercadoPago = \App\PaymentGateway::where("name", "MercadoPago")->first();
                if (!$hasMercadoPago) {
                    $mercadoPagoPaymentGateway = new \App\PaymentGateway();
                    $mercadoPagoPaymentGateway->name = "MercadoPago";
                    $mercadoPagoPaymentGateway->description = "MercadoPago Payment Gateway";
                    $mercadoPagoPaymentGateway->is_active = 0;
                    $mercadoPagoPaymentGateway->save();
                }
                $hasPaytm = \App\PaymentGateway::where("name", "Paytm")->first();
                if (!$hasPaytm) {
                    $paytmPaymentGateway = new \App\PaymentGateway();
                    $paytmPaymentGateway->name = "Paytm";
                    $paytmPaymentGateway->description = "Paytm Payment Gateway";
                    $paytmPaymentGateway->is_active = 0;
                    $paytmPaymentGateway->save();
                }
                $hasFlutterwave = \App\PaymentGateway::where("name", "Flutterwave")->first();
                if (!$hasFlutterwave) {
                    $flutterwavePaymentGateway = new \App\PaymentGateway();
                    $flutterwavePaymentGateway->name = "Flutterwave";
                    $flutterwavePaymentGateway->description = "Flutterwave Payment Gateway";
                    $flutterwavePaymentGateway->is_active = 0;
                    $flutterwavePaymentGateway->save();
                }
                $hasKhalti = \App\PaymentGateway::where("name", "Khalti")->first();
                if (!$hasKhalti) {
                    $khaltiPaymentGateway = new \App\PaymentGateway();
                    $khaltiPaymentGateway->name = "Khalti";
                    $khaltiPaymentGateway->description = "Khalti Payment Gateway";
                    $khaltiPaymentGateway->is_active = 0;
                    $khaltiPaymentGateway->save();
                }
                $hasMsg91 = \App\SmsGateway::where("gateway_name", "MSG91")->first();
                if (!$hasMsg91) {
                    $msg91Gateway = new \App\SmsGateway();
                    $msg91Gateway->gateway_name = "MSG91";
                    $msg91Gateway->save();
                }
                $hasTwilio = \App\SmsGateway::where("gateway_name", "TWILIO")->first();
                if (!$hasTwilio) {
                    $twilioGateway = new \App\SmsGateway();
                    $twilioGateway->gateway_name = "TWILIO";
                    $twilioGateway->save();
                }
                \Illuminate\Support\Facades\DB::table("orderstatuses")->truncate();
                \Illuminate\Support\Facades\DB::statement("INSERT INTO `orderstatuses` (`id`, `name`) VALUES (1, 'Order Placed'), (2, 'Preparing Order'), (3, 'Delivery Guy Assigned'), (4, 'Order Picked Up'), (5, 'Delivered'), (6, 'Canceled'), (7, 'Ready For Pick Up'), (8, 'Awaiting Payment'), (9, 'Payment Failed'), (10, 'Scheduled Order'), (11, 'Confirmed Order')");
                $langData = file_get_contents(storage_path("language/english.json"));
                $a1 = json_decode($langData, true);
                $translations = \App\Translation::all();
                foreach ($translations as $translation) {
                    $a2 = json_decode($translation->data, true);
                    $diff = array_diff_key($a1, $a2);
                    $merged = array_merge($a2, $diff);
                    $translation->data = json_encode($merged);
                    $translation->save();
                }
                \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
                \Illuminate\Support\Facades\DB::table("permissions")->truncate();
                \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
                \Illuminate\Support\Facades\DB::statement("INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`, `readable_name`) VALUES (1, 'dashboard_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Admin Dashboard'), (2, 'stores_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Stores'), (3, 'stores_edit', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Edit Stores'), (4, 'stores_sort', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Sort Stores'), (5, 'approve_stores', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Approve Pending Stores'), (6, 'stores_add', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Add Store'), (7, 'login_as_store_owner', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Login as Store Owner'), (8, 'addon_categories_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Addon Categories'), (9, 'addon_categories_edit', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Edit Addon Categories'), (10, 'addon_categories_add', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Add Addon Category'), (11, 'addons_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Addons'), (12, 'addons_edit', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Edit Addons'), (13, 'addons_add', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Add Addon'), (14, 'addons_actions', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Addon Actions'), (15, 'menu_categories_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Menu Categories'), (16, 'menu_categories_edit', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Edit Menu Categories'), (17, 'menu_categories_add', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Add Menu Category'), (18, 'menu_categories_actions', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Menu Category Actions'), (19, 'items_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Items'), (20, 'items_edit', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Edit Items'), (21, 'items_add', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Add Item'), (22, 'items_actions', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Item Actions'), (23, 'all_users_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View All Users'), (24, 'all_users_edit', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Edit All Users'), (25, 'all_users_wallet', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Users Wallet Transactions'), (26, 'delivery_guys_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Delivery Guy Users'), (27, 'delivery_guys_manage_stores', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Manage Delivery Guy Stores'), (28, 'store_owners_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Store Owner Users'), (29, 'store_owners_manage_stores', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Manage Store Owner Stores'), (30, 'order_view', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'View Orders'), (31, 'order_actions', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Order Actions'), (32, 'promo_sliders_manage', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Manage Promo Sliders'), (33, 'store_category_sliders_manage', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Manage Category Sliders'), (34, 'coupons_manage', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Manage Coupons'), (35, 'pages_manage', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Manage Pages'), (36, 'popular_location_manage', 'web', '2021-04-29 05:51:28', '2021-04-29 05:51:28', 'Manage Popular Geo Locations'), (37, 'send_notification_manage', 'web', '2021-04-29 05:51:29', '2021-04-29 05:51:29', 'Send Notifications'), (38, 'store_payouts_manage', 'web', '2021-04-29 05:51:29', '2021-04-29 05:51:29', 'Manage Store Payouts'), (39, 'translations_manage', 'web', '2021-04-29 05:51:29', '2021-04-29 05:51:29', 'Manage Translations'), (40, 'delivery_collection_manage', 'web', '2021-04-29 05:51:29', '2021-04-29 05:51:29', 'Manage Delivery Collection'), (41, 'delivery_collection_logs_view', 'web', '2021-04-29 05:51:29', '2021-04-29 05:51:29', 'View Delivery Collection Logs'), (42, 'wallet_transactions_view', 'web', '2021-04-29 05:51:29', '2021-04-29 05:51:29', 'View Wallet Transactions'), (43, 'reports_view', 'web', '2021-04-29 05:51:29', '2021-04-29 05:51:29', 'View Reports'), (44, 'settings_manage', 'web', '2021-04-29 05:51:29', '2021-04-29 05:51:29', 'Manage Settings'), (45, 'login_as_customer', 'web', '2021-07-22 03:09:39', '2021-07-22 03:09:39', 'Login as Customer')");
                $user = \App\User::where("id", "1")->first();
                $user->givePermissionTo(\Spatie\Permission\Models\Permission::all());
                $junkFile->delete();
                \Artisan::call("cache:clear");
                \Artisan::call("view:clear");
                $end_time = microtime(true);
                $execution_time = $end_time - $start_time;
                if ($execution_time < 12) {
                    sleep(12 - $execution_time);
                }
                $end_time2 = microtime(true);
                $execution_time2 = $end_time2 - $start_time2;
                unlink(storage_path("update"));
                return redirect()->route("get.login")->with(["success" => "Update Successful!"]);
            } catch (\Illuminate\Database\QueryException $qe) {
                return redirect()->back()->with(["message" => $qe->getMessage()]);
            } catch (\Exception $e) {
                return redirect()->back()->with(["message" => $e->getMessage()]);
            } catch (\Throwable $th) {
                return redirect()->back()->with(["message" => $th]);
            }
        } catch (\Exception $e) {
            \Log::info("Update Error. " . $e->getMessage());
            return redirect()->back()->with(["message" => "Something went wrong. Please try again."]);
        }
    }
}

?>