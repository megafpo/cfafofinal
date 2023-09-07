import React, { Component } from "react";
import CountTo from "react-count-to";
import {
	updateDeliveryUserInfo,
	updateDeliveryOrderHistory,
	toggleDeliveryGuyStatus,
} from "../../../services/Delivery/user/actions";
import { connect } from "react-redux";
import OrdersHistory from "./OrdersHistory";
import Ink from "react-ink";
import EarningChart from "./EarningChart";
import EarningDetails from "./EarningDetails";
import EarningChartLight from "./EarningChartLight";
import DeliveryReviews from "./DeliveryReviews";
import Loading from "../../helpers/loading";
import Axios from "axios";
import { DELIVERY_COMPLETED_ORDERS_URL } from "../../../configs";

class Account extends Component {
	static contextTypes = {
		router: () => null,
	};

	state = {
		loading: false,
		show_orderhistory: true,
		show_earnings: false,
		show_reviews: false,
		show_completedOrders: false,
		delivery_status: null,
		no_completedOrders: false,
		completedOrders: [],
		next_page: DELIVERY_COMPLETED_ORDERS_URL,
		loading_more: false,
	};

	componentDidMount() {
		const { delivery_user } = this.props;
		//update delivery guy info
		this.props.updateDeliveryUserInfo(delivery_user.data.id, delivery_user.data.auth_token);
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
	}

	filterOnGoingOrders = () => {
		this.props.updateDeliveryOrderHistory(
			this.props.delivery_user.data.orders.filter((order) => order.is_complete === 0)
		);
		this.setState({ show_orderhistory: true, show_earnings: false, show_completedOrders: false });
		this.removeScrollEvent();
		this.setState({ completedOrders: [], next_page: DELIVERY_COMPLETED_ORDERS_URL });
	};

	filterCompletedOrders = () => {
		// this.props.updateDeliveryOrderHistory(
		// 	this.props.delivery_user.data.orders.filter((order) => order.is_complete === 1)
		// );
		this.__getCompletedOrder(this.props.delivery_user.data.auth_token);
		this.setState({
			show_orderhistory: false,
			show_earnings: false,
			show_reviews: false,
			show_completedOrders: true,
		});
	};

	__getCompletedOrder = (token) => {
		if (!this.state.loading) {
			this.setState({
				loading: true,
			});
			this.registerScrollEvent();
			Axios.post(this.state.next_page, {
				token: token,
			}).then((response) => {
				const paginator = response.data;
				const orders = paginator.data;
				console.log("Next Page URL: " + paginator.next_page_url);
				if (orders.length) {
					this.setState({
						completedOrders: [...this.state.completedOrders, ...orders],
						next_page: paginator.next_page_url,
						loading: false,
						loading_more: false,
					});
				} else {
					this.setState({
						completedOrders: [],
						loading: false,
						loading_more: false,
					});
				}

				if (!paginator.next_page_url) {
					this.removeScrollEvent();
				}
			});
		}
	};

	registerScrollEvent() {
		window.addEventListener("scroll", this.scrollFunc);
	}

	removeScrollEvent() {
		window.removeEventListener("scroll", this.scrollFunc);
	}

	scrollFunc = () => {
		if (
			document.documentElement.scrollTop + 50 + window.innerHeight > document.documentElement.offsetHeight ||
			document.documentElement.scrollTop + 50 + window.innerHeight === document.documentElement.offsetHeight
		) {
			const { delivery_user } = this.props;
			this.setState({ loading_more: true });
			this.__getCompletedOrder(delivery_user.data.auth_token);
		}
	};

	showEarningsTable = () => {
		this.setState({
			show_orderhistory: false,
			show_earnings: true,
			show_reviews: false,
			show_completedOrders: false,
		});
		this.removeScrollEvent();
		this.setState({ completedOrders: [], next_page: DELIVERY_COMPLETED_ORDERS_URL });
	};

	showReviews = () => {
		this.setState({
			show_orderhistory: false,
			show_earnings: false,
			show_reviews: true,
			show_completedOrders: false,
		});
		this.removeScrollEvent();
		this.setState({ completedOrders: [], next_page: DELIVERY_COMPLETED_ORDERS_URL });
	};

