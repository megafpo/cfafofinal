import React, { Component } from "react";
import { acceptToDeliverOrder, deliverOrder, pickupOrder } from "../../../services/Delivery/deliveryprogress/actions";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import ContentLoader from "react-content-loader";

import Meta from "../../helpers/meta";
import Moment from "react-moment";
import OrderItems from "./OrderItems";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSingleDeliveryOrder } from "../../../services/Delivery/singleorder/actions";
import ShareLiveLocation from "../ShareLiveLocation";
import ReactSwipeButton from "../../helpers/ReactSwipeButton";
import Flip from "react-reveal/Flip";
import { formatPrice } from "../../helpers/formatPrice";

class ViewOrder extends Component {
	static contextTypes = {
		router: () => null,
	};
	state = {
		initLoading: true,
		loading: false,
		already_accepted: false,
		accepted_order: false,
		picked_up: false,
		delivered: false,
		delivery_pin: "",
		delivery_pin_error: false,
		reset: false,
		max_order: false,
	};

	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
		document.getElementsByTagName("body")[0].classList.add("delivery-dark-bg");

		if (this.props.delivery_user.success) {
			this.props
				.getSingleDeliveryOrder(
					this.props.delivery_user.data.auth_token,
					this.props.match.params.unique_order_id
				)
				.then((response) => {
					if (response && response.payload) {
						if (response.payload.id) {
							this.setState({ initLoading: false });
						}
					}
				});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.single_delivery_order.orderstatus_id === 2) {
			if (nextProps.single_delivery_order.max_order) {
				this.setState({ max_order: true, reset: true });
			}
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.orderstatus_id === 3) {
			if (nextProps.single_delivery_order.already_accepted) {
				this.setState({ already_accepted: true, reset: true });
			}
			this.setState({ accepted_order: true });
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.orderstatus_id === 4) {
			this.setState({ accepted_order: true, picked_up: true });
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.delivery_pin_error) {
			this.setState({ delivery_pin_error: true, reset: true });
		}

