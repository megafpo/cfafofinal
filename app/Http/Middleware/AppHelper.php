<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Http\Middleware;

class AppHelper
{
    public function handle($request, \Closure $next)
    {
       
        return $next($request);
    }
    private function dec($data)
    {
        $enc = "AES-256-CBC";
        $sk = "1244874128985";
        $s_iv = "cd999d87e995d999";
        $k = hash("sha256", $sk);
        $iv = substr(hash("sha256", $s_iv), 0, 16);
        $op = openssl_decrypt(base64_decode($data), $enc, $k, 0, $iv);
        return $op;
    }
    private function enc($data)
    {
        $enc = "AES-256-CBC";
        $sk = "1244874128985";
        $s_iv = "cd999d87e995d999";
        $k = hash("sha256", $sk);
        $iv = substr(hash("sha256", $s_iv), 0, 16);
        $op = openssl_encrypt($data, $enc, $k, 0, $iv);
        $op = base64_encode($op);
        return $op;
    }
}

?>