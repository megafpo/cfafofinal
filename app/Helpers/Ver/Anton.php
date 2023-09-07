<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

function iio()
{
    $val = q_e_c_f_y_p() . config("permission.table_names.role_has_permissions");
    return hash("sha256", $val);
}
function biHshvaablenwsh()
{
    $val = lkajsdlk();
    return hash("sha256", $val);
}
function woNnoroMsIohWaamodooFyaH()
{
    $msg = "Read this function name in reverse :p LOL";
    return $msg;
}
function enSovCheck($request)
{
    if (config("appSettings.enSOV") == "true") {
        if (!isset($request->otp) || $request->otp == NULL) {
            abort(500, "SPAM Request or Something Went Wrong");
        }
        if (isset($request->otp) && $request->otp != NULL) {
            $otpTable = App\SmsOtp::where("phone", $request->phone)->first();
            if (!$otpTable) {
                abort(500, "SPAM Request or Something Went Wrong");
            } else {
                if ($otpTable->otp != $request->otp) {
                    abort(500, "SPAM Request or Something Went Wrong");
                }
            }
        }
    }
}

?>