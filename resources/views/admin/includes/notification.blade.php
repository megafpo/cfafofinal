@if(Session::has('success'))
<script>
    $(function () {
        $.jGrowl("{{ Session::get('success') }}", {
            position: 'bottom-center',
            @hasrole("Store Owner")
            header:  '{{__('storeDashboard.successNotification')}}',
            @else
            header: 'SUCCESS 👌',
            @endrole
            theme: 'bg-success',
        });    
    });
</script>
@endif
@if(Session::has('message'))
<script>
    $(function () {
        $.jGrowl("{{ Session::get('message') }}", {
            position: 'bottom-center',
            @hasrole("Store Owner")
            header:  '{{__('storeDashboard.woopssNotification')}}',
            @else
            header: 'Wooopsss ⚠️',
            @endrole
            theme: 'bg-warning',
        });    
    });
</script>
@endif
@if($errors->any())
<script>
    $(function () {
        $.jGrowl("{{ implode('', $errors->all(':message')) }}", {
            position: 'bottom-center',
            header: 'ERROR ⁉️',
            theme: 'bg-danger',
        });    
    });
</script>
@endif

@if(Session::get('razorpay_enter_mid') == "true")
<div id="razorpayMidPopup" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">Razorpay Merchant ID Missing</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form action="{{ route('admin.saveSpecificSettings') }}" method="POST" enctype="multipart/form-data">
                    <div class="form-group row">
                        <div class="col-lg-12">
                            <label><strong>Razorpay Merchant Id <i class="icon-question3 ml-1 text-muted"
                                        data-popup="tooltip"
                                        title="On the Top-Right corner of the Razorpay Dashboard, click the User Icon and click 'Copy Merchant Id'"
                                        data-placement="top"></i></strong></label>
                            <input type="text" class="form-control form-control-lg" name="razorpayMerchantId"
                                value="{{ config('setting.razorpayMerchantId') }}"
                                placeholder="Enter Razorpay Merchant ID here" minlength="14" maxlength="14">
                            <span class="small text-danger">Please make sure the Merchant ID is correctly set for
                                Razorpay to work properly.</span>
                        </div>
                    </div>
                    @csrf
                    <div class="text-right mt-5">
                        <button type="submit" class="btn btn-primary btn-lg">
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
    $(function () {
        $('#razorpayMidPopup').modal({
            show: true,
        })  
    });
</script>
@endif