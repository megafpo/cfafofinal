import React, { Component } from "react";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import Meta from "../../helpers/meta";
import PaymentList from "./PaymentList";
import { Redirect } from "react-router";
import { checkConfirmCart } from "../../../services/confirmCart/actions";
import { connect } from "react-redux";
import { getPaymentGateways } from "../../../services/paymentgateways/actions";
import { GoogleApiWrapper } from "google-maps-react";
import Loading from "../../helpers/loading";

class Checkout extends Component {
	state = {
		loading: false,
		process_distance_calc_loading: false,
		continueFetchPaymentGateway: true,
		gateways_received: false,
		toPay: "",
	};

	componentDidMount() {
		const { user } = this.props;

		if (user) {
			this.props
				.getPaymentGateways(user.data.auth_token, localStorage.getItem("activeRestaurant"))
				.then((response) => {
					if (response && response.payload) {
						this.setState({ gateways_received: true });
					} else {
						console.error("fetching payment gateways failed... trying again after 2.5s");
						this.retryPaymentGatewaySetInterval = setInterval(() => {
							this.fetchPaymentGateways(user.data.auth_token);
						}, 2500);
					}
				});
		}

		if (this.props.cartProducts.length) {
			document.getElementsByTagName("body")[0].classList.add("bg-grey-light");
		}
	}

	handleLoading = (value) => {
		this.setState({ loading: value });
	};

	fetchPaymentGateways = (token) => {
		if (this.state.continueFetchPaymentGateway) {
			console.log("fetching again...");
			this.props.getPaymentGateways(token, localStorage.getItem("activeRestaurant")).then((response) => {
				if (response && response.payload) {
					this.setState({ continueFetchPaymentGateway: false, gateways_received: true });
				}
			});
		} else {
			clearInterval(this.retryPaymentGatewaySetInterval);
		}
	};

	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey-light");
		clearInterval(this.retryPaymentGatewaySetInterval);
	}

	handleProcessDistanceCalcLoading = (value) => {
		this.setState({ process_distance_calc_loading: value });
	};

	handleToPayText = (data) => {
		setTimeout(() => {
			this.setState({ toPay: data });
		}, 200);
	};

	render() {
		if (!this.props.cartProducts.length) {
			// no items in cart after checkout goto cart page
			// return <Redirect to={"/cart"} />;
		}

		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		//TODO:
		//check if the referrer is cart page, if not then redirect to cart
		if (!this.props.confirmCart) {
			return <Redirect to={"/cart"} />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}

		return (
			<React.Fragment>
				{this.state.loading && <Loading />}
				{this.state.process_distance_calc_loading && <Loading />}
				<Meta
					seotitle={localStorage.getItem("checkoutPageTitle")}
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
					// title={{localStorage.getItem("checkoutPageTitle")}}
					title={this.state.toPay}
					disable_search={true}
					from_checkout={true}
				/>
				<div className="pt-50">
					<div className="pt-30" />
					<PaymentList
						handleProcessDistanceCalcLoading={this.handleProcessDistanceCalcLoading}
						googleLoadingStatus={this.state.process_distance_calc_loading}
						paymentgateways={this.props.paymentgateways}
						gatewayStatus={this.state.gateways_received}
						handleLoading={this.handleLoading}
						toPay={this.handleToPayText}
						google={this.props.google}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	total: state.total.total,
	user: state.user.user,
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
	coupon: state.coupon.coupon,
	confirmCart: state.confirmCart.confirmCart,
	paymentgateways: state.paymentgateways.paymentgateways,
});

// export default connect(
// 	mapStateToProps,
// 	{ checkConfirmCart, getPaymentGateways }
// )(Checkout);

export default GoogleApiWrapper({
	apiKey: localStorage.getItem("googleApiKey"),
	LoadingContainer: Loading,
})(
	connect(
		mapStateToProps,
		{
			checkConfirmCart,
			getPaymentGateways,
		}
	)(Checkout)
);
