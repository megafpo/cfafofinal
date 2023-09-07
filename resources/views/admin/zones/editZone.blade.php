@extends('admin.layouts.master')
@section("title") Zones Management
@endsection
@section('content')
<div class="page-header">
    <div class="page-header-content header-elements-md-inline">
        <div class="page-title d-flex">
            <h4>
                <span class="font-weight-bold mr-2">Editing</span>
                <i class="icon-circle-right2 mr-2"></i>
                <span class="font-weight-bold mr-2">{{ $zone->name }}</span>
            </h4>
            <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
        </div>
        <div class="header-elements d-none py-0 mb-3 mb-md-0">
            <div class="breadcrumb">

            </div>
        </div>
    </div>
</div>


<div class="content">
    <div class="col-md-8">
        <div class="card">
            <div class="card-body">
                <form action="{{ route('admin.updateZone') }}" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="id" value="{{ $zone->id }}">
                    <div class="form-group row">
                        <label class="col-lg-2 col-form-label">Name:</label>
                        <div class="col-lg-10">
                            <input type="text" name="name" class="form-control form-control-lg" placeholder="Zone name"
                                required value="{{ $zone->name }}">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-2 col-form-label">Description:</label>
                        <div class="col-lg-10">
                            <input type="text" name="description" class="form-control form-control-lg"
                                placeholder="Zone description" required value="{{ $zone->description }}">
                        </div>
                    </div>
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            Update Zone
                        </button>
                    </div>
                    @csrf
                </form>
            </div>
        </div>
    </div>
</div>

@endsection