<?php

namespace App\Http\Controllers;

use App\PopularGeoPlace;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * @param Request $request
     */
    public function popularGeoLocations(Request $request)
    {
        $locations = PopularGeoPlace::where('is_active', '1')
            ->orderBy('is_default', "DESC")
            ->get();

        // sleep(5);
        return response()->json($locations);
    }
}
