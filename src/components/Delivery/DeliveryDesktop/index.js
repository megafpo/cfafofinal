import React, { Component } from "react";

class DeliveryDesktop extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="content-center text-center text-muted font-w600">
					<div>
						<i className="si si-screen-smartphone mb-2" style={{ fontSize: "4rem", opacity: "0.5" }} />
					</div>
					<div>{localStorage.getItem("deliveryUsePhoneToAccessMsg")}</div>
				</div>
			</React.Fragment>
		);
	}
}

export default DeliveryDesktop;
