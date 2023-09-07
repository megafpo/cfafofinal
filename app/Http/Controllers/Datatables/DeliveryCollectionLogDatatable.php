<?php

namespace App\Http\Controllers\Datatables;

use App\DeliveryCollection;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\DeliveryCollectionLog;
use Yajra\DataTables\DataTables;


class DeliveryCollectionLogDatatable
{
    /**
     * @return mixed
     */
    public function deliveryCollectionLogDatatable(Request $request)
    {
        //if request has ID that means viewing for certain user
        if ($request->has('user_id')) {
            $collection = DeliveryCollection::where('user_id', $request->user_id)->first();
            if ($collection) {
                $deliveryCollectionLogs = DeliveryCollectionLog::where('delivery_collection_id', $collection->id)->with('delivery_collection', 'delivery_collection.user', 'user');
            } else {
                $deliveryCollectionLogs = DeliveryCollectionLog::where('delivery_collection_id', 0); //to show empty result as collection not present
            }
        } else {
            $deliveryCollectionLogs = DeliveryCollectionLog::with('delivery_collection', 'delivery_collection.user', 'user');
        }

        // dd($deliveryCollectionLogs);

        return Datatables::of($deliveryCollectionLogs)

            ->addColumn('name', function ($deliveryCollectionLog) {
                return '<a href="' . route('admin.get.editUser', $deliveryCollectionLog->delivery_collection->user->id) . '" target="_blank"><p class="text-left">' . $deliveryCollectionLog->delivery_collection->user->name . '</p></a>';
            })

            ->addColumn('phone', function ($deliveryCollectionLog) {
                return '<span>' . $deliveryCollectionLog->delivery_collection->user->phone . '</span>';
            })

            ->editColumn('amount', function ($deliveryCollectionLog) {
                return $deliveryCollectionLog->amount;
            })

            ->editColumn('created_at', function ($deliveryCollectionLog) {
                return $deliveryCollectionLog->created_at->format('Y-m-d  - h:i A');
            })

            ->editColumn('message', function ($deliveryCollectionLog) {
                return '<p class="text-left">' . Str::limit($deliveryCollectionLog->message, 20, '...') . '</p>';
            })

            ->editColumn('collected_by', function ($deliveryCollectionLog) {
                if ($deliveryCollectionLog->user) {
                    return '<p class="text-left">' . $deliveryCollectionLog->user->name . '</p>';
                } else {
                    return '<p class="text-left"> -- </p>';
                }
            })

            ->addColumn('action', function ($deliveryCollectionLog) {
                if ($deliveryCollectionLog->user) {
                    $collectedBy = $deliveryCollectionLog->user->name;
                } else {
                    $collectedBy = "--";
                }

                $html = '<button class="btn btn-sm btn-primary viewDetails"
                data-name="' . $deliveryCollectionLog->delivery_collection->user->name . '"
                data-email="' . $deliveryCollectionLog->delivery_collection->user->email . '"
                data-phone="' . $deliveryCollectionLog->delivery_collection->user->phone . '"
                data-message="' . $deliveryCollectionLog->message . '"
                data-date="' . $deliveryCollectionLog->created_at . '"
                data-amount="' . $deliveryCollectionLog->amount . '"
                data-collected-by="' . $collectedBy . '"> View Details </button>';
                return $html;
            })

            ->rawColumns(['name', 'phone', 'amount', 'message', 'created_at', 'action', 'collected_by'])
            ->make(true);
    }
}
