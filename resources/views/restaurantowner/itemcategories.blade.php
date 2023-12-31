@extends('admin.layouts.master')
@section("title") {{__('storeDashboard.mcpPageTitle')}}
@endsection
@section('content')
<div class="page-header">
    <div class="page-header-content header-elements-md-inline">
        <div class="page-title d-flex">
            <h4>
                <span class="font-weight-bold mr-2">{{ __('storeDashboard.total')}}</span>
                <i class="icon-circle-right2 mr-2"></i>
                <span class="font-weight-bold mr-2">{{ $count }}</span>
            </h4>
            <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
        </div>
        <div class="header-elements d-none py-0 mb-3 mb-md-0">
            <div class="breadcrumb">
                <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left"
                    data-toggle="modal" data-target="#addNewItemCategory">
                <b><i class="icon-plus2"></i></b>
                {{__('storeDashboard.mcpAddNewCatBtn')}}
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
                            <th>{{__('storeDashboard.mcpTableCatId')}}</th>
                            <th>{{__('storeDashboard.mcpTableName')}}</th>
                            <th>{{__('storeDashboard.mcpTableNOI')}}</th>
                            <th>{{__('storeDashboard.mcpTableStatus')}}</th>
                            <th>{{__('storeDashboard.mcpTableCA')}}</th>
                            <th class="text-center"><i class="
                                icon-circle-down2"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($itemCategories as $itemCategory)
                        <tr>
                            <td>{{ $itemCategory->id }}</td>
                            <td>{{ $itemCategory->name }}</td>
                            <td>{{ $itemCategory->items_count}}</td>
                            <td><span class="badge badge-flat border-grey-800 text-default text-capitalize">@if($itemCategory->is_enabled) {{ __('storeDashboard.mcpEnabled')}} @else {{ __('storeDashboard.mcpDisabled')}} @endif</span></td>
                            <td>{{ $itemCategory->created_at->diffForHumans() }}</td>
                            <td class="text-center">
                                <div class="btn-group btn-group-justified align-items-center">
                                    <a href="javascript:void(0)" data-toggle="modal" data-target="#editItemCategory" data-catid="{{ $itemCategory->id }}" data-catname="{{ $itemCategory->name }}" data-catimage="{{ $itemCategory->image }}"
                                            class="btn btn-sm btn-primary editItemCategory"> {{ __('storeDashboard.edit')}} </a>
                                   <div class="checkbox checkbox-switchery ml-1" style="padding-top: 0.8rem;">
                                       <label>
                                       <input value="true" type="checkbox" class="action-switch"
                                       @if($itemCategory->is_enabled) checked="checked" @endif data-id="{{ $itemCategory->id }}">
                                       </label>
                                   </div>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<div id="addNewItemCategory" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">{{__('storeDashboard.mcpModalTitle')}}</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('restaurant.createItemCategory') }}" method="POST" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">{{__('storeDashboard.mcpModalLabelName')}}:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="name"
                                placeholder="{{__('storeDashboard.mcpModalPlaceHolderName')}}" required>
                        </div>
                    </div>
                    <div class="form-group row">	
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Image:</label>	
                        <div class="col-lg-9">	
                            <img class="slider-preview-image hidden" />	
                            <div class="uploader">	
                                <input type="file" class="form-control-lg form-control-uniform" name="image" required	
                                    accept="image/x-png,image/gif,image/jpeg" onchange="readURL(this);">	
                                <span class="help-text text-muted">Image dimension 486x355</span>	
                            </div>	
                        </div>	
                    </div>
                    @csrf
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                        {{__('storeDashboard.save')}}
                        <i class="icon-database-insert ml-1"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div id="editItemCategory" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">{{ __('storeDashboard.editItemCategoryName') }}</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('restaurant.updateItemCategory') }}" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="id" id="itemCatId">
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">{{  __('storeDashboard.mcpModalLabelName')}}:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="name"
                                placeholder="{{ __('storeDashboard.mcpModalPlaceHolderName') }}" required id="itemCatName">
                        </div>
                    </div>
                    <div class="form-group row">	
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Image:</label>	
                        <div class="col-lg-9">	
                            <img alt="Image" width="160" style="border-radius: 0.275rem;" id="itemCatImage">	
                            <img class="slider-preview-image hidden" style="border-radius: 0.275rem;"/>	
                            <div class="uploader">	
                                <input type="hidden" name="old_image" id="old_image">	
                                <input type="file" class="form-control-lg form-control-uniform" name="image" required	
                                    accept="image/x-png,image/gif,image/jpeg" onchange="readURL(this);">	
                                <span class="help-text text-muted">Image dimension 486x355</span>	
                            </div>	
                        </div>	
                    </div>
                    @csrf
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                        {{ __('storeDashboard.save') }}
                        <i class="icon-database-insert ml-1"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
    var flagsUrl = '{{ URL::asset('/') }}'; 	
    console.log("LAGSURL",flagsUrl)	
    function readURL(input) {	
       if (input.files && input.files[0]) {	
           let reader = new FileReader();	
           reader.onload = function (e) {	
               $('.slider-preview-image')	
                   .removeClass('hidden')	
                   .attr('src', e.target.result)	
                   .width(120)	
                   .height(120);	
           };	
           reader.readAsDataURL(input.files[0]);	
       }	
    }
    $(function() {
        $('.editItemCategory').click(function(event) {
            $('#itemCatId').val($(this).data("catid"));
            $('#itemCatName').val($(this).data("catname"));
            $('#old_image').val($(this).data("catimage"));	
            $('#itemCatImage').attr("src",flagsUrl.replace("/public/","")+$(this).data("catimage"));
        });
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
            let url = "{{ url('/store-owner/itemcategory/disable/') }}/"+id;
            window.location.href = url;
         });
    });
</script>
@endsection