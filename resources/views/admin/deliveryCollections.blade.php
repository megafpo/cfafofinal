@extends('admin.layouts.master')
@section("title") Delivery Collections - Dashboard
@endsection
@section('content')
<div class="content mt-3">
    <div class="d-flex justify-content-between my-2">
        <h3><strong>Delivery Collection</strong></h3>
        <div>
            <button type="button" class="btn btn-secondary btn-labeled btn-labeled-left" id="clearFilterAndState"> <b><i
                        class=" icon-reload-alt"></i></b> Reset All Filters</button>
        </div>
    </div>
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-datatable" id="deliveryCollectionDatatable" width="100%">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th class="text-left">Delivery Guy Name</th>
                            <th>Phone</th>
                            <th>Cash in Hand</th>
                            <th class="text-center"><i class="
                                icon-circle-down2"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div id="collectCashModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <span class="font-weight-bold"><u>Name: <span id="modalDeliveryName"></span></u></span>
                    <br>
                    <span>Cash in Hand: {{ config('setting.currencyFormat') }}
                        <span id="modalDeliveryCashInHand"></span></span>
                </h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="" method="POST" enctype="multipart/form-data" id="modalFormActionUrl">
                    <input type="hidden" name="delivery_collection_id" id="modalDeliveryCollectionId" value="">
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Collection Type:</label>
                        <div class="col-lg-9">
                            <select class="form-control form-control-lg amountType" name="type">
                                <option value="FULL">Full Amount</option>
                                <option value="CUSTOM">Partial Amount</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row hidden customAmountDiv">
                        <label class="col-lg-3 col-form-label">Amount:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg custom_amount" name="custom_amount"
                                placeholder="Enter the amount in {{ config('setting.currencyFormat') }}"
                                id="modalCustomAmount">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-lg-3 col-form-label">Message:</label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control form-control-lg" name="message"
                                placeholder="Message or Description" id="modalCollectionMessage">
                        </div>
                    </div>
                    @csrf
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            Collect
                            <i class="icon-cash3 ml-1"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(function() {
        $('body').tooltip({selector: '[data-popup="tooltip"]'});
         var datatable = $('#deliveryCollectionDatatable').DataTable({
            searchDelay: 1000,
            processing: true,
            serverSide: true,
            stateSave: true,
            lengthMenu: [ 10, 25, 50, 100, 200, 500 ],
            order: [[ 0, "desc" ]],
            ajax: '{{ route('admin.deliveryCollectionDatatable') }}',
            columns: [
                {data: 'id', visible: false, searchable: false},
                {data: 'name', sortable: false,  searchable: true,name: "user.name"},
                {data: 'phone', sortable: false, searchable: true, name: "user.phone"},
                {data: 'amount',  sortable: false, searchable: false},
                {data: 'action', sortable: true,  searchable: false},
            ],
            colReorder: false,
            drawCallback: function( settings ) {
                $('select').select2({
                   minimumResultsForSearch: Infinity,
                   width: 'auto'
                });
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
                       {extend: 'csv', filename: 'cash-collections-'+ new Date().toISOString().slice(0,10), text: 'Export as CSV'},
                   ]
               }
        });
    
         $('#clearFilterAndState').click(function(event) {
            if (datatable) {
                datatable.state.clear();
                window.location.reload();
            }
         });

        $('.custom_amount').numeric({ allowThouSep:false, maxDecimalPlaces: 2, allowMinus: false });
        $('body').on("change", ".amountType", function(e) {
            if ($(this).val() == "FULL") {
                $(this).parents('.modal-body').find("[name='custom_amount']").removeAttr('required');
                $(this).parents('.modal-body').find(".customAmountDiv").addClass('hidden');
            }
            if ($(this).val() == "CUSTOM") {
                $(this).parents('.modal-body').find("[name='custom_amount']").val("").attr('required', 'required');
                $(this).parents('.modal-body').find(".customAmountDiv").removeClass('hidden');
            }
        });

        $('body').on("click", ".collectCashBtn", function(e) {
            var deliveryCollectionId =  $(this).attr("data-delivery-collection-id");
            console.log(deliveryCollectionId);
            var userId = $(this).attr("data-delivery-id");
            var deliveryName = $(this).attr("data-delivery-name");
            var amount = $(this).attr("data-amount");

            var postUrl = "{{ url('/admin/delivery-collection/collect/') }}" + '/' + userId;

            $('#modalDeliveryName').html(deliveryName);
            $('#modalDeliveryCollectionId').val(deliveryCollectionId);
            $('#modalDeliveryCashInHand').html(amount);
            $('#modalFormActionUrl').attr('action', postUrl);

            $('#collectCashModal').modal('show');
        });

        $('#collectCashModal').on('hidden.bs.modal', function () {
            $('#modalDeliveryName').html("");
            $('#modalDeliveryCollectionId').val("");
            $('#modalDeliveryCashInHand').html("");
            $('#modalFormActionUrl').attr('action', "");
            $('#modalCustomAmount').val("");
            $('#modalCollectionMessage').val("");
        });
        
    });
</script>
@endsection