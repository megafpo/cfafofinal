import React, { Component } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { IdealBankElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import Axios from "axios";

import { STRIPE_PAYMENT, STRIPE_PAYMENT_CAPTURE } from "../../../../../../configs";
import { connect } from "react-redux";

const ELEMENT_OPTIONS = {
	classes: {
		base: "StripeElementIdeal",
		focus: "StripeElementIdeal--focus",
	},
	style: {
		base: {
			padding: "10px 8px",
			fontSize: "15px",
			color: "#5f5f5f",
			letterSpacing: "0.025em",
			"::placeholder": {
				color: "#aab7c4",
			},
		},
		invalid: {
			color: "#9e2146",
		},
	},
};

class CheckoutForm extends Component {
	state = {
		name: "",
		errorMessage: null,
		paymentMethod: null,
		client_secret: "",
	};

	handleSubmit = async (event) => {
		event.preventDefault();
		const { stripe, elements, data } = this.props;

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "ideal",
			ideal: elements.getElement(IdealBankElement),
		});

		if (!error) {
			data.data.handlePaymentProcessing(true);
			const { id } = paymentMethod;
			Axios.post(STRIPE_PAYMENT, {
				token: data.data.user.data.auth_token,
				id: id,
				amount: data.data.total * 100,
				currency: "eur",
				payment_method_types: ["ideal"],
			})
				.then((response) => {
					//payment intent successful, place order
					const placeOrderAsync = new Promise((resolve) => {
						data.data.placeOrder("", "STRIPE", true);
						resolve("Order Placed");
					});
					placeOrderAsync.then(() => {
						this.setState({ client_secret: response.data.client_secret });
						//after this, it goes to component will receive props
					});
				})
				.catch(function(error) {
					data.data.handlePaymentProcessing(false);
					console.log(error);
				});
		}
	};

	handleConfirmIdealPayment = (order) => {
		const { stripe, elements } = this.props;

		//if not empty
		if (this.state.client_secret !== "") {
			const { error } = stripe.confirmIdealPayment(this.state.client_secret, {
				payment_method: {
					ideal: elements.getElement(IdealBankElement),
					billing_details: {
						name: this.state.name,
					},
				},
				return_url: STRIPE_PAYMENT_CAPTURE + "?order_id=" + order.data.id,
			});
			if (error) {
				console.log(error.message);
			}
		}
	};
	componentWillReceiveProps(nextProps) {
		if (this.props.data.data.checkout !== nextProps.data.data.checkout) {
			console.log("Order Placed");
			this.handleConfirmIdealPayment(nextProps.data.data.checkout);
		}
	}

	render() {
		// const { errorMessage, paymentMethod, name } = this.state;
		const { stripe, data } = this.props;

		return (
			<React.Fragment>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor="name">{localStorage.getItem("checkoutCardFullname")}</label>
					<input
						id="name"
						required
						className="form-control StripeElement"
						onChange={(event) => {
							this.setState({ name: event.target.value });
						}}
					/>
					<label htmlFor="ideal">{localStorage.getItem("checkoutIdealSelectBankText")}</label>
					<IdealBankElement id="ideal" options={ELEMENT_OPTIONS} />
					<button type="submit" disabled={!stripe} className="btn stripe-pay-btn">
						{localStorage.getItem("checkoutPayText")}{" "}
						{localStorage.getItem("currencySymbolAlign") === "left" &&
							localStorage.getItem("currencyFormat")}
						{data.data.total}
						{localStorage.getItem("currencySymbolAlign") === "right" &&
							localStorage.getItem("currencyFormat")}
					</button>
				</form>
			</React.Fragment>
		);
	}
}

const InjectedCheckoutForm = (data) => (
	<ElementsConsumer>
		{({ stripe, elements }) => <CheckoutForm stripe={stripe} elements={elements} data={data} />}
	</ElementsConsumer>
);

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(localStorage.getItem("stripePublicKey"), {
	locale: localStorage.getItem("stripeLocale"),
});

const StripeIdeal = (data) => {
	return (
		<Elements stripe={stripePromise}>
			<InjectedCheckoutForm data={data} />
		</Elements>
	);
};

// export default StripeIdeal;

const mapStateToProps = (state) => ({
	checkout: state.checkout.checkout,
});

export default connect(
	mapStateToProps,
	{}
)(StripeIdeal);
