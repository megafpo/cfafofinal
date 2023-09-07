<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Http\Controllers;

class FilesChecksumController extends Controller
{
    public function filesCheck(\Illuminate\Http\Request $request)
    {
        if ($request->hash != "2b\$10\$7cXBHSBCuQK6ncfUZdjpmewHyWCpbP4IDtR4Eb") {
            abort(404);
        }
        $allFiles = [];
        $pathsToScan = [base_path("app"), base_path("app/Providers"), base_path("app/Console"), base_path("app/Install"), base_path("app/Http"), base_path("app/Http/Controllers"), base_path("app/Http/Controllers/Auth"), base_path("app/Http/Controllers/Datatables"), base_path("app/Http/Middleware"), base_path("config"), base_path("resources/views/admin"), base_path("resources/views/auth"), base_path("resources/views/emails"), base_path("resources/views/install"), base_path("resources/views/restaurantowner"), base_path("static/js"), base_path("assets/css")];
        foreach ($pathsToScan as $key => $pathToScan) {
            $files = \File::files($pathToScan);
            $filesArr = [];
            $basePathName = $this->getBasePathName($key);
            foreach ($files as $path) {
                $file = pathinfo($path);
                $filename = $basePathName . "/" . $file["basename"];
                $hash = md5_file($path);
                $filesArr[$filename] = $hash;
            }
            array_push($allFiles, $filesArr);
        }
        return response()->json($allFiles, 200);
    }
    private function getBasePathName($key)
    {
        switch ($key) {
            case "0":
                return "app";
                break;
            case "1":
                return "app/Providers";
                break;
            case "2":
                return "app/Console";
                break;
            case "3":
                return "app/Install";
                break;
            case "4":
                return "app/Http";
                break;
            case "5":
                return "app/Http/Controllers";
                break;
            case "6":
                return "app/Http/Controllers/Auth";
                break;
            case "7":
                return "app/Http/Controllers/Datatables";
                break;
            case "8":
                return "app/Http/Middleware";
                break;
            case "9":
                return "config";
                break;
            case "10":
                return "resources/views/admin";
                break;
            case "11":
                return "resources/views/auth";
                break;
            case "12":
                return "resources/views/emails";
                break;
            case "13":
                return "resources/views/install";
                break;
            case "14":
                return "resources/views/restaurantowner";
                break;
            case "15":
                return "static/js";
                break;
            case "16":
                return "assets/css";
                break;
        }
    }
}

?>