	handleToggleLightDarkMode = () => {
		let state = localStorage.getItem("deliveryAppLightMode");
		if (state !== null) {
			const removeLightState = new Promise((resolve) => {
				localStorage.removeItem("deliveryAppLightMode");
				resolve("Removed Light State");
			});
			removeLightState.then(() => {
				window.location.reload();
			});
		} else {
			const setLightState = new Promise((resolve) => {
				localStorage.setItem("deliveryAppLightMode", "true");
				resolve("Set Light State");
			});
			setLightState.then(() => {
				window.location.reload();
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.delivery_user !== nextProps.delivery_user) {
			this.setState({ delivery_status: nextProps.delivery_user.data.status });
		}
	}

	toggleDeliveryOnOffStatus = () => {
		this.setState({ loading: true });
		const { delivery_user } = this.props;

		this.props.toggleDeliveryGuyStatus(delivery_user.data.auth_token).then(() => {
			this.setState({ loading: false });
		});
	};

	__changeStatusAndLogoutDelivery = () => {
		const { delivery_user } = this.props;

		if (delivery_user.success) {
			if (navigator.userAgent === "frutriAndroidWebViewUA") {
				if (window.Android !== "undefined") {
					window.Android.logoutDelivery();
				}
			}
		}

		this.props.toggleDeliveryGuyStatus(delivery_user.data.auth_token, true).then(() => {
			this.props.logoutDeliveryUser();
		});
	};

	componentWillUnmount() {
		this.removeScrollEvent();
	}

	render() {
		const { delivery_user, order_history } = this.props;
		return (
			<React.Fragment>
				{this.state.loading && <Loading />}
				<div className="d-flex justify-content-between nav-dark">
					<div className="delivery-tab-title px-20 py-15">
						{localStorage.getItem("deliveryWelcomeMessage")} {delivery_user.data.name}
					</div>
					<div className="delivery-order-refresh">
						<button
							className="btn btn-delivery-logout mr-15"
							onClick={() => this.__changeStatusAndLogoutDelivery()}
						>
							{localStorage.getItem("deliveryLogoutDelivery")} <i className="si si-logout" />
						</button>
					</div>
				</div>

				<div>
					<button
						onClick={this.handleToggleLightDarkMode}
						className="btn btn-default btn-block btn-toggleLightDark"
					>
						{localStorage.getItem("deliveryToggleLightDarkMode")}
					</button>
				</div>

				<div onClick={this.toggleDeliveryOnOffStatus} className="d-flex justify-content-center my-2">
					{this.state.delivery_status === null ? (
						<div className="delivery-guy-status delivery-guy-status-neutral">
							<span>
								<div className="spin-load" />
							</span>
						</div>
					) : (
						<React.Fragment>
							{this.state.delivery_status ? (
								<div className="delivery-guy-status delivery-guy-online">
									<span>{localStorage.getItem("deliveryAppYouAreOnlineBtn")}</span>
								</div>
							) : (
								<div className="delivery-guy-status delivery-guy-offline">
									<span>{localStorage.getItem("deliveryAppYouAreOfflineBtn")}</span>
								</div>
							)}
						</React.Fragment>
					)}
				</div>

				<div className="mb-100 pt-20">
					<div className="pr-5">
						{localStorage.getItem("deliveryAppLightMode") === "true" ? (
							<EarningChartLight data={delivery_user.chart} />
						) : (
							<EarningChart data={delivery_user.chart} />
						)}
					</div>

					<div className="row gutters-tiny px-15 mt-20">
						{localStorage.getItem("enableDeliveryGuyEarning") === "true" && (
							<React.Fragment>
								<div className="col-6" onClick={() => this.showEarningsTable()}>
									<div
										className="block shadow-light delivery-block-transparent"
										style={{ position: "relative" }}
									>
										<div className="block-content block-content-full clearfix text-white">
											<div className="font-size-h3 font-w600">
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat")}
												<CountTo
													to={delivery_user.data.wallet_balance}
													speed={1000}
													className="font-size-h3 font-w600"
													easing={(t) => {
														return t < 0.5
															? 16 * t * t * t * t * t
															: 1 + 16 * --t * t * t * t * t;
													}}
													digits={2}
												/>
												{localStorage.getItem("currencySymbolAlign") === "right" &&
													localStorage.getItem("currencyFormat")}

												<div className="font-size-sm font-w600 text-uppercase">
													{localStorage.getItem("deliveryEarningsText")}
												</div>
											</div>
										</div>
										<Ink duration="500" hasTouch="true" />
									</div>
								</div>
								<div className="col-6" onClick={() => this.showEarningsTable()}>
									<div
										className="block shadow-light delivery-block-transparent"
										style={{ position: "relative" }}
									>
										<div className="block-content block-content-full clearfix text-white">
											<div className="font-size-h3 font-w600">
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat")}
												<CountTo
													to={delivery_user.data.totalEarnings}
													speed={1000}
													className="font-size-h3 font-w600"
													easing={(t) => {
														return t < 0.5
															? 16 * t * t * t * t * t
															: 1 + 16 * --t * t * t * t * t;
													}}
													digits={2}
												/>
												{localStorage.getItem("currencySymbolAlign") === "right" &&
													localStorage.getItem("currencyFormat")}

												<div className="font-size-sm font-w600 text-uppercase">
													{localStorage.getItem("deliveryTotalEarningsText")}
												</div>
											</div>
										</div>
										<Ink duration="500" hasTouch="true" />
									</div>
								</div>
							</React.Fragment>
						)}
						<div className="col-6 col-xl-3" onClick={() => this.filterOnGoingOrders()}>
							<div
								className="block shadow-medium delivery-block-ongoing"
								style={{ position: "relative" }}
							>
								<div className="block-content block-content-full clearfix text-white">
									<div className="float-right mt-10">
										<i className="si si-control-forward fa-3x" />
									</div>
									<CountTo
										to={delivery_user.data.onGoingCount}
										speed={1000}
										className="font-size-h3 font-w600"
										easing={(t) => {
											return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
										}}
									/>
									<div className="font-size-sm font-w600 text-uppercase">
										{localStorage.getItem("deliveryOnGoingText")}
									</div>
								</div>
								<Ink duration="500" hasTouch="true" />
							</div>
						</div>
						<div className="col-6 col-xl-3" onClick={() => this.filterCompletedOrders()}>
							<div
								className="block shadow-medium delivery-block-completed"
								style={{ position: "relative" }}
							>
								<div className="block-content block-content-full clearfix text-white">
									<div className="float-right mt-10">
										<i className="si si-check fa-3x" />
									</div>
									<CountTo
										to={delivery_user.data.completedCount}
										speed={1000}
										className="font-size-h3 font-w600"
										easing={(t) => {
											return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
										}}
									/>
									<div className="font-size-sm font-w600 text-uppercase">
										{localStorage.getItem("deliveryCompletedText")}
									</div>
								</div>
								<Ink duration="500" hasTouch="true" />
							</div>
						</div>
						{localStorage.getItem("showDeliveryCollection") === "true" && (
							<div className="col">
								<div
									className="block shadow-light delivery-block-transparent"
									style={{ position: "relative" }}
								>
									<div className="block-content block-content-full clearfix text-white">
										<div className="font-size-h3 font-w600">
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}
											<CountTo
												to={delivery_user.data.deliveryCollection}
												speed={1000}
												className="font-size-h3 font-w600"
												easing={(t) => {
													return t < 0.5
														? 16 * t * t * t * t * t
														: 1 + 16 * --t * t * t * t * t;
												}}
												digits={2}
											/>
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}

											<div className="font-size-sm font-w600 text-uppercase">
												{localStorage.getItem("deliveryCollectionText")}
											</div>
										</div>
									</div>
									<Ink duration="500" hasTouch="true" />
								</div>
							</div>
						)}

						<div className="col" onClick={() => this.showReviews()}>
							<div
								className="block shadow-light delivery-block-transparent"
								style={{ position: "relative" }}
							>
								<div className="block-content block-content-full clearfix text-white">
									<div className="font-size-h3 font-w600">
										<i className="fa fa-star mr-1" />
										{delivery_user.data.averageRating}
										<div className="font-size-sm font-w600 text-uppercase">
											{localStorage.getItem("reviewsPageTitle")}
										</div>
									</div>
								</div>
								<Ink duration="500" hasTouch="true" />
							</div>
						</div>
					</div>
					{this.state.show_completedOrders && (
						<div className="orders-history px-15 mt-20">
							{this.state.completedOrders && this.state.completedOrders.length > 0
								? this.state.completedOrders.map((order) => (
										<OrdersHistory order={order} key={order.id} />
								  ))
								: null}
						</div>
					)}
					{this.state.show_orderhistory && (
						<div className="orders-history px-15 mt-20">
							{order_history && order_history.length > 0
								? order_history.map((order) => <OrdersHistory order={order} key={order.id} />)
								: null}
						</div>
					)}
					{this.state.show_earnings && (
						<div className="delivery-earnings px-15 mt-20">
							{delivery_user.data.earnings &&
								delivery_user.data.earnings.map((earning) => (
									<EarningDetails key={earning.id} transaction={earning} />
								))}
						</div>
					)}
					{this.state.show_reviews && (
						<div className="delivery-reviews px-15 mt-20">
							{delivery_user.data.ratings &&
								delivery_user.data.ratings.map((rating) => (
									<DeliveryReviews
										key={rating.id}
										rating={rating.rating_delivery}
										review={rating.review_delivery}
									/>
								))}
						</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	order_history: state.delivery_user.order_history,
});

export default connect(
	mapStateToProps,
	{ updateDeliveryUserInfo, updateDeliveryOrderHistory, toggleDeliveryGuyStatus }
)(Account);
