@extends('admin.layouts.master')
@section("title") Eagle View - Dashboard
@endsection
@section('content')
<script src="https://www.gstatic.com/firebasejs/8.4.0/firebase.js"></script>
<style>
    #map {
        height: 80vh;
    }
</style>
<div class="content mt-3" id="mainContainerLoading">
    <div class="row mb-5">
        <div class="col-md-9"><span><i class="icon-spinner10 spinner position-left mr-1"></i>Connecting to server.
                Please wait...</span></div>
    </div>
</div>
<div class="content mt-3 invisible" id="mainContainer">
    <div class="d-flex justify-content-between my-2">
        <h3><strong>Eagle View</strong></h3>
        <div>
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#mapLegend">
                View Legend
            </button>
        </div>
    </div>
    <div class="row mb-5">
        <div class="col-md-9">
            <div class="card">
                <div class="card-body p-1" id="mapBlock">
                    <div id="map"></div>
                    <div id="popup" class="ol-popup">
                        <div id="popup-content"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Total Delivery Guys: <span id="totalDeliveryGuys"></span></strong>
                        </div>
                        <div>
                            <i class="icon-question3 ml-1 text-muted" data-popup="tooltip"
                                title="These are the delivery guys who have started using the Android Delivery Application"
                                data-placement="top"></i>
                        </div>
                    </div>

                </div>
            </div>
            <div class="card hidden" id="deliveryInfoBlock">

            </div>
        </div>
    </div>
</div>
<div id="mapLegend" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><span class="font-weight-bold">Map Legend and Info</span></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <div>
                    <div>
                        <img src="{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-green.png"
                            style="width: 40px" class="mr-2">
                        Online and has no ongoing orders
                    </div>
                    <br>
                    <div>
                        <img src="{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-orange.png"
                            style="width: 40px" class="mr-2">
                        Online and has some ongoing orders
                    </div>
                    <br>
                    <div>
                        <img src="{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-black.png"
                            style="width: 40px" class="mr-2">
                        Offline and has some ongoing orders
                    </div>
                    <br>
                    <div>
                        <img src="{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-red.png"
                            style="width: 40px" class="mr-2">
                        Offline and has no ongoing orders
                    </div>
                </div>
                <hr>
                <strong>Note</strong> if you are not able to view the Delivery Guy's name on Hover, reload the page.

            </div>
        </div>
    </div>
