import React, { Component } from "react";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import Map from "./Map";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateUserInfo } from "../../../services/user/actions";

class RunningOrder extends Component {
	state = {
		updatedUserInfo: false,
		show_delivery_details: false,
		sendBackToOrdersPage: false,
	};
	static contextTypes = {
		router: () => null,
	};

	__refreshOrderStatus = () => {
		const { user } = this.props;
		if (user.success) {
			this.refs.refreshButton.setAttribute("disabled", "disabled");
			this.props.updateUserInfo(user.data.id, user.data.auth_token, this.props.match.params.unique_order_id);
			this.setState({ updatedUserInfo: true });
			this.refs.btnSpinner.classList.remove("hidden");
			setTimeout(() => {
				if (this.refs.refreshButton) {
					this.refs.btnSpinner.classList.add("hidden");
				}
			}, 2 * 1000);
			setTimeout(() => {
				if (this.refs.refreshButton) {
					if (this.refs.refreshButton.hasAttribute("disabled")) {
						this.refs.refreshButton.removeAttribute("disabled");
					}
				}
			}, 2 * 1000);
		}
	};

	componentDidMount() {
		const { user } = this.props;

		if (user.success) {
			this.props.updateUserInfo(user.data.id, user.data.auth_token, this.props.match.params.unique_order_id);
		}

		this.refreshSetInterval = setInterval(() => {
			this.__refreshOrderStatus();
		}, 15 * 1000);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user.running_order === null) {
			this.context.router.history.push("/my-orders");
		}
		if (nextProps.user.delivery_details !== null) {
			this.setState({ show_delivery_details: true });
		}
	}

	__getDirectionToRestaurant = (restaurant_latitude, restaurant_longitude) => {
		// http://maps.google.com/maps?q=24.197611,120.780512
		const directionUrl = "http://maps.google.com/maps?q=" + restaurant_latitude + "," + restaurant_longitude;
		window.open(directionUrl, "_blank");
	};

	componentWillUnmount() {
		clearInterval(this.refreshSetInterval);
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user } = this.props;
		if (!user.success) {
			return <Redirect to={"/"} />;
		}

		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("seoMetaTitle")}
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
						user.running_order &&
						"#" + user.running_order.unique_order_id.substr(user.running_order.unique_order_id.length - 8)
					}
					disable_search={true}
					back_to_home={false}
					goto_orders_page={true}
					homeButton={true}
				/>
				{user.running_order && (
					<React.Fragment>
						{localStorage.getItem("showMap") === "true" && user.running_order.delivery_type === 1 && (
							<Map
								restaurant_latitude={user.running_order.restaurant.latitude}
								restaurant_longitude={user.running_order.restaurant.longitude}
								order_id={user.running_order.id}
								orderstatus_id={user.running_order.orderstatus_id}
								deliveryLocation={user.running_order.location}
							/>
						)}

						<div
							className="bg-white height-100"
							style={{
								position: "absolute",
								top:
									localStorage.getItem("showMap") === "true" && user.running_order.delivery_type === 1
										? "26.3rem"
										: "4rem",
								width: "100%",
							}}
						>
							{user.running_order.delivery_type === 2 && (
								<div className="block-content block-content-full clearfix py-0 mt-30">
									<div className="d-flex">
										<div className="pr-15">
											<img
												src={user.running_order.restaurant.image}
												alt={user.running_order.restaurant.name}
												className="restaurant-image mt-0"
											/>
										</div>

										<div className="mt-5 pb-15 w-100">
											<h4 className="font-w600 mb-5 text-dark">
												{user.running_order.restaurant.name}
											</h4>
											<div className="font-size-sm text-muted truncate-text text-muted">
												{user.running_order.restaurant.address}
											</div>
											<div
												onClick={() =>
													this.__getDirectionToRestaurant(
														user.running_order.restaurant.latitude,
														user.running_order.restaurant.longitude
													)
												}
												className="mt-10"
											>
												<button className="btn btn-get-direction">
													<i className="si si-action-redo mr-5" />
													{localStorage.getItem("deliveryGetDirectionButton")}
												</button>
											</div>
										</div>
									</div>
									<hr />
								</div>
							)}
							{this.state.show_delivery_details && (
								<div className="block block-link-shadow pb-2 m-0 delivery-assigned-block">
									<div className="block-content block-content-full clearfix py-0">
										<div className="float-right">
											<img
												src={"/assets/img/delivery/" + user.delivery_details.photo}
												className="img-fluid img-avatar"
												alt={user.delivery_details.name}
											/>
										</div>

										<div className="float-left mt-20" style={{ width: "75%" }}>
											<div className="font-w600 font-size-h5 mb-5">
												{user.delivery_details.name}{" "}
												{localStorage.getItem("deliveryGuyAfterName")}
											</div>
											{(user.delivery_details.rating !== null ||
												user.delivery_details.rating !== "") && (
												<span
													className="order-deliveryguy-rating mb-1"
													style={{ backgroundColor: localStorage.getItem("storeColor") }}
												>
													<i className="fa fa-star" /> {user.delivery_details.rating}
												</span>
											)}

											<div className="font-size-sm text-muted mt-1">
												{user.delivery_details.description} <br />
												<span>
													{localStorage.getItem("vehicleText")}{" "}
													{user.delivery_details.vehicle_number}
												</span>
											</div>

											<div className="">
												<a
													className="btn btn-get-direction mt-2"
													href={"tel:" + user.delivery_details.phone}
												>
													{localStorage.getItem("callNowButton")}{" "}
													<i className="si si-call-out" />
												</a>
											</div>
										</div>
									</div>
								</div>
							)}
							<div className="mt-15 mb-200">
								{user.running_order.orderstatus_id === 8 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/various/awaiting-payment.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("awaitingPaymentTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("awaitingPaymentTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("awaitingPaymentSubTitle")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 1 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 2 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-preparing.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPreparingTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPreparingTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPreparingSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 3 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-onway.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem(
																	"runningOrderDeliveryAssignedTitle"
																)}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem(
																	"runningOrderDeliveryAssignedTitle"
																)}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem(
																	"runningOrderDeliveryAssignedSub"
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-preparing.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPreparingTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPreparingTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPreparingSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 4 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												{localStorage.getItem("enableDeliveryPin") === "true" && (
													<React.Fragment>
														<div className="font-size-h4 mb-5 px-15 text-center">
															<div className="font-w600 btn-deliverypin">
																<span className="text-muted">
																	{localStorage.getItem("runningOrderDeliveryPin")}{" "}
																</span>
																{user.running_order.delivery_pin}
															</div>
														</div>
														<hr />
													</React.Fragment>
												)}

												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-onway.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderOnwayTitle")}
																style={{
																	transform: "scaleX(-1)",
																}}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderOnwayTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderOnwaySub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-onway.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem(
																	"runningOrderDeliveryAssignedTitle"
																)}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem(
																	"runningOrderDeliveryAssignedTitle"
																)}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem(
																	"runningOrderDeliveryAssignedSub"
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-preparing.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPreparingTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPreparingTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPreparingSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 6 && (
									<div className="row">
										<div className="col-md-12">
											<div className="block block-link-shadow">
												<div className="block-content block-content-full clearfix py-0">
													<div className="float-right">
														<img
															src="/assets/img/order-canceled.png"
															className="img-fluid img-avatar"
															alt={localStorage.getItem("runningOrderCanceledTitle")}
															style={{ transform: "scaleX(-1)" }}
														/>
													</div>
													<div className="float-left mt-20" style={{ width: "75%" }}>
														<div className="font-w600 font-size-h4 mb-5">
															{localStorage.getItem("runningOrderCanceledTitle")}
														</div>
														<div className="font-size-sm text-muted">
															{localStorage.getItem("runningOrderCanceledSub")}
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</div>
								)}
								{user.running_order.orderstatus_id === 7 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/ready-for-selfpickup.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderReadyForPickup")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderReadyForPickup")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderReadyForPickupSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-preparing.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPreparingTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPreparingTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPreparingSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
							</div>
						</div>
						<div>
							<button
								className="btn btn-lg btn-refresh-status"
								ref="refreshButton"
								onClick={this.__refreshOrderStatus}
								style={{
									backgroundColor: localStorage.getItem("cartColorBg"),
									color: localStorage.getItem("cartColorText"),
								}}
							>
								{localStorage.getItem("runningOrderRefreshButton")}{" "}
								<span ref="btnSpinner" className="hidden">
									<i className="fa fa-refresh fa-spin" />
								</span>
							</button>
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{ updateUserInfo }
)(RunningOrder);