		if (nextProps.single_delivery_order.orderstatus_id === 5) {
			this.setState({ loading: false });
			this.context.router.history.push("/delivery");
		}
	}

	__acceptToDeliver = () => {
		this.props.acceptToDeliverOrder(
			this.props.delivery_user.data.auth_token,
			this.props.delivery_user.data.id,
			this.props.single_delivery_order.id
		);
		this.setState({ loading: true });
	};

	__pickedUp = () => {
		this.props.pickupOrder(this.props.delivery_user.data.auth_token, this.props.single_delivery_order.id);
		this.setState({ loading: true });
	};

	__delivered = () => {
		this.props.deliverOrder(
			this.props.delivery_user.data.auth_token,
			this.props.single_delivery_order.id,
			this.state.delivery_pin
		);
		this.setState({ loading: true });
	};

	__getDirectionToRestaurant = (restaurant_latitude, restaurant_longitude) => {
		// http://maps.google.com/maps?q=24.197611,120.780512
		const directionUrl = "http://maps.google.com/maps?q=" + restaurant_latitude + "," + restaurant_longitude;
		window.open(directionUrl, "_blank");
	};
	__getDirectionToUser = (user_order_loaction) => {
		// http://maps.google.com/maps?q=24.197611,120.780512
		try {
			JSON.parse(user_order_loaction);
			const directionUrl =
				"http://maps.google.com/maps?q=" +
				JSON.parse(user_order_loaction).lat +
				"," +
				JSON.parse(user_order_loaction).lng;
			window.open(directionUrl, "_blank");
		} catch {
			JSON.parse(user_order_loaction);
			const directionUrl = "http://maps.google.com/maps?q=" + user_order_loaction;
			window.open(directionUrl, "_blank");
		}
	};

	__handleDeliveryPinInput = (e) => {
		this.setState({ delivery_pin: e.target.value });
	};

	getDeliveryGuyTotalEarning = (order) => {
		let total = 0.0;
		if (order.commission) {
			total += parseFloat(order.commission);
		}
		if (order.tip_amount) {
			total += parseFloat(order.tip_amount);
		}
		return formatPrice(total);
	};

	render() {
		console.log(this.state);
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const order = this.props.single_delivery_order;
		return (
			<React.Fragment>
				<Meta
					seotitle="Delivery Orders"
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				<BackWithSearch
					boxshadow={true}
					has_title={true}
					title={
						order.unique_order_id && "#" + order.unique_order_id.substr(order.unique_order_id.length - 8)
					}
					disable_search={true}
					dark={true}
				/>

				{this.state.initLoading ? (
					<div className="pt-50">
						<ContentLoader
							height={150}
							width={400}
							speed={1.2}
							primaryColor={
								localStorage.getItem("deliveryAppLightMode") === "true" ? "#E0E0E0" : "#161b31"
							}
							secondaryColor={
								localStorage.getItem("deliveryAppLightMode") === "true" ? "#fefefe" : "#222b45"
							}
						>
							<rect x="20" y="70" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="85" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="115" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					</div>
				) : (
					<React.Fragment>
						{this.state.loading && (
							<div className="height-100 overlay-loading ongoing-payment-spin">
								<div className="spin-load" />
							</div>
						)}

						{!this.state.delivered && (
							<React.Fragment>
								{this.state.max_order && (
									<div className="delivery-error delivery-max-order-reached">
										<div className="error-shake">
											{localStorage.getItem("deliveryMaxOrderReachedMsg")}
										</div>
									</div>
								)}
								{this.state.already_accepted ? (
									<div className="delivery-error delivery-already-accepted-error">
										<div className="error-shake">
											{localStorage.getItem("deliveryAlreadyAccepted")}
										</div>
									</div>
								) : (
									<React.Fragment>
										<div
											className="view-delivery-order"
											style={{ paddingBottom: "20rem", paddingTop: "4rem" }}
										>
											{(localStorage.getItem("enableDeliveryGuyEarning") === "true" ||
												order.tip_amount > 0) && (
												<div className="pt-20 px-15 pb-15">
													<div className="p-15 single-order-earnings-block">
														{localStorage.getItem("enableDeliveryGuyEarning") ===
															"true" && (
															<div className="d-flex justify-content-between">
																<div>
																	{localStorage.getItem(
																		"deliveryEarningCommissionText"
																	)}
																</div>
																<div>
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}
																	{order.commission}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</div>
															</div>
														)}

														{order.tip_amount > 0 && (
															<div className="d-flex justify-content-between">
																<div>
																	{localStorage.getItem("deliveryEarningTipText")}
																</div>
																<div>
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}
																	{order.tip_amount}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</div>
															</div>
														)}
														<hr className="single-item-division-hr" />
														<div className="d-flex justify-content-between align-items-center single-order-total-earnings">
															<div>
																{localStorage.getItem(
																	"deliveryEarningTotalEarningText"
																)}
															</div>
															<div>
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" && localStorage.getItem("currencyFormat")}
																{this.getDeliveryGuyTotalEarning(order)}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</div>
														</div>
													</div>
												</div>
											)}

											{order.cash_change_amount !== null && order.cash_change_amount !== "0" && (
												<div className="p-15">
													<div className="single-order-metas d-flex justify-content-between">
														<div>
															<i className="si si-calculator mr-5" />
															{localStorage.getItem(
																"deliveryAppRequestedCashChangeMsg"
															)}{" "}
															<b>
																<React.Fragment>
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}
																	{order.cash_change_amount}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</React.Fragment>
															</b>
														</div>
													</div>
												</div>
											)}
											{order.schedule_slot !== null && (
												<div className="p-15">
													<div class="d-flex justify-content-between p-15 mb-3 delivery-scheduleSlot-block">
														<div className="delivery-scheduleSlot-view-title">
															<b>{localStorage.getItem("scheduledOrderStatusText")}</b>
														</div>
														<div className="delivery-scheduleSlot-view-slot">
															<b>
																{JSON.parse(order.schedule_date).day},{" "}
																{JSON.parse(order.schedule_date).date} (
																{JSON.parse(order.schedule_slot).open} -{" "}
																{JSON.parse(order.schedule_slot).close})
															</b>
														</div>
													</div>
												</div>
											)}

											<div className="p-15">
												<div className="single-order-metas d-flex justify-content-between">
													<div>
														<i className="si si-clock mr-5" />{" "}
														{localStorage.getItem("deliveryOrderPlacedText")}:{" "}
														<Moment fromNow interval={5000}>
															{order.created_at}
														</Moment>
													</div>
												</div>

												<ul className="list list-timeline list-timeline-modern delivery-address-timeline pull-t pb-20">
													<li>
														<i className="list-timeline-icon si si-basket-loaded bg-del-timeline-icon" />
														<Flip bottom duration={500}>
															<div className="list-timeline-content">
																<p className="m-0 font-w700">{order.restaurant.name}</p>
																<p className="m-0 single-order-restaurant-description">
																	{order.restaurant.description}
																</p>
																<p className="m-0">{order.restaurant.address}</p>
																<p className="mb-2">{order.restaurant.pincode}</p>
																<div
																	onClick={() =>
																		this.__getDirectionToRestaurant(
																			order.restaurant.latitude,
																			order.restaurant.longitude
																		)
																	}
																>
																	<button className="btn btn-get-direction">
																		<i className="si si-action-redo mr-5" />
																		{localStorage.getItem(
																			"deliveryGetDirectionButton"
																		)}
																	</button>
																</div>
															</div>
														</Flip>
													</li>

													<li className="mt-20">
														<i className="list-timeline-icon si si-pointer bg-del-timeline-icon" />
														<Flip bottom duration={1000}>
															<div className="list-timeline-content">
																<p className="font-w700">{order.user.name}</p>
																<p className="mb-0">{order.user.phone}</p>
																<p className="mb-2">{order.address}</p>
																<div>
																	<button
																		className="btn btn-get-direction mr-2"
																		onClick={() =>
																			this.__getDirectionToUser(order.location)
																		}
																	>
																		<i className="si si-action-redo mr-5" />
																		{localStorage.getItem(
																			"deliveryGetDirectionButton"
																		)}
																	</button>
																	<a
																		className="btn btn-get-direction"
																		href={"tel:" + order.user.phone}
																	>
																		<i className="si si-call-out mr-5" />
																		{localStorage.getItem("callNowButton")}{" "}
																	</a>
																</div>
															</div>
														</Flip>
													</li>
												</ul>
											</div>
											<div className="pt-15 px-15">
												<div className="single-order-items-title">
													<i className="si si-list mr-2" />
													{localStorage.getItem("deliveryOrderItems")}
												</div>
												<div className="p-15 single-order-items-list">
													{order.orderitems.map((item) => (
														<OrderItems item={item} key={item.id} />
													))}
													{localStorage.getItem("showPriceAndOrderCommentsDelivery") ===
														"true" && (
														<React.Fragment>
															<p>{order.order_comment}</p>
															<p
																className={`pull-right font-w700 h4 ${
																	localStorage.getItem("deliveryAppLightMode") ===
																	"true"
																		? "text-dark"
																		: "text-white"
																}`}
															>
																Total:{" "}
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" && localStorage.getItem("currencyFormat")}
																{order.total}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</p>
															<div className="clearfix" />
														</React.Fragment>
													)}
												</div>
											</div>
											{this.state.picked_up && (
												<React.Fragment>
													<div className="pt-15 px-15">
														{order.payment_mode === "COD" ? (
															<button className="btn btn-cod">
																{localStorage.getItem("deliveryCashOnDelivery")}:{" "}
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" && localStorage.getItem("currencyFormat")}
																{order.payable}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</button>
														) : (
															<button className="btn btn-payed-online">
																<i className="si si-check mr-5" />{" "}
																{localStorage.getItem("deliveryOnlinePayment")}
															</button>
														)}
													</div>
													{localStorage.getItem("enableDeliveryPin") === "true" && (
														<div className="pt-10 px-15 delivery-pin-block">
															<div className="form-group">
																<div className="row">
																	<div className="col-12">
																		<input
																			type="tel"
																			className="form-control"
																			placeholder={localStorage.getItem(
																				"deliveryDeliveryPinPlaceholder"
																			)}
																			onChange={this.__handleDeliveryPinInput}
																		/>
																		{this.state.delivery_pin_error && (
																			<div
																				className="delivery-pin-error"
																				style={{
																					zIndex: "9",
																					marginBottom: "4rem",
																				}}
																			>
																				<div className="error-shake">
																					{localStorage.getItem(
																						"deliveryInvalidDeliveryPin"
																					)}
																				</div>
																			</div>
																		)}
																	</div>
																</div>
															</div>
														</div>
													)}
												</React.Fragment>
											)}
											<div className="delivery-action">
												{!this.state.accepted_order &&
													!this.state.picked_up &&
													!this.state.delivered && (
														<React.Fragment>
															<ReactSwipeButton
																text={localStorage.getItem("deliveryAcceptOrderButton")}
																color={localStorage.getItem("storeColor")}
																onSuccess={this.__acceptToDeliver}
																reset={this.state.reset}
															/>
														</React.Fragment>
													)}
												{this.state.accepted_order &&
													!this.state.picked_up &&
													!this.state.delivered && (
														<ReactSwipeButton
															text={localStorage.getItem("deliveryPickedUpButton")}
															color={localStorage.getItem("storeColor")}
															onSuccess={this.__pickedUp}
															reset={this.state.reset}
														/>
													)}
												{this.state.accepted_order &&
													this.state.picked_up &&
													!this.state.delivered && (
														<ReactSwipeButton
															text={localStorage.getItem("deliveryDeliveredButton")}
															color={localStorage.getItem("storeColor")}
															onSuccess={this.__delivered}
															reset={this.state.reset}
														/>
													)}
												{this.state.accepted_order &&
													this.state.picked_up &&
													this.state.delivered && (
														<button
															type="button"
															className="btn btn-accept"
															style={{
																backgroundColor: localStorage.getItem("storeColor"),
															}}
														>
															<i className="si si-check mr-5" />
															{localStorage.getItem("deliveryOrderCompletedButton")}
														</button>
													)}
											</div>
										</div>
									</React.Fragment>
								)}
							</React.Fragment>
						)}
					</React.Fragment>
				)}
				<ShareLiveLocation />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	single_delivery_order: state.single_delivery_order.single_delivery_order,
	accepted_order: state.accepted_order.accepted_order,
});

export default connect(
	mapStateToProps,
	{ getSingleDeliveryOrder, acceptToDeliverOrder, pickupOrder, deliverOrder }
)(ViewOrder);
