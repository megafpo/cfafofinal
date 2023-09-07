import React, { Component } from "react";

class OrderInfo extends Component {
	render() {
		const item = this.props.item;
		return (
			<React.Fragment>
				<div className="d-flex justify-content-between">
					<div>
						<span className="delivery-order-item-quantity">{item.quantity}x</span>
					</div>
					<div style={{ maxWidth: "200px", minWidth: "200px" }}>
						<strong>{item.name}</strong>
					</div>

					{localStorage.getItem("showPriceAndOrderCommentsDelivery") === "true" && (
						<div className="cart-item-price">
							<React.Fragment>
								{localStorage.getItem("currencySymbolAlign") === "left" &&
									localStorage.getItem("currencyFormat")}
								{item.price * item.quantity}
								{localStorage.getItem("currencySymbolAlign") === "right" &&
									localStorage.getItem("currencyFormat")}
							</React.Fragment>
						</div>
					)}
				</div>
				{localStorage.getItem("showOrderAddonsDelivery") === "true" && (
					<div className="delivery-items-addons-block">
						{item &&
							item.order_item_addons.map((addonArray, index) => (
								<React.Fragment key={item.id + addonArray.id + index}>
									<div className="d-flex justify-content-between">
										<div>{addonArray.addon_name}</div>
										<div>
											{localStorage.getItem("showPriceAndOrderCommentsDelivery") === "true" && (
												<React.Fragment>
													{localStorage.getItem("currencySymbolAlign") === "left" &&
														localStorage.getItem("currencyFormat")}{" "}
													{addonArray.addon_price}
													{localStorage.getItem("currencySymbolAlign") === "right" &&
														localStorage.getItem("currencyFormat")}
												</React.Fragment>
											)}
										</div>
									</div>
								</React.Fragment>
							))}
					</div>
				)}
				<hr className="single-item-division-hr" />
			</React.Fragment>
		);
	}
}

export default OrderInfo;
