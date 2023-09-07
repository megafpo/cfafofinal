import { GoogleApiWrapper, Map } from "google-maps-react";
import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import mapStyle from "../mapStyle.json";
import Bounce from "react-reveal/Bounce";

class GoogleMap extends Component {
	state = {
		initialPosition: {
			lat: 37.77,
			lng: -122.42,
		},
		zoom: 15,
		isAllowedLocationToDetect: true,
		hideErrorMessage: false,
		getCurrentAddress: false,
		centerAroundCurrentLocation: false,
		center: {},
	};

	componentDidMount() {
		console.log(this.props);
		if (localStorage.getItem("geoLocation") !== null) {
			const location = JSON.parse(localStorage.getItem("geoLocation")).geometry.location;
			this.setState({ initialPosition: { lat: location.lat, lng: location.lng } });
		}
		setTimeout(() => {
			this.setState({ zoom: 18 });
		}, 1 * 1000);
	}

	onMarkerClick = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			this.setState((prevState) => ({
				center: {
					...prevState.center,
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				},
				centerAroundCurrentLocation: true,
			}));

			this.getCurrentLocation(position.coords.latitude, position.coords.longitude);
		});

		navigator.permissions
			.query({
				name: "geolocation",
			})
			.then((result) => {
				console.log(result);
				if (result.state === "granted") {
					this.handleGPS(true);
				} else if (result.state === "prompt") {
					this.handleGPS(true);
				} else if (result.state === "denied") {
					this.handleGPS(false);
				}
				result.onchange = (res) => {
					if (res.currentTarget.state === "denied") {
						this.handleGPS(false);
					}
					if (res.currentTarget.state === "granted") {
						this.handleGPS(true);
						this.handleMap();
					}
				};
			});
	};

	handleMap = () => {
		this.setState({ getCurrentAddress: true });
	};

	handleGPS = (val) => {
		this.setState({ isAllowedLocationToDetect: val, hideErrorMessage: true });
	};

	onDrag = () => {
		this.setState({ isAllowedLocationToDetect: true, getCurrentAddress: false });
	};

	getCurrentLocation = (lat, lng) => {
		this.props.reverseLookup(lat, lng);
	};

	render() {
		return (
			<React.Fragment>
				<div>
					<Map
						google={this.props.google}
						style={{
							width: "100%",
							height: "55vh",
						}}
						initialCenter={{
							lat: JSON.parse(localStorage.getItem("geoLocation")).geometry.location.lat,
							lng: JSON.parse(localStorage.getItem("geoLocation")).geometry.location.lng,
						}}
						onDragend={(t, map, coord) => this.props.onMarkerDragEnd(map)}
						zoom={this.state.zoom}
						styles={mapStyle}
						zoomControl={false}
						mapTypeControl={false}
						scaleControl={true}
						streetViewControl={false}
						fullscreenControl={false}
						onReady={(mapProps, map) => {
							this.props.dragging
								? this.props.reverseLookup(
										this.state.initialPosition.lat,
										this.state.initialPosition.lng
								  )
								: this.props.location(this.state.initialPosition.lat, this.state.initialPosition.lng);
							localStorage.setItem("userLat", map.center.lat());
							localStorage.setItem("userLng", map.center.lng());
						}}
						onDragstart={() => {
							this.props.handleDragging(true);
							this.setState({ isAllowedLocationToDetect: true });
							this.onDrag();
						}}
						centerAroundCurrentLocation={this.state.centerAroundCurrentLocation}
						center={this.state.center}
					>
						<div onClick={this.onMarkerClick}>
							<div className="current-location-btn-overmap">
								<i className="si si-compass" /> {localStorage.getItem("useCurrentLocationText")}
							</div>
						</div>

						{!this.state.isAllowedLocationToDetect && (
							<div className="auth-error">
								<div className="error-shake">{localStorage.getItem("gpsAccessNotGrantedMsg")}</div>
							</div>
						)}
					</Map>

					<div className="center-marker-pulse">
						<Bounce top duration={1000}>
							<img
								src="/assets/img/various/dragable-markerv2.png"
								alt="Marker"
								className="center-marker"
							/>
						</Bounce>
					</div>
				</div>
			</React.Fragment>
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
	LoadingContainer: MapLoadingContainer,
})(GoogleMap);
