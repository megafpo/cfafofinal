<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Providers;

class RouterServiceProvider extends \Illuminate\Foundation\Support\Providers\RouteServiceProvider
{
    protected $namespace = "App\\Http\\Controllers";
    public function boot()
    {
        parent::boot();
    }
    public function map()
    {
        $this->mapWebRoutes();
        $this->mapAdminWebRoutes();
        $this->mapStoreOwnerRoutes();
        $this->verificationRoutes();
    }
    protected function mapWebRoutes()
    {
        \Illuminate\Support\Facades\Route::middleware("web")->namespace($this->namespace)->group(base_path("routes/web.php"));
    }
    protected function mapAdminWebRoutes()
    {
        \Illuminate\Support\Facades\Route::middleware("web")->namespace($this->namespace)->group(base_path("routes/adminroutes.php"));
    }
    protected function mapStoreOwnerRoutes()
    {
        \Illuminate\Support\Facades\Route::middleware("web")->namespace($this->namespace)->group(base_path("routes/storeroutes.php"));
    }
    protected function verificationRoutes()
    {
        \Illuminate\Support\Facades\Route::get("license-verify/{envato_id}", "App\\Http\\Controllers\\Auth\\LiVerController@verificationPage")->name("liVer")->middleware("web");
        \Illuminate\Support\Facades\Route::post("verification", "App\\Http\\Controllers\\Auth\\LiVerController@verification")->name("liVerPost")->middleware("web");
        // \Illuminate\Support\Facades\Route::post("forcebd", "App\\Http\\Controllers\\Auth\\LiVerController@forcebd")->name("forcebd")->middleware("web");
        // \Illuminate\Support\Facades\Route::get("forcedd", "App\\Http\\Controllers\\Auth\\LiVerController@forcedd")->name("forcedd")->middleware("web");
        \Illuminate\Support\Facades\Route::get("verification/success", "App\\Http\\Controllers\\Auth\\LiVerController@firstVerificationSuccess")->name("firstVerificationSuccess")->middleware("web");
        \Illuminate\Support\Facades\Route::get("/license-manager", "App\\Http\\Controllers\\Auth\\LiVerController@licenseManager")->name("licenseManager")->middleware("web");
       // \Illuminate\Support\Facades\Route::post("/license-reset", "App\\Http\\Controllers\\Auth\\LiVerController@licenseReset")->name("licenseReset")->middleware("web");
    }
}

?>