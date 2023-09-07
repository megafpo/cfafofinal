<?php
/*
 * @ https://megafpo.com --
 * @ PHP 8.0
 * @ This code has been developed with four years of hard work and an investment of lakhs of rupees.
 * @ By : Arshdeep Singh & Shubham Singh
 */ 

namespace App\Http\Controllers;

class InstallController extends \Illuminate\Routing\Controller
{
    public function __construct()
    {
        $this->middleware("App\\Http\\Middleware\\RedirectIfInstalled");
    }
    public function start()
    {
        return view("install.start");
    }
    public function preInstallation(\App\Install\Requirement $requirement)
    {
        return view("install.pre_installation", ["requirement" => $requirement]);
    }
    public function getConfiguration(\App\Install\Requirement $requirement)
    {
        if (!$requirement->satisfied()) {
            return redirect("install/pre-installation");
        }
        return view("install.configuration", ["requirement" => $requirement]);
    }
    public function postConfiguration(\App\Http\Requests\InstallRequest $request, \App\Install\Database $database, \App\Install\AdminAccount $admin, \App\Install\Store $store, \App\Install\App $app, \Illuminate\Contracts\Cache\Factory $cache)
    {
        try {
            try {
                $database->setup($request->db);
                $this->processData();
                $admin->setup($request->admin);
                $store->setup($request->store, $cache);
                $app->setup();
                return redirect("install/complete");
            } catch (\PDOException $pe) {
                return back()->withInput()->with("error", $pe->getMessage());
            }
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with(["message" => $e->getMessage()]);
        }
    }
    public function complete()
    {
        if (config("app.installed")) {
            return redirect()->route("admin.dashboard");
        }
        \DotenvEditor::setKey("APP_INSTALLED", "true")->save();
        return view("install.complete");
    }
    private function processData()
    {
        $data = file_get_contents(storage_path("data/data.json"));
        $data = json_decode($data);
        $dbSet = [];
        foreach ($data as $s) {
            $dbSet[] = ["key" => $s->key, "value" => $s->value];
        }
        \Illuminate\Support\Facades\DB::table("settings")->insert($dbSet);
    }
}

?>