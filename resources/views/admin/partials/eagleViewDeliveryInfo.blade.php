<style>
    .deliveryGuyPhoto {
        width: 40px;
        border-radius: 4px;
        transition: 0.2s linear all;
    }

    .deliveryGuyPhoto:hover {
        transform: scale(2.5);
        box-shadow: 0 4px 8px -5px #000;
        transition: 0.2s linear all;
    }
</style>
<div class="card-body">
    <input type="hidden" id="selectedDeliveryGuyId" value="{{ $deliveryUser->id }}">
    <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-0"><strong>Delivery Guy Info</strong></h4>
        <div>
            <button type="button" id="refreshBlock" class="btn btn-md btn-default mr-1" data-popup="tooltip"
                title="Refresh delivery guy data" style="background-color: #ececec"><i
                    class="icon-database-refresh"></i></button>
            <a href="tel:{{ $deliveryUser->phone }}" class="btn btn-md btn-primary"><i class="icon-phone2"></i></a>
        </div>
    </div>

    <hr>
    <div class="d-flex justify-content-between align-items-center">
        <div class="font-weight-bold">
            @if(!empty($deliveryUser->delivery_guy_detail->photo))
            <img src="{{ substr(url('/'), 0, strrpos(url('/'), '/')) }}/assets/img/delivery/{{ $deliveryUser->delivery_guy_detail->photo }}"
                alt="delivery-photo" class="img-fluid deliveryGuyPhoto mr-1">
            @endif
            {{ $deliveryUser->name }}
            <span class="small font-weight-normal ml-1">
                <a href="{{ route('admin.get.editUser', $deliveryUser->id) }}" target="_blank">Edit</a>
            </span>
        </div>
        <div>
            @if($status)
            <span class="badge badge-success text-white">Online</span>
            @else
            <span class="badge badge-danger text-white">Offline</span>
            @endif
        </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between">
        <div class="small font-weight-bold">Cash in hand</div>
        <div class="small font-weight-bold">{{ config('setting.currencyFormat') }}{{ $cashInHand }} @if($cashLimit > 0)
            (out of
            {{ config('setting.currencyFormat') }}{{ $cashLimit }}) @endif</div>
    </div>
    <div class="d-flex justify-content-between">
        <div class="small font-weight-bold">Wallet balance <i class="icon-question3 ml-1 text-muted"
                data-popup="tooltip" title="This is the commission earned by {{ $deliveryUser->name }}"
                data-placement="top" style="font-size: 12px;"></i></div>
        <div class="small font-weight-bold">{{ config('setting.currencyFormat') }}{{ $walletBalance }}</div>
    </div>
    <hr>
    <div class="mt-2">
        <div class="d-flex justify-content-between">
            <div class="small font-weight-bold">Completed orders <span
                    class="text-muted font-weight-normal">(overall)</span>
            </div>
            <div class="small font-weight-bold">{{ $completedOrderCountOverall }}</div>
        </div>
        <div class="d-flex justify-content-between">
            <div class="small font-weight-bold">Non-completed orders </div>
            <div class="small font-weight-bold">{{ $nonCompleteOrderCount }}</div>
        </div>
        <div class="d-flex justify-content-between">
            <div class="small font-weight-bold">Completed orders <span
                    class="text-muted font-weight-normal">(today)</span> </div>
            <div class="small font-weight-bold">{{ $completedOrdersToday }}</div>
        </div>
    </div>
    <hr>
    <div class="mt-2 scrollable-ongoingOrders" style="overflow-y: scroll; max-height: 15rem;">
        @if(count($onGoingOrders) > 0)
        <div class="mb-2"><strong>Ongoing Orders</strong></div>

        @foreach($onGoingOrders as $onGoingOrder)
        <div class="eagleViewSingleOngoingOrder">
            <a href="{{ route('admin.viewOrder', $onGoingOrder->order->unique_order_id) }}" class="text-default"
                target="_blank">
                <div class="d-flex justify-content-between py-1">
                    <div class="small font-weight-regular">
                        <div>
                            <span><strong>#{{ substr($onGoingOrder->order->unique_order_id, -9) }}</strong></span>
                            <br>
                            <span class="small">{{ $onGoingOrder->order->restaurant->name }}</span>
                        </div>
                    </div>
                    <div class="small font-weight-bold">
                        {{ config('setting.currencyFormat') }}{{ $onGoingOrder->order->total }}
                    </div>
                </div>
            </a>
        </div>
        @endforeach

        @else
        <div><strong>No Ongoing Orders</strong></div>
        @endif
    </div>
</div>

<script>
    $(document).ready(function () {
      $('body').tooltip({selector: '[data-popup="tooltip"]'});
      $(".scrollable-ongoingOrders").overlayScrollbars({
          scrollbars : {
              visibility       : "auto",
              autoHide         : "leave",
              autoHideDelay    : 500
          }
      });
});

</script>