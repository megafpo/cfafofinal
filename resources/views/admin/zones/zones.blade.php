@extends('admin.layouts.master')
@section("title") Zones Management
@endsection
@section('content')
<div class="page-header">
    <div class="page-header-content header-elements-md-inline">
        <div class="page-title d-flex">
            <h4>
                <span class="font-weight-bold mr-2">TOTAL</span>
                <i class="icon-circle-right2 mr-2"></i>
                <span class="font-weight-bold mr-2">{{ count($zones) }} Zones</span>
            </h4>
            <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
        </div>
        <div class="header-elements d-none py-0 mb-3 mb-md-0">
            <div class="breadcrumb">
                <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left mr-2" id="addNewZone"
                    data-toggle="modal" data-target="#addNewZoneModal">
                    <b><i class="icon-plus2"></i></b>
                    Add New Zone
                </button>
            </div>
        </div>
    </div>
</div>

<div class="content">
    <div class="card">
        <div class="card-body">
            @if($zones->count() > 0)
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>No. of Stores</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th class="text-center"><i class="
                                icon-circle-down2"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($zones as $zone)
                        <tr>
                            <td>{{ $zone->name }}</td>
                            <td class="small">{{ $zone->description }}</td>
                            <td>{{ $zone->restaurants_count }}</td>
                            <td class="small">{{ properDateFormat($zone->created_at) }}</td>
                            <td class="small">{{ properDateFormatTime($zone->updated_at) }}</td>
                            <td>
                                <div class="d-flex justify-content-center">
                                    <a href="{{ route('admin.editZone', $zone->id) }}" class="btn btn-sm btn-primary">
                                        Edit Zone</a>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @else
            <p class="mb-0 text-muted"><b class="mr-1">No zones found</b> <a href="javascript:void(0)"
                    data-toggle="modal" data-target="#addNewZoneModal"><b>Add Zone</b></a></p>
            @endif
        </div>
    </div>
</div>


<div id="addNewZoneModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">Add New Zone</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('admin.saveNewZone') }}" method="POST" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="col-lg-2 col-form-label">Name:</label>
                        <div class="col-lg-10">
                            <input type="text" name="name" class="form-control form-control-lg" placeholder="Zone name"
                                required autocomplete="new-name">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-2 col-form-label">Description:</label>
                        <div class="col-lg-10">
                            <input type="text" name="description" class="form-control form-control-lg"
                                placeholder="Short description (optional)">
                        </div>
                    </div>
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            Save Zone
                        </button>
                    </div>
                    @csrf
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $('.select').select2(); 

    $('#dynamic_select_store').on('change', function () {
        var url = $(this).val();
        if (url) {
            window.location = url;
        }
        return false;
    });
</script>
@endsection