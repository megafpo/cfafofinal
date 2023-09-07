@if(count($topStores) > 0)
@foreach($topStores as $topStore)
<div class="top-store px-0 py-2">
    @if($loop->first)
    <img src="{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/top-badge.svg"
        style="position: absolute; height: 3.2rem; right: 24px; top: 0px;">
    @endif

    <div class="d-flex justify-content-start">
        <div class="first-letter-icon custom-bg-{{ $loop->iteration + 1 }}">
            {{ $loop->iteration }}
        </div>
        <div class="ml-2">
            <span><strong>{{ $topStore->data->name }}</strong> @if($loop->first) 🎉 @endif</span>
            <br>
            <span class="small"><b>{{ config('setting.currencyFormat') }}{{ $topStore->revenue }}</b>
                revenue with {{ $topStore->sales_count }} orders
            </span>
        </div>
    </div>
</div>
@endforeach
@else
<div class="text-center">
    <i class="icon-exclamation" style="font-size: 2.5rem; margin-top: 12px; opacity: 0.1;"></i>
    <p class="text-muted mb-0">No data to show</p>
</div>
@endif