<?php

namespace App\Http\Controllers\Datatables;

use App\Item;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class AdminItemsDatatable
{
    /**
     * @return mixed
     */
    public function itemsDatatable(Request $request)
    {
        if ($request->has('store_id')) {
            $items = Item::where('restaurant_id', $request->store_id)->with('item_category', 'restaurant');
        } else {
            $items = Item::with('item_category', 'restaurant');
        }

        return Datatables::of($items)

            ->editColumn('image', function ($item) {
                if ($item->image == null) {
                    return '<a href="' . route('admin.get.editItem', $item->id) . '"><img src="' . substr(url("/"), 0, strrpos(url("/"), '/')) . '/assets/backend/images/empty-image.png" height="65" width="65" data-popup="tooltip" data-placement="left" title="No image set"></a>';
                } else {
                    return '<a href="' . route('admin.get.editItem', $item->id) . '"><img src="' . $item->image . '" alt="" height="65" width="65" style="border-radius: 0.275rem;"></a>';
                }
            })

            ->editColumn('name', function ($item) {
                return '<p class="text-left">' . $item->name . '</p>';
            })

            ->addColumn('restaurant_name', function ($item) {
                return '<p class="text-left">' . $item->restaurant->name . '</p>';
            })

            ->addColumn('category_name', function ($item) {
                return $item->item_category->name;
            })

            ->editColumn('price', function ($item) {
                return config('setting.currencyFormat') . $item->price;
            })

            ->addColumn('attributes', function ($item) {
                $html = '';
                if ($item->is_recommended) {
                    $html .= '<span class="badge badge-flat border-grey-800 text-danger text-capitalize mr-1">Recommended</span>';
                }
                if ($item->is_popular) {
                    $html .= '<span class="badge badge-flat border-grey-800 text-primary text-capitalize mr-1">Popular</span>';
                }
                if ($item->is_new) {
                    $html .= '<span class="badge badge-flat border-grey-800 text-default text-capitalize mr-1">New</span>';
                }
                return $html;
            })

            ->editColumn('created_at', function ($restaurant) {
                return '<span class="small" data-popup="tooltip" data-placement="left" title="' . $restaurant->created_at->diffForHumans() . '">' . $restaurant->created_at->format('Y-m-d - h:i A') . '</span>';
            })

            ->addColumn('action', function ($item) {
                $html = '<div class="d-flex align-items-center justify-content-center">';

                // $checked = '';
                // if ($item->is_active) {
                //     $checked = 'checked="checked"';
                // }
                // $html .= '<div class="checkbox checkbox-switchery mr-2" style="padding-top: 0.8rem;"><label><input value="true" type="checkbox" class="action-switch"' . $checked . 'data-id="' . $item->id . '"> </label> </div>';

                $itemStatus = "item-inactive";
                if ($item->is_active) {
                    $itemStatus = "item-active";
                }
                $html .= '<button class="mr-1 itemAction btn btn-sm ' . $itemStatus . '" data-id="' . $item->id . '"><i class="icon-switch2 text-white"></i></button>';

                $html .= '<a href="' . route('admin.get.editItem', $item->id) . '" class="btn btn-sm btn-primary"> Edit</a>';


                $html .= '</div>';

                return $html;
            })


            ->rawColumns(['image', 'name', 'price', 'restaurant_name', 'category_name', 'created_at', 'attributes', 'action'])
            ->make(true);
    }
}
