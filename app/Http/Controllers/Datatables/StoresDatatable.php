<?php

namespace App\Http\Controllers\Datatables;

use App\Zone;
use App\Restaurant;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use Nwidart\Modules\Facades\Module;

class StoresDatatable
{
    /**
     * @return mixed
     */
    public function storesDatatable(Request $request)
    {
        if ($request->pending == 'true') {
            $restaurants = Restaurant::where('is_accepted', '0')->with('users', 'users.roles', 'delivery_areas');
        } else {
            $restaurants = Restaurant::where('is_accepted', '1')->with('users', 'users.roles', 'delivery_areas')->get();
        }

        return Datatables::of($restaurants)

            ->editColumn('image', function ($restaurant) {
                return '<img src="' . $restaurant->image . '" alt="' . $restaurant->name . '" height="65" width="65" style="border-radius: 0.275rem;">';
            })

            ->addColumn('areas', function ($restaurant) {
                $restaurantDeliveryAreas = '';

                if (Module::find('DeliveryAreaPro') && Module::find('DeliveryAreaPro')->isEnabled()) {
                    $areaCount = count($restaurant->delivery_areas);
                    if ($areaCount > 0) {
                        $restaurantDeliveryAreas .= '<p class="text-truncate badge badge-flat text-default mb-0 text-left" style="width: 180px;"><strong>Areas: </strong>';
                        $i = 1;
                        foreach ($restaurant->delivery_areas as $deliveryArea) {
                            if ($i != $areaCount) {
                                $restaurantDeliveryAreas .= $deliveryArea->name . ', ';
                            } else {
                                $restaurantDeliveryAreas .= $deliveryArea->name;
                            }
                            $i++;
                        }
                        $restaurantDeliveryAreas .= '</p>';
                    } else {
                        $restaurantDeliveryAreas = '<p class="badge badge-flat text-default mb-0 text-left"><strong>Areas: </strong> None </p>';
                    }
                }

                $restaurantZone = '';
                $zones = Zone::exists();
                if ($zones) {
                    if ($restaurant->zone_id != null) {
                        $restaurantZone = '<p class="badge badge-flat text-default mb-0 text-left"><strong>Zone: </strong>' . $restaurant->zone->name . '</p>';
                    }
                }
                $text = '<div class="d-flex flex-column align-items-baseline">' . $restaurantDeliveryAreas . $restaurantZone . '</div>';
                return $text;
            })

            ->addColumn('owner', function ($restaurant) {
                $html = '';
                if (count($restaurant->users) > 0) {
                    $resUsercount = 0;
                    foreach ($restaurant->users as $restaurantUser) {
                        if ($restaurantUser->hasRole('Store Owner')) {
                            $resUsercount++;
                            $html .= '<p class="w-100 text-left mb-0"><a href="' . route('admin.get.editUser', $restaurantUser->id) . '">' . $restaurantUser->name . '</a><a href="' . route('admin.impersonate', $restaurantUser->id) . '" class="btn btn-sm btn-default" data-popup="tooltip" data-placement="left" title="Login as ' . $restaurantUser->name . ' "> <i class="icon-circle-right2 text-warning"></i></a></p>';
                        }
                    }
                    if ($resUsercount == 0) {
                        $html = '<p class="w-100 badge badge-flat text-default text-left mb-0">Unassigned</p>';
                    }
                } else {
                    $html = '<p class="w-100 badge badge-flat text-default text-left mb-0">Unassigned</p>';
                }

                return $html;
            })

            ->editColumn('created_at', function ($restaurant) {
                $html = '<span class="small" data-popup="tooltip" data-placement="left" title="' . $restaurant->created_at->diffForHumans() . '">' . $restaurant->created_at->format('Y-m-d - h:i A') . '</span>';
                return $html;
            })

            ->addColumn('action', function ($restaurant) use ($request) {
                $html = '<div class="d-flex align-items-center justify-content-center">';

                $checked = '';
                if ($restaurant->is_active) {
                    $checked = 'checked="checked"';
                }
                $html .= '<div class="checkbox checkbox-switchery mr-2" style="padding-top: 0.8rem;"><label><input value="true" type="checkbox" class="action-switch"' . $checked . 'data-id="' . $restaurant->id . '"> </label> </div>';

                $html .= '<a href="' . route('admin.get.editRestaurant', $restaurant->id) . '" class="btn btn-sm btn-primary"> Edit</a>';

                $html .= '<a href="' . route('admin.items') . '?store_id=' . $restaurant->id . '" class="btn btn-sm btn-action ml-1" data-popup="tooltip" title="Manage ' . $restaurant->name . '\'s Items" data-placement="left"> <i class="icon-arrow-right5"></i> </a>';

                if ($request->pending == 'true') {
                    $html .= '<a href="' . route('admin.acceptRestaurant', $restaurant->id) . '" class="btn btn-success btn-md ml-1"> <i class="icon-check"></i> Accept </a>';
                }

                $html .= '</div>';

                return $html;
            })

            ->editColumn('name', function ($restaurant) {
                return '<p class="text-left">' . $restaurant->name . '</p>';
            })

            ->rawColumns(['image', 'areas', 'owner', 'created_at', 'action', 'name'])
            ->make(true);
    }
}
