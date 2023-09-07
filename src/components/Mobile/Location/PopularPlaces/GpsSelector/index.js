import React, { Component } from "react";
import Ink from "react-ink";
import { GET_ADDRESS_FROM_COORDINATES } from "../../../../../configs";
import Axios from "axios";

class GpsSelector extends Component {
	static contextTypes = {
		router: () => null,
	};

	state = {
		gps_loading: false,
	};


	getMyLocation = () => {
		this.startLoading();
		const location = navigator && navigator.geolocation;
		if (location) {
			location.getCurrentPosition(
				(position) => {
					this.reverseLookup(position.coords.latitude, position.coords.longitude);
				},
				(error) => {
					this.setState({ gps_loading: false });
					this.stopLoading();
					console.log(error);
					if (navigator.userAgent !== "frutriAndroidWebViewUA") {
						alert(localStorage.getItem("gpsAccessNotGrantedMsg"));
					}
				},
				{ timeout: 5000 }
			);
		} else {
			this.stopLoading();
		}
	};

	reverseLookup = (lat, lng) => {
		Axios.post(GET_ADDRESS_FROM_COORDINATES, {
			lat: lat,
			lng: lng,
		})
			.then((response) => {
				console.log(response);
				const myLocation = [
					{
						formatted_address: response.data,
						geometry: {
							location: {
								lat: lat,
								lng: lng,
							},
						},
					},
				];
				this.handleGeoLocationClick(myLocation);
			})
			.catch(function(error) {
				console.warn(error.response.data);
			});
	};

	handleGeoLocationClick = (results) => {
		const saveGeoLocation = new Promise((resolve) => {
			localStorage.setItem("geoLocation", JSON.stringify(results[0]));
			resolve("GeoLocation Saved");
		});
		saveGeoLocation.then(() => {
			this.stopLoading();
			if (this.props.fetchGpsAutomaticallyAndroid) {
				//set user location but with business flag (do not redirect to address saving)
				const userSetAddress = {
					lat: JSON.parse(localStorage.getItem("geoLocation")).geometry.location.lat,
					lng: JSON.parse(localStorage.getItem("geoLocation")).geometry.location.lng,
					address: JSON.parse(localStorage.getItem("geoLocation")).formatted_address,
					house: null,
					tag: null,
					businessLocation: true,
				};
				const saveUserSetAddress = new Promise((resolve) => {
					localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
					localStorage.setItem("userAlreadySelectedLocation", "true");
					resolve("Location Saved");
				});
				saveUserSetAddress.then(() => {
					window.location.reload();
				});
			} else {
				this.context.router.history.push("/my-location");
			}
		});
	};

	startLoading = () => {
		document.getElementById("gpsLoadingScreen").classList.remove("hidden");
	};

	stopLoading = () => {
		document.getElementById("gpsLoadingScreen").classList.add("hidden");
	};

	render() {
		return (
			<React.Fragment>
				<div
					className="p-15 d-flex justify-content-center align-items-center gps-selection-block"
					style={{
						backgroundColor: localStorage.getItem("cartColorBg"),
						color: localStorage.getItem("cartColorText"),
						position: "relative",
					}}
					onClick={this.getMyLocation}
				>
					<div className="mr-15">
						<p className="mb-0">{localStorage.getItem("useGpsMessage")}</p>
					</div>
					<div className="useGpsBtn">{localStorage.getItem("useGpsButtonText")}</div>
					<Ink duration="500" />
				</div>
			</React.Fragment>
		);
	}
}

export default GpsSelector;
