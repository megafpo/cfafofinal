import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import mapStyle from "../../../GeoLocationPage/mapStyle.json";
import ContentLoader from "react-content-loader";
import React, { Component } from "react";

class GoogleMaps extends Component {
    state = {
        zoom: 15
    };

    componentDidMount() {
        const deliveryMarker = this.refs.deliveryRefIcon;

        if (deliveryMarker) {
            deliveryMarker.style.transform = "rotate(" + 50 + "deg)";
            deliveryMarker.style.transition = "transform 1s linear";
        }
        setTimeout(() => {
            this.setState({ zoom: 18 });
        }, 1 * 1000);
    }

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            if (document.querySelector('[src*="/assets/img/various/marker-delivery.png"]') && nextProps.delivery_gps_location.heading) {
                console.log("Inside update delivery icon");
                document.querySelector('[src*="/assets/img/various/marker-delivery.png"]').style.transform =
                    "rotate(" + nextProps.delivery_gps_location.heading + "deg)";
                document.querySelector('[src*="/assets/img/various/marker-delivery.png"]').style.transition = "transform 0.25s linear";
            }
        }, 500);
    }

    render() {
        return (
            <Map
                ref={ref => {
                    this.map = ref;
                }}
                google={this.props.google}
                style={{
                    width: "100%",
                    height: "55vh"
                }}
                initialCenter={{
                    lat: JSON.parse(this.props.deliveryLocation).lat,
                    lng: JSON.parse(this.props.deliveryLocation).lng
                }}
                zoom={this.state.zoom}
                styles={mapStyle}
                zoomControl={false}
                mapTypeControl={false}
                scaleControl={true}
                streetViewControl={false}
                fullscreenControl={false}
            >
                <Marker
                    position={{
                        lat: JSON.parse(this.props.deliveryLocation).lat,
                        lng: JSON.parse(this.props.deliveryLocation).lng
                    }}
                    icon={{
                        url: "/assets/img/various/marker-home.png",
                        // anchor: new this.props.google.maps.Point(32, 32),
                        scaledSize: new this.props.google.maps.Size(34, 54)
                    }}
                ></Marker>

                <Marker
                    position={{
                        lat: parseFloat(this.props.restaurant_latitude),
                        lng: parseFloat(this.props.restaurant_longitude)
                    }}
                    icon={{
                        url: "/assets/img/various/marker-restaurant.png",
                        // anchor: new this.props.google.maps.Point(32, 32),
                        scaledSize: new this.props.google.maps.Size(34, 54)
                    }}
                ></Marker>
                {this.props.show_delivery_gps && (
                    <Marker
                        position={{
                            lat: parseFloat(this.props.delivery_gps_location.delivery_lat),
                            lng: parseFloat(this.props.delivery_gps_location.delivery_long)
                        }}
                        icon={{
                            url: "/assets/img/various/marker-delivery.png",
                            anchor: new this.props.google.maps.Point(32, 32),
                            scaledSize: new this.props.google.maps.Size(54, 54)
                        }}
                    ></Marker>
                )}
            </Map>
        );
    }
}

const MapLoadingContainer = () => (
    <ContentLoader height={400} width={window.innerWidth} speed={1.2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
        <rect x="0" y="0" rx="0" ry="0" width={window.innerWidth} height="400" />
    </ContentLoader>
);

export default GoogleApiWrapper({
    apiKey: localStorage.getItem("googleApiKey"),
    LoadingContainer: MapLoadingContainer
})(GoogleMaps);
