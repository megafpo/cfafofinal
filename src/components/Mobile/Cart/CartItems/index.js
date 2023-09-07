import React, { Component } from "react";

import Ink from "react-ink";
import { formatPrice } from "../../../helpers/formatPrice";
import { connect } from "react-redux";

class CartItems extends Component {
	_getItemTotal = (item) => {
		let addonTotal = 0;
		let sum = 0;
		if (item.selectedaddons) {
			item.selectedaddons.map((addonArray) => {
				addonTotal += parseFloat(addonArray.price);
				return addonTotal;
			});
		}
		sum += item.price * item.quantity + addonTotal * item.quantity;
		sum = parseFloat(sum);

		if (localStorage.getItem("currencySymbolAlign") === "left") {
			return localStorage.getItem("currencyFormat") + formatPrice(sum);
		} else {
			return formatPrice(sum) + localStorage.getItem("currencyFormat");
		}
	};
	_generateKey = (pre) => {
		let newkey = `${pre}_${new Date().getTime()}_${Math.random()
			.toString(36)
			.substring(2, 15) +
			Math.random()
				.toString(36)
				.substring(2, 15)}`;
		console.log(newkey);
		return newkey;
	};
	render() {
		const { addProductQuantity, removeProductQuantity, item, removeProduct } = this.props;
		return (
			<React.Fragment>
				<div className="cart-item-meta pt-15 pb-15 align-items-center">
					<div className="cart-item-name">
						{localStorage.getItem("showVegNonVegBadge") === "true" && item.is_veg !== null && (
							<React.Fragment>
								{item.is_veg ? (
									<img
										src="/assets/img/various/veg-icon-bg.png"
										alt="Veg"
										style={{ width: "1rem" }}
										className="mr-1"
									/>
								) : (
									<img
										src="/assets/img/various/non-veg-icon-bg.png"
										alt="Non-Veg"
										style={{ width: "1rem" }}
										className="mr-1"
									/>
								)}
							</React.Fragment>
						)}

						<span className={`${!item.is_active && "text-danger"}`}>
							<strong> {item.name}</strong>
						</span>
						{item.selectedaddons && (
							<React.Fragment>
								<br />
								{item.selectedaddons.map((addonArray, index) => (
									<React.Fragment key={item.id + addonArray.addon_id}>
										{localStorage.getItem("showAddonPricesOnCart") === "true" ? (
											<span style={{ color: "#adadad", fontSize: "0.8rem" }}>
												<p className="p-0 m-0">
													{addonArray.addon_name +
														"- " +
														localStorage.getItem("currencyFormat") +
														addonArray.price}
												</p>
												{/* {(index ? ", " : "") + addonArray.addon_name + "- " + addonArray.price } */}
											</span>
										) : (
											<span style={{ color: "#adadad", fontSize: "0.8rem" }}>
												{(index ? ", " : "") + addonArray.addon_name}
											</span>
										)}
									</React.Fragment>
								))}
							</React.Fragment>
						)}
					</div>
					{item.is_active ? (
						<React.Fragment>
							<div className="btn-group btn-group-sm cart-item-btn">
								<button
									type="button"
									className="btn btn-add-remove"
									style={{
										color: localStorage.getItem("cartColor-bg"),
									}}
									onClick={() => removeProductQuantity(item)}
								>
									<span className="btn-dec">
										{item.quantity === 1 ? (
											<i
												className="si si-trash"
												style={{
													fontSize: "0.8rem",
													top: "-0.2rem",
													WebkitTextStroke: "0.4px #f44336",
													color: "#f44336",
												}}
											/>
										) : (
											"-"
										)}
									</span>
									<Ink duration="500" />
								</button>
								<button type="button" className="btn btn-quantity">
									{item.quantity}
								</button>
								<button
									type="button"
									className="btn btn-add-remove"
									style={{
										color: localStorage.getItem("cartColor-bg"),
									}}
									onClick={() => addProductQuantity(item)}
								>
									<span className="btn-inc">+</span>
									<Ink duration="500" />
								</button>
							</div>
							<div className="cart-item-price">
								<React.Fragment>{this._getItemTotal(item)}</React.Fragment>
							</div>
						</React.Fragment>
					) : (
						<React.Fragment>
							<button
								type="button"
								className="btn btn-add-remove text-danger"
								style={{
									color: localStorage.getItem("cartColor-bg"),
									minWidth: "132.05px",
								}}
								onClick={() => {
									removeProduct(item);
								}}
							>
								{localStorage.getItem("cartRemoveItemButton")}
							</button>

							<div className="cart-item-price text-danger">
								{localStorage.getItem("cartItemNotAvailable")}
							</div>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
});

export default connect(
	mapStateToProps,
	{}
)(CartItems);
