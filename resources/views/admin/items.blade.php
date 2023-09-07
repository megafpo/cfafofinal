@extends('admin.layouts.master')
@section("title") Items - Dashboard
@endsection
@section('content')

<style>
    .item-active {
        background-color: #2ebf91;
    }

    .item-inactive {
        background-color: #f44336;
    }
</style>

<div class="content mt-3">
    <div class="d-flex justify-content-between my-2">
        <h3><strong>Items Management</strong></h3>
        <div>
            <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left mr-2" id="addNewItem"
                data-toggle="modal" data-target="#addNewItemModal">
                <b><i class="icon-plus2"></i></b>
                Add New Item
            </button>
            @role('Admin')
            <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left" id="addBulkItem"
                data-toggle="modal" data-target="#addBulkItemModal">
                <b><i class="icon-database-insert"></i></b>
                Bulk CSV Upload
            </button>
            @endrole
            <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left" id="clearFilterAndState"> <b><i
                        class=" icon-reload-alt"></i></b> Reset All Filters</button>
        </div>
    </div>
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-datatable" id="itemsDatatable" width="100%">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th class="text-left">Name</th>
                            <th class="text-left">Item Store</th>
                            <th class="text-left">Item Category</th>
                            <th>Price</th>
                            <th>Attributes</th>
                            <th>Created Date</th>
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

