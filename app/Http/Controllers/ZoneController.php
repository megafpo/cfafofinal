<?php

namespace App\Http\Controllers;

use App\Restaurant;
use App\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Cache;

class ZoneController extends Controller
{
    public function changeZoneScope($zone_id)
    {
        $zone = Zone::where('id', $zone_id)->first();
        if ($zone) {
            session(['selectedZone' => $zone_id]);
        } else {
            session()->forget('selectedZone');
        }
        return redirect()->back();
    }

    public function zones()
    {
        $zones = Zone::all();
        $zones->loadCount('restaurants');

        $stores = Restaurant::get(['id', 'name']);
        return view('admin.zones.zones', array(
            'zones' => $zones,
            'stores' => $stores,
        ));
    }

    public function saveNewZone(Request $request)
    {
        $zone = new Zone();
        $zone->name = $request->name;
        $zone->description = $request->description;
        $zone->save();

        Cache::forget('zonesCache');

        //if first zone, then update all the restaurants, items and orders.
        if ($zone->id == 1) {
            $zoneId = $zone->id;
            DB::statement('UPDATE `restaurants` SET `zone_id`=:zone_id', array('zone_id' => $zoneId));
            DB::statement('UPDATE `items` SET `zone_id`=:zone_id', array('zone_id' => $zoneId));
            DB::statement('UPDATE `orders` SET `zone_id`=:zone_id', array('zone_id' => $zoneId));
            DB::statement('UPDATE `coupons` SET `zone_id`=:zone_id', array('zone_id' => $zoneId));
            DB::statement('UPDATE `delivery_collections` SET `zone_id`=:zone_id', array('zone_id' => $zoneId));
            DB::statement('UPDATE `delivery_collection_logs` SET `zone_id`=:zone_id', array('zone_id' => $zoneId));
            DB::statement('UPDATE `restaurant_earnings` SET `zone_id`=:zone_id', array('zone_id' => $zoneId));
            DB::statement('UPDATE `restaurant_payouts` SET `zone_id`=:zone_id', array('zone_id' => $zoneId));

            return redirect()->back()->with(['success' => 'Zone created and all data are now linked to this zone.']);
        }

        return redirect()->back()->with(['success' => 'Zone created.']);
    }

    public function editZone($id)
    {
        $zone = Zone::where('id', $id)->firstOrFail();
        // dd($zone);

        return view('admin.zones.editZone', array(
            'zone' => $zone,
        ));
    }

    public function updateZone(Request $request)
    {
        $zone = Zone::where('id', $request->id)->firstOrFail();
        $zone->name = $request->name;
        $zone->description = $request->description;
        $zone->save();

        Cache::forget('zonesCache');

        return redirect()->back()->with(['success' => 'Zone updated.']);
    }
}
