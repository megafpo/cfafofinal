import React, { Component } from "react";

import DelayLink from "../../../../helpers/delayLink";
import Ink from "react-ink";
import Moment from "react-moment";

import { formatPrice } from "../../../../helpers/formatPrice";
import OrderCancelPopup from "./OrderCancelPopup";
import AwaitingPaymentTimer from "./AwaitingPaymentTimer";

class OrderList extends Component {
	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.add("bg-grey");
	}

	__getOrderStatus = (id) => {
		if (id === 1) {
			return localStorage.getItem("orderPlacedStatusText");
		}
		if (id === 2) {
			return localStorage.getItem("preparingOrderStatusText");
		}
		if (id === 3) {
			return localStorage.getItem("deliveryGuyAssignedStatusText");
		}
		if (id === 4) {
			return localStorage.getItem("orderPickedUpStatusText");
		}
		if (id === 5) {
			return localStorage.getItem("deliveredStatusText");
		}
		if (id === 6) {
			return localStorage.getItem("canceledStatusText");
		}
		if (id === 7) {
			return localStorage.getItem("readyForPickupStatusText");
		}
		if (id === 8) {
			return localStorage.getItem("awaitingPaymentStatusText");
		}
		if (id === 9) {
			return localStorage.getItem("paymentFailedStatusText");
		}
		if (id === 10) {
			return localStorage.getItem("scheduledOrderStatusText");
		}
		if (id === 11) {
			return localStorage.getItem("confirmedOrderStatusText");
		}
	};

	_getTotalItemCost = (item) => {
		let itemCost = parseFloat(item.price) * item.quantity;
		if (item.order_item_addons.length) {
			item.order_item_addons.map((addon) => {
				itemCost += parseFloat(addon.addon_price) * item.quantity;
				return itemCost;
			});
		}
		return formatPrice(itemCost);
	};

	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
	}

	render() {
		const { order, user, cancelOrder } = this.props;
		return (
			<React.Fragment>
				<div className="bill-details mb-2 bg-white">
					<div className="p-3" style={{ borderRadius: "0.275rem" }}>
						<div className="pull-right">
							{(order.orderstatus_id === 1 ||
								order.orderstatus_id === 2 ||
								order.orderstatus_id === 3 ||
								order.orderstatus_id === 4 ||
								order.orderstatus_id === 7 ||
								order.orderstatus_id === 8) && (
								<DelayLink
									to={`/running-order/${order.unique_order_id}`}
									className="btn btn-square btn-outline-secondary mb-10 order-track-button"
									delay={250}
									style={{ position: "relative" }}
								>
									{localStorage.getItem("trackOrderText")}
									<span className="pulse ml-2" />
									<Ink duration="500" />
								</DelayLink>
							)}
						</div>
						<div className="pull-right">
							{order.is_ratable && (
								<DelayLink
									to={`/rate-order/${order.id}`}
									className="btn btn-square btn-outline-secondary mb-10 order-track-button"
									delay={250}
									style={{ position: "relative" }}
								>
									{localStorage.getItem("orderRateOrderButton")}
									<Ink duration="500" />
								</DelayLink>
							)}
						</div>
						<div className="display-flex">
							<div className="flex-auto">
								<button
									className={`mr-5 btn btn-square btn-outline-secondary min-width-125 mb-10 order-status-button text-muted ${order.orderstatus_id ===
										6 && "text-danger"} ${order.orderstatus_id === 11 && "order-confirmed-badge"}`}
								>
									{this.__getOrderStatus(order.orderstatus_id)}
								</button>
							</div>
						</div>
						{order.schedule_slot !== null && (
							<p className="mb-0 orderlist-scheduleSlot">
								{JSON.parse(order.schedule_date).day}, {JSON.parse(order.schedule_date).date} (
								{JSON.parse(order.schedule_slot).open} - {JSON.parse(order.schedule_slot).close})
							</p>
						)}
						<span className="text-muted pull-right" style={{ fontSize: "0.9rem" }}>
							{localStorage.getItem("showFromNowDate") === "true" ? (
								<Moment fromNow>{order.created_at}</Moment>
							) : (
								<Moment format="DD/MM/YYYY hh:mma">{order.created_at}</Moment>
							)}
						</span>
						<div className="flex-auto">
							<h6 className="font-w700 mb-2" style={{ color: localStorage.getItem("storeColor") }}>
								{order.unique_order_id}
							</h6>
							{order.restaurant && (
								<DelayLink to={`/stores/${order.restaurant.slug}`} delay={100}>
									<h6 className="font-w600">{order.restaurant.name}</h6>
								</DelayLink>
							)}
						</div>
						<hr />
						{order.orderitems.map((item) => (
							<div className="mb-2" key={item.id}>
								<div className="display-flex pb-5">
									<span className="order-item-quantity mr-10">x{item.quantity}</span>
									<div className="flex-auto text-left font-w600">{item.name}</div>
									<div className="flex-auto text-right font-w600">
										{localStorage.getItem("currencySymbolAlign") === "left" &&
											localStorage.getItem("currencyFormat")}
										{this._getTotalItemCost(item)}
										{localStorage.getItem("currencySymbolAlign") === "right" &&
											localStorage.getItem("currencyFormat")}
									</div>
								</div>
								{item.order_item_addons.map((addon) => (
									<div className="display-flex pb-5" key={addon.id}>
										<div className="flex-auto text-left">
											<small>{addon.addon_name}</small>
										</div>
										<div className="flex-auto text-right">
											<small>
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat")}
												{addon.addon_price}
												{localStorage.getItem("currencySymbolAlign") === "right" &&
													localStorage.getItem("currencyFormat")}
											</small>
										</div>
									</div>
								))}
							</div>
						))}
						<hr />
						<React.Fragment>
							{order.coupon_name && (
								<div className="display-flex mt-10">
									<React.Fragment>
										<div className="flex-auto">
											<small>Coupon: </small>
										</div>
										<div className="flex-auto text-right">
											<small>{order.coupon_name} </small>{" "}
											{order.coupon_amount && (
												<small>
													(-
													{localStorage.getItem("currencySymbolAlign") === "left" &&
														localStorage.getItem("currencyFormat")}
													{order.coupon_amount}
													{localStorage.getItem("currencySymbolAlign") === "right" &&
														localStorage.getItem("currencyFormat")}
													)
												</small>
											)}
										</div>
									</React.Fragment>
								</div>
							)}
							{order.restaurant_charge !== null && (
								<div className="display-flex mt-10">
									<React.Fragment>
										<div className="flex-auto">
											<small>{localStorage.getItem("cartRestaurantCharges")}:</small>{" "}
										</div>
										<div className="flex-auto text-right">
											<small>
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat")}
												{order.restaurant_charge}
												{localStorage.getItem("currencySymbolAlign") === "right" &&
													localStorage.getItem("currencyFormat")}
											</small>
										</div>
									</React.Fragment>
								</div>
							)}
							<div className="display-flex mt-10">
								<React.Fragment>
									<div className="flex-auto">
										<small>{localStorage.getItem("cartDeliveryCharges")}:</small>{" "}
									</div>
									<div className="flex-auto text-right">
										<small>
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}
											{order.delivery_charge || 0}
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}
										</small>
									</div>
								</React.Fragment>
							</div>
							{order.tip_amount !== null && (
								<React.Fragment>
									{order.tip_amount > 0 && (
										<div className="display-flex mt-10">
											<div className="flex-auto">
												<small>{localStorage.getItem("tipText")}: </small>
											</div>
											<div className="flex-auto text-right text-danger">
												<small>
													{localStorage.getItem("currencySymbolAlign") === "left" &&
														localStorage.getItem("currencyFormat")}
													{order.tip_amount}
													{localStorage.getItem("currencySymbolAlign") === "right" &&
														localStorage.getItem("currencyFormat")}
												</small>
											</div>
										</div>
									)}
								</React.Fragment>
							)}
							{order.tax && (
								<div className="display-flex mt-10">
									<React.Fragment>
										<div className="flex-auto">
											<small>{localStorage.getItem("taxText")}: </small>
										</div>
										<div className="flex-auto text-right text-danger">
											<small>
												{order.tax}%{" "}
												{order.tax_amount && (
													<React.Fragment>
														(+
														{localStorage.getItem("currencySymbolAlign") === "left" &&
															localStorage.getItem("currencyFormat")}
														{order.tax_amount}
														{localStorage.getItem("currencySymbolAlign") === "right" &&
															localStorage.getItem("currencyFormat")}
														)
													</React.Fragment>
												)}
											</small>
										</div>
									</React.Fragment>
								</div>
							)}

							<div className="display-flex mt-10 font-w700">
								<React.Fragment>
									<div className="flex-auto">{localStorage.getItem("orderTextTotal")}</div>
									<div className="flex-auto text-right">
										{localStorage.getItem("currencySymbolAlign") === "left" &&
											localStorage.getItem("currencyFormat")}
										{order.total}
										{localStorage.getItem("currencySymbolAlign") === "right" &&
											localStorage.getItem("currencyFormat")}
									</div>
								</React.Fragment>
							</div>

							{order.wallet_amount && (
								<div className="display-flex mt-10">
									<div className="flex-auto">
										{localStorage.getItem("orderAmountPaidWithWallet")}:
									</div>
									<div className="flex-auto text-right">
										-
										{localStorage.getItem("currencySymbolAlign") === "left" &&
											localStorage.getItem("currencyFormat")}
										{order.wallet_amount}
										{localStorage.getItem("currencySymbolAlign") === "right" &&
											localStorage.getItem("currencyFormat")}
									</div>
								</div>
							)}

							{!(order.orderstatus_id === 5 || order.orderstatus_id === 6) && (
								<React.Fragment>
									{order.payment_mode === "COD" && (
										<React.Fragment>
											{(order.payable !== null || order.payable !== "0.00") && (
												<div className="display-flex mt-10">
													<div className="flex-auto">
														{localStorage.getItem("orderAmountRemainingToPay")}:{" "}
													</div>
													<div className="flex-auto text-right">
														{localStorage.getItem("currencySymbolAlign") === "left" &&
															localStorage.getItem("currencyFormat")}
														{order.payable + (order.delivery_charge?parseFloat(order.delivery_charge):0)}
														{localStorage.getItem("currencySymbolAlign") === "right" &&
															localStorage.getItem("currencyFormat")}
													</div>
												</div>
											)}
										</React.Fragment>
									)}
								</React.Fragment>
							)}

							<div className="display-flex mt-10 font-w700">
								<React.Fragment>
									<div className="flex-auto">{localStorage.getItem("orderDetailsPaymentMode")}</div>
									<div className="flex-auto text-right">{order.payment_mode}</div>
								</React.Fragment>
							</div>
						</React.Fragment>
						<p className="small mt-2 orderlist-address">{order.address}</p>
						{(order.orderstatus_id === 1 || order.orderstatus_id === 10) && (
							<React.Fragment>
								<div className="pull-right">
									<OrderCancelPopup order={order} user={user} cancelOrder={cancelOrder} />
								</div>
								<div className="clearfix" />
							</React.Fragment>
						)}

						{order.orderstatus_id === 8 && <AwaitingPaymentTimer order={order} />}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default OrderList;
