import React, { Component } from "react";
import Modal from "react-responsive-modal";
import Ink from "react-ink";
import { formatPrice } from "../../../../../helpers/formatPrice";

class OrderCancelPopup extends Component {
	state = {
		open: false,
	};
	handlePopupOpen = () => {
		this.setState({ open: true });
	};
	handlePopupClose = () => {
		this.setState({ open: false });
	};
	render() {
		const { order, user, cancelOrder } = this.props;

		return (
			<React.Fragment>
				<button
					className="btn btn-square btn-sm btn-outline-danger mb-0 mt-15"
					style={{ position: "relative", fontSize: "0.8rem" }}
					onClick={this.handlePopupOpen}
				>
					{localStorage.getItem("cancelOrderMainButton")}
					<Ink duration="500" />
				</button>
				<Modal open={this.state.open} onClose={this.handlePopupClose} closeIconSize={32}>
					<div className="text-center mt-100">
						<div style={{ fontSize: "1.2rem", fontWeight: "500" }}>
							<i className="si si-info" style={{ fontSize: "4rem", opacity: "0.3", color: "#FF9800" }} />
							<p>{order.unique_order_id}</p>
							<p>{localStorage.getItem("orderCancellationConfirmationText")}</p>
							{order.orderstatus_id === 1 || order.orderstatus_id === 10 ? (
								<React.Fragment>
									{order.payment_mode !== "COD" && (
										<p className="text-muted font-w400">
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}
											{order.total}{" "}
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}
											{localStorage.getItem("willBeRefundedText")}
										</p>
									)}
									{order.payment_mode === "COD" && order.total - order.payable !== 0 && (
										<p className="text-muted font-w400">
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}
											{formatPrice(order.total - order.payable)}{" "}
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}
											{localStorage.getItem("willBeRefundedText")}
										</p>
									)}
								</React.Fragment>
							) : (
								<p className="text-muted font-w400">{localStorage.getItem("willNotBeRefundedText")}</p>
							)}
						</div>
						<div>
							<button
								className="btn btn-lg btn-danger mr-3"
								onClick={() => cancelOrder(user.data.auth_token, user.data.id, order.id)}
								style={{
									border: "0",
									borderRadius: "0",
									backgroundColor: localStorage.getItem("storeColor"),
								}}
							>
								{localStorage.getItem("yesCancelOrderBtn")}
							</button>
							<button
								onClick={this.handlePopupClose}
								className="btn btn-lg"
								style={{ border: "0", borderRadius: "0" }}
							>
								{localStorage.getItem("cancelGoBackBtn")}
							</button>
						</div>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default OrderCancelPopup;
