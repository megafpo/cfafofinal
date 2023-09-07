import React, { Component } from "react";
import Ink from "react-ink";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import CountTo from "react-count-to";

class NewOrders extends Component {
	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
		document.getElementsByTagName("body")[0].classList.add("delivery-dark-bg");
	}

	__refreshOrders = () => {
		if (this.refs.btnSpinner) {
			this.refs.btnSpinner.classList.add("fa-spin");
		}
		setTimeout(() => {
			if (this.refs.btnSpinner) {
				this.refs.btnSpinner.classList.remove("fa-spin");
			}
		}, 2 * 1000);
		this.props.refreshOrders();
	};

	getDeliveryGuyTotalEarning = (order) => {
		let total = 0.0;
		if (order.commission) {
			total += parseFloat(order.commission);
		}
		if (order.tip_amount) {
			total += parseFloat(order.tip_amount);
		}
		return total;
	};

	render() {
		const { new_orders, delivery_user } = this.props;

		return (
			<React.Fragment>
				<div className="mb-100">
					<div className="d-flex justify-content-between nav-dark">
						{delivery_user.data.status ? (
							<React.Fragment>
								<div className="delivery-tab-title px-20 py-15">
									{localStorage.getItem("deliveryNewOrdersTitle")}
								</div>

								<div className="delivery-order-refresh">
									<button
										className="btn btn-refreshOrders mr-15"
										onClick={this.__refreshOrders}
										style={{ position: "relative" }}
									>
										{localStorage.getItem("deliveryOrdersRefreshBtn")}{" "}
										<i ref="btnSpinner" className="fa fa-refresh" />
										<Ink duration={1200} />
									</button>
								</div>
							</React.Fragment>
						) : null}
					</div>
					{delivery_user.data.status ? (
						<React.Fragment>
							{new_orders.length === 0 ? (
								<p className="text-center text-muted py-15 mb-10 bg-white">
									{localStorage.getItem("deliveryNoNewOrders")}
								</p>
							) : (
								<div className="p-15">
									<div className="delivery-list-wrapper pb-20">
										{new_orders.map((order) => (
											<Link
												to={`/delivery/orders/${order.unique_order_id}`}
												key={order.id}
												style={{ position: "relative" }}
											>
												<div className="delivery-list-item px-15 pb-5 pt-15">
													<div className="d-flex justify-content-between">
														<div>
															<p className="m-0">
																{localStorage.getItem("showFromNowDate") === "true" ? (
																	<Moment fromNow>{order.updated_at}</Moment>
																) : (
																	<Moment format="DD/MM/YYYY hh:mma">
																		{order.updated_at}
																	</Moment>
																)}
															</p>
														</div>
														<div>
															{localStorage.getItem("enableDeliveryGuyEarning") ===
																"true" && (
																<p className="m-0 list-delivery-commission">
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}

																	<CountTo
																		to={this.getDeliveryGuyTotalEarning(order)}
																		speed={1000}
																		digits={2}
																	/>
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</p>
															)}
														</div>
													</div>

													<div className="d-flex justify-content-between">
														<div className="font-w700 list-delivery-store-name">
															{order.restaurant.name}
														</div>
														<div>
															<p className="m-0 font-w700">
																#
																{order.unique_order_id.substr(
																	order.unique_order_id.length - 8
																)}
															</p>
														</div>
													</div>

													<p>
														{localStorage.getItem("showDeliveryFullAddressOnList") ===
														"true" ? (
															<span>{order.address}</span>
														) : (
															<span className="d-flex align-items-center">
																<i className="si si-pointer mr-2" />
																<span
																	style={{ maxWidth: "100%", display: "block" }}
																	className="truncate-text"
																>
																	{order.address}
																</span>
															</span>
														)}
													</p>
												</div>
												<Ink duration="500" hasTouch="true" />
											</Link>
										))}
									</div>
								</div>
							)}
						</React.Fragment>
					) : (
						<div className="d-flex justify-content-center pt-100">
							<div className="delivery-guy-status delivery-guy-offline">
								<span>{localStorage.getItem("deliveryAppYouAreOfflineBtn")}</span>
							</div>
						</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default NewOrders;
