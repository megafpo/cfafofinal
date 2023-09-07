@extends('admin.layouts.master')
@section("title")
Dashboard
@endsection
@section('content')
<style>
    .chart-container {
        overflow: hidden;
    }

    .chart-container.has-scroll {
        overflow: hidden;
    }
</style>
<div class="content mb-5">

    <div class="d-flex justify-content-between mt-4 mb-0">
        <div>
            <h3><b>Dashboard</b></h3>
        </div>
        <div>
            <button type="button" class="btn btn-action-secondary daterange-ranges">
                <i class="icon-calendar22 position-left mr-1"></i> <span></span> <b class="caret"></b>
            </button>
        </div>
    </div>

    <div class="clearfix"></div>
    <div class="row" id="dashboardStatsBlock">
        <div class="col-6 col-xl-3 mb-2 mt-2">
            <div class="col-xl-12 dashboard-display p-3">
                <a class="block block-link-shadow text-left text-default" href="javascript:void(0)">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="dashboard-display-number">--</div>
                            <div class="font-size-sm text-uppercase text-muted">Orders</div>
                        </div>
                        <div class="d-none d-sm-block">
                            <div class="dashboard-display-icon-block block-bg-1">
                                <i class="dashboard-display-icon icon-spinner2 spinner color-purple"></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div class="col-6 col-xl-3 mb-2 mt-2">
            <div class="col-xl-12 dashboard-display p-3">
                <a class="block block-link-shadow text-left text-default" href="javascript:void(0)">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="dashboard-display-number">--</div>
                            <div class="font-size-sm text-uppercase text-muted">Users</div>
                        </div>
                        <div class="d-none d-sm-block">
                            <div class="dashboard-display-icon-block block-bg-2">
                                <i class="dashboard-display-icon icon-spinner2 spinner color-cyan"></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div class="col-6 col-xl-3 mb-2 mt-2">
            <div class="col-xl-12 dashboard-display p-3">
                <a class="block block-link-shadow text-left text-default" href="javascript:void(0)">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="dashboard-display-number">--</div>
                            <div class="font-size-sm text-uppercase text-muted">Stores</div>
                        </div>
                        <div class="d-none d-sm-block">
                            <div class="dashboard-display-icon-block block-bg-3">
                                <i class="dashboard-display-icon icon-spinner2 spinner color-red"></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div class="col-6 col-xl-3 mb-2 mt-2">
            <div class="col-xl-12 dashboard-display p-3">
                <a class="block block-link-shadow text-left text-default" href="javascript:void(0)">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="dashboard-display-number">--</div>
                            <div class="font-size-sm text-uppercase text-muted">Earnings</div>
                        </div>
                        <div class="d-none d-sm-block">
                            <div class="dashboard-display-icon-block block-bg-4">
                                <i class="dashboard-display-icon icon-spinner2 spinner color-green"></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>

    @if(!empty($latestNews))
    @role('Admin')
    <div class="px-3 my-2 newsViewBannerBlock" id="frutriLatestNewsBlock">
        <div class="d-flex justify-content-between align-items-center" style="padding: 1.5rem 0rem;">
            <a href="{{ $latestNews->link }}" data-id={{ $latestNews->id }} class="frutriSingleNews" target="_blank">
                <div class="d-flex">
                    <div class="mr-3" style="height: 100%;">
                        <img src="{{ $latestNews->image }}" class="img-fluid" style="width: 95px">
                    </div>

                    <div class="text-white">
                        <p class="mb-0 font-weight-bold" style="font-size: 1rem;">{{ $latestNews->title }}</p>
                        <p class="mb-0" style="width: 100%; max-width: 330px;">{{ $latestNews->content }}</p>
                        <div>
                            <p class="newsViewButton mb-0 mr-2">View</p>
                        </div>
                    </div>
                </div>
            </a>
            <div style="position: absolute; right: 20px; top: 10px;">
                <button type="button" class="close text-light closefrutriLatestNewsBlock"
                    data-id="{{ $latestNews->id }}">×</button>
            </div>
        </div>
    </div>
    @endrole
    @endif

    <div class="row hidden" id="sortable">
        <div class="col-xl-4 dashboard-block-movable" data-id="1">
            <div class="dashboard-recent-orders-block mt-2 p-3">
                <h4 style="color: #000;font-weight: 500;" class="move-handle">Recent Orders</h4>
                @foreach($orders as $order)
                <div class="recent-order-card p-0 py-2 mb-1">
                    <a href="{{ route('admin.viewOrder', $order->unique_order_id) }}" data-popup="tooltip"
                        data-placement="right" title="{{ $order->restaurant->name }}">
                        <div class=" float-right text-right">
                            <span class="badge order-badge badge-color-{{$order->orderstatus_id}} border-grey-800">
                                {{ getOrderStatusName($order->orderstatus_id) }}
                            </span>
                            <br>
                            @if($agent->isDesktop())
                            @if($order->orderstatus_id == 5)
                            <p class="order-dashboard-time min-fit-content mt-1 small"><b>Completed in:
                                </b>{{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</p>
                            @elseif($order->orderstatus_id == 6)
                            <p class="order-dashboard-time min-fit-content mt-1 small"><b>Cancelled in: </b>
                                {{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</p>
                            @elseif($order->orderstatus_id == 9)
                            <p class="order-dashboard-time min-fit-content mt-1 small"><b>Failed in: </b>
                                {{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</p>
                            @else
                            <p class="liveTimer mt-1 text-center min-fit-content order-dashboard-time small"
                                title="{{ $order->created_at }}"><i class="icon-spinner10 spinner position-left"></i>
                            </p>
                            @endif
                            @endif
                        </div>
                        <div class="d-flex justify-content-start align-items-center">
                            <div>
                                <img src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}{{ $order->restaurant->image }}"
                                    alt="{{ $order->restaurant->name }}" height="45" width="45"
                                    style="border-radius: 0.275rem;">
                            </div>
                            <div class="ml-2">
                                <span><strong>{{ $order->restaurant->name }}</strong></span>
                                <br>
                                <span class="small">#{{ substr($order->unique_order_id, -9) }} -
                                    {{ config('setting.currencyFormat') }}{{ $order->total }}</span>
                            </div>
                        </div>
                        @if($agent->isMobile())
                        <div class="mt-2">
                            @if($order->orderstatus_id == 5)
                            <p class="order-dashboard-time min-fit-content mt-1"><b>Completed in:
                                </b>{{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</p>
                            @elseif($order->orderstatus_id == 6)
                            <p class="order-dashboard-time min-fit-content mt-1"><b>Cancelled in: </b>
                                {{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</p>
                            @elseif($order->orderstatus_id == 9)
                            <p class="order-dashboard-time min-fit-content mt-1"><b>Failed in: </b>
                                {{ timeStampDiffFormatted($order->created_at, $order->updated_at) }}</p>
                            @else
                            <p class="liveTimer mt-1 text-center min-fit-content order-dashboard-time"
                                title="{{ $order->created_at }}"><i class="icon-spinner10 spinner position-left"></i>
                            </p>
                            @endif
                        </div>
                        @endif
                    </a>
                </div>
                @endforeach
            </div>
        </div>
        <div class="col-xl-3 dashboard-block-movable" data-id="2">
            <div class="dashboard-new-users-block mt-2 p-3">
                <h4 style="color: #000;font-weight: 500;" class="move-handle">New Signups</h4>
                @foreach($users as $user)
                <div class="new-users px-0 py-2 mb-1">
                    <a href="{{ route('admin.get.editUser', $user->id) }}">
                        <div class="float-right">
                            @foreach ($user->roles as $role)
                            <span class="badge badge-flat border-grey-800 text-default text-capitalize"
                                style="border-radius: 2px;">
                                {{ $role->name }}
                            </span>
                            @endforeach
                        </div>
                        <div class="d-flex justify-content-start">
                            <div class="first-letter-icon custom-bg-{{ rand(1,8) }}">
                                {{ returnAcronym($user->name) }}
                            </div>
                            <div class="ml-2">
                                <span><strong>{{ $user->name }}</strong> <span class="small">-
                                        {{ $user->phone }}
                                    </span> </span><br>
                                <span class="small">{{ $user->created_at->diffForHumans() }}</span>
                            </div>
                        </div>
                    </a>
                </div>
                @endforeach
            </div>
        </div>
        <div class="col-xl-2 dashboard-block-movable" data-id="3">
            <div class="card mt-2 p-3 position-relative">
                <h4 style="color: #000;font-weight: 500;" class="move-handle">Wallet Transactions</h4>
                <div class="card-body p-0">
                    @foreach($walletTransactions as $transaction)
                    <div class="d-flex justify-content-between single-transaction py-2">
                        <div class="small w-100 text-dark">{{ $transaction->meta["description"] }} <br>
                            <span class="small text-default"> {{ $transaction->created_at->diffForHumans() }}</span>
                        </div>
                        <div class="small font-weight-semibold @if($transaction->type == 'deposit') text-success @else
                            text-warning @endif">
                            {{ config('setting.currencyFormat') }}{{ number_format($transaction->amount / 100, 2,'.', '') }}
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="col-xl-3 dashboard-block-movable" data-id="4">
            @role('Admin')
            <div class="card mt-2">
                <div class="card-body">
                    @if(config('setting.adminDailyTargetRevenue') != null)
                    <div class="row">
                        <div class="col font-weight-semibold move-handle">
                            Today's Target Achievement
                        </div>
                        <div class="col col-auto">
                            <span
                                class="text-success font-weight-semibold">{{ dailyTargetPercentage($todayRevenue) }}%</span>
                        </div>
                    </div>
                    <div class="progress mt-2" style="height: 10px; border-radius: 25px;">
                        <div class="progress-bar {{ revenueTargetColorHelper($todayRevenue) }} progress-bar-striped progress-bar-animated"
                            style="width: {{dailyTargetPercentage($todayRevenue)}}%"></div>
                    </div>
                    <div class="row @if(dailyTargetPercentage($todayRevenue) > 100) div-celebration @endif">
                        <div class="col">
                            <div class="mt-4">
                                <h6 class="mb-1">Target Revenue</h6>
                                <h4 class="mb-0 font-weight-semibold">
                                    {{ config('setting.currencyFormat') }}{{ config('setting.adminDailyTargetRevenue') }}
                                </h4>
                            </div>
                        </div>
                        <div class="col col-auto">
                            <div class="mt-4">
                                <h6 class="mb-1">Actual Revenue</h6>
                                <h4 class="mb-0 font-weight-semibold">
                                    {{ config('setting.currencyFormat') }}{{ $todayRevenue }}</h4>
                            </div>
                        </div>
                    </div>
                    @else
                    <p class="mb-0">>Set Daily Revenue Target in Settings</p>
                    @endif
                </div>
            </div>
            @endrole
            <div class="card mt-2" style="background-image: linear-gradient(90deg,#5b73e8,#44c4fa);">
                <div class="card-body">
                    <h4 class="font-weight-semibold text-center mb-1 text-white move-handle">{{ $todayOrderCount }}
                        Sales Today</h4>
                    <p class="text-success-600 small text-center mb-3 text-white"
                        style="padding: 5px; background-color: rgb(0 0 0 / 16%); font-weight: 500; border-radius: 2px;">
                        {!! calculatePercentIncreaseDecrease($todayOrderCount, $yesterdayOrderCount) !!}%
                        compared
                        yesterday (as of {{ \Carbon\Carbon::now()->format('h:i A') }})
                    </p>
                    <div id="hourly-sales-count" class="mt-2" style="margin-bottom: -20px;"></div>
                </div>
            </div>
        </div>
        <div class="col-xl-3 dashboard-block-movable" data-id="5">
            <div class="dashboard-latest-reviews mt-2 p-3">
                <h4 style="color: #000;font-weight: 500;" class="move-handle">Latest Reviews</h4>
                @foreach($reviews as $review)
                <div class="top-review px-0 py-2">

                    <div class="d-flex justify-content-between">
                        <div class="small">
                            Customer: {{ $review->user->name }} <br>
                            Order: <a href=" {{ route('admin.viewOrder', $review->order->unique_order_id) }}">
                                #{{ substr ($review->order->unique_order_id, -9)  }}</a> <br>
                            @if($review->order->accept_delivery && $review->order->accept_delivery->user &&
                            $review->order->accept_delivery->user->id)
                            Delivery:
                            <a
                                href="{{ route('admin.get.editUser', $review->order->accept_delivery->user->id) }}">{{ $review->order->accept_delivery->user->name }}</a>
                            @endif
                        </div>
                        <div>
                            <span
                                class="ml-1 badge badge-flat text-white {{ ratingColorClass($review->rating_delivery) }}">{{ $review->rating_delivery }}
                                <i class="icon-star-full2 text-white" style="font-size: 0.6rem;" data-popup="tooltip"
                                    title="Delivery Review" data-placement="top"></i></span>
                            <br>
                            <span
                                class="ml-1 badge badge-flat text-white {{ ratingColorClass($review->rating_store) }}">
                                {{ $review->rating_store }}
                                <i class="icon-star-full2 text-white" style="font-size: 0.6rem;" data-popup="tooltip"
                                    title="Store Review" data-placement="top"></i></span>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        <div class="col-xl-3 dashboard-block-movable" data-id="6">
            <div class="dashboard-top-stores mt-2 p-3 position-relative">
                <div class="mb-2">
                    <h4 style="color: #000;font-weight: 500;" class="move-handle mb-0">Top Stores</h4>
                    <p class="topStoreFromTo small mb-0" style="font-size: 10px">(This Month)</p>
                </div>
                <div id="topStoresDynamicList"></div>
            </div>
        </div>
        <div class="col-xl-6 d-none d-md-block dashboard-block-movable" data-id="7">
            <div class="card mt-2 move-handle">
                <div class="card-body">
                    @if($ifAnyOrders)
                    <div class="chart-container has-scroll">
                        <div class="chart has-fixed-height has-minimum-width" id="basic_donut"></div>
                    </div>
                    @endif
                </div>
            </div>
        </div>
        <div class="col-xl-3 dashboard-block-movable" data-id="8">
            <div class="dashboard-todoNotes mt-2 p-3 position-relative" style="max-height: 504px; overflow-y: scroll;">
                <div>
                    <h4 style="color: #000;font-weight: 500;" class="move-handle">Notes</h4>
                    <input type="text" id="todo_data" placeholder="Add a note here..." class="mt-2 mb-1">
                    <ul id="filledTodoNotes" class="mt-2 m-0">
                        @foreach($todoNotes as $todoNote)
                        <li class="d-flex justify-content-between px-0 todoSingleLi">
                            <div class="mr-3 ignore-drag">{{ $todoNote->data }} </div>
                            <div class="deleteTodoNote btn btn-sm btn-default cursor-pointer rounded h-100"
                                data-id="{{ $todoNote->id }}"><i class='icon-cross3 text-warning'></i></div>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

        @role('Admin')
        <div class="col-xl-4 dashboard-block-movable" data-id="9">
            <div class="card mt-2 p-3 position-relative" id="frutriNews">
                <div class="card-body">
                    <div class="text-center"><i class="icon-spinner2 spinner"></i></div>
                </div>
            </div>
        </div>
        @endrole
    </div>
</div>
</div>

<input type="hidden" name="_token" value="{{ csrf_token() }}" id="token">

<script>
    function init() {

        $(".dashboard-todoNotes").overlayScrollbars({
            scrollbars : {
                visibility       : "auto",
                autoHide         : "leave",
                autoHideDelay    : 500
            }
        });

        $('#todo_data').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                var todo_data = $('#todo_data').val();
                $.ajax({
                    type: "get",
                    url: "{{ route('admin.saveTodoNote') }}",
                    data: {"data": todo_data, "priority": "HIGH"},
                    dataType: "json",
                    success: function (response) {
                        console.log(response.data.id);
                        $('#todo_data').val("");
                        $('#filledTodoNotes').prepend("<li class='d-flex justify-content-between px-0 todoSingleLi'><div class='mr-3'>"+ todo_data +" </div><div class='deleteTodoNote btn btn-sm btn-default cursor-pointer rounded h-100' data-id='"+response.data.id+"'><i class='icon-cross3 text-warning'></i></div></li>")
                    }
                });
            }
        });

        $('body').on("click", ".deleteTodoNote", function(e) {
            e.preventDefault();
            
            if (confirm("Confirm delete?") == true) {
                var todoNoteId = $(this).attr('data-id');
                var li = $(this).parent();
                $.ajax({
                    type: "get",
                    url: "{{ route('admin.deleteTodoNote') }}",
                    data: {"id": todoNoteId},
                    dataType: "json",
                    success: function (response) {
                        li.remove();
                    }
                });
            }
            
        });
    
        timer = setInterval(updateClock, 1000);
    
        var newDate = new Date();
        var newStamp = newDate.getTime();
    
        var timer; 
    
        function updateClock() {
    
            $('.liveTimer').each(function(index, el) {
                var orderCreatedData = $(this).attr("title");
                var startDateTime = new Date(orderCreatedData); 
                var startStamp = startDateTime.getTime();
            
    
                newDate = new Date();
                newStamp = newDate.getTime();
                var diff = Math.round((newStamp-startStamp)/1000);
                
                var d = Math.floor(diff/(24*60*60));
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
    
                $(this).text(formattedTime);
            });
        }
    
        require.config({
            paths: {
                echarts: '{{ substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/visualization/echarts'
            }
        });
    
        require(
            [
                'echarts',
                'echarts/theme/limitless',
                'echarts/chart/pie',
                'echarts/chart/funnel',
            ],
    
            function (ec, limitless) {
    
                var basic_donut = ec.init(document.getElementById('basic_donut'), limitless);
              
                basic_donut_options = {
    
                    // Add title
                    title: {
                        text: 'Overview Of Order Statuses',
                        subtext: 'Of all orders till {{ $todaysDate }}',
                        x: 'center'
                    },
    
                    // Add legend
                    legend: {
                        show: true,
                        orient: 'vertical',
                        x: 'left',
                        data: {!! $orderStatusesName !!}
                    },
    
                    // Display toolbox
                    toolbox: {
                        show: false,
                    },
    
                    // Enable drag recalculate
                    calculable: false,
    
                    // Add series
                    series: [
                        {
                            name: 'Orders',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '58%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        formatter: '{b}' + '\n\n' + '{c} ({d}%)',
                                        position: 'center',
                                        textStyle: {
                                            fontSize: '17',
                                            fontWeight: '500'
                                        }
                                    }
                                }
                            },
    
                            data: {!! $orderStatusesData !!} 
                        }
                    ]
                };
    
                basic_donut.setOption(basic_donut_options);
    
                 window.onresize = function () {
                    setTimeout(function (){
                        basic_donut.resize();
                    }, 200);
                }
    
            }
        );

        $('.select').select2({
            minimumResultsForSearch: -1
        });
        //dateranger picker
        // Initialize with options
        $('.daterange-ranges').daterangepicker({
                startDate: moment().startOf('month'),
                endDate:moment().endOf('month'),
                minDate: '01/01/2020',
                maxDate: moment().format('MM-DD-YYYY'),
                dateLimit: {
                    'months': 48,
                },
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment()],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                opens: 'left',
                applyClass: 'btn-small bg-primary',
                cancelClass: 'btn-small btn-default',
                autoApply: true,
            },
            function(start, end) {
                var fromToDate = start.format('MMMM D, YYYY') + ' &nbsp; - &nbsp; ' + end.format('MMMM D, YYYY');
                $('.daterange-ranges span').html(fromToDate);
                $('.topStoreFromTo').html('('+fromToDate+')');
                //ajax processing
                $('.dashboard-display-icon').each(function(index, el) {
                    $(this).removeClass('icon-stats-growth2 icon-users4 icon-store2 icon-coin-dollar').addClass('icon-spinner2 spinner')
                });
                let from = start.format('YYYY-MM-DD')
                let to = end.format('YYYY-MM-DD')
                $.ajax({
                        url: '{{ route('admin.partials.dashboardStats') }}',
                        type: 'GET',
                        dataType: 'JSON',
                        data: {
                            from: from,
                            to: to
                        },
                    })
                    .done(function(data) {
                        $('#dashboardStatsBlock').html(data.dashboardStats);
                        $('#topStoresDynamicList').html(data.topStores);
                        $('[data-toggle="tooltip"]').tooltip();  
                    })
                    .fail(function() {
                        console.log("error");
                    })
            }
        );

        // Display date format
        // $('.daterange-ranges span').html(moment().format('MMMM D, YYYY'));
        $('.daterange-ranges span').html("This Month")
        $('.daterange-ranges').on('show.daterangepicker', function(ev, picker) {
            $('body').addClass("daterange-blur");
        });
        $('.daterange-ranges').on('hide.daterangepicker', function(ev, picker) {
            $('body').removeClass("daterange-blur");
        });

        //onload
        $.ajax({
            url: '{{ route('admin.partials.dashboardStats') }}',
            type: 'GET',
            dataType: 'JSON',
            data: {
                from: moment().startOf('month').format('YYYY-MM-DD'),
                to: moment().format('YYYY-MM-DD'),
            },
        })
        .done(function(data) {
            $('#dashboardStatsBlock').html(data.dashboardStats);
            $('#topStoresDynamicList').html(data.topStores);
            $('[data-toggle="tooltip"]').tooltip();  
        })
        .fail(function() {
            console.log("error");
        })


        generateBarChart("#hourly-sales-count", 24, 40, true, "elastic", 1200, 50, "#ffffff", "hours");

        function generateBarChart(element, barQty, height, animate, easing, duration, delay, color, tooltip) {
            var bardata = @json($todayOrderFullArr);

            var d3Container = d3.select(element),
                width = d3Container.node().getBoundingClientRect().width;
            
            var x = d3.scale.ordinal()
                .rangeBands([0, width], 0.3)

            var y = d3.scale.linear()
                .range([0, height]);

            x.domain(d3.range(0, bardata.length))

            y.domain([0, d3.max(bardata)])

            var container = d3Container.append('svg');

            var svg = container
                .attr('width', width)
                .attr('height', height)
                .append('g');

            var bars = svg.selectAll('rect')
                .data(bardata)
                .enter()
                .append('rect')
                    .attr('class', 'd3-random-bars')
                    .attr('width', x.rangeBand())
                    .attr('x', function(d,i) {
                        return x(i);
                    })
                    .style('fill', color);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0]);

            bars.call(tip)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            if(tooltip == "hours") {
                tip.html(function (d, i) {
                    return "<div class='text-center'>" +
                            "<h6 class='no-margin mb-0'>" + d + " Sales </h6>" +
                            "<div class='text-size-small mt-2'>at " + i + ":00" + "</div>" +
                        "</div>"
                });
            }

            if(animate) {
                withAnimation();
            } else {
                withoutAnimation();
            }

            function withAnimation() {
                bars
                    .attr('height', 0)
                    .attr('y', height)
                    .transition()
                        .attr('height', function(d) {
                            return y(d);
                        })
                        .attr('y', function(d) {
                            return height - y(d);
                        })
                        .delay(function(d, i) {
                            return i * delay;
                        })
                        .duration(duration)
                        .ease(easing);
            }

            function withoutAnimation() {
                bars
                    .attr('height', function(d) {
                        return y(d);
                    })
                    .attr('y', function(d) {
                        return height - y(d);
                    })
            }

            $(window).on('resize', barsResize);
            $(document).on('click', '.sidebar-control', barsResize);

            function barsResize() {
                console.log("called");
                width = d3Container.node().getBoundingClientRect().width;
                container.attr("width", width);
                svg.attr("width", width);
                x.rangeBands([0, width], 0.3);
                svg.selectAll('.d3-random-bars')
                    .attr('width', x.rangeBand())
                    .attr('x', function(d,i) {
                        return x(i);
                    });
            }
        

            var sortable = $('#sortable').sortable({
                animation: 350,
                easing: "cubic-bezier(0.42, 0, 0.58, 1.0)",
                handle: ".move-handle",
                onUpdate: function (evt) {
                    let newSortOrder = {};
                    $('.dashboard-block-movable').each(function() {
                        newSortOrder[$(this).index()] = $(this).data('id');
                    });
                },
                store: {
                    get: function (sortable) {
                        var order = localStorage.getItem("admin_dashboard_custom_order");
                        $('#sortable').removeClass("hidden");
                        barsResize();
                        return order ? order.split('|') : []; 
                    },
                    set: function (sortable) {
                        var order = sortable.toArray();
                        localStorage.setItem("admin_dashboard_custom_order", order.join('|'));
                    }
                }
            });


            $.ajax({
                type: "GET",
                url: "{{ route('admin.getfrutriNews') }}",
                dataType: "json",
                success: function (response) {
                    $('#frutriNews').html(response.data);
                }
            });

            $('body').on("click", ".frutriSingleNews", function(e) {
                var self = $(this).parents('.frutriSingleNewsBlock');

                var id = $(this).attr("data-id");
                var token = $('#token').val();

                $.ajax({
                    type: "POST",
                    url: "{{ route('admin.makefrutriNewsRead') }}",
                    data: { _token: token, id: id},
                    dataType: "json",
                    success: function (response) {
                        self.removeClass("newsNotRead").addClass("newsRead");

                        if (!response.was_already_read) {
                            var currentCount = $('#nonReadCounter').html();
                            currentCount = parseInt(currentCount);
                            if (currentCount > 1) {
                                $('#nonReadCounter').html(currentCount-1);
                            } else {
                                $('#nonReadCounter').remove();
                            }
                            console.log("here");
                            $('#frutriLatestNewsBlock').remove();
                        }
                    }
                });
            });
            
            $('body').on("click", ".closefrutriLatestNewsBlock", function(e) {
                $('#frutriLatestNewsBlock').remove();
                var id = $(this).attr("data-id");
                var token = $('#token').val();
                $.ajax({
                    type: "POST",
                    url: "{{ route('admin.makefrutriNewsRead') }}",
                    data: { _token: token, id: id},
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                    }
                });
            });
        }
    }

    $(function () {
        init();
    });

</script>
@endsection