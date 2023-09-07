@extends('admin.layouts.master')
@section("title") Order - Dashboard
@endsection
@section('content')
@if(config('setting.iHavefrutriDeliveryApp') == "true")
<script src="https://www.gstatic.com/firebasejs/8.4.0/firebase.js"></script>
@endif
<style>
    .content-wrapper {
        overflow: hidden;
    }

    .bill-calc-table tr td {
        padding: 6px 80px;
    }

    @media (min-width: 320px) and (max-width: 767px) {
        .bill-calc-table tr td {
            padding: 6px 50px;
        }
    }

    .td-title {
        padding-left: 15px !important;
    }

    .td-data {
        padding-right: 15px !important;
    }

    @media (min-width: 1200px) {
        .container {
            max-width: 95%;
        }
    }


    .timeline-ul,
    .timeline-li {
        list-style: none;
        padding: 0;
    }

    .timeline-li {
        padding-bottom: 1.5rem;
        border-left: 1px solid #abaaed;
        position: relative;
        padding-left: 20px;
        margin-left: 10px;
    }

    .timeline-li:last-child {
        border: 0px;
        padding-bottom: 0;
    }

    .timeline-li:before {
        content: "";
        width: 15px;
        height: 15px;
        background: #fff;
        border: 3px solid #8360c3;
        box-shadow: 3px 3px 0px rgba(46, 191, 145, 40%);
        border-radius: 50%;
        position: absolute;
        left: -10px;
        top: 0px;
    }
</style>

