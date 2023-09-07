<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use Illuminate\Support\Facades\Route;
use App\PaymentGateway;

class RpMiddleware
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
        if (Auth::user() && Auth::user()->hasRole('Admin')) {

            //else redirect to page to create new location as primary
            $allowed = [
                'admin.dashboard',
            ];

            $route = Route::getRoutes()->match($request);
            // dd($route->getName());
            if (!in_array($route->getName(), $allowed)) {
                session(['razorpay_enter_mid' => "false"]);
                return $next($request);
            } else {
                //not in allowed routes, so set session to show popup
                $razorpay = PaymentGateway::where('name', 'Razorpay')->first();
                if (!$razorpay->is_active) {
                    return $next($request);
                }
                if (config('setting.razorpayMerchantId') == null) {
                    session(['razorpay_enter_mid' => "true"]);
                    return $next($request);
                }
            }
            return $next($request);
        }
        return $next($request);
    }
}
