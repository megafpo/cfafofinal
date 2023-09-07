import React, { Component } from "react";

import { connect } from "react-redux";
import { sendDeliveryGuyGpsLocation } from "../../../services/Delivery/gpslocation/actions";

class ShareLiveLocation extends Component {
	state = {
		gpsAccessError: false,
		lat: null,
		lng: null,
	};

	componentDidMount() {
		const location = navigator && navigator.geolocation;

		if (location) {
			this.refreshSetInterval = setInterval(() => {
				location.getCurrentPosition(
					(position) => {
						this.__sendGpsLocation(position);
					},
					(error) => {
						if (navigator.userAgent === "frutriAndroidWebViewUA" && window.Android !== "undefined") {
							this.setState({ gpsAccessError: false });
						} else {
							console.log("Inside error");
							console.log(error);
							this.setState({ gpsAccessError: true });
						}
					},
					{
						enableHighAccuracy: true,
					}
				);
			}, 15000);
		}
	}

	__sendGpsLocation = (position) => {
		this.props.sendDeliveryGuyGpsLocation(
			this.props.delivery_user.data.auth_token,
			this.props.delivery_user.data.id,
			position.coords.latitude,
			position.coords.longitude,
			position.coords.heading
		);
	};

	componentWillUnmount() {
		clearInterval(this.refreshSetInterval);
		console.log("Cleared API CALL");
	}
	render() {
		return (
			<React.Fragment>
				<div className="pt-50">
					{this.state.gpsAccessError && (
						<div className="auth-error location-error" style={{ bottom: "5rem" }}>
							<div className="error-shake">{localStorage.getItem("allowLocationAccessMessage")}</div>
						</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
});

export default connect(
	mapStateToProps,
	{ sendDeliveryGuyGpsLocation }
)(ShareLiveLocation);
