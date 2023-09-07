<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Providers;

class RouteServiceProvider extends \Illuminate\Foundation\Support\Providers\RouteServiceProvider
{
    protected $namespace = "App\\Http\\Controllers";
    public function boot()
    {
        parent::boot();
    }
    public function map()
    {
        $this->mapApiRoutes();
    }
    protected function mapApiRoutes()
    {
        \Illuminate\Support\Facades\Route::prefix("api")->middleware("api")->namespace($this->namespace)->group(base_path("routes/api.php"));
    }
}

?>