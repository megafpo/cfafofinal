@extends('admin.layouts.master')
@section("title") Edit User - Dashboard
@endsection
@section('content')
<style>
    #showPassword {
        cursor: pointer;
        padding: 5px;
        border: 1px solid #E0E0E0;
        border-radius: 0.275rem;
        color: #9E9E9E;
    }

    #showPassword:hover {
        color: #616161;
    }
</style>
<div class="page-header">
    <div class="page-header-content header-elements-md-inline">
        <div class="page-title d-flex">
            <h4>
                <span class="font-weight-bold mr-2">Editing</span>
                <i class="icon-circle-right2 mr-2"></i>
                <span class="font-weight-bold mr-2">{{ $user->name }}</span>
            </h4>
            <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
        </div>
    </div>
</div>


<div class="content">
    <div class="col-md-12">
        <div class="card">
            <div class="card-body" style="min-height: 60vh;">
                <form action="{{ route('admin.updateUser') }}" method="POST" enctype="multipart/form-data"
                    id="storeMainForm" style="min-height: 60vh;">
                    @csrf
                    <input type="hidden" name="window_redirect_hash" value="">
                    <input type="hidden" name="id" value="{{ $user->id }}">

                    <div class="d-lg-flex justify-content-lg-left">
                        <ul class="nav nav-pills nav-pills-main flex-column mr-lg-3 wmin-lg-250 mb-lg-0">
                            <li class="nav-item">
                                <a href="#userDetails" class="nav-link active" data-toggle="tab">
                                    <i class="icon-store2 mr-2"></i>
                                    User Details
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#userRole" class="nav-link" data-toggle="tab">
                                    <i class="icon-tree7 mr-2"></i>
                                    User Role @if(isset($navZones) && count($navZones) > 0) & Zone @endif
                                </a>
                            </li>
                            @if($user->hasRole("Delivery Guy"))
                            <li class="nav-item">
                                <a href="#deliveryGuyDetails" class="nav-link" data-toggle="tab">
                                    <i class="icon-truck mr-2"></i>
                                    Delivery Guy Details
                                </a>
                            </li>
                            @endif
                            <li class="nav-item">
                                <a href="javascript:void(0)" class="nav-link" data-toggle="tab" id="walletBalance">
                                    <i class="icon-piggy-bank mr-2"></i>
                                    Wallet Balance
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#walletTransactions" class="nav-link" data-toggle="tab">
                                    <i class="icon-transmission mr-2"></i>
                                    Wallet Transactions
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#userOrders" class="nav-link" data-toggle="tab">
                                    <i class="icon-basket mr-2"></i>
                                    Orders
                                </a>
                            </li>
                            @if($user->hasRole("Delivery Guy"))
                            <li class="nav-item">
                                <a href="{{ route('admin.viewDeliveryReviews', $user->id) }}" class="nav-link">
                                    <i class="icon-stars mr-2"></i>
                                    Rating & Reviews <span
                                        class="ml-1 badge badge-flat text-white {{ ratingColorClass($rating) }}">{{ $rating }}
                                        <i class="icon-star-full2 text-white" style="font-size: 0.6rem;"></i></span>
                                </a>
                            </li>
                            @endif
                            <li class="nav-item">
                                <a href="#userAddresses" class="nav-link" data-toggle="tab">
                                    <i class="icon-home7 mr-2"></i>
                                    User Addresses
                                </a>
                            </li>
                        </ul>
                        <div class="tab-content" style="width: 100%; padding: 0 25px;">

                            <div class="tab-pane fade show active" id="userDetails">
                                <legend class="font-weight-semibold text-uppercase font-size-sm">
                                    User Details
                                </legend>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Name:</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg" name="name"
                                            value="{{ $user->name }}" placeholder="Enter Full Name" required
                                            autocomplete="new-name">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Email:</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg" name="email"
                                            value="{{ $user->email }}" placeholder="Emter Email Address" required
                                            autocomplete="new-email">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Phone:</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg" name="phone"
                                            value="{{ $user->phone }}" placeholder="Enter Phone Number" required
                                            autocomplete="new-phone">
                                    </div>
                                </div>
                                <div class="form-group row form-group-feedback form-group-feedback-right">
                                    <label class="col-lg-3 col-form-label">Password:</label>
                                    <div class="col-lg-9">
                                        <input id="passwordInput" type="password" class="form-control form-control-lg"
                                            name="password" placeholder="Enter Password (min 6 characters)"
                                            autocomplete="new-password">
                                    </div>
                                    <div class="form-control-feedback form-control-feedback-lg">
                                        <span id="showPassword"><i class="icon-unlocked2"></i> Show</span>
                                    </div>
                                </div>

                                <div class="text-left">
                                    <div class="btn-group btn-group-justified" style="width: 150px">
                                        @if($user->is_active)
                                        <a class="btn btn-danger" href="{{ route('admin.banUser', $user->id) }}"
                                            data-popup="tooltip"
                                            title="User will not be able to place orders if banned">
                                            Ban User
                                        </a>
                                        @else
                                        <a class="btn btn-success" href="{{ route('admin.banUser', $user->id) }}"
                                            data-popup="tooltip"
                                            title="Currently, {{ $user->name }} is banned from placing any orders">
                                            Reactivate User
                                        </a>
                                        @endif
                                    </div>
                                </div>

                                <p class="mt-2">User IP used during regisration: @if($user->user_ip != null)
                                    <b>{{ $user->user_ip }}</b> @else IP Not found @endif </p>

                            </div>

                            <div class="tab-pane fade" id="userRole">
                                <legend class="font-weight-semibold text-uppercase font-size-sm">
                                    Role Management
                                </legend>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Current Role:</label>
                                    <div class="col-lg-9 d-flex align-items-center">
                                        @foreach ($user->roles as $role)
                                        <span class="badge badge-success font-size-lg">
                                            {{ $role->name }}
                                        </span> @endforeach
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Assign Role:</label>
                                    <div class="col-lg-9">
                                        @if($user->id == "1")
                                        <span>Super Admin Role cannot be changed</span>
                                        @else
                                        <select class="form-control select" data-fouc name="roles">
                                            <option></option>
                                            @foreach ($roles as $key => $role)
                                            @if($key != 1)
                                            <option value="{{ $role->name }}" class="text-capitalize">{{ $role->name }}
                                            </option>
                                            @endif
                                            @endforeach
                                        </select>
                                        @endif
                                    </div>
                                </div>

                                @if(count($zones) > 0)
                                @php
                                $protectedRoles = ['Admin', 'Store Owner', 'Customer'];
                                $hidden = false;
                                if (in_array($user->roles()->pluck('name')[0], $protectedRoles)) {
                                $hidden = true;
                                }
                                @endphp
                                <div id="userAreaSelection" class="@if($hidden) hidden @endif">
                                    <hr>
                                    @if($user->zone_id != null)
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label">Current Zone:</label>
                                        <div class="col-lg-9 d-flex align-items-center">
                                            <span class="badge badge-success font-size-lg">
                                                {{ $user->zone->name }}
                                            </span>
                                        </div>
                                    </div>
                                    @else
                                    <p class="text-danger"><strong>{{ $user->name }}</strong> is not assigned to any
                                        zone.</p>
                                    @endif
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label">Assign Zone:</label>
                                        <div class="col-lg-9">
                                            <select class="form-control select-zone" name="zone_id">
                                                <option></option>
                                                @foreach($zones as $zone)
                                                <option value="{{ $zone->id }}" @if($user->zone_id == $zone->id)
                                                    selected @endif>{{ $zone->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                @endif

                            </div>
                            <script>
                                $(".select-zone").select2({
                                    placeholder: "Select a zone",
                                    allowClear: true
                                });
                                $('select[name="roles"]').on('change',(event) => {
                                    var protectedRoles = ['Admin', 'Delivery Guy', 'Store Owner', 'Customer'] 
                                    if ($.inArray(event.target.value, protectedRoles) !== -1){
                                        $('#userAreaSelection').addClass('hidden');
                                    } else {
                                        $('#userAreaSelection').removeClass('hidden');
                                    }
                                });
                            </script>

                            @if($user->hasRole("Delivery Guy"))
                            <div class="tab-pane fade" id="deliveryGuyDetails">
                                <legend class="font-weight-semibold text-uppercase font-size-sm">
                                    Delivery Guy Details
                                </legend>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Name or Nick Name:</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg" name="delivery_name"
                                            value="{{ !empty($user->delivery_guy_detail->name) ? $user->delivery_guy_detail->name : "" }}"
                                            placeholder="Enter Name or Nickname of Delivery Guy" required
                                            autocomplete="new-name">
                                        <span class="help-text text-muted">This name will be displayed to the
                                            user/customers</span>
                                    </div>

                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Age</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg" name="delivery_age"
                                            value="{{ !empty($user->delivery_guy_detail->age) ? $user->delivery_guy_detail->age : "" }}"
                                            placeholder="Enter Delivery Guy's Age">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    @if(!empty($user->delivery_guy_detail->photo))
                                    <div class="col-lg-9 offset-lg-3">
                                        <img src="{{ substr(url('/'), 0, strrpos(url('/'), '/')) }}/assets/img/delivery/{{ $user->delivery_guy_detail->photo }}"
                                            alt="delivery-photo" class="img-fluid mb-2"
                                            style="width: 90px; border-radius: 50%">
                                    </div>
                                    @endif
                                    <label class="col-lg-3 col-form-label">Delivery Guy's Photo:</label>
                                    <div class="col-lg-9">
                                        <input type="file" class="form-control-uniform" name="delivery_photo" data-fouc>
                                        <span class="help-text text-muted">Image size 250x250</span>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Description</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg"
                                            name="delivery_description"
                                            value="{{ !empty($user->delivery_guy_detail->description) ? $user->delivery_guy_detail->description : "" }}"
                                            placeholder="Enter Short Description about this Delivery Guy">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Vehicle Number</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg"
                                            name="delivery_vehicle_number"
                                            value="{{ !empty($user->delivery_guy_detail->vehicle_number) ? $user->delivery_guy_detail->vehicle_number : "" }}"
                                            placeholder="Enter Delivery Guy's Vehicle Number">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">SMS Notification for New Orders?</label>
                                    <div class="col-lg-9">
                                        <div class="checkbox checkbox-switchery mt-2">
                                            <label>
                                                <input value="true" type="checkbox" class="switchery-primary"
                                                    @if(!empty($user->delivery_guy_detail->is_notifiable) &&
                                                $user->delivery_guy_detail->is_notifiable) checked="checked" @endif
                                                name="is_notifiable">
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Commission Rate %</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg commission_rate"
                                            name="delivery_commission_rate" placeholder="Commission Rate %"
                                            value="{{  !empty($user->delivery_guy_detail->commission_rate) ? $user->delivery_guy_detail->commission_rate : "0" }}"
                                            required="required">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Cash Limit
                                        ({{ config('setting.currencyFormat') }})</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg cash_limit"
                                            name="cash_limit"
                                            value="{{  !empty($user->delivery_guy_detail->cash_limit) ? $user->delivery_guy_detail->cash_limit : "0" }}" />
                                        <p>Enter an amount after which you don't want delivery guy to receive any
                                            orders. <strong><mark>Zero(0) means no limit.</mark></strong></p>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Max Orders in Queue</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg max_orders"
                                            name="max_accept_delivery_limit" placeholder="Max Orders in Queue"
                                            value="{{  !empty($user->delivery_guy_detail->max_accept_delivery_limit) ? $user->delivery_guy_detail->max_accept_delivery_limit : "100" }}"
                                            required="required">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Tip Commission Rate %</label>
                                    <div class="col-lg-9">
                                        <input type="text" class="form-control form-control-lg commission_rate"
                                            name="tip_commission_rate" placeholder="Commission Rate %"
                                            value="{{  !empty($user->delivery_guy_detail->tip_commission_rate) ? $user->delivery_guy_detail->tip_commission_rate : "100" }}"
                                            required="required">
                                    </div>
                                </div>
                            </div>
                            @endif

                            <div class="tab-pane fade" id="walletTransactions">
                                <legend class="font-weight-semibold text-uppercase font-size-sm">
                                    Wallet Transactions
                                </legend>
                                @if(count($user->transactions) > 0)
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Type
                                                </th>
                                                <th width="20%">
                                                    Amount
                                                </th>
                                                <th>
                                                    Description
                                                </th>
                                                <th>
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach($user->transactions->reverse() as $transaction)
                                            <tr>
                                                <td>
                                                    @if($transaction->type === "deposit")
                                                    <span
                                                        class="badge badge-flat border-grey-800 text-success text-capitalize">{{$transaction->type}}</span>
                                                    @else
                                                    <span
                                                        class="badge badge-flat border-grey-800 text-danger text-capitalize">{{$transaction->type}}</span>
                                                    @endif
                                                </td>
                                                <td class="text-right">
                                                    {{ config('setting.currencyFormat') }}
                                                    {{ number_format($transaction->amount / 100, 2,'.', '') }}
                                                </td>
                                                <td>
                                                    {{ $transaction->meta["description"] }}
                                                </td>
                                                <td class="small">
                                                    {{ $transaction->created_at->format('Y-m-d  - h:i A')}}
                                                    ({{ $transaction->created_at->diffForHumans() }})
                                                </td>
                                            </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                                @else
                                <p class="text-muted text-center mb-0">No transactions has been made from
                                    {{ config('setting.walletName') }}</p>
                                @endif
                            </div>

                            <div class="tab-pane fade" id="userOrders">
                                <legend class="font-weight-semibold text-uppercase font-size-sm">
                                    Orders
                                </legend>
                                @if(count($orders) > 0)
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Order ID
                                                </th>
                                                <th width="20%">
                                                    Order Status
                                                </th>
                                                <th>
                                                    Order Date
                                                </th>
                                                <th>
                                                    Order Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach($orders->reverse() as $order)
                                            <tr>
                                                <td>
                                                    <a
                                                        href="{{ route('admin.viewOrder', $order->unique_order_id ) }}">{{$order->unique_order_id}}</a>
                                                </td>
                                                <td>
                                                    <span
                                                        class="badge badge-flat border-grey-800 text-primary @if ($order->orderstatus_id == 6) text-danger @endif text-capitalize">
                                                        {{ getOrderStatusName($order->orderstatus_id) }}
                                                    </span>
                                                </td>

                                                <td class="small">
                                                    {{ $order->created_at->format('Y-m-d  - h:i A')}}
                                                    ({{ $order->created_at->diffForHumans() }})
                                                </td>

                                                <td class="text-right">
                                                    {{ config('setting.currencyFormat') }}{{ $order->total }}
                                                </td>
                                            </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                                @else
                                <p class="text-muted text-center mb-0">No Orders Placed From This User</p>
                                @endif
                            </div>

                            <div class="tab-pane fade" id="userAddresses">
                                @if(count($user->addresses) > 0)
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Address
                                                </th>
                                                <th width="20%">
                                                    House
                                                </th>
                                                <th>
                                                    Tag
                                                </th>
                                                <th class="text-center"><i class="
                                                    icon-circle-down2"></i></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach($user->addresses as $address)
                                            <tr>
                                                <td>
                                                    @if($user->default_address_id == $address->id)
                                                    <i class="icon-star-full2 text-warning" data-popup="tooltip"
                                                        title="Primary Address" data-placement="left"></i>
                                                    @endif

                                                    @if($address->address != null)
                                                    {{ $address->address }}
                                                    @else
                                                    --
                                                    @endif
                                                </td>
                                                <td>
                                                    @if($address->house != null)
                                                    {{ $address->house }}
                                                    @else
                                                    --
                                                    @endif
                                                </td>
                                                <td>
                                                    @if($address->landmark != null)
                                                    {{ $address->landmark }}
                                                    @else
                                                    --
                                                    @endif
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center justify-content-left">
                                                        @if($user->default_address_id != $address->id)
                                                        <button type="button"
                                                            class="btn btn-sm btn-danger mr-1 deleteAddressBtn"
                                                            data-popup="tooltip" title="Delete Address"
                                                            data-placement="left" data-addressid={{ $address->id }}><i
                                                                class="icon-trash"></i></button>
                                                        @endif
                                                        <a href="https://maps.google.com/?q={{ $address->latitude }},{{ $address->longitude }}"
                                                            target="_blank" class="btn btn-sm btn-secondary w-100"
                                                            data-popup="tooltip" title="Locate on Google Maps"
                                                            data-placement="left">Locate</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                                @else
                                <p class="text-muted text-center mb-0">No Addresses found</p>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="text-right mt-5">
                        <button type="submit" class="btn btn-primary btn-labeled btn-labeled-left btn-lg btnUpdateUser">
                            <b><i class="icon-database-insert ml-1"></i></b>
                            Update User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<form action="{{ route('admin.deleteUserAddress') }}" id="deleteAddressForm" method="POST">
    <input type="hidden" name="user_id" value="{{ $user->id }}">
    <input type="hidden" name="address_id" id="deleteAddressId">
    <input type="hidden" name="window_redirect_hash" value="#userAddresses">
    @csrf
</form>

<div class="content" id="walletBalanceBlock" style="margin-bottom: 10rem;">
    <div class="col-md-9">
        <div class="card">
            <div class="card-body">
                <legend class="font-weight-semibold h6">
                    <mark>{{ config("setting.walletName") }} Balance:
                        {{ config('setting.currencyFormat') }}{{ $user->balanceFloat }}</mark>
                </legend>

                <div class="d-lg-flex justify-content-lg-left">
                    <ul class="nav nav-pills flex-column mr-lg-3 wmin-lg-250 mb-lg-0">
                        <li class="nav-item">
                            <a href="#addWallet" class="nav-link active" data-toggle="tab">
                                Add Money
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#deductWallet" class="nav-link" data-toggle="tab">
                                Deduct Money
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content" style="width: 100%; padding: 0 25px;">
                        <div class="tab-pane fade show active" id="addWallet">
                            <form action="{{ route('admin.addMoneyToWallet') }}" method="POST">
                                <input type="hidden" name="user_id" value="{{ $user->id }}">
                                <div class="form-group row">
                                    <label class="col-lg-4 col-form-label">Add
                                        Money:</label>
                                    <div class="col-lg-8">
                                        <input type="text" class="form-control form-control-lg balance"
                                            name="add_amount"
                                            placeholder="Amount in {{ config('setting.currencyFormat') }}" required>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-4 col-form-label">Message:</label>
                                    <div class="col-lg-8">
                                        <input type="text" class="form-control form-control-lg"
                                            name="add_amount_description" placeholder="Short Description or Message"
                                            required>
                                    </div>
                                </div>
                                @csrf
                                <div class="text-right">
                                    <button type="submit" class="btn btn-secondary">
                                        Update Balance
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="deductWallet">
                            <form action="{{ route('admin.substractMoneyFromWallet') }}" method="POST">
                                <input type="hidden" name="user_id" value="{{ $user->id }}">
                                <div class="form-group row">
                                    <label class="col-lg-4 col-form-label">Deduct
                                        Money:</label>
                                    <div class="col-lg-8">
                                        <input type="text" class="form-control form-control-lg balance"
                                            name="substract_amount"
                                            placeholder="Amount in {{ config('setting.currencyFormat') }}" required>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-lg-4 col-form-label">Message:</label>
                                    <div class="col-lg-8">
                                        <input type="text" class="form-control form-control-lg"
                                            name="substract_amount_description"
                                            placeholder="Short Description or Message" required>
                                    </div>
                                </div>
                                @csrf
                                <div class="text-right">
                                    <button type="submit" class="btn btn-secondary">
                                        Update Balance
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(function () {

        if (Array.prototype.forEach) {
                 var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery-primary'));
                 elems.forEach(function(html) {
                     var switchery = new Switchery(html, { color: '#2196F3' });
                 });
             }
             else {
                 var elems = document.querySelectorAll('.switchery-primary');
                 for (var i = 0; i < elems.length; i++) {
                     var switchery = new Switchery(elems[i], { color: '#2196F3' });
                 }
             }
             
        $('.form-control-uniform').uniform();

        $("#showPassword").click(function (e) { 
            $("#passwordInput").attr("type", "text");
        });
        $('.select').select2({
            minimumResultsForSearch: Infinity,
            placeholder: 'Select Role (Old role will be revoked and the new role will be applied)',
        });
        $('.balance').numeric({allowThouSep:false, maxDecimalPlaces: 2 });

        $("#addAmountButton").click(function(event) {
            $('#addAmountButton').hide();
            $('#substractAmountButton').hide();
            $("#addAmountForm").removeClass('hidden');
            $("#substractAmountForm").addClass('hidden');
        });

        $("#substractAmountButton").click(function(event) {
            $('#addAmountButton').hide();
            $('#substractAmountButton').hide();
            $("#addAmountForm").addClass('hidden');
            $("#substractAmountForm").removeClass('hidden');
        });

        $("#viewTransactions").click(function(event) {
            var targetOffset = $('#tansactionsDiv').offset().top - 70;
            $('html, body').animate({scrollTop: targetOffset}, 500);
        });

        $('.commission_rate').numeric({ allowThouSep:false, maxDecimalPlaces: 2, max: 100, allowMinus: false });
        $('.max_orders').numeric({ allowThouSep:false, maxDecimalPlaces: 0, max: 99999, allowMinus: false });
        $('.cash_limit').numeric({allowThouSep:false, maxDecimalPlaces: 2, allowMinus: false });

        /* Navigate with hash */
        var hash = window.location.hash;
        $("[name='window_redirect_hash']").val(hash);
        hash && $('ul.nav a[href="' + hash + '"]').tab('show');
        $('.nav-pills-main a').click(function (e) {
            $(this).tab('show');
            var scrollmem = $('body').scrollTop();
            window.location.hash = this.hash;
            $("[name='window_redirect_hash']").val(this.hash);
            $('html, body').scrollTop(scrollmem);
        });

        $('#walletBalance').click(function(event) {
            var targetOffset = $('#walletBalanceBlock').offset().top - 70;
            $('html, body').animate({scrollTop: targetOffset}, 500);
        });

        $('.btnUpdateUser').click(function () {
            $('input:invalid').each(function () {
                // Find the tab-pane that this element is inside, and get the id
                var $closest = $(this).closest('.tab-pane');
                var id = $closest.attr('id');

                // Find the link that corresponds to the pane and have it show
                $('ul.nav a[href="#' + id + '"]').tab('show');

                // var hash = '#'+id;
                // window.location.hash = hash;
                // console.log("hash: ", hash)
                // $("[name='window_redirect_hash']").val(hash);

                return false;
            });
        });

        $('.assigning-checkboxes label').each(function(){
            $(this).attr('data-name', $(this).text().toLowerCase());
        });

        $('.search-input').on('keyup', function(){
        var searchTerm = $(this).val().toLowerCase();
            $('.assigning-checkboxes label').each(function(){
                if ($(this).filter('[data-name *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
        $('#checkAll').dblclick(function(event) {
            $("input:checkbox").prop("checked", true);
        });
        $('#unCheckAll').dblclick(function(event) {
            $("input:checkbox").prop("checked", false);
        });

        $('.deleteAddressBtn').click(function (e) { 

            var address_id = $(this).attr('data-addressid');

            $('#deleteAddressId').val(address_id);

            var query = confirm("Confirm delete?");
            if (query == true) {
                $('#deleteAddressForm').submit();
            } else {
                $('#deleteAddressId').val(null);
            }
        });
    });
</script>
@endsection