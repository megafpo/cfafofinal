import React, { Component } from "react";

import { connect } from "react-redux";
import { getDeliveryGuyGpsLocation } from "../../../../services/Delivery/gpslocation/actions";
import GoogleMaps from "./GoogleMaps";

class Map extends Component {
	state = {
		gps_latitude: null,
		gps_longitude: null,
		show_delivery_gps: false,
		delivery_guy_latitude: null,
		delivery_guy_longitude: null,
		loopStarted: false,
	};

	componentDidMount() {
		if (this.props.orderstatus_id === 3 || this.props.orderstatus_id === 4) {
			this.__getDeliveryGuyLocationOnce();
		}
	}

	__getDeliveryGuyLocationOnce = () => {
		const getDeliveryGuyGpsLocation = new Promise((resolve) => {
			this.props.getDeliveryGuyGpsLocation(this.props.user.data.auth_token, this.props.order_id);
			resolve("done");
		});

		getDeliveryGuyGpsLocation.then(() => {
			this.setState({ show_delivery_gps: true });
		});
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.orderstatus_id === 3 || nextProps.orderstatus_id === 4) {
			if (!this.state.loopStarted) {
				this.__getDeliveryGuyGpsLocationLoop();
			}
		}
		if (this.props.delivery_gps_location !== nextProps.delivery_gps_location) {
			if (!this.state.show_delivery_gps) {
				this.setState({ show_delivery_gps: true });
			}
		}
	}

	gettingGpsLocationInterval = 0;
	__getDeliveryGuyGpsLocationLoop = () => {
		// console.log("This should be called only once");

		this.setState({ loopStarted: true });
		this.gettingGpsLocationInterval = setInterval(() => {
			this.props.getDeliveryGuyGpsLocation(this.props.user.data.auth_token, this.props.order_id);
		}, 15 * 1000);
	};

	componentWillUnmount() {
		clearInterval(this.gettingGpsLocationInterval);
	}

	render() {
		// console.log("LOOP STATUS: ", this.state.loopStarted);

		return (
			<React.Fragment>
				<GoogleMaps
					restaurant_latitude={this.props.restaurant_latitude}
					restaurant_longitude={this.props.restaurant_longitude}
					show_delivery_gps={this.state.show_delivery_gps}
					delivery_gps_location={this.props.delivery_gps_location}
					deliveryLocation={this.props.deliveryLocation}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	delivery_gps_location: state.gps_location.get_delivery_guy_gps_location,
});

export default connect(
	mapStateToProps,
	{ getDeliveryGuyGpsLocation }
)(Map);
