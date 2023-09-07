@extends('admin.layouts.master')
@section("title") Stores - Dashboard
@endsection
@section('content')
<style>
    .delivery-div {
        background-color: #fafafa;
        padding: 1rem;
    }

    .location-search-block {
        position: relative;
        top: -26rem;
        z-index: 999;
    }
</style>

<div class="content mt-3">
    <div class="d-flex justify-content-between my-2">
        <h3><strong>Stores Management</strong></h3>
        <div>
            <a href="{{ route('admin.sortStores') }}" class="btn btn-secondary btn-labeled btn-labeled-left mr-2">
                <b><i class="icon-sort"></i></b>
                Sort Stores
            </a>
            @if(!Request::is('admin/stores/pending-acceptance') && $pendingCount > 0)
            <a href="{{ route('admin.pendingAcceptance') }}"
                class="btn btn-secondary btn-labeled btn-labeled-left mr-2">
                <b><i class="icon-exclamation"></i></b>
                Pending Approval
                <span class="badge badge-warning"
                    style="position: absolute; top: -10px; right: -8px;"><b>{{ $pendingCount }}</b></span>
            </a>
            @endif
            @if(Request::is('admin/stores'))
            <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left mr-2" id="addNewRestaurant"
                data-toggle="modal" data-target="#addNewRestaurantModal">
                <b><i class="icon-plus2"></i></b>
                Add New Store
            </button>
            @role('Admin')
            <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left" id="addBulkRestaurant"
                data-toggle="modal" data-target="#addBulkRestaurantModal">
                <b><i class="icon-database-insert"></i></b>
                Bulk CSV Upload
            </button>
            @endrole
            @endif
            <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left" id="clearFilterAndState"> <b><i
                        class=" icon-reload-alt"></i></b> Reset All Filters</button>
        </div>
    </div>
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-datatable" id="storesDatatable" width="100%">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th class="text-left">Name</th>
                            <th class="text-left">Operational Areas</th>
                            <th class="text-left">Owner</th>
                            <th>Joined Date</th>
                            <th class="text-center"><i class="
                                icon-circle-down2"></i></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div id="addNewRestaurantModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">Add New Store</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('admin.saveNewRestaurant') }}" method="POST" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Store Name <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="name" placeholder="Store Name"
                                required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Description <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="description"
                                placeholder="Store Short Description" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Image <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <img class="slider-preview-image hidden" />
                            <div class="uploader">
                                <input type="file" class="form-control-lg form-control-uniform" name="image" required
                                    accept="image/x-png,image/gif,image/jpeg" onchange="readURL(this);">
                                <span class="help-text text-muted">Image dimension 160x117</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Default Rating <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg rating" name="rating"
                                placeholder="Rating from 1-5" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Approx Delivery
                            Time <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg delivery_time" name="delivery_time"
                                placeholder="Time in Minutes" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Approx Price for
                            Two <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg price_range" name="price_range"
                                placeholder="Approx Price for 2 People in {{ config('setting.currencyFormat') }}"
                                required>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Full Address <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="address"
                                placeholder="Full Address of Store" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label" data-popup="tooltip"
                            title="Pincode / Postcode / Zip Code" data-placement="bottom">Pincode</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="pincode"
                                placeholder="Pincode / Postcode / Zip Code of Store">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Land Mark:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="landmark"
                                placeholder="Any Near Landmark">
                        </div>
                    </div>

                    @if(config('setting.googleApiKeyNoRestriction') != null)
                    <fieldset class="gllpLatlonPicker">
                        <div width="100%" id="map" class="gllpMap" style="position: relative; overflow: hidden;"></div>
                        <div class="form-group row">
                            <div class="col-lg-6">
                                <label class="col-form-label">Latitude:</label><input type="text"
                                    class="form-control form-control-lg gllpLatitude latitude" value="40.6976701"
                                    name="latitude" placeholder="Latitude of the Store" required="required"
                                    readonly="readonly">
                            </div>
                            <div class="col-lg-6">
                                <label class="col-form-label">Longitude:</label><input type="text"
                                    class="form-control form-control-lg gllpLongitude longitude" value="-74.2598672"
                                    name="longitude" placeholder="Longitude of the Store" required="required"
                                    readonly="readonly">
                            </div>
                        </div>
                        <input type="hidden" class="gllpZoom" value="20">
                        <div class="d-flex justify-content-center">
                            <div class="col-lg-9 d-flex location-search-block">
                                <input type="text" class="form-control form-control-lg gllpSearchField"
                                    placeholder="Search for resraurant, city or town...">
                                <button type="button" class="btn btn-primary gllpSearchButton">Search</button>
                            </div>
                        </div>
                    </fieldset>
                    @else
                    <div class="form-group row">
                        <div class="col-lg-6">
                            <label class="col-form-label">Latitude <span class="text-danger">*</span></label><input
                                type="text" class="form-control form-control-lg gllpLatitude latitude"
                                value="40.6976701" name="latitude" placeholder="Latitude of the Store"
                                required="required">
                        </div>
                        <div class="col-lg-6">
                            <label class="col-form-label">Longitude <span class="text-danger">*</span></label><input
                                type="text" class="form-control form-control-lg gllpLongitude longitude"
                                value="-74.2598672" name="longitude" placeholder="Longitude of the Store"
                                required="required">
                        </div>
                    </div>
                    <span class="text-muted">You can use services like: <a href="https://www.mapcoordinates.net/en"
                            target="_blank">https://www.mapcoordinates.net/en</a></span>
                    <br>
                    <mark>You have not set <a href="{{ route('admin.settings', "#mapSettings") }}"
                            target="_blank">Google Map API Key (with no IP/HTTP Restriction)</a></mark><br>
                    <mark>Kindly configure that to access Google Maps to select Store's Geo Location
                        (Latitude/Longitude)</mark>
                    <br> If you enter an invalid Latitude/Longitude the map system might crash with a white screen.
                    @endif

                    <hr>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Certificate/License Code:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="certificate"
                                placeholder="Certificate Code or License Code">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Store Charge (Packing/Extra):</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg restaurant_charges"
                                name="restaurant_charges"
                                placeholder="Store Charge in {{ config('setting.currencyFormat') }}">
                        </div>
                    </div>
                    @if(config("setting.enSPU") == "true")
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Delivery Type <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <select class="form-control select-search" name="delivery_type" required>
                                <option value="1" class="text-capitalize">Delivery</option>
                                <option value="2" class="text-capitalize">Self Pickup</option>
                                <option value="3" class="text-capitalize">Both Delivery & Self Pickup</option>
                            </select>
                        </div>
                    </div>
                    @endif
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Delivery Radius in Km:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg delivery_radius"
                                name="delivery_radius"
                                placeholder="Delivery Radius in KM (If left blank, delivery radius will be set to 10 KM)">
                        </div>
                    </div>
                    <div class="delivery-div">
                        <div class="form-group row">
                            <label class="col-lg-3 col-form-label">Delivery Charge
                                Type <span class="text-danger">*</span></label>
                            <div class="col-lg-9">
                                <select class="form-control select-search" name="delivery_charge_type" required>
                                    <option value="FIXED" class="text-capitalize">Fixed Charge</option>
                                    <option value="DYNAMIC" class="text-capitalize">Dynamic Charge</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row" id="deliveryCharge">
                            <label class="col-lg-3 col-form-label">Delivery Charge:</label>
                            <div class="col-lg-9">
                                <input type="text" class="form-control form-control-lg delivery_charges"
                                    name="delivery_charges"
                                    placeholder="Delivery Charge in {{ config('setting.currencyFormat') }}">
                            </div>
                        </div>
                        <div id="dynamicChargeDiv" class="hidden">
                            <div class="form-group">
                                <div class="col-lg-12 row">
                                    <div class="col-lg-3">
                                        <label class="col-lg-12 col-form-label">Base Delivery Charge:</label>
                                        <input type="text" class="form-control form-control-lg base_delivery_charge"
                                            name="base_delivery_charge"
                                            placeholder="In {{ config('setting.currencyFormat') }}">
                                    </div>
                                    <div class="col-lg-3">
                                        <label class="col-lg-12 col-form-label">Base Delivery Distance:</label>
                                        <input type="text" class="form-control form-control-lg base_delivery_distance"
                                            name="base_delivery_distance" placeholder="In Kilometer (KM)">
                                    </div>
                                    <div class="col-lg-3">
                                        <label class="col-lg-12 col-form-label">Extra Delivery Charge:</label>
                                        <input type="text" class="form-control form-control-lg extra_delivery_charge"
                                            name="extra_delivery_charge"
                                            placeholder="In {{ config('setting.currencyFormat') }}">
                                    </div>
                                    <div class="col-lg-3">
                                        <label class="col-lg-12 col-form-label">Extra Delivery Distance:</label>
                                        <input type="text" class="form-control form-control-lg extra_delivery_distance"
                                            name="extra_delivery_distance" placeholder="In Kilometer (KM)">
                                    </div>
                                </div>
                                <p class="help-text mt-2 mb-0 text-muted"> Base delivery charges will be applied to the
                                    base delivery distance. And for every extra delivery distance, extra delivery charge
                                    will be applied.</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                    </div>		
                            </div>		
                        </div>		
                        <div class="form-group">		
                            <div class="col-lg-12 row">		
                                <div class="col-lg-4">		
                                    <label class="col-lg-12 col-form-label">Time Slot 3 (From-To):</label>		
                                </div>		
                                <div class="col-lg-3">		
                                    <input type="time" class="form-control form-control-lg" name="fromtime3"		
                                    placeholder="From">		
                                </div>		
                                <div class="col-lg-3">		
                                    <input type="time" class="form-control form-control-lg" name="totime3"		
                                    placeholder="To">		
                                </div>		
                                <div class="col-lg-2">		
                                    <div class="checkbox checkbox-switchery mt-2">		
                                        <label>		
                                        <input value="true" type="checkbox" class="switchery-primary" checked="checked" name="enable_timeslot3">		
                                        </label>		
                                    </div>		
                                </div>		
                            </div>		
                        </div>		
                        <div class="form-group">		
                            <div class="col-lg-12 row">		
                                <div class="col-lg-4">		
                                    <label class="col-lg-12 col-form-label">Same Day Time Slot (From-To):</label>		
                                </div>		
                                <div class="col-lg-3">		
                                    <input type="time" class="form-control form-control-lg" name="fromtime4"		
                                    placeholder="From">		
                                </div>		
                                <div class="col-lg-3">		
                                    <input type="time" class="form-control form-control-lg" name="totime4"		
                                    placeholder="From">		
                                </div>		
                                <div class="col-lg-2">		
                                    <div class="checkbox checkbox-switchery mt-2">		
                                        <label>		
                                        <input value="true" type="checkbox" class="switchery-primary" checked="checked" name="enable_same_day_timeslot">		
                                        </label>		
                                    </div>		
                                </div>		
                            </div>		
                        </div>		
                        <div class="form-group">		
                            <div class="col-lg-12 row">		
                                <div class="col-lg-4">		
                                    <label class="col-lg-12 col-form-label">Delivery Limit:</label>		
                                </div>		
                                <div class="col-lg-6">		
                                    <input type="text" class="form-control form-control-lg delivery_limit" name="delivery_limit"		
                                    placeholder="50">		
                                </div>		
                            </div>		
                        </div>		
                    </div>		
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Is Pure Veg?</label>
                        <div class="col-lg-9">
                            <div class="checkbox checkbox-switchery mt-2">
                                <label>
                                    <input value="true" type="checkbox" class="switchery-primary" checked="checked"
                                        name="is_pureveg">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Is Featured?</label>
                        <div class="col-lg-9">
                            <div class="checkbox checkbox-switchery mt-2">
                                <label>
                                    <input value="true" type="checkbox" class="switchery-primary" name="is_featured">
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Min Order Price <i class="icon-question3 ml-1"
                                data-popup="tooltip" title="Set the value as 0 if not required"
                                data-placement="top"></i></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg min_order_price"
                                name="min_order_price"
                                placeholder="Min Cart Value before discount and tax {{ config('setting.currencyFormat') }}"
                                value="0" required="required">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Commission Rate
                            % <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg commission_rate"
                                name="commission_rate" placeholder="Commission Rate %" required value="0.00">
                        </div>
                    </div>

                    @if(count($zones) > 0)
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Zone</label>
                        <div class="col-lg-9">
                            <select name="zone_id" class="select-zone" required>
                                @foreach($zones as $zone)
                                <option value="{{ $zone->id }}">{{ $zone->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <hr>
                    @endif

                    @csrf
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            Save Store
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</div>
<div id="addBulkRestaurantModal" class="modal fade mt-5" tabindex="-1">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">CSV Bulk Upload for Stores</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('admin.restaurantBulkUpload') }}" method="POST" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="col-lg-2 col-form-label">CSV File: </label>
                        <div class="col-lg-10">
                            <div class="uploader">
                                <input type="file" accept=".csv" name="restaurant_csv"
                                    class="form-control-uniform form-control-lg" required>
                            </div>
                        </div>
                    </div>
                    <div class="text-left">
                        <button type="button" class="btn btn-primary" id="downloadSampleRestaurantCsv">
                            Download Sample CSV
                            <i class="icon-file-download ml-1"></i>
                        </button>
                    </div>
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            Upload
                            <i class="icon-database-insert ml-1"></i>
                        </button>
                    </div>
                    @csrf
                </form>
            </div>
        </div>
    </div>
</div>
<script>
    function readURL(input) {
       if (input.files && input.files[0]) {
           let reader = new FileReader();
           reader.onload = function (e) {
               $('.slider-preview-image')
                   .removeClass('hidden')
                   .attr('src', e.target.result)
                   .width(160)
                   .height(117)
                   .css('borderRadius', '0.275rem');
           };
           reader.readAsDataURL(input.files[0]);
       }
    }
    
    $(document).ready(function() {
        $('body').tooltip({selector: '[data-popup="tooltip"]'});
         var datatable = $('#storesDatatable').DataTable({
            searchDelay: 1000,
            processing: true,
            serverSide: true,
            stateSave: true,
            lengthMenu: [ 10, 25, 50, 100, 200, 500 ],
            order: [[ 0, "desc" ]],
            ajax: '{{ route('admin.storesDatatable') }}{{ Request::is('admin/stores/pending-acceptance') ? "?pending=true" : "?pending=false" }}',
            columns: [
                {data: 'id', visible: false, searchable: false, sortable: false},
                {data: 'image', searchable: false, sortable: false},
                {data: 'name', sortable: true},
                {data: 'areas', searchable: false, sortable: false },
                {data: 'owner', searchable: false, sortable: true},
                {data: 'created_at', searchable: true, sortable: true},
                {data: 'action', sortable: false, searchable: false, sortable: false},
            ],
            colReorder: false,
            drawCallback: function( settings ) {
                // $('select').select2({
                //    minimumResultsForSearch: Infinity,
                //    width: 'auto'
                // });
                var elems = Array.prototype.slice.call(document.querySelectorAll('.action-switch'));
                elems.forEach(function(html) {
                    var switchery = new Switchery(html, { color: '#02b875' });
                });
            },
            scrollX: true,
            scrollCollapse: true,
            dom: '<"custom-processing-banner"r>flBtip',
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search with anything...',
                sEmptyTable: "No data found",
                lengthMenu: '_MENU_',
                paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' },
                processing: '<i class="icon-spinner2 spinner position-left mr-1"></i>Please wait...'
            },
           buttons: {
                   dom: {
                       button: {
                           className: 'btn btn-default'
                       }
                   },
                   buttons: [
                       {extend: 'csv', filename: 'stores-'+ new Date().toISOString().slice(0,10), text: 'Export as CSV'},
                   ]
               }
        });
    
         $('#clearFilterAndState').click(function(event) {
            if (datatable) {
                datatable.state.clear();
                window.location.reload();
            }
         });
        
        $('.form-control-uniform').uniform();
        
        $('#downloadSampleRestaurantCsv').click(function(event) {
            event.preventDefault();
            window.location.href = "{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/docs/restaurants-sample-csv.csv";
        });
         
         $('.rating').numeric({allowThouSep:false,  min: 1, max: 5, maxDecimalPlaces: 1 });
         $('.delivery_time').numeric({allowThouSep:false});
         $('.price_range').numeric({allowThouSep:false});
         $('.latitude').numeric({allowThouSep:false});
         $('.longitude').numeric({allowThouSep:false});
         $('.restaurant_charges').numeric({ allowThouSep:false, maxDecimalPlaces: 2, allowMinus: false });
         $('.delivery_charges').numeric({ allowThouSep:false, maxDecimalPlaces: 2, allowMinus: false });
         $('.commission_rate').numeric({ allowThouSep:false, maxDecimalPlaces: 2, max: 100, allowMinus: false });
        
        $('.delivery_radius').numeric({ allowThouSep:false, maxDecimalPlaces: 2, allowMinus: false });
        
        $('.base_delivery_charge').numeric({ allowThouSep:false, maxDecimalPlaces: 2, allowMinus: false });
        $('.base_delivery_distance').numeric({ allowThouSep:false, maxDecimalPlaces: 0, allowMinus: false });
        $('.extra_delivery_charge').numeric({ allowThouSep:false, maxDecimalPlaces: 2, allowMinus: false });
        $('.extra_delivery_distance').numeric({ allowThouSep:false, maxDecimalPlaces: 0, allowMinus: false });

        $('.min_order_price').numeric({ allowThouSep:false, maxDecimalPlaces: 2, allowMinus: false });
        
    
         $("[name='delivery_charge_type']").change(function(event) {
             if ($(this).val() == "FIXED") {
                 $("[name='base_delivery_charge']").val(null);
                 $("[name='base_delivery_distance']").val(null);
                 $("[name='extra_delivery_charge']").val(null);
                 $("[name='extra_delivery_distance']").val(null);
                 $('#dynamicChargeDiv').addClass('hidden');
                 $('#deliveryCharge').removeClass('hidden')
             } else {
                 $("[name='delivery_charges']").val(null);
                 $('#deliveryCharge').addClass('hidden');
                 $('#dynamicChargeDiv').removeClass('hidden')
             }
         });
        
         $('body').on("click", ".action-switch", function(e) {
            let id = $(this).attr("data-id")
            let url = "{{ url('/admin/store/disable/') }}/"+id;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
            })
            .done(function(data) {
                if (data.success) {
                    $.jGrowl("", {
                        position: 'bottom-center',
                        header: 'Operation Successful ✅',
                        theme: 'bg-success',
                        life: '1800'
                    }); 
                }
                hideLoading();
            })
            .fail(function() {
                console.log("error");
                hideLoading();
            })
        });
        
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

        //Switch Action Function
        if (Array.prototype.forEach) {
               var elems = Array.prototype.slice.call(document.querySelectorAll('.action-switch'));
               elems.forEach(function(html) {
                   var switchery = new Switchery(html, { color: '#8360c3' });
               });
           }
           else {
               var elems = document.querySelectorAll('.action-switch');
               for (var i = 0; i < elems.length; i++) {
                   var switchery = new Switchery(elems[i], { color: '#8360c3' });
               }
           }

         $('.action-switch').click(function(event) {
            let id = $(this).attr("data-id")
            let url = "{{ url('/admin/store/disable/') }}/"+id;
            window.location.href = url;
         });
         $('.select-zone').select2();
         $(function () {		
            $('input[name="delivery_time_slot"]').click(function() {		
                var inputValue = $(this).attr("value");		
                $("#" + inputValue).toggle();		
            });		
         });
    });
    
</script>
@endsection