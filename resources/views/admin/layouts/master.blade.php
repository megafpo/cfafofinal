<!DOCTYPE html>
<html lang="{{ app()->getLocale()}}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="apple-touch-icon" sizes="180x180"
        href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32"
        href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16"
        href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/images/favicons/favicon-16x16.png">
    <title>@yield("title")</title>
    <!-- Global stylesheets -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet"
        type="text/css">
    <link
        href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/css/icons/icomoon/styles.min.css"
        rel="stylesheet" type="text/css">
    <link href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/css/bootstrap.min.css?v=3.5.0-BUILD-02"
        rel="stylesheet" type="text/css">
    <link href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/css/combined.min.css?v=3.5.0-BUILD-02"
        rel="stylesheet" type="text/css">
    <link href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/css/layout.min.css?v=3.5.0-BUILD-02"
        rel="stylesheet" type="text/css">
    <link href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/css/components.min.css?v=3.5.0-BUILD-02"
        rel="stylesheet" type="text/css">
    <link href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/css/colors.min.css" rel="stylesheet"
        type="text/css">
    <link href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/css/extras/animate.min.css"
        rel="stylesheet" type="text/css">
    <link href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/css/backend-custom.css?v=3.5.0-BUILD-02"
        rel="stylesheet" type="text/css">
    <link type="text/css"
        href="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/css/OverlayScrollbars.min.css"
        rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />
    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/css/ol.css">
    <!-- /global stylesheets -->


    <!-- Core JS files -->
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/main/jquery.min.js">
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.10.2/Sortable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery-sortablejs@latest/jquery-sortable.js"></script>


    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/js/jquery.overlayScrollbars.min.js">
    </script>

    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets//js/plugins/ui/moment/moment.min.js">
    </script>


    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/main/bootstrap.bundle.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/loaders/blockui.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/ui/slinky.min.js">
    </script>
    <!-- /core JS files -->
    <!-- Theme JS files -->
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/ui/sticky.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/buttons/spin.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/buttons/ladda.min.js">
    </script>

    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/notifications/jgrowl.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/forms/selects/select2.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/forms/styling/uniform.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/forms/styling/switchery.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/pickers/color/spectrum.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/editors/summernote/summernote.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/pickers/daterangepicker.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/uploaders/dropzone.min.js">
    </script>

    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-106310733-1"></script>
    <script>
        window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-106310733-1'); gtag('evaluation', window.location.hostname);
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/tables/datatables/datatables.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/tables/datatables/extensions/fixed_columns.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/tables/datatables/extensions/col_reorder.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/tables/datatables/extensions/buttons.min.js">
    </script>
    {{-- <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/tables/datatables/extensions/responsive.min.js">
    </script> --}}

    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/visualization/echarts/echarts.js"
        defer></script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/visualization/d3/d3.min.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/visualization/d3/d3_tooltip.js">
    </script>

    <script type="text/javascript" src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/js/app.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/js/navbar-sticky.js"></script>
    <script type="text/javascript" src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/js/printThis.js">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/js/jquery-alphanum.js"></script>
    @if(Request::is('admin/settings'))
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/editors/ace/ace.js">
    </script>
    @endif

    @if(Request::is('admin/stores') || Request::is('admin/store/*') || Request::is('store-owner/stores') ||
    Request::is('store-owner/store/*') || Request::is('admin/popular-geo-locations'))
    <!-- Load GMAPS Only when needed -->
    <script src="https://maps.googleapis.com/maps/api/js?key={{ config('setting.googleApiKeyNoRestriction') }}">
    </script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/js/google-maps.js"></script>
    @endif

    <script src="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.js"></script>
    <script type="text/javascript"
        src="{{substr(url("/"), 0, strrpos(url("/"), '/'))}}/assets/backend/global_assets/js/plugins/pickers/daterangepicker.js">
    </script>
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/build/ol.js"></script>

    <!-- /theme JS files -->
    <style>
        #nprogress .bar {
            background: #fff !important;
        }

        #nprogress .peg {
            box-shadow: 0 0 10px #fff, 0 0 5px #fff;
        }

        #nprogress .spinner-icon {
            border-top-color: #fff;
            border-left-color: #fff;
        }
    </style>

    @include('admin.includes.customCss')

</head>

<body>
    @if(!(Request::is('auth/*') || Request::is('license-manager')))
    @include("admin.includes.header")
    @endif

    <div class="page-content container pt-0">
        <div class="content-wrapper">
            @yield("content")
        </div>
    </div>
    @if(!(Request::is('auth/delivery-registration') || Request::is('auth/store-registration') ||
    Request::is('auth/forgot-password')))
    @include('admin.includes.notification')
    @endif
    <script>
        NProgress.configure({ showSpinner: true, minimum: 0.2 });
        NProgress.start();
        window.onload = function () { NProgress.done(); }
    </script>
    <script>
        function findLocalItems (query) {
            var i, results = [];
            for (i in localStorage) {
                if (localStorage.hasOwnProperty(i)) {
                if (i.match(query) || (!query && typeof i === 'string')) {
                    value = JSON.parse(localStorage.getItem(i));
                    results.push({key:i,val:value});
                }
                }
            }
            return results;
        }
        $(function() {
                $('form').submit(function(){
                    $(this).find(':input[type=submit]').prop('disabled', true);
                });
                $('.note-codable').on('blur', function() {
                  var codeviewHtml        = $(this).val();
                  var $summernoteTextarea = $(this).closest('.note-editor').siblings('textarea');
                  $summernoteTextarea.val(codeviewHtml);
                 });
            });
    </script>
</body>

</html>