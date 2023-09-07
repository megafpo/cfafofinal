@extends('admin.layouts.master')
@section("title") Send Notifications - Dashboard
@endsection
@section('content')
<style>
    .dropzone {
        border: 2px dotted #EEEEEE !important;
    }
</style>

<div class="content mt-3">
    <div class="row">
        <div class="col-6 @if($countJunkData > 0)col-xl-3 @else col-xl-4 @endif mb-2 mt-2" data-popup="tooltip"
            title="These are total registered customers on your websites who can receive only Alerts messages.">
            <div class="col-xl-12 dashboard-display p-3">
                <a class="block block-link-shadow text-left text-default" href="javascript:void(0)">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="dashboard-display-number">{{ $usersCount }}</div>
                            <div class="font-size-sm text-uppercase text-muted">Registered Customers</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        <div class="col-6 @if($countJunkData > 0)col-xl-3 @else col-xl-4 @endif mb-2 mt-2" data-popup="tooltip"
            title="These are total registered push notification subscribed customers who can receive both Alerts and Push Notifications messages.">
            <div class="col-xl-12 dashboard-display p-3">
                <a class="block block-link-shadow text-left text-default" href="javascript:void(0)">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="dashboard-display-number">{{ $subscriberCount }}</div>
                            <div class="font-size-sm text-uppercase text-muted">Subscribers</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        <div class="col-6 @if($countJunkData > 0)col-xl-3 @else col-xl-4 @endif mb-2 mt-2" data-popup="tooltip"
            title="These are non-registered users of your Android App who can receive only Push Notifications messages.">
            <div class="col-xl-12 dashboard-display p-3">
                <a class="block block-link-shadow text-left text-default" href="javascript:void(0)">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="dashboard-display-number">{{ $appUsers }}</div>
                            <div class="font-size-sm text-uppercase text-muted">App Users</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        @if($countJunkData > 0)
        <div class="col-6 col-xl-3 mb-2 mt-2" data-popup="tooltip" title="Alters older than 7 days are not shown to the users and hence are of no
            use. Clicking on the below button will only delete {{ $countJunkData }} Alerts data that
            are older than 7 days." onclick="confirmDelete()">
            <div class="col-xl-12 dashboard-display p-3">
                <a class="block block-link-shadow text-left text-danger" href="javascript:void(0)">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="dashboard-display-number">{{ $countJunkData }}</div>
                            <div class="font-size-sm text-uppercase text-danger">Delete Junk Data</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        @endif

    </div>

    <div class="row mt-3">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">

                    <div class="d-lg-flex justify-content-lg-left">
                        <ul class="nav nav-pills flex-column mr-lg-3 wmin-lg-250 mb-lg-0">
                            <li class="nav-item">
                                <a href="#toAll" class="nav-link active" data-toggle="tab">
                                    To All
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#toSelected" class="nav-link" data-toggle="tab">
                                    To Selected
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#toNonRegisteredUsers" class="nav-link" data-toggle="tab">
                                    To Non-Registered App Users
                                </a>
                            </li>
                        </ul>
                        <div class="tab-content" style="width: 100%; padding: 0 25px;">
                            <div class="tab-pane fade show active" id="toAll">
                                <legend class="font-weight-semibold text-uppercase font-size-sm">
                                    Send push notification & alert to all users
                                </legend>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Notification Image: </label>
                                    <div class="col-lg-9">
                                        <img class="slider-preview-image hidden" />
                                        <div class="uploader">
                                            <form method="POST" action="{{ route('admin.uploadNotificationImage') }}"
                                                enctype="multipart/form-data" class="dropzone" id="dropzone">
                                                <input type="hidden" name="_token" value="{{ csrf_token() }}"
                                                    id="csrfToken">
                                            </form>
                                            <span class="help-text text-muted">Image size: 1600x1100</span>
                                        </div>
                                    </div>
                                </div>
                                <form action="{{ route('admin.sendNotifiaction') }}" method="POST"
                                    enctype="multipart/form-data">
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label"><span
                                                class="text-danger">*</span>Notification
                                            Title:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg" name="data[title]"
                                                placeholder="Notification Title" required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label"><span
                                                class="text-danger">*</span>Message:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg" name="data[message]"
                                                placeholder="Notification Message" required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label">URL:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg"
                                                name="data[click_action]"
                                                placeholder="This link will be opened when the notification is clicked">
                                        </div>
                                    </div>
                                    <input type="hidden" name="data[badge]"
                                        value="/assets/img/favicons/favicon-96x96.png">
                                    <input type="hidden" name="data[icon]"
                                        value="/assets/img/favicons/favicon-512x512.png">
                                    <input type="hidden" name="data[image]" value="" class="notificationImage">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}" id="token">
                                    <div class="text-right">
                                        <button type="submit" class="btn btn-primary btn-labeled btn-labeled-left">
                                            <b><i class="icon-paperplane"></i></b>
                                            SEND
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-pane fade" id="toSelected">
                                <legend class="font-weight-semibold text-uppercase font-size-sm">
                                    Send push notification & alert to selected users
                                </legend>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Notification Image: </label>
                                    <div class="col-lg-9">
                                        <img class="slider-preview-image hidden" />
                                        <div class="uploader">
                                            <form method="POST" action="{{ route('admin.uploadNotificationImage') }}"
                                                enctype="multipart/form-data" class="dropzone" id="dropzone">
                                                <input type="hidden" name="_token" value="{{ csrf_token() }}"
                                                    id="csrfToken">
                                            </form>
                                            <span class="help-text text-muted">Image size: 1600x1100</span>
                                        </div>
                                    </div>
                                </div>
                                <form action="{{ route('admin.sendNotificationToSelectedUsers') }}" method="POST"
                                    enctype="multipart/form-data">
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label"><span class="text-danger">*</span>Select
                                            Users:</label>
                                        <div class="col-lg-9">
                                            <select multiple="multiple" class="form-control select" data-fouc
                                                name="users[]" required="required">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label"><span
                                                class="text-danger">*</span>Notification
                                            Title:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg" name="data[title]"
                                                placeholder="Notification Title" required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label"><span
                                                class="text-danger">*</span>Message:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg" name="data[message]"
                                                placeholder="Notification Message" required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label">URL:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg"
                                                name="data[click_action]"
                                                placeholder="This link will be opened when the notification is clicked">
                                        </div>
                                    </div>
                                    <input type="hidden" name="data[badge]"
                                        value="/assets/img/favicons/favicon-96x96.png">
                                    <input type="hidden" name="data[icon]"
                                        value="/assets/img/favicons/favicon-512x512.png">
                                    <input type="hidden" name="data[image]" value="" class="notificationImage">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}" id="token">
                                    <div class="text-right">
                                        <button type="submit" class="btn btn-primary btn-labeled btn-labeled-left">
                                            <b><i class="icon-paperplane"></i></b>
                                            SEND
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-pane fade" id="toNonRegisteredUsers">
                                <legend class="font-weight-semibold text-uppercase font-size-sm">
                                    Send push notification to non registered app users
                                </legend>
                                <div class="form-group row">
                                    <label class="col-lg-3 col-form-label">Notification Image: </label>
                                    <div class="col-lg-9">
                                        <img class="slider-preview-image hidden" />
                                        <div class="uploader">
                                            <form method="POST" action="{{ route('admin.uploadNotificationImage') }}"
                                                enctype="multipart/form-data" class="dropzone" id="dropzone">
                                                <input type="hidden" name="_token" value="{{ csrf_token() }}"
                                                    id="csrfToken">
                                            </form>
                                            <span class="help-text text-muted">Image size: 1600x1100</span>
                                        </div>
                                    </div>
                                </div>
                                <form action="{{ route('admin.sendNotificationToNonRegisteredAppUsers') }}"
                                    method="POST" enctype="multipart/form-data">
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label"><span
                                                class="text-danger">*</span>Notification
                                            Title:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg" name="data[title]"
                                                placeholder="Notification Title" required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label"><span
                                                class="text-danger">*</span>Message:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg" name="data[message]"
                                                placeholder="Notification Message" required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label">URL:</label>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-lg"
                                                name="data[click_action]"
                                                placeholder="This link will be opened when the notification is clicked">
                                        </div>
                                    </div>
                                    <input type="hidden" name="data[image]" value="" class="notificationImage">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}" id="token">
                                    <div class="text-right">
                                        <button type="submit" class="btn btn-primary btn-labeled btn-labeled-left">
                                            <b><i class="icon-paperplane"></i></b>
                                            SEND
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
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
                   .width(300)
           };
           reader.readAsDataURL(input.files[0]);
       }
    }
    

    $(function() {
       $('.form-control-uniform').uniform();

       $('.select').select2({
           minimumResultsForSearch: Infinity,
           placeholder: 'Select Users',
           ajax: { 
                url: "{{route('admin.getUsersToSendNotification')}}",
                type: "get",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        search: params.term
                    };
                },
                processResults: function (response) {
                    console.log(response);
                    return {
                        results: response
                    };
                },
                cache: true
            }
       });

    });

    @if($subscriberCount == 0)
        $.jGrowl("There are no subscribers to send push notifications.", {
            position: 'bottom-center',
            header: 'Wooopsss ⚠️',
            theme: 'bg-warning',
            life: '5000'
        }); 
    @endif
</script>
<script type="text/javascript">
    Dropzone.options.dropzone =
     {
        maxFilesize: 12,
        renameFile: function(file) {
            var dt = new Date();
            var time = dt.getTime();
           return time+file.name;
        },
        acceptedFiles: ".jpeg,.jpg,.png,.gif",
        addRemoveLinks: true,
        timeout: 50000,
        removedfile: function(file) 
        {
           $('.notificationImage').attr('value', "");
            var fileRef;
            return (fileRef = file.previewElement) != null ? fileRef.parentNode.removeChild(file.previewElement) : void 0;
        },
        success: function(file, response) 
        {
            console.log(response.success);
            $('.notificationImage').attr('value', '/assets/img/various/' +response.success);
        },
        error: function(file, response)
        {
           return false;
        }
    };

    function confirmDelete()
    {
          var r = confirm("Are you sure? This action is irreversible!");
          if (r == true) {
            let url = "{{ url('admin/delete-alerts-junk') }}";
            window.location.href = url;
          }
    }
</script>
@endsection