<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\File;

class PhpVersionCompatibility
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
        $version = phpversion();
        if (File::exists(storage_path('ignorePhpVersion'))) {
            return $next($request);
        }
        if (!(version_compare($version, '7.2', '>=') && version_compare($version, '7.4', '<'))) {
            print_r("<p>Your PHP version is: <b>" . $version . "</b></p>");
            print_r("<p>frutri only supports <b>PHP version 7.3 or 7.3.x</b></p>");
            print_r("<p>Kindly set your PHP version to 7.3 from your cPanel or contact your Hosting Provider/Server Admin for the same.</p>");
            print_r("<p><a href='https://docs.frutri.com/installation/installation-on-server#requirements' target='_blank'>Click here</a> to know more about frutri requirements.</p>");
            die();
        } else {
            return $next($request);
        }
    }
}
