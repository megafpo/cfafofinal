import React, { Component } from "react";

class Loading extends Component {
	render() {
		return (
			<React.Fragment>
				{localStorage.getItem("useSimpleSpinner") === "true" ? (
					<div className="height-100 overlay-loading ongoing-payment-spin">
						<div className="spin-load" />
					</div>
				) : (
					<div className="height-100 overlay-loading">
						<div>
							<img src="/assets/img/loading-food.gif" alt={localStorage.getItem("pleaseWaitText")} />
						</div>
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default Loading;
