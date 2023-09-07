import React, { Component } from "react";
import moment from "moment";

class AwaitingPaymentTimer extends Component {
	state = {
		showTimer: false,
		timer: "",
	};

	componentDidMount = () => {
		this.renderAwaitingPaymentTimer(this.props.order);
	};

	renderAwaitingPaymentTimer = (order) => {
		if (order.orderstatus_id === 8) {
			var currentTime = moment(new Date()).unix();
			var deadLine =
				moment(order.created_at).unix() + parseInt(localStorage.getItem("awaitingPaymentThreshold")) * 60;
			var diffTime = deadLine - currentTime;

			var duration = moment.duration(diffTime * 1000, "milliseconds");
			var interval = 1000;
			var self = this;
			this.awaitingPaymentTimer = setInterval(function() {
				duration = moment.duration(duration - interval, "milliseconds");

				if (duration.minutes() >= 0 && duration.seconds() >= 0) {
					self.setState({ showTimer: true, timer: duration.minutes() + ":" + duration.seconds() });
				} else {
					self.setState({ showTimer: false, timer: "" });
				}
			}, interval);
		}
	};

	componentWillUnmount() {
		clearInterval(this.awaitingPaymentTimer);
	}
	render() {
		return (
			<React.Fragment>
				{this.state.showTimer && (
					<div className="awaitingPaymentTimer small">
						{localStorage.getItem("awaitingPaymentTimerText")}{" "}
						<b style={{ color: localStorage.getItem("storeColor") }}>{this.state.timer}</b>
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default AwaitingPaymentTimer;
