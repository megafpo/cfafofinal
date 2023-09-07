<?php

namespace App\Http\Controllers\Datatables;

use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\DeliveryCollection;

class DeliveryCollectionDatatable
{
    /**
     * @return mixed
     */
    public function deliveryCollectionDatatable(Request $request)
    {
        $deliveryCollections = DeliveryCollection::with('user');

        return Datatables::of($deliveryCollections)

            ->addColumn('name', function ($deliveryCollection) {
                return '<a href="' . route('admin.get.editUser', $deliveryCollection->user->id) . '" target="_blank"><p class="text-left">' . $deliveryCollection->user->name . '</p></a>';
            })

            ->addColumn('phone', function ($deliveryCollection) {
                return '<span>' . $deliveryCollection->user->phone . '</span>';
            })

            ->editColumn('amount', function ($deliveryCollection) {
                return config('setting.currencyFormat') . $deliveryCollection->amount;
            })

            ->addColumn('action', function ($deliveryCollection) {
                $html = '';

                $html .= '<button class="btn btn-sm btn-primary collectCashBtn mr-2" data-delivery-collection-id="' . $deliveryCollection->id . '" data-delivery-id="' . $deliveryCollection->user->id . '" data-delivery-name="' . $deliveryCollection->user->name . '" data-amount="' . $deliveryCollection->amount . '" > Process </button>';

                $html .= '<a href="' . route('admin.deliveryCollectionLogs') . '?user_id=' . $deliveryCollection->user_id . '" class="btn btn-sm btn-secondary" data-popup="tooltip"
                data-placement="left" title="View past collection logs of' . $deliveryCollection->user->name  . '">View Logs </a>';

                return $html;
            })

            ->rawColumns(['name', 'phone', 'amount', 'action',])
            ->make(true);
    }
}
