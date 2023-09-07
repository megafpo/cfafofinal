import React, { Component } from "react";

import { loadStripe } from "@stripe/stripe-js";
import {
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement,
	Elements,
	ElementsConsumer,
} from "@stripe/react-stripe-js";
import Axios from "axios";

import { STRIPE_PAYMENT } from "../../../../../../configs";

class CheckoutForm extends Component {
	state = {
		postal: "",
	};
	handleSubmit = async (event) => {
		event.preventDefault();

		const { stripe, elements, data } = this.props;

		const cardElement = elements.getElement(CardNumberElement);

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card: cardElement,
		});

		if (!error) {
			data.data.handlePaymentProcessing(true);
			const { id } = paymentMethod;
			Axios.post(STRIPE_PAYMENT, {
				token: data.data.user.data.auth_token,
				id: id,
				amount: data.data.total * 100,
				currency: localStorage.getItem("currencyId"),
				payment_method_types: ["card"],
			})
				.then((response) => {
					console.log("STRIPE DATA", response.data);
					const { client_secret: clientSecret } = response.data;
					console.log(clientSecret);
					stripe
						.confirmCardPayment(clientSecret)
						.then((response) => {
							if (response.paymentIntent && response.paymentIntent.status === "succeeded") {
								console.log("Payment successful!!!");
								data.data.placeOrder("", "STRIPE");
							} else {
								console.log("Something went wrong...");
								data.data.handlePaymentProcessing(false);
							}
						})
						.catch(function(e) {
							console.log(e);
						});
				})
				.catch(function(err) {
					data.data.handlePaymentProcessing(false);
					console.log(err);
				});
		} else {
			console.log(error);
		}
	};

	render() {
		const { stripe, data } = this.props;

		return (
			<React.Fragment>
				<form onSubmit={this.handleSubmit}>
					{/* <CardElement hidePostalCode={true} /> */}

					<label htmlFor="cardNumber">{localStorage.getItem("checkoutCardNumber")}</label>
					<CardNumberElement id="cardNumber" />
					<label htmlFor="expiry">{localStorage.getItem("checkoutCardExpiration")}</label>
					<CardExpiryElement id="expiry" />
					<label htmlFor="cvc">{localStorage.getItem("checkoutCardCvv")}</label>
					<CardCvcElement id="cvc" />
					{localStorage.getItem("stripeCheckoutPostalCode") === "true" && (
						<React.Fragment>
							<label htmlFor="postal">{localStorage.getItem("checkoutCardPostalCode")}</label>
							<input
								id="postal"
								required
								value={this.state.postal}
								className="form-control StripeElement"
								onChange={(e) => {
									this.setState({ postal: e.target.value });
								}}
							/>
						</React.Fragment>
					)}

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
	<React.Fragment>
		<ElementsConsumer>
			{({ stripe, elements }) => <CheckoutForm stripe={stripe} elements={elements} data={data} />}
		</ElementsConsumer>
	</React.Fragment>
);

const stripePromise = loadStripe(localStorage.getItem("stripePublicKey"), {
	locale: localStorage.getItem("stripeLocale"),
});

const StripeCard = (data) => (
	<Elements stripe={stripePromise}>
		<InjectedCheckoutForm data={data} />
	</Elements>
);

export default StripeCard;