<div id="addNewItemModal" class="modal fade">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">Add New Item</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('admin.saveNewItem') }}" method="POST" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Item Name:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="name" placeholder="Item Name"
                                required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Item Description</label>
                        <div class="col-lg-9">
                            <textarea class="summernote-editor" name="desc" placeholder="Item Description"
                                rows="6"></textarea>
                        </div>
                    </div>

                    <div class="form-group row" style="display: none;" id="discountedTwoPrice">
                        <div class="col-lg-6">
                            <label class="col-form-label">Mark Price: <i class="icon-question3 ml-1"
                                    data-popup="tooltip" title="Make this filed empty or zero if not required"
                                    data-placement="top"></i></label>
                            <input type="text" class="form-control form-control-lg price" name="old_price"
                                placeholder="Item Price in {{ config('setting.currencyFormat') }}">
                        </div>
                        <div class="col-lg-6">
                            <label class="col-form-label"><span class="text-danger">*</span>Selling Price:</label>
                            <input type="text" class="form-control form-control-lg price" name="price"
                                placeholder="Item Price in {{ config('setting.currencyFormat') }}" id="newSP">
                        </div>
                    </div>
                    <div class="form-group row" id="singlePrice">
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Price:</label>
                        <div class="col-lg-6">
                            <input type="text" class="form-control form-control-lg price" name="price"
                                placeholder="Item Price in {{ config('setting.currencyFormat') }}" required id="oldSP">
                        </div>
                        <div class="col-lg-3">
                            <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left mr-2"
                                id="addDiscountedPrice">
                                <b><i class="icon-percent"></i></b>
                                Add Dicounted Price
                            </button>
                        </div>
                    </div>
                    <script>
                        $('#addDiscountedPrice').click(function(event) {
                            let price = $('#oldSP').val();
                            $('#newSP').val(price).attr('required', 'required');;
                            $('#singlePrice').remove();
                            $('#discountedTwoPrice').show();
                        });
                    </script>

                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Item's
                            Store:</label>
                        <div class="col-lg-9">
                            <select class="form-control select" name="restaurant_id" required>
                                @foreach ($restaurants as $restaurant)
                                <option value="{{ $restaurant->id }}" class="text-capitalize">{{ $restaurant->name }}
                                </option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Item's
                            Category:</label>
                        <div class="col-lg-9">
                            <select class="form-control select" name="item_category_id" required>
                                @foreach ($itemCategories as $itemCategory)
                                <option value="{{ $itemCategory->id }}" class="text-capitalize">
                                    {{ $itemCategory->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Addons Category:</label>
                        <div class="col-lg-9">
                            <select multiple="multiple" class="form-control select" data-fouc
                                name="addon_category_item[]">
                                @foreach($addonCategories as $addonCategory)
                                <option value="{{ $addonCategory->id }}" class="text-capitalize">
                                    {{ $addonCategory->name }} @if($addonCategory->description != null)->
                                    {{ $addonCategory->description }} @endif</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Image:</label>
                        <div class="col-lg-9">
                            <img class="slider-preview-image hidden" />
                            <div class="uploader">
                                <input type="file" class="form-control-lg form-control-uniform" name="image"
                                    accept="image/x-png,image/gif,image/jpeg" onchange="readURL(this);">
                                <span class="help-text text-muted">Image dimension 486x355</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Is Recommended?</label>
                        <div class="col-lg-9">
                            <div class="checkbox checkbox-switchery mt-2">
                                <label>
                                    <input value="true" type="checkbox" class="switchery-primary recommendeditem"
                                        name="is_recommended">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Is Popular?</label>
                        <div class="col-lg-9">
                            <div class="checkbox checkbox-switchery mt-2">
                                <label>
                                    <input value="true" type="checkbox" class="switchery-primary popularitem"
                                        name="is_popular">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Is New?</label>
                        <div class="col-lg-9">
                            <div class="checkbox checkbox-switchery mt-2">
                                <label>
                                    <input value="true" type="checkbox" class="switchery-primary newitem"
                                        checked="checked" name="is_new">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label display-block">Veg/Non-Veg: </label>
                        <div class="col-lg-9 d-flex align-items-center">
                            <label class="radio-inline mr-2">
                                <input type="radio" name="is_veg" value="veg">
                                Veg
                            </label>

                            <label class="radio-inline mr-2">
                                <input type="radio" name="is_veg" value="nonveg">
                                Non-Veg
                            </label>

                            <label class="radio-inline mr-2">
                                <input type="radio" name="is_veg" value="none" checked="checked">
                                None
                            </label>
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
<div id="addBulkItemModal" class="modal fade mt-5" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">CSV Bulk Upload for Items</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('admin.itemBulkUpload') }}" method="POST" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="col-lg-2 col-form-label">CSV File: </label>
                        <div class="col-lg-10">
                            <div class="uploader">
                                <input type="file" accept=".csv" name="item_csv"
                                    class="form-control-uniform form-control-lg" required>
                            </div>
                        </div>
                    </div>
                    <div class="text-left">
                        <button type="button" class="btn btn-primary" id="downloadSampleItemCsv">
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
                   .width(120)
                   .height(120);
           };
           reader.readAsDataURL(input.files[0]);
       }
    }

    $(function() {
        $('body').tooltip({selector: '[data-popup="tooltip"]'});

        var datatable = $('#itemsDatatable').DataTable({
            searchDelay: 1000,
            processing: true,
            serverSide: true,
            stateSave: true,
            lengthMenu: [ 10, 25, 50, 100, 200, 500 ],
            order: [[ 0, "desc" ]],
            ajax: '{{ route('admin.adminItemsDatatable') }}@if($store_id != null)?store_id={{ $store_id }}@endif',
            columns: [
                {data: 'id', visible: false, searchable: false},
                {data: 'image', searchable: false, sortable: false},
                {data: 'name', searchable: true, sortable: true},
                {data: 'restaurant_name', searchable: false, sortable: false, name: "restaurant.name"},
                {data: 'category_name', searchable: false, sortable: false, name: "item_category.name"},
                {data: 'price', searchable: true},
                {data: 'attributes', searchable: false, sortable: false,},
                {data: 'created_at', searchable: true},
                {data: 'action', sortable: false, searchable: false, reorder: false},
            ],
            fixedColumns: {
                leftColumns: 0,
                rightColumns: 1
            },
            colReorder: false,
            drawCallback: function(settings) {
                // $('select').select2({
                //    minimumResultsForSearch: Infinity,
                //    width: 'auto'
                // });
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
                       {extend: 'csv', filename: 'items-'+ new Date().toISOString().slice(0,10), text: 'Export as CSV'},
                   ]
               }
        });
    
         $('#clearFilterAndState').click(function(event) {
            if (datatable) {
                datatable.state.clear();
                window.location.reload();
            }
         });

        $('.summernote-editor').summernote({
                   height: 200,
                   popover: {
                       image: [],
                       link: [],
                       air: []
                     }
            });
        
       $('.select').select2();
    
       var recommendeditem = document.querySelector('.recommendeditem');
       new Switchery(recommendeditem, { color: '#f44336' });
    
       var popularitem = document.querySelector('.popularitem');
       new Switchery(popularitem, { color: '#8360c3' });
    
       var newitem = document.querySelector('.newitem');
       new Switchery(newitem, { color: '#333' });

       
       $('.form-control-uniform').uniform();
       
        $('#downloadSampleItemCsv').click(function(event) {
           event.preventDefault();
           window.location.href = "{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/docs/items-sample-csv.csv";
       });
        
         $('.price').numeric({allowThouSep:false, maxDecimalPlaces: 2 });
 

          $('body').on("click", ".itemAction", function(e) {
             let id = $(this).attr("data-id")
             let url = "{{ url('/admin/item/disable/') }}/"+id;
             let self = $(this);
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'JSON',
            })
            .done(function(data) {
                if (data.currentStatus) {
                    $.jGrowl("Item Enabled", {
                        position: 'bottom-center',
                        header: "",
                        theme: 'bg-success',
                        life: '1800'
                    }); 
                } else {
                    $.jGrowl("Item Disabled", {
                        position: 'bottom-center',
                        header: "",
                        theme: 'bg-danger',
                        life: '1800'
                    }); 
                }
                
                if(self.hasClass("item-inactive")) {
                    self.removeClass("item-inactive").addClass("item-active");
                } else {
                    self.removeClass("item-active").addClass('item-inactive');
                }
            })
            .fail(function(data) {
                $.jGrowl("", {
                    position: 'bottom-center',
                    header: 'Something went wrong, please try again.',
                    theme: 'bg-danger',
                    life: '1800'
                }); 
            })            
          });
    });
</script>
@endsection