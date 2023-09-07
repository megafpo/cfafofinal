import React, { Component } from "react";

import { connect } from "react-redux";
import { formatPrice } from "../../../helpers/formatPrice";
import { couponApplied } from "../../../../services/coupon/actions";

class BillDetails extends Component {
	state = {
		delivery_charges: 0,
		distance: 0,
		tips: 0,
		couponAppliedAmount: 0,
	};

	componentDidMount() {
		if (localStorage.getItem("userSelected") === "SELFPICKUP") {
			this.setState({ delivery_charges: 0 });
		} else {
			if (parseFloat(this.props.restaurant_info.free_delivery_subtotal) > 0) {
				if (parseFloat(this.props.total) >= parseFloat(this.props.restaurant_info.free_delivery_subtotal)) {
					console.log("Free Delivery 😍");
					this.setState({ delivery_charges: 0 });
				} else {
					this.setState({ delivery_charges: this.props.restaurant_info.delivery_charges });
				}
			} else {
				this.setState({ delivery_charges: this.props.restaurant_info.delivery_charges });
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (localStorage.getItem("userSelected") === "DELIVERY") {
			if (this.props.restaurant_info.delivery_charges !== nextProps.restaurant_info.delivery_charges) {
				this.setState({ delivery_charges: nextProps.restaurant_info.delivery_charges });
			}

			if (this.props.total !== nextProps.total) {
				if (nextProps.restaurant_info.delivery_charge_type !== "DYNAMIC") {
					if (parseFloat(nextProps.restaurant_info.free_delivery_subtotal) > 0) {
						if (
							parseFloat(nextProps.total) >= parseFloat(nextProps.restaurant_info.free_delivery_subtotal)
						) {
							console.log("Free Delivery 😍");
							this.setState({ delivery_charges: 0 });
						} else {
							this.setState({ delivery_charges: nextProps.restaurant_info.delivery_charges });
						}
					} else {
						this.setState({ delivery_charges: nextProps.restaurant_info.delivery_charges });
					}
					return;
				}
			}
		}

		// if (nextProps.distance) {
		if (localStorage.getItem("userSelected") === "DELIVERY") {
			if (nextProps.restaurant_info.delivery_charge_type === "DYNAMIC") {
				this.setState({ distance: nextProps.distance }, () => {
					if (parseFloat(nextProps.restaurant_info.free_delivery_subtotal) > 0) {
						if (
							parseFloat(nextProps.total) >= parseFloat(nextProps.restaurant_info.free_delivery_subtotal)
						) {
							console.log("Free Delivery 😍");
							this.setState({ delivery_charges: 0 });
						} else {
							//check if restaurant has dynamic delivery charge..
							this.calculateDynamicDeliveryCharge();
						}
					} else {
						//check if restaurant has dynamic delivery charge..
						this.calculateDynamicDeliveryCharge();
					}
				});
			} else {
				this.setState({ distance: nextProps.distance });
			}
		}
		// }
	}

	calculateDynamicDeliveryCharge = () => {
		const { restaurant_info } = this.props;

		const distanceFromUserToRestaurant = this.state.distance;
		console.log("Distance from user to restaurant: " + distanceFromUserToRestaurant + " km");

		if (distanceFromUserToRestaurant > restaurant_info.base_delivery_distance) {
			const extraDistance = distanceFromUserToRestaurant - restaurant_info.base_delivery_distance;
			console.log("Extra Distance: " + extraDistance + " km");

			const extraCharge =
				(extraDistance / restaurant_info.extra_delivery_distance) * restaurant_info.extra_delivery_charge;
			console.log("Extra Charge: " + extraCharge);

			let dynamicDeliveryCharge = parseFloat(restaurant_info.base_delivery_charge) + parseFloat(extraCharge);
			console.log("Total Charge: " + dynamicDeliveryCharge);
			if (localStorage.getItem("enDelChrRnd") === "true") {
				dynamicDeliveryCharge = Math.ceil(dynamicDeliveryCharge);
			}

			this.setState({ delivery_charges: dynamicDeliveryCharge });
		} else {
			this.setState({ delivery_charges: restaurant_info.base_delivery_charge });
		}
	};

	// Calculating total with/without coupon/tax
	getTotalAfterCalculation = () => {
		const { total, restaurant_info, coupon, tips, deliveryCharges } = this.props;
		let calc = 0;
		if (coupon.code) {
			if (coupon.discount_type === "PERCENTAGE") {
				let percentage_discount = formatPrice((coupon.discount / 100) * parseFloat(total));
				if (coupon.max_discount) {
					if (parseFloat(percentage_discount) >= coupon.max_discount) {
						percentage_discount = coupon.max_discount;
					}
				}

				this.props.couponApplied(coupon, percentage_discount);
				const saveCouponAppliedAmount = new Promise((resolve) => {
					localStorage.setItem("couponAppliedAmount", percentage_discount);
					resolve("Saved");
				});
				saveCouponAppliedAmount.then(() => {
					this.checkAndSetAppliedAmount();
				});

				calc = formatPrice(
					formatPrice(
						parseFloat(total) -
							percentage_discount +
							parseFloat(restaurant_info.restaurant_charges || 0.0) +
							parseFloat(this.state.delivery_charges || 0.0)
					)
				);
			} else {
				calc = formatPrice(
					parseFloat(total) -
						(parseFloat(coupon.discount) || 0.0) +
						((parseFloat(restaurant_info.restaurant_charges) || 0.0) +
							(parseFloat(this.state.delivery_charges) || 0.0))
				);
			}
		} else {
			calc = formatPrice(
				parseFloat(total) +
					parseFloat(restaurant_info.restaurant_charges || 0.0) +
					parseFloat(deliveryCharges   || 0.0)
			);
		}

		if (localStorage.getItem("taxApplicable") === "true") {
			calc = formatPrice(
				parseFloat(
					parseFloat(calc) + parseFloat(parseFloat(localStorage.getItem("taxPercentage")) / 100) * calc
				)
			);
		}

		if (tips.value > 0) {
			calc = parseFloat(calc) + parseFloat(tips.value);
		}

		return formatPrice(calc);
	};

	checkAndSetAppliedAmount = () => {
		let elem = "";
		if (localStorage.getItem("currencySymbolAlign") === "left") {
			elem = "(" + localStorage.getItem("currencyFormat") + localStorage.getItem("couponAppliedAmount") + ")";
		} else {
			elem = "(" + localStorage.getItem("couponAppliedAmount") + localStorage.getItem("currencyFormat") + ")";
		}

		if (this.refs.appliedAmount) {
			this.refs.appliedAmount.innerHTML = elem;
		}
	};

	render() {
		const { total, restaurant_info, coupon, tips, removeTip, deliveryCharges } = this.props;
		return (
			<React.Fragment>
				<div className="px-15">
					<div
						className={`bg-white bill-details mb-200 ${!this.props.alreadyRunningOrders &&
							"border-radius-4px"}`}
					>
						<div className="p-15">
							<h2 className="bill-detail-text m-0">{localStorage.getItem("cartBillDetailsText")}</h2>
							<div className="display-flex">
								<div className="flex-auto">{localStorage.getItem("cartItemTotalText")}</div>
								<div className="flex-auto text-right">
									{localStorage.getItem("currencySymbolAlign") === "left" &&
										localStorage.getItem("currencyFormat")}
									{formatPrice(total)}
									{localStorage.getItem("currencySymbolAlign") === "right" &&
										localStorage.getItem("currencyFormat")}
								</div>
							</div>
							<hr />
							{coupon.code && (
								<React.Fragment>
									<div className="display-flex">
										<div className="flex-auto coupon-text">
											{localStorage.getItem("cartCouponText")}
										</div>
										<div className="flex-auto text-right coupon-text">
											<span>-</span>
											{coupon.discount_type === "PERCENTAGE" ? (
												<React.Fragment>
													{coupon.discount}%{" "}
													<span className="coupon-appliedAmount" ref="appliedAmount">
														{this.checkAndSetAppliedAmount()}
													</span>
												</React.Fragment>
											) : (
												<React.Fragment>
													{localStorage.getItem("currencySymbolAlign") === "left" &&
														localStorage.getItem("currencyFormat") + coupon.discount}

													{localStorage.getItem("currencySymbolAlign") === "right" &&
														coupon.discount + localStorage.getItem("currencyFormat")}
												</React.Fragment>
											)}
										</div>
									</div>
									<hr />
								</React.Fragment>
							)}
							{restaurant_info.restaurant_charges === "0.00" ||
							restaurant_info.restaurant_charges === null ? null : (
								<React.Fragment>
									<div className="display-flex">
										<div className="flex-auto">{localStorage.getItem("cartRestaurantCharges")}</div>
										<div className="flex-auto text-right">
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}
											{restaurant_info.restaurant_charges}
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}
										</div>
									</div>
									<hr />
								</React.Fragment>
							)}

							{this.state.delivery_charges === 0 ? (
								<React.Fragment>
									<div className="display-flex">
										<div className="flex-auto">{localStorage.getItem("cartDeliveryCharges")}</div>
										<div className="flex-auto text-right">
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}
											{deliveryCharges}
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}
										</div>
									</div>
									<hr />
								</React.Fragment>
							) : (
								<React.Fragment>
									<div className="display-flex">
										<div className="flex-auto">
											{localStorage.getItem("cartDeliveryCharges")}{" "}
											<span className="cart-delivery-distance">
												({parseFloat(this.state.distance).toFixed(1)}km)
											</span>
											{this.props.restaurant_info.free_delivery_subtotal > 0 &&
												this.state.delivery_charges > 0 && (
													<React.Fragment>
														<br />
														<div class="freeDeliveryMessageBlock">
															{localStorage.getItem("freeDeliveryPrefixText")}{" "}
															<b>
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" && localStorage.getItem("currencyFormat")}
																{parseFloat(
																	this.props.restaurant_info.free_delivery_subtotal
																) - parseFloat(this.props.total)}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</b>{" "}
															{localStorage.getItem("freeDeliverySuffixText")}
														</div>
													</React.Fragment>
												)}
										</div>
										<div className="flex-auto text-right">
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}
											{formatPrice(deliveryCharges)}
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}
										</div>
									</div>

