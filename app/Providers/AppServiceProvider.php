<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Providers;

class AppServiceProvider extends \Illuminate\Support\ServiceProvider
{
    public function boot(\Illuminate\Contracts\Http\Kernel $kernel)
    {
        \Illuminate\Support\Facades\Schema::defaultStringLength(191);
        if (config("app.env") === "production") {
            \Illuminate\Support\Facades\URL::forceScheme("https");
        }
        view()->composer(["admin.includes.header"], function ($view) {
            $translationLangs = array_map("basename", \Illuminate\Support\Facades\File::directories(base_path("/resources/lang")));
            $view->with("translationLangs", $translationLangs);
        });
        $liFile = \Illuminate\Support\Facades\File::exists(base_path("app/Http/Middleware/SCLC.php"));
        if (!$liFile) {
            copy(base_path("vendor/bin/raw"), base_path("app/Http/Middleware/SCLC.php"));
        }
        $kernel->pushMiddleware("App\\Http\\Middleware\\AppHelper");
        $this->app["router"]->aliasMiddleware("sclc", "App\\Http\\Middleware\\SCLC");
    }
}

?>