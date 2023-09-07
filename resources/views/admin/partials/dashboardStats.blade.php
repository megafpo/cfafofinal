<div class="col-6 col-xl-3 mb-2 mt-2">
    <div class="col-xl-12 dashboard-display p-3">
        <a class="block block-link-shadow text-left text-default" href="javascript:void(0)">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="dashboard-display-number">{{ $displaySales }}</div>
                    <div class="font-size-sm text-uppercase text-muted">Orders</div>
                </div>
                <div class="d-none d-sm-block">
                    <div class="dashboard-display-icon-block block-bg-1">
                        <i class="dashboard-display-icon icon-stats-growth2 color-purple"></i>
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
                    <div class="dashboard-display-number">{{ $displayUsers }}</div>
                    <div class="font-size-sm text-uppercase text-muted">Users</div>
                </div>
                <div class="d-none d-sm-block">
                    <div class="dashboard-display-icon-block block-bg-2">
                        <i class="dashboard-display-icon icon-users4 color-cyan"></i>
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
                    <div class="dashboard-display-number">{{ $displayRestaurants }}</div>
                    <div class="font-size-sm text-uppercase text-muted">Stores</div>
                </div>
                <div class="d-none d-sm-block">
                    <div class="dashboard-display-icon-block block-bg-3">
                        <i class="dashboard-display-icon icon-store2 color-red"></i>
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
                    <div class="dashboard-display-number" title="{{ $displayEarnings }}" data-popup="tooltip"
                        data-placement="bottom">{{ config('setting.currencyFormat') }}
                        {{ fancyNumberFormat($displayEarnings) }}</div>
                    <div class="font-size-sm text-uppercase text-muted">Earnings</div>
                </div>
                <div class="d-none d-sm-block">
                    <div class="dashboard-display-icon-block block-bg-4">
                        <i class="dashboard-display-icon icon-coin-dollar color-green"></i>
                    </div>
                </div>
            </div>
        </a>
    </div>
</div>