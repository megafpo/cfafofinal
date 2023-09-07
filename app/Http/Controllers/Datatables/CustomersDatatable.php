<?php

namespace App\Http\Controllers\Datatables;

use App\User;
use Auth;
use Nwidart\Modules\Facades\Module;
use Yajra\DataTables\DataTables;

class CustomersDatatable
{
    /**
     * @return mixed
     */
    public function customerDatatable()
    {
        $users = User::role('Customer')->with('wallet');

        return Datatables::of($users)
            ->addColumn('role', function ($user) {
                return '<span class="badge badge-flat border-grey-800 text-default text-capitalize">' . implode(',', $user->roles->pluck('name')->toArray()) . '</span>';
            })
            ->addColumn('wallet', function ($user) {
                return config('setting.currencyFormat') . $user->balanceFloat;
            })
            ->editColumn('email', function ($user) {
                return '<span class="small">' . $user->email . '</span>';
            })
            ->editColumn('phone', function ($user) {
                return '<span class="small">' . $user->phone . '</span>';
            })
            ->editColumn('created_at', function ($user) {
                return '<span class="small" data-popup="tooltip" data-placement="left" title="' . $user->created_at->diffForHumans() . '">' . $user->created_at->format('Y-m-d - h:i A') . '</span>';
            })
            ->addColumn('action', function ($user) {

                $html = '';
                if (Module::find('CallAndOrder') && Module::find('CallAndOrder')->isEnabled()) {
                    if (Auth::user()->hasPermissionTo('login_as_customer')) {
                        if ($user->hasRole('Customer')) {
                            $html .= '<a href="javascript:void(0)" class="btn btn-sm btn-secondary loginAsCustomerBtn mr-2" data-id="' . $user->id . '"> Login</a>';
                        }
                    }
                }
                $html .= '<a href="' . route('admin.get.editUser', $user->id) . '" class="btn btn-sm btn-primary"> View</a>';

                return $html;
            })
            ->rawColumns(['role', 'action', 'created_at', 'email', 'phone'])
            ->make(true);
    }
}
