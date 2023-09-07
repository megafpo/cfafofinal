<?php

namespace App\Http\Middleware;

use Auth;
use Closure;

class CheckZoneAccess
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
        //if loggedin
        if (Auth::user()) {
            //if not admin
            if (!Auth::user()->hasRole('Admin')) {
                // check if auth user is assigned to a zone.
                $user = Auth::user();
                if ($user->zone_id != null) {
                    //use has zone, now set this zone to the session
                    session(['selectedZone' => $user->zone_id]);
                }
            }
        }
        return $next($request);
    }
}
