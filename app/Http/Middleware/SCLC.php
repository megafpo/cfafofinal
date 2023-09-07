<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Http\Middleware;

class SCLC
{
    public function handle($request, \Closure $next)
    {
        $route = \Illuminate\Support\Facades\Route::getRoutes()->match($request);
        $currentroute = $route->getName();
        $accessibleRoutes = ["liVer", "liVerPost",  "updatePage", "updatePost", "install.start", "install.preInstallation", "install.configuration", "install.configurationPost", "install.complete", "firstVerificationSuccess", "licenseManager"];
        if (in_array($currentroute, $accessibleRoutes)) {
            return $next($request);
        }
        $myIp = $request->server("SERVER_ADDR") ? $request->server("SERVER_ADDR") : "127.0.0.1";
        $frutriLicenseFile = \Illuminate\Support\Facades\File::exists(base_path("vendor/bin/sys"));
        $envato_id = "24534953";
        // if (!$frutriLicenseFile) {
        //     return redirect()->route("liVer", $envato_id);
        // }
        if ($frutriLicenseFile) {
            $liFileCont = \Illuminate\Support\Facades\File::get(base_path("vendor/bin/sys"));
            $dec = $this->dec($liFileCont);
            $dec = json_decode($dec);
            // if (!$dec || isset($dec->nvl)) {
            //     return redirect()->route("liVer", $envato_id);
            // }
            if (isset($dec->purchase_code)) {
                if (isset($dec->license_type)) {
                    if ($dec->license_type == "Regular License" || $dec->license_type == "Regular") {
                        $junkFiles = new \App\Install\JunkFile();
                        $trueFiles = $junkFiles->getFiles();
                        $filesToDelete = [];
                        if (is_dir(base_path("static/js"))) {
                            $allFrontendFiles = \Illuminate\Support\Facades\File::files(base_path("static/js/"));
                            foreach ($allFrontendFiles as $frontFile) {
                                $file = pathinfo($frontFile);
                                if (!in_array($file["basename"], $trueFiles)) {
                                    array_push($filesToDelete, $file["basename"]);
                                }
                            }
                        //     if (!empty($filesToDelete) && \Illuminate\Support\Facades\File::exists(base_path("vendor/bin/sys"))) {
                        //         \Illuminate\Support\Facades\File::put(base_path("vendor/bin/elflag"), "Unlicensed EL");
                        //         unlink(base_path("vendor/bin/sys"));
                        //         \Ixudra\Curl\Facades\Curl::to("https://api.frutri.com/api/illegal-extended")->withData(["domain" => $request->getHttpHost()])->post();
                        //     }
                        }
                    }
                } else {
                    return redirect()->route("liVer", $envato_id);
                }
            }
        }
        $modules = \Nwidart\Modules\Facades\Module::all();
        if (0 < count($modules)) {
            foreach ($modules as $key => $module) {
                if ($module->getStudlyName() == "SuperCache" || $module->getStudlyName() == "DeliveryAreaPro" || $module->getStudlyName() == "ThermalPrinter" || $module->getStudlyName() == "CallAndOrder" || $module->getStudlyName() == "OrderSchedule") {
                    if ($module->getStudlyName() == "SuperCache") {
                        $envato_id = "27879131";
                        $moduleLicenseFileName = "sc";
                    }
                    if ($module->getStudlyName() == "DeliveryAreaPro") {
                        $envato_id = "28505962";
                        $moduleLicenseFileName = "dap";
                    }
                    if ($module->getStudlyName() == "ThermalPrinter") {
                        $envato_id = "30280239";
                        $moduleLicenseFileName = "tp";
                    }
                    if ($module->getStudlyName() == "CallAndOrder") {
                        $envato_id = "33813527";
                        $moduleLicenseFileName = "cao";
                    }
                    if ($module->getStudlyName() == "OrderSchedule") {
                        $envato_id = "33813595";
                        $moduleLicenseFileName = "os";
                    }
                    $moduleLicenseFile = \Illuminate\Support\Facades\File::exists(base_path("vendor/bin/" . $moduleLicenseFileName));
                    if (!$moduleLicenseFile) {
                        return redirect()->route("liVer", $envato_id);
                    }
                    $moduleLicense = \Illuminate\Support\Facades\File::get(base_path("vendor/bin/" . $moduleLicenseFileName));
                    $decModuleLicense = $this->dec($moduleLicense);
                    $decModuleLicense = json_decode($decModuleLicense);
                    // if (!$decModuleLicense || isset($decModuleLicense->nvl)) {
                    //     return redirect()->route("liVer", $envato_id);
                    // }

                }
            }
        }
        return $next($request);
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
}

?>