@extends('admin.layouts.master')
@section("title") Popular Geo Locations - Dashboard
@endsection
@section('content')
<style>
    .location-search-block {
        position: relative;
        top: -26rem;
        z-index: 999;
    }

    .btn-success:hover {
        color: #fff;
        background-color: #4caf50;
    }

    .cursor-disabled {
        cursor: not-allowed;
    }
</style>

<div class="page-header">
    <div class="page-header-content header-elements-md-inline">
        <div class="page-title d-flex">
            <h4>
                <span class="font-weight-bold mr-2">Total</span>
                <i class="icon-circle-right2 mr-2"></i>
                <span class="font-weight-bold mr-2">{{ $count }}</span>
            </h4>
            <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
        </div>
        <div class="header-elements d-none py-0 mb-3 mb-md-0">
            <div class="breadcrumb">
                <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left mr-2" id="addNewLocation"
                    data-toggle="modal" data-target="#addNewLocationModal">
                    <b><i class="icon-plus2"></i></b>
                    Add New Location
                </button>
            </div>
        </div>
    </div>
</div>
<div class="content">
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Status</th>
                            <th class="text-center" style="width: 10%;"><i class="
                                icon-circle-down2"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($locations as $location)
                        <tr>
                            <td>{{ $location->name }}</td>
                            <td>{{ $location->latitude }}</td>
                            <td>{{ $location->longitude }}</td>
                            <td>
                                @if($location->is_active)
                                <span class="badge badge-flat border-grey-800 text-primary text-capitalize mr-1">
                                    Active
                                </span>
                                @else
                                <span class="badge badge-flat border-grey-800 text-default text-capitalize mr-1">
                                    In Active
                                </span>
                                @endif
                                @if($location->is_default)
                                <span class="badge badge-flat bg-success text-white text-capitalize"> DEFAULT </span>
                                @endif
                            </td>
                            <td class="text-center">
                                <div class="btn-group btn-group-justified">
                                    @if(!$location->is_default)
                                    @if($location->is_active)
                                    <a href="@if($location->is_default) javascript:void(0) @else {{ route('admin.makeDefaultLocation', $location->id) }} @endif"
                                        class="btn btn-sm btn-dark ml-1" data-popup="tooltip" title="Make
                                        {{ $location->name }} as Primary Location" data-placement="bottom"> <i
                                            class="icon-checkmark4"></i> </a>

                                    <a href="{{ route('admin.disablePopularGeoLocation', $location->id) }}"
                                        class="btn btn-sm btn-primary ml-1" data-popup="tooltip"
                                        title="Disable Location" data-placement="bottom"> <i class="icon-switch2"></i>
                                    </a>
                                    @else
                                    <a href="{{ route('admin.disablePopularGeoLocation', $location->id) }}"
                                        class="btn btn-sm btn-danger ml-1" data-popup="tooltip" title="Enable Location"
                                        data-placement="bottom"> <i class="icon-switch2"></i> </a>
                                    @endif

                                    <a href="{{ route('admin.deletePopularGeoLocation', $location->id) }}"
                                        class="btn btn-sm btn-danger ml-1 doubleClickDelete" data-popup="tooltip"
                                        title="Double click to delete {{ $location->name }}" data-placement="bottom"> <i
                                            class="icon-trash"></i> </a>
                                    @endif
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                <div class="mt-3">
                    {{ $locations->links() }}
                </div>
            </div>
        </div>
    </div>
</div>
<div id="addNewLocationModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">Add New Geo Location</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('admin.saveNewPopularGeoLocation') }}" method="POST"
                    enctype="multipart/form-data" id="geoLocationForm">
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Location Name:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="name"
                                placeholder="Location Name" required id="nameKey">
                        </div>
                    </div>

                    @if(config('setting.googleApiKeyNoRestriction') != null)
                    <fieldset class="gllpLatlonPicker">
                        <div width="100%" id="map" class="gllpMap" style="position: relative; overflow: hidden;"></div>
                        <div class="mt-3">
                            <div class="form-group row">
                                <label class="col-lg-3 col-form-label">Latitude:</label>
                                <div class="col-lg-9">
                                    <input type="text" class="form-control form-control-lg gllpLatitude latitude"
                                        name="latitude" placeholder="Latitude of the place" required="required"
                                        readonly="readonly">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-lg-3 col-form-label">Longitude:</label>
                                <div class="col-lg-9">
                                    <input type="text" class="form-control form-control-lg gllpLongitude longitude"
                                        name="longitude" placeholder="Longitude of the place" required="required"
                                        readonly="readonly">
                                </div>
                            </div>
                        </div>

                        <input type="hidden" class="gllpZoom" value="20">
                        <div class="d-flex justify-content-center">
                            <div class="col-lg-9 d-flex location-search-block">
                                <input type="text" class="form-control form-control-lg gllpSearchField"
                                    placeholder="Search for city, town or country">
                                <button type="button" class="btn btn-primary gllpSearchButton">Search</button>
                            </div>
                        </div>
                    </fieldset>
                    @else
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Latitude:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg gllpLatitude latitude"
                                name="latitude" placeholder="Latitude of the place" required="required">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Longitude:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg gllpLongitude longitude"
                                name="longitude" placeholder="Longitude of the place" required="required">
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

                    <div class="form-group row mt-3">
                        <label class="col-lg-3 col-form-label">Is Active?</label>
                        <div class="col-lg-9">
                            <div class="checkbox checkbox-switchery mt-2">
                                <label>
                                    <input value="true" type="checkbox" class="switchery-primary" name="is_active"
                                        checked="checked">
                                </label>
                            </div>
                        </div>
                    </div>
                    @csrf
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            SAVE
                            <i class="icon-database-insert ml-1"></i></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
    $(function() {
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
            
        $('#nameKey').bind('keydown', function(e) {
            if (e.keyCode == 13) {
                e.preventDefault();
            }
        });
        $('.gllpSearchField').bind('keydown', function(e) {
            if (e.keyCode == 13) {
                e.preventDefault();
            }
        });
        
        $('.doubleClickDelete').click(function() {
            return false;
        }).dblclick(function() {
            window.location = this.href;
            return false;
        });
    });
</script>
@endsection