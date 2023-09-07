<?php

namespace App\Providers;


use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;
use Cache;
use App\Zone;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        view()->composer(['admin.*'], function ($view) {
            $elFlag = File::exists(base_path('vendor/bin/elflag'));
            if ($elFlag) {
                session()->put('elFlag', true);
            } else {
                session()->put('elFlag', false);
            }
        });

        if (env('APP_INSTALLED')) {
            if (DB::connection()->getDatabaseName()) {
                if (Schema::hasTable('zones')) {
                    if (Cache::has('zonesCache')) {
                        $zones = Cache::get('zonesCache');
                    } else {
                        $zones = Cache::remember('zonesCache', 3600, function () {
                            $data =  Zone::get();
                            return $data;
                        });
                    }
                    view()->composer(['*'], function ($view) use ($zones) {
                        $view->with('navZones', $zones);
                    });
                }
            }
        }
    }
}
