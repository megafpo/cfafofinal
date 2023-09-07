import React, { Component } from "react";
import Moment from "react-moment";

class OrdersHistory extends Component {
	render() {
		const { order } = this.props;
		return (
			<React.Fragment>
				<div className="delivery-account-orders-block p-15 mb-20">
					<div className="d-flex justify-content-between mb-2">
						<div className="font-w700">
							<h4
								className={`mb-0 ${
									localStorage.getItem("deliveryAppLightMode") === "true" ? "text-dark" : "text-white"
								}`}
							>
								#{order.order.unique_order_id.substr(order.order.unique_order_id.length - 6)}
							</h4>
						</div>
						<div>
							{localStorage.getItem("showFromNowDate") === "true" ? (
								<Moment fromNow>{order.updated_at}</Moment>
							) : (
								<Moment format="DD/MM/YYYY hh:mma">{order.updated_at}</Moment>
							)}
						</div>
					</div>

					<div className="d-flex justify-content-between mb-2">
						<div className="mr-4">
							{order.is_complete ? (
								<span className="btn btn-sm btn-delivery-success min-width-125">
									{localStorage.getItem("deliveryCompletedText")}
								</span>
							) : (
								<span className="btn btn-sm btn-delivery-ongoing min-width-125">
									{localStorage.getItem("deliveryOnGoingText")}
								</span>
							)}
						</div>
						<div>
							{order.order.payment_mode === "COD" ? (
								<span className="btn btn-sm btn-delivery-success min-width-175">
									{localStorage.getItem("deliveryCashOnDelivery")}:{" "}
									{localStorage.getItem("currencySymbolAlign") === "left" &&
										localStorage.getItem("currencyFormat")}
									{order.order.payable}
									{localStorage.getItem("currencySymbolAlign") === "right" &&
										localStorage.getItem("currencyFormat")}
								</span>
							) : (
								<span className="btn btn-sm btn-delivery-success min-width-175">
									<i className="si si-check mr-2" /> {localStorage.getItem("deliveryOnlinePayment")}
								</span>
							)}
						</div>
					</div>

					<div>
						<i className="si si-pointer mr-1" /> {order.order.address}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default OrdersHistory;
