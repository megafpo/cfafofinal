<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Providers;
class SettingsServiceProvider extends \Illuminate\Support\ServiceProvider
{
    public function boot(\Illuminate\Contracts\Cache\Factory $cache, \App\Setting $settings)
    {
        
        $settings = '';
        if (env("APP_INSTALLED") && \Illuminate\Support\Facades\DB::connection()->getDatabaseName() && \Illuminate\Support\Facades\Schema::hasTable("settings")) {
            if (\Cache::has("settings")) {
                $settings = \Cache::get("settings");
                config()->set("setting", $settings);
            } else {
                $settings = $cache->remember("settings", 3600, function () {
                    return \App\Setting::pluck("value", "key")->all();
                });
                config()->set("setting", $settings);
            }
        }
    }
}

?>