@extends('admin.layouts.master')
@section("title") frutri License Management
@endsection
@section('content')
<style>
    .navbar { display: none !important; }
</style>
@if(Session::has("licenseManagement"))
<div class="page-header">
    <div class="page-header-content header-elements-md-inline">
        <div class="page-title d-flex">
            <h4>
                frutri License Management
            </h4>
        </div>
        <div class="header-elements d-none py-0 mb-3 mb-md-0">
            <div class="breadcrumb">
            </div>
        </div>
    </div>
</div>

<div class="content">
    <div class="card">
        <div class="card-body">
            @if(count($products) > 0)
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>License Code</th>
                            <th>License Type</th>
                            <th class="text-center" style="width: 10%;"><i class="
                                icon-circle-down2"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($products as $product)
                            <tr>
                                <td>
                                    {{ $product->product_name }}
                                </td>
                                <td>
                                    {{ $product->purchase_code }}
                                </td>
                                <td>
                                    {{ $product->license_type }}
                                </td>
                                <td>
                                    <button class="btn btn-danger resetBtn" style="width: 110px;" data-id="{{ $product->short_code }}">Reset</button>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @else
                <p class="mb-0">No product registered yet.</p>
            @endif
        </div>
    </div>
</div>
<input type="hidden" id="csrf" value="{{ csrf_token() }}">
@if(count($products) > 0)
<script>
    $(function() {
        $('.resetBtn').click(function(event) {
            var resetBtns = $('.resetBtn');
            resetBtns.attr("disabled", "disabled");
            var self = $(this);
            self.html('<i class="icon-spinner10 spinner"></i>');
            var password = prompt("Enter the Super Admin password");
            if (password == null || password == "") {
                self.html("Reset");
                resetBtns.removeAttr("disabled");
                return;
            } else {
                var id = $(this).data('id');
                var code = $(this).data('code');
                var token = $('#csrf').val();

                $.ajax({
                    url: '{{ route('licenseReset') }}',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {_token: token, id: id, password: password,},
                })
                .done(function() {
                    $.jGrowl("License Reset Successful.", {
                        position: 'bottom-center',
                        header: 'SUCCESS 👌',
                        theme: 'bg-success',
                    }); 
                    setTimeout(function() {
                        window.location.reload();
                    }, 1500);
                })
                .fail(function(data) {
                    self.html("Reset");
                    resetBtns.removeAttr("disabled");
                    if (data && data.responseJSON && data.responseJSON.message) {
                        alert(data.responseJSON.message);
                    } else {
                        alert("Something went wrong. Try agian.")
                    }
                })
            }
        });
    });
</script>
@endif
@else
<script>
    $(function() {
        var password = prompt("Enter the Super Admin password");
        if (password == null || password == "") {
            alert("Invalid Password")
        }
        $.ajax({
            url: '{{ route('licenseManager') }}',
            type: 'GET',
            dataType: 'JSON',
            data: {password: password},
        })
        .done(function() {
            window.location.reload();
        })
        .fail(function(data) {
            if (data && data.responseJSON && data.responseJSON.message) {
                alert(data.responseJSON.message);
            }
        })
    });
</script>
@endif
@endsection