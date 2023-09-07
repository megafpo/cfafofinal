<?php

namespace App\Http\Middleware;

use Closure;
use App\PopularGeoPlace;
use Illuminate\Support\Facades\Route;
use Auth;
use Illuminate\Support\Facades\File;

class CheckAtleastOneLocationIsPrimary
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $updateFile = File::exists(storage_path('update'));
        if ($updateFile && !$request->is('install/update')) {
            return redirect('install/update');
        }

        if (Auth::user() && Auth::user()->hasRole('Admin')) {



            //else redirect to page to create new location as primary
            $allowed = [
                'admin.popularGeoLocations',
                'admin.saveNewPopularGeoLocation',
                'admin.disablePopularGeoLocation',
                'admin.deletePopularGeoLocation',
                'admin.makeDefaultLocation',
                'logout',
                'liVer',
                'liVerPost',
                'firstVerificationSuccess',
                'licenseManager',
                'licenseReset',
                'updatePage',
                'updatePost',
            ];
            $route = Route::getRoutes()->match($request);
            if (!in_array($route->getName(), $allowed)) {

                $primaryLocation = PopularGeoPlace::where('is_default', '1')->first();

                //if present, do nothing
                if ($primaryLocation) {
                    return $next($request);
                }

                return redirect()->route('admin.popularGeoLocations');
            }
        }

        return $next($request);
    }
}