									<hr />
								</React.Fragment>
							)}

							{localStorage.getItem("taxApplicable") === "true" && (
								<React.Fragment>
									<div className="display-flex">
										<div className="flex-auto text-danger">{localStorage.getItem("taxText")}</div>
										<div className="flex-auto text-right text-danger">
											<span>+</span>
											{localStorage.getItem("taxPercentage")}%
										</div>
									</div>
									<hr />
								</React.Fragment>
							)}

							{tips.value !== 0 && (
								<React.Fragment>
									<div className="display-flex">
										<div className="flex-auto">{localStorage.getItem("tipText")}</div>
										<div className="flex-auto text-right">
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}
											{formatPrice(tips.value)}
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}
											<br />
											<span onClick={removeTip}>
												<u>{localStorage.getItem("cartRemoveTipText")}</u>
											</span>
										</div>
									</div>
									<hr />
								</React.Fragment>
							)}

							<div className="display-flex">
								<div className="flex-auto font-w700">{localStorage.getItem("cartToPayText")}</div>
								<div className="flex-auto text-right font-w700">
									{/* Calculating total after discount coupon or without discount coupon */}
									{localStorage.getItem("currencySymbolAlign") === "left" &&
										localStorage.getItem("currencyFormat")}
									{this.getTotalAfterCalculation()}
									{localStorage.getItem("currencySymbolAlign") === "right" &&
										localStorage.getItem("currencyFormat")}
								</div>
							</div>
							{localStorage.getItem("userSelected") === "SELFPICKUP" && (
								<p className="my-2 mt-3 text-danger font-weight-bold">
									{localStorage.getItem("selectedSelfPickupMessage")}
								</p>
							)}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	coupon: state.coupon.coupon,
	restaurant_info: state.items.restaurant_info,
});

export default connect(
	mapStateToProps,
	{ couponApplied }
)(BillDetails);