<div class="content mt-2 mb-5">

    <div class="d-flex justify-content-between my-2">
        <h3></h3>
        <div>
            @if(\Nwidart\Modules\Facades\Module::find('ThermalPrinter') &&
            \Nwidart\Modules\Facades\Module::find('ThermalPrinter')->isEnabled())
            <button type="button" class="btn btn-secondary btn-labeled mr-1 thermalPrintButton" disabled="disabled"
                title="{{__('thermalPrinterLang.connectingToPrinterMessage')}}" data-type="kot"><i
                    class="icon-printer4 mr-1 thermalPrinterIcon"></i>
                {{__('thermalPrinterLang.printKotWithThermalPrinter')}}</button>
            <button type="button" class="btn btn-secondary btn-labeled mr-2 thermalPrintButton" disabled="disabled"
                title="{{__('thermalPrinterLang.connectingToPrinterMessage')}}" data-type="invoice"><i
                    class="icon-printer4 mr-1 thermalPrinterIcon"></i>
                {{__('thermalPrinterLang.printInvoiceWithThermalPrinter')}}</button>
            <input type="hidden" id="thermalPrinterCsrf" value="{{ csrf_token() }}">
            <script>
                var socket = null;
        var socket_host = 'ws://127.0.0.1:6441';
        
        initializeSocket = function() {
            try {
                if (socket == null) {
                    socket = new WebSocket(socket_host);
                    socket.onopen = function() {};
                    socket.onmessage = function(msg) {
                        let message = msg.data;
                        $.jGrowl("", {
                            position: 'bottom-center',
                            header: message,
                            theme: 'bg-danger',
                            life: '5000'
                        });
                    };
                    socket.onclose = function() {
                        socket = null;
                    };
                }
            } catch (e) {
                console.log("ERROR", e);
            }
        
            var checkSocketConnecton = setInterval(function() {
                if (socket == null || socket.readyState != 1) {
                    $('.thermalPrintButton').attr({
                        disabled: 'disabled',
                        title: '{{__('thermalPrinterLang.connectingToPrinterFailedMessage')}}'
                    });
                }
                if (socket != null && socket.readyState == 1) {
                    $('.thermalPrintButton').removeAttr('disabled').removeAttr('title');
                }
                    clearInterval(checkSocketConnecton);
                }, 500)
            };

            initializeSocket();

            $('.thermalPrintButton').click(function(event) {
            $('.thermalPrinterIcon').removeClass('icon-printer').addClass('icon-spinner10 spinner');
                let printButton = $('.thermalPrintButton');
                printButton.attr('disabled', 'disabled');
                let printType = $(this).data("type");

                let order_id = '{{ $order->id }}';
                let token = $('#thermalPrinterCsrf').val();

                $.ajax({
                url: '{{ route('thermalprinter.getOrderData') }}',
                type: 'POST',
                dataType: 'JSON',
                data: {order_id: order_id, _token: token, print_type: printType },
                })
                .done(function(response) {
                    let content = {};
                    content.type = 'print-receipt';
                    content.data = response;
                    let sendData = JSON.stringify(content);
                    if (socket != null && socket.readyState == 1) {
                        socket.send(sendData);
                        $.jGrowl("", {
                        position: 'bottom-center',
                        header: '{{__('thermalPrinterLang.printCommandSentMessage')}}',
                        theme: 'bg-success',
                        life: '3000'
                        });
                        setTimeout(function() {
                        $('.thermalPrinterIcon').removeClass('icon-spinner10 spinner').addClass('icon-printer');
                        printButton.removeAttr('disabled');
                        }, 1000);
                    } else {
                        initializeSocket();
                        setTimeout(function() {
                        socket.send(sendData);
                        $.jGrowl("", {
                            position: 'bottom-center',
                            header: '{{__('storeDashboard.printCommandSentMessage')}}',
                            theme: 'bg-success',
                            life: '5000'
                        });
                        }, 700);
                    }
                })
                .fail(function() {
                    alert("ERROR")
                })
            });
            </script>
            @endif
            <a href="javascript:void(0)" id="printButton" class="btn btn-secondary btn-labeled mr-1"> Print Bill</a>
            <a href="{{ route('admin.printThermalBill', $order->unique_order_id) }}" id="printButton"
                class="btn btn-secondary btn-labeled">Print Thermal Bill</a>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-6">
            <div class="card" id="printThis">
                <div class="p-3">
                    <div class="d-flex justify-content-between @if($agent->isMobile()) flex-column @endif)">
                        <div class="form-group mb-0">
                            <h3><strong>{{ $order->restaurant->name }}</strong><br>
                                <p style="font-size: 1rem; font-weight: 400;" class="mb-0">{{ $order->unique_order_id }}
                                </p>
                            </h3>
                        </div>
                        <div class="form-group mb-0">
                            <label class="control-label no-margin text-semibold mr-1"><strong>Order
                                    Date:</strong></label>
                            {{ $order->created_at->format('Y-m-d - h:i A')}}
                        </div>
                    </div>
                    <hr>
                    <div>
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <div class="form-group">
                                    <label class="control-label no-margin text-semibold mr-1">
                                        <strong>
                                            <h5 class="font-weight-bold">Customer Details</h5>
                                        </strong>
                                    </label>
                                    <br>
                                    <p><b>Name: </b> {{ $order->user->name }}</p>
                                    <p><b>Email: </b> {{ $order->user->email }}</p>
                                    <p><b>Contact Number: </b> {{ $order->user->phone }}</p>
                                    @if($order->delivery_type == 1)
                                    <p><b>Delivery Address: </b> {{ $order->address }}</p>
                                    @endif
                                    @if($order->user->tax_number != NULL)
                                    <p><b>Tax Number: </b> {{ strtoupper($order->user->tax_number) }}</p>
                                    @endif
                                    @if($order->order_comment != NULL)
                                    <p class="mb-0"><b>Comment/Suggestion:</b></p>
                                    <h4 class="text-danger"><b>{{ $order->order_comment }}</b></h4>
                                    @endif
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="form-group mb-1">
                                    <div class="d-flex justify-content-center align-items-center flex-column mb-1"
                                        style="border: 1px solid #ddd;">
                                        <div class="py-1" style="font-weight: 900;">STATUS</div>
                                        <hr style="width: 100%;" class="m-0">
                                        <div class="py-1 text-success @if ($order->orderstatus_id == 6) text-danger @endif"
                                            style="font-weight: 500;">
                                            {{ getOrderStatusName($order->orderstatus_id) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group mb-1 mt-2">
                                    <div class="d-flex">
                                        <div class="col p-0 mr-2">
                                            <div class="d-flex justify-content-center align-items-center flex-column mb-1"
                                                style="border: 1px solid #ddd;">
                                                <div class="py-1" style="font-weight: 900;">Order Type</div>
                                                <hr style="width: 100%;" class="m-0">
                                                <div class="py-1 text-warning" style="font-weight: 500;">
                                                    @if($order->delivery_type == 1)
                                                    Delivery
                                                    @else
                                                    Self-pickup
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col p-0">
                                            <div class="d-flex justify-content-center align-items-center flex-column mb-1"
                                                style="border: 1px solid #ddd;">
                                                <div class="py-1" style="font-weight: 900;">Payment Mode</div>
                                                <hr style="width: 100%;" class="m-0">
                                                <div class="py-1 text-warning" style="font-weight: 500;">
                                                    {{ $order->payment_mode }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    @php
                    $subTotal = 0;
                    function calculateAddonTotal($addons) {
                    $total = 0;
                    foreach ($addons as $addon) {
                    $total += $addon->addon_price;
                    }
                    return $total;
                    }
                    @endphp
                    <div class="text-right mt-3">
                        <div class="form-group mb-2">
                            <div class="clearfix"></div>
                            <div class="row">
                                <div class="col-md-12 p-2 mb-3"
                                    style="background-color: #f7f8fb; float: right; text-align: left;">
                                    @foreach($order->orderitems as $item)
                                    <div>
                                        <div class="d-flex mb-1 align-items-start" style="font-size: 1.2rem;">
                                            <span
                                                class="badge badge-flat border-grey-800 text-default mr-2 order-item-quantity">{{ $item->quantity }}x</span>
                                            <strong class="mr-1" style="width: 100%;">{{ $item->name }}</strong>
                                            @php
                                            $itemTotal = ($item->price +calculateAddonTotal($item->order_item_addons)) *
                                            $item->quantity;
                                            $subTotal = $subTotal + $itemTotal;
                                            @endphp
                                            <span
                                                class="badge badge-flat border-grey-800 text-default">{{ config('setting.currencyFormat') }}{{ $itemTotal }}</span>
                                        </div>
                                        @if(count($item->order_item_addons))
                                        <div class="table-responsive">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Category</th>
                                                        <th>Addon</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    @foreach($item->order_item_addons as $addon)
                                                    <tr>
                                                        <td>{{ $addon->addon_category_name }}</td>
                                                        <td>{{ $addon->addon_name }}</td>
                                                        <td>{{ config('setting.currencyFormat') }}{{ $addon->addon_price }}
                                                        </td>
                                                    </tr>
                                                    @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                        @endif
                                        @if(!$loop->last)
                                        <div class="mb-2" style="border-bottom: 2px solid #dcdcdc;"></div>
                                        @endif
                                    </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="float-right">
                            <table class="table table-bordered table-striped bill-calc-table">
                                <tr>
                                    <td class="text-left td-title">SubTotal</td>
                                    <td class="td-data"> {{ config('setting.currencyFormat') }}{{ $subTotal }}</td>
                                </tr>
                                @if($order->coupon_name != NULL)
                                <tr>
                                    <td class="text-left td-title">Coupon</td>
                                    <td class="td-data"> {{ $order->coupon_name }} @if($order->coupon_amount != NULL)
                                        ({{ config('setting.currencyFormat') }}{{ $order->coupon_amount }}) @endif
                                    </td>
                                </tr>
                                @endif
                                @if($order->restaurant_charge != NULL)
                                <tr>
                                    <td class="text-left td-title">Store Charge</td>
                                    <td class="td-data">
                                        {{ config('setting.currencyFormat') }}{{ $order->restaurant_charge }} </td>
                                </tr>
                                @endif
                                <tr>
                                    <td class="text-left td-title">Delivery Charge</td>
                                    <td class="td-data">
                                        {{ config('setting.currencyFormat') }}{{ $order->delivery_charge }} </td>
                                </tr>
                                @if($order->tax != NULL)
                                <tr>
                                    <td class="text-left td-title">Tax</td>
                                    <td class="td-data">{{ $order->tax }}% @if($order->tax_amount != NULL)
                                        ({{ config('setting.currencyFormat') }}{{ $order->tax_amount }}) @endif
                                    </td>
                                </tr>
                                @endif
                                @if(!$order->tip_amount == NULL)
                                <tr>
                                    <td class="text-left td-title">Tip</td>
                                    <td class="td-data">
                                        {{ config('setting.currencyFormat') }}{{ $order->tip_amount }}</td>
                                </tr>
                                @endif
                                @if($order->wallet_amount != NULL)
                                <tr>
                                    <td class="text-left td-title">Paid With {{ config('setting.walletName') }}</td>
                                    <td class="td-data">
                                        {{ config('setting.currencyFormat') }}{{ $order->wallet_amount }} </td>
                                </tr>
                                @endif
                                <tr>
                                    <td class="text-left td-title"><b>Total</b></td>
                                    <td class="td-data"> {{ config('setting.currencyFormat') }}{{ $order->total }}
                                    </td>
                                </tr>
                                @if($order->payable != NULL)
                                <tr>
                                    <td class="text-left td-title">Payable</td>
                                    <td class="td-data"><b>
                                            {{ config('setting.currencyFormat') }}{{ $order->payable }}</b></td>
                                </tr>
                                @endif
                            </table>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 mb-5">
            @if($order->rating)
            <div class="card">
                <div class="card-body">
                    <p class="text-center mb-3"><b>Rating and Review</b></p>
                    <div>
                        @if($order->delivery_type == 1)
                        <p> <b>Delivery Rating </b> <span
                                class="ml-1 badge badge-flat text-white {{ ratingColorClass($order->rating->rating_delivery) }}">{{ $order->rating->rating_delivery }}
                                <i class="icon-star-full2 text-white" style="font-size: 0.6rem;"></i></span></p>
                        <p>{{ $order->rating->review_delivery }}</p>
                        <hr>
                        @endif
                        <p> <b>Store Rating </b> <span
                                class="ml-1 badge badge-flat text-white {{ ratingColorClass($order->rating->rating_store) }}">{{ $order->rating->rating_store }}
                                <i class="icon-star-full2 text-white" style="font-size: 0.6rem;"></i></span> </p>
                        <p>{{ $order->rating->review_store }}</p>
                    </div>
                </div>
            </div>
            @endif
            @if($order->schedule_slot != null)
            <div class="card">
                <div class="card-body">
                    <p class="text-center mb-0">
                        <b>
                            Scheduled Order
                        </b>
                        <br>
                        <b>Date:</b> {{ json_decode($order->schedule_date)->day }},
                        {{ json_decode($order->schedule_date)->date }}
                        <br>
                        <b>Slot:</b> {{ json_decode($order->schedule_slot)->open }} -
                        {{ json_decode($order->schedule_slot)->close }}
                    </p>
                </div>
            </div>
            @endif
            @if($order->payment_mode == "RAZORPAY" && $order->razorpay_data)
            <div class="card">
                <div class="card-body">
                    <p class="text-left mb-0">
                        <b>Razorpay ID:</b> <a
                            href="https://dashboard.razorpay.com/app/orders/{{ $order->razorpay_data->razorpay_order_id_first }}"
                            target="_blank">{{ $order->razorpay_data->razorpay_order_id_first }}
                        </a>
                        @if($order->razorpay_data->razorpay_payment_id != null)
                        <br>
                        <b>Razorpay Payment ID:</b>
                        <a href="https://dashboard.razorpay.com/app/payments/{{ $order->razorpay_data->razorpay_payment_id }}"
                            target="_blank">
                            {{ $order->razorpay_data->razorpay_payment_id }}</a>
                        @endif
                    </p>
                </div>
            </div>
            @endif

            <div class="card">
                <div class="card-body">
                    <p class="text-center mb-0"><b>Delivery Pin: {{ $order->delivery_pin }}</b></p>
                </div>
            </div>

            @if($order->distance != null)
            <div class="card">
                <div class="card-body">
                    <p class="text-center mb-0">
                        <b>
                            Distance from Store to Customer:
                            {{ number_format((float) $order->distance, 2, '.', '') }} km
                        </b>
                    </p>
                </div>
            </div>
            @endif

            @if($order->cash_change_amount !=null && $order->cash_change_amount > 0)
            <div class="card">
                <div class="card-body">
                    <p class="text-center mb-0">Cash Change Requested:
                        {{ config('setting.currencyFormat') }}{{ $order->cash_change_amount }}</p>
                </div>
            </div>
            @endif


            @if($order->orderstatus_id != 5 && $order->orderstatus_id != 6)
            <div class="card">
                <div class="card-body">
                    <h3 class="text-center"> <strong> Order Actions </strong> </h3>
                    <hr class="mt-1">
                    <div class="form-group d-flex justify-content-center">
                        @if($order->orderstatus_id == 1 || $order->orderstatus_id == 11)
                        <form action="{{ route('admin.acceptOrderFromAdmin') }}" class="mr-1" method="POST">
                            <input type="hidden" name="id" value="{{ $order->id }}">
                            @csrf
                            <button class="btn btn-primary btn-labeled btn-labeled-left mr-1"> <b><i
                                        class="icon-checkmark3 ml-1"></i> </b> Accept Order </button>
                        </form>
                        @endif

                        @if($order->orderstatus_id == 10)
                        <a href="{{ route('admin.confirmScheduledOrder', $order->id) }}"
                            class="mr-2 btn btn-lg confirmOrderBtn btn-success"> Confirm Order <i
                                class="icon-checkmark3 ml-1"></i></a>
                        @endif

                        @if($order->orderstatus_id == 1 || $order->orderstatus_id == 2 || $order->orderstatus_id == 3 ||
                        $order->orderstatus_id == 4 || $order->orderstatus_id == 7 || $order->orderstatus_id == 8 ||
                        $order->orderstatus_id == 9 || $order->orderstatus_id == 10 || $order->orderstatus_id == 11)
                        <a href="javascript:void(0)" class="btn btn-danger btn-labeled dropdown-toggle"
                            data-toggle="dropdown">
                            Cancel Order
                        </a>
                        <div class="dropdown-menu">
                            <form action="{{ route('admin.cancelOrderFromAdmin') }}" method="POST">
                                <input type="hidden" name="order_id" value="{{ $order->id }}">
                                <input type="hidden" name="refund_type" value="NOREFUND">
                                @csrf
                                <button class="dropdown-item" @if($order->wallet_amount) type="submit"
                                    data-popup="tooltip" data-placement="bottom"
                                    title="{{ config('setting.currencyFormat') }}{{ $order->wallet_amount }} will be
                                    refunded as user has paid @if($order->payment_mode != "WALLET") partially @endif
                                    with Wallet" @endif>
                                    Cancel Order
                                </button>
                            </form>
                            <form action="{{ route('admin.cancelOrderFromAdmin') }}" method="POST">
                                <input type="hidden" name="order_id" value="{{ $order->id }}">
                                <input type="hidden" name="refund_type" value="FULL">
                                @csrf
                                <button class="dropdown-item" type="submit" data-popup="tooltip" data-placement="bottom"
                                    title="Full refund of {{ config('setting.currencyFormat') }}{{ $order->total }} will be refunded to users wallet. (Even if user has not made any payment)">
                                    Cancel With Full Refund
                                </button>
                            </form>
                            <form action="{{ route('admin.cancelOrderFromAdmin') }}" method="POST">
                                <input type="hidden" name="order_id" value="{{ $order->id }}">
                                <input type="hidden" name="refund_type" value="HALF">
                                @csrf
                                <button class="dropdown-item" type="submit" data-popup="tooltip" data-placement="bottom"
                                    title="Half refund of {{ config('setting.currencyFormat') }}{{ $order->total/2 }} will be refunded to users wallet. (Even if user has not made any payment)">
                                    Cancel With Half Refund
                                </button>
                            </form>
                        </div>
                        @endif

                        @if($order->orderstatus_id == 8)
                        <a href="{{ route('admin.approvePaymentOfOrder', $order->id) }}"
                            class="btn btn-secondary ml-2 approvePayment" data-popup="tooltip" data-placement="bottom"
                            title="Double Click to Approve Payment">
                            Approve Payment
                        </a>
                        @endif
                    </div>
                </div>
            </div>
            @endif
            @if($order->delivery_type==1)
            @if($order->orderstatus_id == 1 || $order->orderstatus_id == 2)
            <div class="card">
                <div class="card-body">
                    <label class="control-label no-margin text-semibold mr-1"><strong>Assign Delivery
                            Guy</strong></label>
                    <form action="{{route('admin.assignDeliveryFromAdmin')}}" method="POST">
                        <input type="text" hidden value="{{$order->id}}" name="order_id">
                        <input type="text" hidden value="{{$order->user->id}}" name="customer_id">
                        @csrf
                        <div class="form-group row mb-0">
                            <div class="col-lg-12 mb-2">
                                <select class="form-control select" data-fouc name="user_id" required="required">
                                    <option></option>
                                    @foreach ($users as $user)
                                    <option value="{{$user->id}}" @if(!$user->delivery_guy_detail) disabled="disabled"
                                        @endif>{{$user->name}} @if($user->delivery_guy_detail &&
                                        $user->delivery_guy_detail->status == 0) (Offline) @endif</option>
                                    @endforeach
                                </select>
                            </div>
                            <br>
                            <div class="col-lg-12 mt-1 text-right float-right p-0">
                                <button type="submit" class="btn btn-secondary mr-1">
                                    Assign Delivery
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            @endif
            @endif
            @if($order->delivery_type==1)
            @if($order->orderstatus_id == 3 || $order->orderstatus_id == 4)
            <div class="card">
                <div class="card-body">
                    @if($order->accept_delivery && $order->accept_delivery->user && $order->accept_delivery->user->name)
                    <p class="text-center mb-2"> <strong>Assigned Delivery Guy:
                            {{ $order->accept_delivery->user->name }}
                            @if($order->accept_delivery->user->delivery_guy_detail->status == 0) <span
                                class="text-danger"> (Offline) </span> @endif</strong></p>
                    @endif
                    <form action="{{route('admin.reAssignDeliveryFromAdmin')}}" method="POST">
                        <input type="text" hidden value="{{$order->id}}" name="order_id">
                        <input type="text" hidden value="{{$order->user->id}}" name="customer_id">
                        @csrf
                        <div class="form-group row">
                            <div class="col-lg-12">
                                <select class="form-control select" data-fouc name="user_id" required="required">
                                    <option></option>
                                    @foreach ($users as $user)
                                    <option value="{{$user->id}}">{{$user->name}} @if($user->delivery_guy_detail &&
                                        $user->delivery_guy_detail->status == 0) (Offline) @endif</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-lg-12 mt-2 text-center">
                                <button type="submit" class="btn btn-secondary">
                                    Re-Assign Delivery
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            @endif
            @endif
            @if($order->orderstatus_id == 5 || $order->orderstatus_id == 6)
            @if($order->accept_delivery && $order->accept_delivery->user && $order->accept_delivery->user->name)
            <div class="card">
                <div class="card-body">
                    <p class="text-center mb-0"> <strong>Assigned Delivery Guy:
                            {{ $order->accept_delivery->user->name }}
                            @if($order->accept_delivery->user->delivery_guy_detail->status == 0) (Offline) @endif
                        </strong></p>
                </div>
            </div>
            @endif
            @endif
        </div>


        <div class="col-lg-3 mb-5">
            @if($order->orderstatus_id == 5)
            <div class="card">
                <div class="card-body text-center">
                    <h4 class="mb-0"><b>Order Completed in:</b></h4>
                    <span>{{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</span>
                </div>
            </div>
            @elseif($order->orderstatus_id == 6)
            <div class="card">
                <div class="card-body text-center">
                    <h4 class="mb-0"><b>Order cancelled in:</b></h4>
                    <span>{{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</span>
                </div>
            </div>
            @elseif($order->orderstatus_id == 9)
            <div class="card">
                <div class="card-body text-center">
                    <h4 class="mb-0"><b>Payment Failed in:</b></h4>
                    <span>{{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</span>
                </div>
            </div>
            @else
            <div class="card">
                <div class="card-body text-center">
                    <h4 class="mb-0"><b>Ongoing order</b></h4>
                    <span class="liveTimerNonCompleteOrder"></span>
                </div>
            </div>
            @endif
            @if(count($activities) > 0)
            <div class="card">
                <div class="card-body">
                    <div>
                        <ul class="timeline-ul">
                            @foreach($activities as $activity)
                            <li class="timeline-li">
                                <div class="small" data-popup="tooltip" data-placement="left"
                                    title="{{ $activity->created_at->format("Y-m-d - h:i:s A") }}">
                                    <b>{{ $activity->created_at->format('h:i A') }}</b></div>
                                {{ $activity->description }}
                                @if($activity->causer && $activity->properties["type"] != "Order_Accepted_Auto")
                                <span> by </span>
                                <a href="{{ route('admin.get.editUser', $activity->causer->id) }}" class="text-default">
                                    <b>{{ $activity->causer->name }}</b>
                                </a>
                                @endif
                            </li>
                            @endforeach
                        </ul>
                    </div>

                </div>
            </div>
            @endif

            @if(config('setting.iHavefrutriDeliveryApp') == "true")
            <div class="card">
                <div class="card-body p-1">
                    <div id="map" style="height: 280px"></div>
                </div>
            </div>
            @endif
        </div>
    </div>
</div>
</div>

<script>
    function processLocation(places, vectorSource) { 
        var features = [];
        for (var i = 0; i < places.length; i++) {
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([places[i][0], places[i][1]], 'EPSG:4326', 'EPSG:3857')),
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: places[i][2],
                    crossOrigin: 'anonymous',
                    scale: 0.5
                })
            });
            iconFeature.setStyle(iconStyle);
            vectorSource.addFeature(iconFeature);
        }
    }

    $(function() {
        var orderCreatedData = "{{ $order->created_at }}";
        var startDateTime = new Date(orderCreatedData); 
        var startStamp = startDateTime.getTime();
    
        var newDate = new Date();
        var newStamp = newDate.getTime();
    
        var timer; // for storing the interval (to stop or pause later if needed)
    
        function updateClock() {
            newDate = new Date();
            newStamp = newDate.getTime();
            var diff = Math.round((newStamp-startStamp)/1000);
            
            var d = Math.floor(diff/(24*60*60)); /* though I hope she won't be working for consecutive days :) */
            diff = diff-(d*24*60*60);
            var h = Math.floor(diff/(60*60));
            diff = diff-(h*60*60);
            var m = Math.floor(diff/(60));
            diff = diff-(m*60);
            var s = diff;
            var checkDay = d > 0 ? true : false;
            var checkHour = h > 0 ? true : false;
            var checkMin = m > 0 ? true : false;
            var checkSec = s > 0 ? true : false;
            var formattedTime = checkDay ? d+ " day" : "";
                formattedTime += checkHour ? " " +h+ " hr" : "";
                formattedTime += checkMin ? " " +m+ " min" : "";
                formattedTime += checkSec ? " " +s+ " sec" : "";
    
            $('.liveTimerNonCompleteOrder').text(formattedTime);
        }
    
        timer = setInterval(updateClock, 1000);
    
        $('#printButton').on('click',function(){
            $('#printThis').printThis();
        })
        
        $('.select').select2({
            placeholder: 'Select Delivery Guy',
        allowClear: true,
        });

        $('body').on("click", ".approvePayment", function(e) {
            return false;
        });

        $('body').on("dblclick", ".approvePayment", function(e) {
            window.location = this.href;
            return false;
        });

        @if($order->delivery_type == 1)
        var deliveryGuyMarker = "{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-orange.png"
        var storeMarker = "{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/store-marker.png";
        var customerMarker = "{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/customer-marker.png";

        var customerLat = "{{ json_decode($order->location, true)['lat'] }}";
        var customerLng = "{{ json_decode($order->location, true)['lng'] }}";
        var storeLat = "{{ $order->restaurant->latitude }}";
        var storeLng = "{{ $order->restaurant->longitude }}";
        var orderStatus = "{{ $order->orderstatus_id }}";

        var vectorSource = new ol.source.Vector({});

        @if(config('setting.iHavefrutriDeliveryApp') == "true" && $eagleViewData != null)
           
            var places = [
                [customerLng, customerLat , customerMarker],
                [storeLng, storeLat, storeMarker],
            ];   

            var features = [];
            for (var i = 0; i < places.length; i++) {
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([places[i][0], places[i][1]], 'EPSG:4326', 'EPSG:3857')),
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: places[i][2],
                    crossOrigin: 'anonymous',
                    scale: 0.5
                })
            });
            iconFeature.setStyle(iconStyle);
            vectorSource.addFeature(iconFeature);
        }

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                updateWhileAnimating: true,
                updateWhileInteracting: true,
            });


            var fullScreenControl = new ol.control.FullScreen();
            var map = new ol.Map({
                target: 'map',
                controls: ol.control.defaults({ attribution: false }).extend([fullScreenControl]),
                layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), vectorLayer],
                loadTilesWhileAnimating: true,
            });
            // map.getView().fit(vectorSource.getExtent());
            var extent = vectorLayer.getSource().getExtent();
            map.getView().fit(extent, {size:map.getSize(), maxZoom:12})
            
            
            @if(($order->orderstatus_id == 3 || $order->orderstatus_id == 4) && $order->accept_delivery && $order->accept_delivery->user != null)
            var deliveryGuyId = "{{ $order->accept_delivery->user->id }}";
            var config = {
                apiKey: "{{ $eagleViewData['project_number'] }}",
                databaseURL: "{{ $eagleViewData['firebase_url'] }}",
                storageBucket: "{{ $eagleViewData['storage_bucket'] }}",
            };
            var firebaseApp = firebase.initializeApp(config);

            var centerBound = false;

            var ref = "/User/" +deliveryGuyId;
            firebaseApp
                .database()
                .ref(ref)
                .on("value", function(snapshot) {
                
                    var deliveryGuy = snapshot.val();
                    
                    console.log(deliveryGuy);
                    console.log(Object.keys(deliveryGuy).length);

                    if (Object.keys(deliveryGuy).length == 0) {
                        return;
                    }
                    
                    var newDeliveryGuyLat = deliveryGuy.latitude;
                    var newDeliveryGuyLng = deliveryGuy.longitude;

                    if (2 in places) {
                        places[2][0] = newDeliveryGuyLng;
                    places[2][1] = newDeliveryGuyLat
                    } else {
                        var newEntry = [newDeliveryGuyLng, newDeliveryGuyLat , deliveryGuyMarker];
                        places[2] = newEntry;
                    }
                    
                    vectorSource.clear();
                    processLocation(places, vectorSource);
            });
            @endif
        @endif
        @endif
    });    
</script>
@endsection