</div>
<script>
    function processLocation(places, vectorSource) { 
        var features = [];
        for (var i = 0; i < places.length; i++) {
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([places[i][0], places[i][1]], 'EPSG:4326', 'EPSG:3857')),
                userId: places[i][3],
                name: places[i][4],
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: places[i][2],
                    crossOrigin: 'anonymous',
                    scale: 0.65
                })
            });
        
            iconFeature.setStyle(iconStyle);
            vectorSource.addFeature(iconFeature);
        }
    }

    $(function() {

        var markerGreen = "{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-green.png"
        var markerOrange = "{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-orange.png";
        var markerBlack = "{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-black.png";
        var markerRed = "{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/marker-red.png";
        
        var zonalDeliveryUserIds = @json($deliveryUserIds);
        console.log(zonalDeliveryUserIds);

        var ajaxResponse;
        var timestamp = new Date().getTime();

        function fetchDeliveryGuysDataFromServer(userIdsArr) {
            var currentTimestamp = new Date().getTime(); 
            var timeDiff = (parseInt(currentTimestamp) - parseInt(timestamp))/1000;
            if (timeDiff >= 10 && ajaxResponse) {
                    ajaxResponse =  $.ajax({
                        type: "GET",
                        url: "{{ route('admin.getAllDeliveryInfoEagleView') }}",
                        data: {"ids": userIdsArr},
                        dataType: "json",
                    });
                    timestamp = currentTimestamp;
                    return ajaxResponse
            } else if(timeDiff < 10 && !ajaxResponse) {
                ajaxResponse =  $.ajax({
                    type: "GET",
                    url: "{{ route('admin.getAllDeliveryInfoEagleView') }}",
                    data: {"ids": userIdsArr},
                    dataType: "json",
                });
                timestamp = currentTimestamp;
                return ajaxResponse
            } 
            else {
                return ajaxResponse
            }
        }

        var config = {
            apiKey: "{{ $project_number }}",
            databaseURL: "{{ $firebase_url }}",
            storageBucket: "{{ $storage_bucket }}",
        };
        var firebaseApp = firebase.initializeApp(config);

        var centerBound = false;
        firebaseApp
            .database()
            .ref("/User")
            .on("value", function(snapshot) {
                    var deliveryGuys = snapshot.val();
                    console.log(typeof(deliveryGuys));
                    console.log(deliveryGuys);

                    var filteredZonalDeliveryGuys = zonalDeliveryUserIds.reduce((result, key) => ({ ...result, [key]: deliveryGuys[key] }), {});
                    for (const key in filteredZonalDeliveryGuys) {
                        if (filteredZonalDeliveryGuys[key] === undefined) {
                            delete filteredZonalDeliveryGuys[key];
                        }
                        if(filteredZonalDeliveryGuys[key] !== undefined && !filteredZonalDeliveryGuys[key].hasOwnProperty("latitude")) {
                            delete filteredZonalDeliveryGuys[key];
                        }
                    }

                    console.log("Filtered ->");
                    console.log(filteredZonalDeliveryGuys);

                    var filterdDeliveryGuyCount = Object.keys(filteredZonalDeliveryGuys).length
                    $('#totalDeliveryGuys').html(filterdDeliveryGuyCount);
                   
                    console.log("Count: " +filterdDeliveryGuyCount);

                    var userIdsArr = Object.keys(filteredZonalDeliveryGuys);
                    
                    if (filterdDeliveryGuyCount > 0) {
                    fetchDeliveryGuysDataFromServer(userIdsArr).done(function(serverResponse) {
                        var i = 0;
                        $.each(filteredZonalDeliveryGuys, function (indexInArray, valueOfElement) {
                            var deliveryGuyId = indexInArray;
                            var latitude = valueOfElement.latitude;
                            var longitude = valueOfElement.longitude;

                            var filteredKeys = [indexInArray];
                            var filtered = filteredKeys.reduce((obj, key) => ({ ...obj, [key]: serverResponse[key] }), {});
                            var deliveryGuyName = filtered[indexInArray] ? filtered[indexInArray].name : "Please wait or Reload the Page";
                            var deliveryStatus = filtered[indexInArray] ? filtered[indexInArray].status : "NA";

                                if (i in places) {
                                    places[i][0] = longitude;
                                    places[i][1] = latitude;
                                    if (deliveryStatus == "GREEN") {
                                        places[i][2] = markerGreen;
                                    } else if(deliveryStatus == "ORANGE") {
                                        places[i][2] = markerOrange;
                                    }
                                    else if(deliveryStatus == "BLACK") {
                                        places[i][2] = markerBlack;
                                    } else {
                                        places[i][2] = markerRed;
                                    }
                                    places[i][3] = deliveryGuyId;
                                    places[i][4] = deliveryGuyName;
                                    
                                } else {
                                    if (deliveryStatus == "GREEN") {
                                        markerIcon = markerGreen;
                                    } else if(deliveryStatus == "ORANGE") {
                                        markerIcon = markerOrange;
                                    }
                                    else if(deliveryStatus == "BLACK") {
                                        markerIcon = markerBlack;
                                    } else {
                                        markerIcon = markerRed;
                                    }
                                    var newEntry = [longitude, latitude , markerIcon, deliveryGuyId, deliveryGuyName];
                                    places[i] = newEntry;
                                }
                            
                            i++;
                            console.log(i);
                        });

                        
                        vectorSource.clear();
                        processLocation(places, vectorSource);

                        if (!centerBound) {
                            map.getView().fit(vectorSource.getExtent(), map.getSize());
                            setTimeout(() => {
                                if (filterdDeliveryGuyCount > 0) {
                                    $('#mainContainer').removeClass("invisible");
                                    $('#mainContainerLoading').remove();
                                } else {
                                    $('#mainContainerLoading').html("<strong>No delivery guys data found. </strong> <br> <span class='small'>If you have selected a zone, try selecting a different one.</span>");
                                }
                                
                                map.getView().animate({
                                    zoom: map.getView().getZoom() - 0.8,
                                    duration: 850
                                })
                            }, 1000);
                        }
                        centerBound = true;
                    });
                } else {
                    $('#mainContainerLoading').html("<strong>No delivery guys data found. </strong> <br> <span class='small'>If you have selected a zone, try selecting a different one.</span>");
                }
            });
     
            var vectorSource = new ol.source.Vector({});

            var places = [
                [81.3656048, 21.2245896 , 'https://i.postimg.cc/HnDrrP3b/delivery-map-marker.png', "0", "0"],
            ];
   
            var features = [];
            for (var i = 0; i < places.length; i++) {
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([places[i][0], places[i][1]], 'EPSG:4326', 'EPSG:3857')),
                    userId: places[i][3],
                });

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        src: places[i][2],
                        crossOrigin: 'anonymous',
                        scale: 0.8
                    })
                });
                
                iconFeature.setStyle(iconStyle);
                vectorSource.addFeature(iconFeature);
            }

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                updateWhileAnimating: true,
                updateWhileInteracting: true,
            });

            var map = new ol.Map({
                target: 'map',
                controls: ol.control.defaults({ attribution: false }),
                layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), vectorLayer],
                loadTilesWhileAnimating: true,
            });

            map.getView().fit(vectorSource.getExtent(), map.getSize());

            const container = document.getElementById('popup');
            const content = document.getElementById('popup-content');
           
            var popup = new ol.Overlay({
                element: container,
                autoPan: {
                    animation: {
                        duration: 250,
                    },
                },
            });
            map.addOverlay(popup);
            popup.setPosition(undefined);

            map.on('singleclick', function(evt) {
                $('#deliveryInfoBlock').addClass("hidden");

                var userId = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    return feature.get('userId');
                })
                if (userId) {
                    $.ajax({
                        type: "get",
                        url: "{{ url('/admin/manage-delivery-guys/getDeliveryInfoEagleView') }}/"+userId,
                        dataType: "json",
                        success: function (response) {
                            $('#deliveryInfoBlock').removeClass("hidden");
                            $('#deliveryInfoBlock').html(response.html);
                        }
                    });
                } else {
                    $('#deliveryInfoBlock').addClass("hidden");
                }
            });

            let selected = null;
            map.on('pointermove', function(evt) {
                map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

                if (selected !== null) {
                    selected = null;
                }

                map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    selected = feature;
                    return true;
                });

                if (selected) {                
                    content.innerHTML = selected.get('name');
                    popup.setPosition(evt.coordinate);
                } else {
                    content.innerHTML = '';
                    popup.setPosition(undefined)
                }
            });

            $('body').on("click", "#refreshBlock", function(e) {
                $('.tooltip').remove();
                var selectedDeliveryGuyId = $('#selectedDeliveryGuyId').val();
                $('#deliveryInfoBlock').addClass("hidden");
            
                $.ajax({
                    type: "get",
                    url: "{{ url('/admin/manage-delivery-guys/getDeliveryInfoEagleView') }}/"+selectedDeliveryGuyId,
                    dataType: "json",
                    success: function (response) {
                        $('#deliveryInfoBlock').html(response.html);
                        $('#deliveryInfoBlock').removeClass("hidden");
                    }
                });
            })
    });
</script>
@endsection