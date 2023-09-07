import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import { Helmet } from "react-helmet";
import PaypalExpressBtn from "react-paypal-express-checkout";
import PaystackButton from "react-paystack";

import { RAZORPAY_CREATE_ORDER_URL } from "../../../../configs";
import { RAZORPAY_PROCESS_VERIFY_URL } from "../../../../configs";

import { PAYMONGO_PAYMENT_URL } from "../../../../configs";
import { MERCADOPAGO_PAYMENT_URL } from "../../../../configs";
import { PAYTM_PAYMENT_URL } from "../../../../configs";

import { KHALTI_PAYMENT_VERIFICATION_URL } from "../../../../configs";

import { connect } from "react-redux";
import { formatPrice } from "../../../helpers/formatPrice";

import { placeOrder } from "../../../../services/checkout/actions";
import { updateUserInfo } from "../../../../services/user/actions";
import { calculateDistance } from "../../../helpers/calculateDistance";
import calculateDistanceGoogle from "../../../helpers/calculateDistanceGoogle.js";
import Axios from "axios";

import { getRestaurantInfoById } from "../../../../services/items/actions";

import StripeCard from "./Stripe/StripeCard";
import StripeIdeal from "./Stripe/StripeIdeal";
import StripeFpx from "./Stripe/StripeFpx";

import { PaymentInputsContainer } from "react-payment-inputs";
import { Redirect } from "react-router";
import FlutterWave from "./Flutterwave";
import KhaltiCheckout from "khalti-checkout-web";
import { setDeliveryDateTime, setExpressDeliveryCharges } from '../../../../services/Delivery/deliverytimeslot/actions'

class PaymentList extends Component {
	static contextTypes = {
		router: () => null,
	};
	state = {
		payment_gateway_loading: true,
		loading: false,
		stripe_opened: false,
		delivery_charges: 0.0,
		error: false,
		razorpay_opened: false,
		razorpay_success: false,
		canPayPartialWithWallet: false,
		walletChecked: false,
		canPayFullWithWallet: false,
		distance: 0,
		placeOrderError: false,
		errorMessage: "",

		payWithStripeCard: false,
		payWithStripeIdeal: false,
		payWithStripeFpx: false,

		paymongoCCNumber: "",
		paymongoCCExp: "",
		paymongoCCCvv: "",
		showPaymongoForm: false,
		paymongoRedirect: "",
		paymongo_processing: false,

		cashChange: "",
		regexp: /^[0-9\b]+$/,
		showCod: false,
	};

	componentDidMount() {
		const { user } = this.props;

		if (localStorage.getItem("activeRestaurant") !== null) {
			this.props.getRestaurantInfoById(localStorage.getItem("activeRestaurant")).then((response) => {
				if (response) {
					if (response.payload.id) {
						this.__doesRestaurantOperatesAtThisLocation(response.payload);
					}
				}
			});
		}

		if (user.success) {
			this.props.updateUserInfo(user.data.id, user.data.auth_token, null);
		}

		if (localStorage.getItem("userSelected") === "SELFPICKUP") {
			this.setState({ delivery_charges: 0.0 });
		} else {
			if (parseFloat(this.props.restaurant_info.free_delivery_subtotal) > 0) {
				if (
					parseFloat(this.props.cartTotal.totalPrice) >=
					parseFloat(this.props.restaurant_info.free_delivery_subtotal)
				) {
					console.log("Free Delivery 😍");
					this.setState({ delivery_charges: 0 });
				} else {
					this.setState({ delivery_charges: this.props.restaurant_info.delivery_charges });
				}
			} else {
				this.setState({ delivery_charges: this.props.restaurant_info.delivery_charges });
			}
		}

		if (localStorage.getItem("userSelected") === "SELFPICKUP") {
			if (localStorage.getItem("enCODonSF") === "true") {
				this.setState({ showCod: true });
			} else {
				this.setState({ showCod: false });
			}
		} else {
			this.setState({ showCod: true });
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.gatewayStatus) {
			this.setState({ payment_gateway_loading: false });
		}

		if (nextProps.checkout !== this.props.checkout) {
			//remove coupon
			localStorage.removeItem("appliedCoupon");

			if (nextProps.checkout.data.payment_mode === "PAYMONGO") {
				if (this.state.paymongoRedirect !== "") {
					window.location = this.state.paymongoRedirect;
					return null;
				}
			}

			if (nextProps.checkout.data.payment_mode === "MERCADOPAGO") {
				window.location = MERCADOPAGO_PAYMENT_URL + "/" + nextProps.checkout.data.id;
				return null;
			}

			//for stripe ideal, fpx and 3d
			if (nextProps.checkout.data.orderstatus_id !== 8) {
				//if orderstatus_id is not Awaiting payment then
				//redirect to running order page
				this.context.router.history.push("/running-order/" + nextProps.checkout.data.unique_order_id);
			}

			if (nextProps.checkout.data.payment_mode === "PAYTM") {
				window.location = PAYTM_PAYMENT_URL + "/" + nextProps.checkout.data.id;
				return null;
			}

			if (nextProps.checkout.data.payment_mode === "RAZORPAY") {
				console.log(nextProps.checkout);

				if (navigator.userAgent === "frutriAndroidWebViewUA") {
					if (window.Android !== "undefined") {
						window.Android.startRazorpaySdkProcess(
							nextProps.checkout.data.id,
							nextProps.checkout.data.unique_order_id,
							nextProps.user.data.name,
							nextProps.user.data.email,
							nextProps.user.data.phone
						);
					}
				} else {
					this.__handleRazorPay(nextProps.checkout.data.id, nextProps.checkout.data.unique_order_id);
				}

				return null;
			}
		}
		console.log("Google Loading: " + nextProps.googleLoadingStatus);
		if (nextProps.googleLoadingStatus === false) {
			//if  > 0 then user can pay with wallet (Amount will be deducted)
			if (
				nextProps.user.data.wallet_balance > 0 &&
				nextProps.user.data.wallet_balance < parseFloat(this.getTotalAfterCalculation())
			) {
				// console.log("Can pay partial with wallet");
				this.setState({ canPayPartialWithWallet: true, canPayFullWithWallet: false });
			}
			// console.log("Outside:" + parseFloat(this.getTotalAfterCalculation()));
			if (
				nextProps.user.data.wallet_balance > 0 &&
				nextProps.user.data.wallet_balance >= parseFloat(this.getTotalAfterCalculation())
			) {
				console.log("Inside:" + parseFloat(this.getTotalAfterCalculation()));
				// console.log("Can pay full with wallet");
				this.setState({ canPayFullWithWallet: true, canPayPartialWithWallet: false });
			}
		}
	}

	__doesRestaurantOperatesAtThisLocation = (restaurant_info) => {
		//send user lat long to helper, check with the current restaurant lat long and setstate accordingly
		const { user } = this.props;
		if (user.success) {
			let self = this;

			if (localStorage.getItem("enGDMA") === "true") {
				if (localStorage.getItem("userSelected") === "DELIVERY") {
					this.props.handleProcessDistanceCalcLoading(true);

					calculateDistanceGoogle(
						restaurant_info.longitude,
						restaurant_info.latitude,
						user.data.default_address.longitude,
						user.data.default_address.latitude,
						this.props.google,
						function(distance) {
							if (self.props.restaurant_info.delivery_charge_type === "DYNAMIC") {
								self.setState({ distance: distance }, () => {
									//check if restaurant has dynamic delivery charge..
									self.calculateDynamicDeliveryCharge();
								});
							}
							self.props.handleProcessDistanceCalcLoading(false);
						}
					);
				}
			} else {
				if (localStorage.getItem("userSelected") === "DELIVERY") {
					const distance = calculateDistance(
						restaurant_info.longitude,
						restaurant_info.latitude,
						user.data.default_address.longitude,
						user.data.default_address.latitude
					);
					if (this.props.restaurant_info.delivery_charge_type === "DYNAMIC") {
						this.setState({ distance: distance }, () => {
							//check if restaurant has dynamic delivery charge..
							this.calculateDynamicDeliveryCharge();
						});
					}
				}
			}
		}
	};

	calculateDynamicDeliveryCharge = () => {
		const { restaurant_info } = this.props;

		const distanceFromUserToRestaurant = this.state.distance;
		// console.log("Distance from user to restaurant: " + distanceFromUserToRestaurant + " km");
		let delivery_charges_calc = 0;
		if (distanceFromUserToRestaurant > restaurant_info.base_delivery_distance) {
			const extraDistance = distanceFromUserToRestaurant - restaurant_info.base_delivery_distance;
			// console.log("Extra Distance: " + extraDistance + " km");

			const extraCharge =
				(extraDistance / restaurant_info.extra_delivery_distance) * restaurant_info.extra_delivery_charge;
			// console.log("Extra Charge: " + extraCharge);

			let dynamicDeliveryCharge = parseFloat(restaurant_info.base_delivery_charge) + parseFloat(extraCharge);
			if (localStorage.getItem("enDelChrRnd") === "true") {
				dynamicDeliveryCharge = Math.ceil(dynamicDeliveryCharge);
			}

			delivery_charges_calc = dynamicDeliveryCharge;
			console.log("dynamic: " + delivery_charges_calc);
		} else {
			delivery_charges_calc = restaurant_info.base_delivery_charge;
			console.log("fixed: " + delivery_charges_calc);
		}

		if (parseFloat(restaurant_info.free_delivery_subtotal) > 0) {
			if (parseFloat(this.props.cartTotal.totalPrice) >= parseFloat(restaurant_info.free_delivery_subtotal)) {
				console.log("Free Delivery 😍");
				this.setState({ delivery_charges: 0 });
			} else {
				this.setState({ delivery_charges: delivery_charges_calc });
			}
		} else {
			this.setState({ delivery_charges: delivery_charges_calc });
		}

		// this.processPayWithWalletBlocks();
	};

	// processPayWithWalletBlocks = () => {
	// 	if (
	// 		this.props.user.data.wallet_balance > 0 &&
	// 		this.props.user.data.wallet_balance < parseFloat(this.getTotalAfterCalculation())
	// 	) {
	// 		console.log("Can pay partial with wallet");
	// 		this.setState({ canPayPartialWithWallet: true, canPayFullWithWallet: false });
	// 	}

	// 	if (this.props.user.data.wallet_balance >= parseFloat(this.getTotalAfterCalculation())) {
	// 		console.log("Can pay full with wallet");
	// 		this.setState({ canPayFullWithWallet: true, canPayPartialWithWallet: false });
	// 	}
	// };

	/* Stripe */
	onOpened = () => {
		this.setState({ stripe_opened: true });
	};
	onToken = (payment_token) => {
		const method = "STRIPE";
		this.__placeOrder(payment_token, method);
	};
	/* END Stripe */

	/* Paypal */
	onSuccess = (payment) => {
		const payment_token = "";
		const method = "PAYPAL";
		this.__placeOrder(payment_token, method);
	};

	onCancel = (data) => {
		console.log("Paypal Payment Canceled");
	};

	onError = (err) => {
		console.log("Error!");
	};
	/* END Paypal */

	/* PayStack */
	callback = (response) => {
		if (response.status === "success") {
			const payment_token = response.reference;
			const method = "PAYSTACK";
			this.__placeOrder(payment_token, method);
		} else {
			console.log(response);
		}
	};

	close = () => {
		console.log("PayStack Payment Closed");
	};

	getReference = () => {
		//you can put any unique reference implementation code here
		let text = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

		for (let i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};
	/* END PayStack */

	__placeOrder = (payment_token, method, pending_payment = false) => {
		let navBar = document.getElementById("checkoutNavPageTitle");
		if (navBar) {
			document.getElementById("checkoutNavPageTitle").remove();
		}

		// disable all button Onclick with pointer events
		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.add("no-click");
		}

		let tipAmount = null;
		console.log("cart_tips", JSON.parse(localStorage.getItem("cart_tips")));
		if (JSON.parse(localStorage.getItem("cart_tips")) != null) {
			tipAmount = JSON.parse(localStorage.getItem("cart_tips")).value;
		}

		const { user, cartProducts, coupon, cartTotal, delivery_datetime, deliveryCharges  } = this.props;
		if (user.success) {
			if (localStorage.getItem("userSelected") === "SELFPICKUP") {
				this.props
					.placeOrder(
						user,
						cartProducts,
						coupon.success ? coupon : null,
						JSON.parse(localStorage.getItem("userSetAddress")),
						localStorage.getItem("orderComment"),
						cartTotal,
						method,
						payment_token,
						2,
						this.state.walletChecked,
						parseFloat(this.state.distance),
						pending_payment,
						null,
						null,
						delivery_datetime,	
						deliveryCharges
					)
					.then((response) => {
						this.props.setDeliveryDateTime(0,0);		
						this.props.setExpressDeliveryCharges("0")
						if (response) {
							if (!response.success) {
								this.setState({ placeOrderError: true, errorMessage: response.message });
								if (response.status === 429) {
									this.setState({ errorMessage: localStorage.getItem("tooManyApiCallMessage") });
								}
								this.resetPage();
							}
						}
					});
			} else {
				this.props
					.placeOrder(
						user,
						cartProducts,
						coupon.success ? coupon : null,
						JSON.parse(localStorage.getItem("userSetAddress")),
						localStorage.getItem("orderComment"),
						cartTotal,
						method,
						payment_token,
						1,
						this.state.walletChecked,
						parseFloat(this.state.distance),
						pending_payment,
						tipAmount,
						this.state.cashChange,	
						delivery_datetime,	
						deliveryCharges
					)
					.then((response) => {
						this.props.setDeliveryDateTime(0,0);		
						this.props.setExpressDeliveryCharges("0")
						if (response) {
							console.log("Came here");
							console.log("THIS", response);
							if (response.status === 401) {
								this.setState({
									placeOrderError: true,
									errorMessage: localStorage.getItem("userInActiveMessage"),
								});
								this.resetPage();
							} else if (!response.success) {
								this.setState({ placeOrderError: true, errorMessage: response.message });
								if (response.status === 429) {
									this.setState({ errorMessage: localStorage.getItem("tooManyApiCallMessage") });
								}
								this.resetPage();
							}
						}
					});
			}

			//show progress bar
			const progressBar = document.getElementById("progressBar");
			progressBar.classList.remove("hidden");
			let progress = 0;
			var foo = setInterval(function() {
				if (progress > 100) {
					clearInterval(foo);
				}
				progress = progress + 1;
				progressBar.style.width = progress + "%";
			}, 20);

			const progressBarMessage = document.getElementById("checkoutMessageOnProcess");
			progressBarMessage.classList.remove("hidden");

			const checkoutIdleMessage = document.getElementById("checkoutMessageOnIdle");
			checkoutIdleMessage.classList.add("hidden");

			this.setState({ stripe_opened: false });
		}
	};

	resetPage = () => {
		const progressBar = document.getElementById("progressBar");
		progressBar.classList.add("hidden");
		setTimeout(() => {
			progressBar.style.width = "0%";
		}, 2200);

		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.remove("no-click");
		}
		const progressBarMessage = document.getElementById("checkoutMessageOnProcess");
		progressBarMessage.classList.add("hidden");

		const checkoutIdleMessage = document.getElementById("checkoutMessageOnIdle");
		checkoutIdleMessage.classList.remove("hidden");
	};

	// Calculating total with/without coupon/tax
	getTotalAfterCalculation = () => {
		const { coupon, restaurant_info, user, deliveryCharges } = this.props;

		var tips = JSON.parse(localStorage.getItem("cart_tips"));

		const total = this.props.cartTotal.totalPrice;
		let calc = 0;
		if (coupon.code) {
			if (coupon.discount_type === "PERCENTAGE") {
				let percentage_discount = formatPrice((coupon.discount / 100) * parseFloat(total));
				if (coupon.max_discount) {
					if (parseFloat(percentage_discount) >= coupon.max_discount) {
						percentage_discount = coupon.max_discount;
					}
				}
				coupon.appliedAmount = percentage_discount;
				calc = formatPrice(
					formatPrice(
						parseFloat(total) -
							percentage_discount +
							parseFloat(restaurant_info.restaurant_charges || 0.0) +
							parseFloat(deliveryCharges || 0.0)
					)
				);
			} else {
				calc = formatPrice(
					parseFloat(total) -
						(parseFloat(coupon.discount) || 0.0) +
						((parseFloat(restaurant_info.restaurant_charges) || 0.0) +
							(parseFloat(deliveryCharges) || 0.0))
				);
			}
		} else {
			calc = formatPrice(
				parseFloat(total) +
					parseFloat(restaurant_info.restaurant_charges || 0.0) +
					parseFloat(deliveryCharges || 0.0)
			);
		}

		if (localStorage.getItem("taxApplicable") === "true") {
			calc = formatPrice(
				parseFloat(
					parseFloat(calc) + parseFloat(parseFloat(localStorage.getItem("taxPercentage")) / 100) * calc
				)
			);
			if (this.state.walletChecked && user.data.wallet_balance < calc) {
				calc = calc - user.data.wallet_balance;
			}
		} else {
			if (this.state.walletChecked && user.data.wallet_balance < calc) {
				calc = calc - user.data.wallet_balance;
			}
		}

		if (tips && tips.value > 0) {
			calc = parseFloat(calc) + parseFloat(tips.value);
		}

		return formatPrice(calc);
	};

	/* Khalti Payment Gateway */
	__handleKhaltiPayment = () => {
		this.props.handleLoading(true);
		var self = this;
		let config = {
			publicKey: localStorage.getItem("khaltiPublicKey"),
			productIdentity: localStorage.getItem("storeName"),
			productName: localStorage.getItem("storeName"),
			productUrl: localStorage.getItem("storeUrl"),
			eventHandler: {
				onSuccess(payload) {
					// hit merchant api for initiating verfication
					console.log(payload);

					self.__handleKhaltiPaymentSuccess(payload);
				},
				// onError handler is optional
				onError(error) {
					// handle errors
					console.log(error);
					alert("Something went wrong. Please try again.");
				},
				onClose() {
					self.props.handleLoading(false);
				},
			},
			// one can set the order of payment options and also the payment options based on the order and items in the array
			// paymentPreference: ["MOBILE_BANKING", "KHALTI", "EBANKING", "CONNECT_IPS", "SCT"],
		};
		let checkout = new KhaltiCheckout(config);
		const totalAmount = this.getTotalAfterCalculation() * 100; //in paisa
		checkout.show({ amount: totalAmount });
	};

	__handleKhaltiPaymentSuccess = (payload) => {
		Axios.get(KHALTI_PAYMENT_VERIFICATION_URL, {
			params: {
				token: payload.token,
				amount: payload.amount,
			},
		})
			.then((response) => {
				console.log("Verification Response: ", response);
				if (response.data.success) {
					console.log("success.. place order now");
					this.__placeOrder(response.data.idx, "KHALTI");
				}
			})
			.catch(function(error) {
				alert("Something went wrong.");
				this.props.handleLoading(false);
			});
	};

	/* Razorpay */
	__handleRazorPay = (frutri_order_id, frutri_unique_order_id) => {
		let self = this;
		this.setState({ razorpay_opened: true });

		Axios.post(RAZORPAY_CREATE_ORDER_URL, {
			order_id: frutri_order_id,
		})
			.then((res) => {
				console.log(res);
				// console.log(res.data.response.id);
				if (res.data.razorpay_success) {
					const options = {
						key: localStorage.getItem("razorpayKeyId"),
						name: localStorage.getItem("storeName"),
						currency: localStorage.getItem("currencyId"),
						order_id: res.data.response.id,
						handler(response) {
							Axios.post(RAZORPAY_PROCESS_VERIFY_URL, {
								order_id: frutri_order_id,
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature,
							}).then((res) => {
								if (res && res.data && res.data.success) {
									self.context.router.history.push("/running-order/" + frutri_unique_order_id);
								}
							});
						},
						modal: {
							ondismiss: function() {
								self.setState({ razorpay_opened: false, razorpay_success: false });
								self.context.router.history.push("/my-orders");
							},
						},
						prefill: {
							name: this.props.user.data.name,
							email: this.props.user.data.email,
							contact: this.props.user.data.phone,
						},
					};
					const rzp1 = new window.Razorpay(options);

					rzp1.open();
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	};
	/* END Razorpay */

	/* Paymongo */
	handleInput = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	__showPaymongoForm = () => {
		this.setState({ showPaymongoForm: true });
	};

	handlePaymongo = (event) => {
		event.preventDefault();

		const paymongoCCNumber = this.state.paymongoCCNumber;
		const paymongoCCExp = this.state.paymongoCCExp;
		const paymongoCCCvv = this.state.paymongoCCCvv;

		if (paymongoCCNumber === "" || paymongoCCExp === "" || paymongoCCCvv === "") {
			this.setState({ placeOrderError: true, errorMessage: "Please enter credit card details." });
		} else {
			this.props.handleLoading(true);
			this.setState({ paymongo_processing: true });
			let self = this;
			this.setState({ paymongo_opened: true, showPaymongoForm: false, placeOrderError: false, errorMessage: "" });
			const totalAmount = formatPrice(parseFloat(this.getTotalAfterCalculation()));
			const method = "PAYMONGO";
			Axios.post(PAYMONGO_PAYMENT_URL, {
				amount: totalAmount,
				name: this.props.user.data.name,
				email: this.props.user.data.email,
				phone: this.props.user.data.phone,
				ccNum: paymongoCCNumber,
				ccExp: paymongoCCExp,
				ccCvv: paymongoCCCvv,
			})
				.then((res) => {
					console.log(res);

					if (res.data.paymongo_success) {
						if (res.data.status === "succeeded") {
							self.setState({ paymongo_opened: false, paymongo_success: true });
							this.__placeOrder(res.data.token, method, false);
						} else if (res.data.status === "awaiting_next_action") {
							console.log("3d secure");
							self.setState({
								paymongo_opened: false,
								paymongo_success: true,
								paymongoRedirect: res.data.redirect_url,
							});
							this.__placeOrder(res.data.token, method, true);
						} else {
							this.props.handleLoading(false);
							self.setState({
								paymongo_processing: false,
								paymongo_opened: true,
								paymongo_success: false,
								placeOrderError: true,
								errorMessage: "Payment failed: " + res.data.error,
							});
						}
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	};

	/* END Paymongo */

	handlePayWithStripeCardToggle = (event) => {
		this.setState({ payWithStripeCard: !this.state.payWithStripeCard }, () => {
			if (this.state.payWithStripeCard) {
				this.refs.payWithStripeCardToggle.classList.add("stripe-toggle-active");
				this.refs.payWithStripeCardToggle.scrollIntoView({ behavior: "instant", block: "start" });
			} else {
				this.refs.payWithStripeCardToggle.classList.remove("stripe-toggle-active");
			}
		});
	};
	handlePayWithStripeIdealToggle = (event) => {
		this.setState({ payWithStripeIdeal: !this.state.payWithStripeIdeal }, () => {
			if (this.state.payWithStripeIdeal) {
				this.refs.payWithStripeIdealToggle.classList.add("stripe-toggle-active");
				this.refs.payWithStripeIdealToggle.scrollIntoView({ behavior: "instant", block: "start" });
			} else {
				this.refs.payWithStripeIdealToggle.classList.remove("stripe-toggle-active");
			}
		});
	};
	handlePayWithStripeFpxToggle = (event) => {
		this.setState({ payWithStripeFpx: !this.state.payWithStripeFpx }, () => {
			if (this.state.payWithStripeFpx) {
				this.refs.payWithStripeFpxToggle.classList.add("stripe-toggle-active");
				this.refs.payWithStripeFpxToggle.scrollIntoView({ behavior: "instant", block: "start" });
			} else {
				this.refs.payWithStripeFpxToggle.classList.remove("stripe-toggle-active");
			}
		});
	};
	handlePaymentGatewayRedirect = (url) => {
		console.log("I am here");
		console.log("Placed order", this.props.checkout.id);
		const redirectUrl = url + "&order_id=" + this.props.checkout.id;
		window.location.replace(redirectUrl);
	};

	/* FlutterWave */
	__processFlutterWave = () => {
		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.add("no-click");
		}
		let flutterWaveBtn = document.getElementsByClassName("flutterwave-btn")[0];
		flutterWaveBtn.click();
	};
	/*END FlutterWave */

	__showCashChangeBlock = (e) => {
		this.refs.cashAmountBlock.classList.remove("hidden");
		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.add("hidden");
		}
		this.refs.paymentListTitle.innerHTML = localStorage.getItem("cashChangeTitle");
	};

	__handleCashInput = (e) => {
		let cashChange = e.target.value;
		// if value is not blank, then test the regex
		if (cashChange === "" || this.state.regexp.test(cashChange)) {
			if (cashChange.length <= 8) {
				this.setState({ [e.target.name]: cashChange });
			}
		}
	};
	__handleCashInputConfirm = (e) => {
		e.target.disabled = true;
		this.__placeOrder("", "COD");
	};

	render() {
		const client = {
			sandbox: localStorage.getItem("paypalSandboxKey"),
			production: localStorage.getItem("paypalProductionKey"),
		};

		this.props.toPay(formatPrice(parseFloat(this.getTotalAfterCalculation())));

		if (this.props.restaurant_info) {
			if (!this.props.restaurant_info.is_active) {
				console.log("store is closed");
				return <Redirect to={"/cart"} />;
			}
		}

		return (
			<React.Fragment>
				{this.state.placeOrderError && (
					<div className="auth-error ongoing-payment">
						<div className="error-shake">{this.state.errorMessage}</div>
					</div>
				)}

				{this.props.paymentgateways.some((gateway) => gateway.name === "Razorpay") && (
					<Helmet>
						<script src="https://checkout.razorpay.com/v1/checkout.js" />
					</Helmet>
				)}
				{(this.state.stripe_opened || this.state.razorpay_opened) && (
					<React.Fragment>
						<div className="height-80 overlay-loading ongoing-payment-spin">
							<div className="spin-load" />
						</div>
						<div className="auth-error ongoing-payment">
							<div className="error-shake">{localStorage.getItem("checkoutPaymentInProcess")}</div>
						</div>
					</React.Fragment>
				)}

				<div className="col-12 mb-50">
					{this.state.payment_gateway_loading ? (
						<div className="row">
							<div className="col-12">
								<div className="block block-link-shadow text-left shadow-light">
									<div className="block-content block-content-full clearfix py-3 payment-select-block">
										<ContentLoader
											height={70}
											width={window.innerWidth}
											speed={1.2}
											primaryColor="#f3f3f3"
											secondaryColor="#ecebeb"
										>
											<rect x="320" y="10" rx="4" ry="4" width="55" height="55" />
											<rect x="0" y="10" rx="0" ry="0" width="85" height="20" />
											<rect x="0" y="40" rx="0" ry="0" width="190" height="18" />
										</ContentLoader>
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="block block-link-shadow text-left shadow-light">
									<div className="block-content block-content-full clearfix py-3 payment-select-block">
										<ContentLoader
											height={70}
											width={window.innerWidth}
											speed={1.2}
											primaryColor="#f3f3f3"
											secondaryColor="#ecebeb"
										>
											<rect x="320" y="10" rx="4" ry="4" width="55" height="55" />
											<rect x="0" y="10" rx="0" ry="0" width="85" height="20" />
											<rect x="0" y="40" rx="0" ry="0" width="190" height="18" />
										</ContentLoader>
									</div>
								</div>
							</div>
						</div>
					) : (
						<React.Fragment>
							<div className="row">
								{this.state.canPayPartialWithWallet && (
									<React.Fragment>
										<div
											className="col-12"
											onClick={() => this.setState({ walletChecked: !this.state.walletChecked })}
										>
											<div className="block block-link-shadow text-left shadow-light">
												<div className="block-content block-content-full clearfix py-3 payment-select-block">
													<div className="float-right mt-10">
														<img
															src="/assets/img/various/wallet.png"
															alt={localStorage.getItem("walletName")}
															className="img-fluid"
														/>
													</div>
													<input
														type="checkbox"
														name="walletcheckbox"
														defaultChecked={this.props.walletChecked}
														className="wallet-checkbox"
													/>
													<div className="font-size-h3 font-w600">
														{this.state.walletChecked && (
															<i
																className="si si-check mr-2"
																style={{
																	color: localStorage.getItem("cartColorBg"),
																	fontWeight: "900",
																}}
															/>
														)}
														{localStorage.getItem("walletName")}:{" "}
														<span style={{ color: localStorage.getItem("storeColor") }}>
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}
															{this.props.user.data.wallet_balance}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</span>
													</div>
													<div className="font-size-sm font-w600 text-muted">
														{this.state.walletChecked ? (
															<React.Fragment>
																<span
																	style={{
																		color: localStorage.getItem("storeColor"),
																	}}
																>
																	{" "}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}
																	{this.props.user.data.wallet_balance}{" "}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</span>{" "}
																{localStorage.getItem("willbeDeductedText")}{" "}
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" && localStorage.getItem("currencyFormat")}
																{this.props.user.data.wallet_balance}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</React.Fragment>
														) : (
															<React.Fragment>
																<span>
																	{localStorage.getItem("payPartialWithWalletText")}
																</span>
																<button
																	className="btn btn-redeem mt-2"
																	style={{
																		color: localStorage.getItem("cartColorBg"),
																		borderColor: localStorage.getItem(
																			"cartColorBg"
																		),
																	}}
																>
																	{localStorage.getItem("walletRedeemBtnText")}
																</button>
															</React.Fragment>
														)}
													</div>
												</div>
											</div>
											<hr className="mb-4" />
										</div>
									</React.Fragment>
								)}

								<hr />
								<div className="col-12 text-center mb-0 mt-4">
									<h4 className="text-muted" ref="paymentListTitle">
										{localStorage.getItem("checkoutPaymentListTitle")}
									</h4>
								</div>

								{this.state.canPayFullWithWallet && (
									<React.Fragment>
										<div
											className="col-12 paymentGatewayBlock"
											onClick={() => this.__placeOrder("", "WALLET")}
										>
											<p className="mb-1" />
											<div className="block block-link-shadow text-left shadow-light">
												<div className="block-content block-content-full clearfix py-3 payment-select-block">
													<div className="float-right mt-10">
														<img
															src="/assets/img/various/wallet.png"
															alt={localStorage.getItem("walletName")}
															className="img-fluid"
														/>
													</div>
													<div className="font-size-h3 font-w600">
														{localStorage.getItem("walletName")}
													</div>
													<div className="font-size-sm font-w600 text-muted">
														{localStorage.getItem("payFullWithWalletText")}
														<br />
														<span style={{ color: localStorage.getItem("storeColor") }}>
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}
															{parseFloat(this.getTotalAfterCalculation())}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</span>{" "}
														{localStorage.getItem("willbeDeductedText")}{" "}
														{localStorage.getItem("currencySymbolAlign") === "left" &&
															localStorage.getItem("currencyFormat")}
														{this.props.user.data.wallet_balance}
														{localStorage.getItem("currencySymbolAlign") === "right" &&
															localStorage.getItem("currencyFormat")}
													</div>
												</div>
											</div>
										</div>
										<hr />
									</React.Fragment>
								)}

								<div className="col-12">
									{localStorage.getItem("stripeAcceptIdealPayment") === "true" && (
										<React.Fragment>
											<div
												className="col-12 p-0"
												ref="payWithStripeIdealToggle"
												onClick={this.handlePayWithStripeIdealToggle}
											>
												<div className="block block-link-shadow text-left shadow-light">
													<div className="block-content block-content-full clearfix py-3 payment-select-block">
														<div className="float-right mt-10">
															<img
																src="/assets/img/various/ideal.png"
																alt="stripe-ideal"
																className="img-fluid"
																style={{ width: "50px" }}
															/>
														</div>
														<div className="font-size-h3 font-w600">
															{localStorage.getItem("checkoutStripeIdealText")}
															<div className="font-size-sm font-w600 text-muted">
																{localStorage.getItem("checkoutStripeIdealSubText")}
															</div>
														</div>
													</div>
												</div>
											</div>
											{this.state.payWithStripeIdeal && (
												<div className="stripe-card-container">
													<StripeIdeal
														user={this.props.user}
														total={formatPrice(parseFloat(this.getTotalAfterCalculation()))}
														handlePaymentProcessing={this.props.handleLoading}
														placeOrder={this.__placeOrder}
														handlePaymentGatewayRedirect={this.handlePaymentGatewayRedirect}
														checkout={this.props.checkout}
													/>
												</div>
											)}
										</React.Fragment>
									)}
								</div>
								<div className="col-12">
									{localStorage.getItem("stripeAcceptFpxPayment") === "true" && (
										<React.Fragment>
											<div
												className="col-12 p-0"
												ref="payWithStripeFpxToggle"
												onClick={this.handlePayWithStripeFpxToggle}
											>
												<div className="block block-link-shadow text-left shadow-light">
													<div className="block-content block-content-full clearfix py-3 payment-select-block">
														<div className="float-right mt-10">
															<img
																src="/assets/img/various/fpx.png"
																alt="stripe-fpx"
																className="img-fluid"
																style={{ width: "50px" }}
															/>
														</div>
														<div className="font-size-h3 font-w600">
															{localStorage.getItem("checkoutStripeFpxText")}
															<div className="font-size-sm font-w600 text-muted">
																{localStorage.getItem("checkoutStripeFpxSubText")}
															</div>
														</div>
													</div>
												</div>
											</div>
											{this.state.payWithStripeFpx && (
												<div className="stripe-card-container">
													<StripeFpx
														user={this.props.user}
														total={formatPrice(parseFloat(this.getTotalAfterCalculation()))}
														handlePaymentProcessing={this.props.handleLoading}
														placeOrder={this.__placeOrder}
														handlePaymentGatewayRedirect={this.handlePaymentGatewayRedirect}
														checkout={this.props.checkout}
													/>
												</div>
											)}
										</React.Fragment>
									)}
								</div>

								{this.props.paymentgateways.map((gateway) => (
									<React.Fragment key={gateway.id}>
										{gateway.name === "Stripe" && (
											<div className="col-12 paymentGatewayBlock stripe-gateway-block">
												<React.Fragment>
													<div
														className="col-12 p-0"
														ref="payWithStripeCardToggle"
														onClick={this.handlePayWithStripeCardToggle}
													>
														<div className="block block-link-shadow text-left shadow-light">
															<div className="block-content block-content-full clearfix py-3 payment-select-block">
																<div className="float-right mt-10">
																	<img
																		src="/assets/img/various/stripe.png"
																		alt={gateway.name}
																		className="img-fluid"
																	/>
																</div>
																<div className="font-size-h3 font-w600">
																	{localStorage.getItem("checkoutStripeText")}
																	<div className="font-size-sm font-w600 text-muted">
																		{localStorage.getItem("checkoutStripeSubText")}
																	</div>
																</div>
															</div>
														</div>
													</div>
													{this.state.payWithStripeCard && (
														<div className="stripe-card-container">
															<StripeCard
																user={this.props.user}
																total={formatPrice(
																	parseFloat(this.getTotalAfterCalculation())
																)}
																handlePaymentProcessing={this.props.handleLoading}
																placeOrder={this.__placeOrder}
															/>
														</div>
													)}
												</React.Fragment>
											</div>
										)}

										{this.state.showCod && (
											<React.Fragment>
												{gateway.name === "COD" && (
													<React.Fragment>
														{localStorage.getItem("showCashChange") === "true" ? (
															<React.Fragment>
																<div
																	className="col-12 paymentGatewayBlock"
																	onClick={() => this.__showCashChangeBlock()}
																>
																	<div className="block block-link-shadow text-left shadow-light">
																		<div className="block-content block-content-full clearfix py-3 payment-select-block">
																			<div className="float-right mt-10">
																				<img
																					src="/assets/img/various/cod.png"
																					alt={gateway.name}
																					className="img-fluid"
																				/>
																			</div>
																			<div className="font-size-h3 font-w600">
																				{localStorage.getItem(
																					"checkoutCodText"
																				)}
																			</div>
																			<div className="font-size-sm font-w600 text-muted">
																				{localStorage.getItem(
																					"checkoutCodSubText"
																				)}
																			</div>
																		</div>
																	</div>
																</div>
																<div className="col-12 hidden" ref="cashAmountBlock">
																	<div className="text-left">
																		<input
																			type="tel"
																			name="cashChange"
																			value={this.state.cashChange}
																			className="form-control cash-change-input"
																			placeholder={localStorage.getItem(
																				"cashChangeInputPlaceholder"
																			)}
																			onChange={this.__handleCashInput}
																		/>
																		<button
																			className="btn btn-main"
																			style={{
																				backgroundColor: localStorage.getItem(
																					"cartColorBg"
																				),
																			}}
																			onClick={this.__handleCashInputConfirm}
																		>
																			{localStorage.getItem(
																				"cashChangeConfirmButton"
																			)}
																		</button>
																		<p className="pt-2">
																			{localStorage.getItem("cashChangeHelpText")}
																		</p>
																	</div>
																</div>
															</React.Fragment>
														) : (
															<div
																className="col-12 paymentGatewayBlock"
																onClick={() => this.__placeOrder("", "COD")}
															>
																<div className="block block-link-shadow text-left shadow-light">
																	<div className="block-content block-content-full clearfix py-3 payment-select-block">
																		<div className="float-right mt-10">
																			<img
																				src="/assets/img/various/cod.png"
																				alt={gateway.name}
																				className="img-fluid"
																			/>
																		</div>
																		<div className="font-size-h3 font-w600">
																			{localStorage.getItem("checkoutCodText")}
																		</div>
																		<div className="font-size-sm font-w600 text-muted">
																			{localStorage.getItem("checkoutCodSubText")}
																		</div>
																	</div>
																</div>
															</div>
														)}
													</React.Fragment>
												)}
											</React.Fragment>
										)}

										{gateway.name === "Khalti" && (
											<div
												className="col-12 paymentGatewayBlock"
												onClick={() => this.__handleKhaltiPayment()}
											>
												<div className="block block-link-shadow text-left shadow-light">
													<div className="block-content block-content-full clearfix py-3 payment-select-block">
														<div className="float-right mt-10">
															<img
																src="/assets/img/various/khalti.png"
																alt={gateway.name}
																className="img-fluid"
															/>
														</div>
														<div className="font-size-h3 font-w600">
															{localStorage.getItem("checkoutKhaltiText")}
														</div>
														<div className="font-size-sm font-w600 text-muted">
															{localStorage.getItem("checkoutKhaltiSubText")}
														</div>
													</div>
												</div>
											</div>
										)}
										{gateway.name === "Paytm" && (
											<div
												className="col-12 paymentGatewayBlock"
												onClick={() => this.__placeOrder("", "PAYTM")}
											>
												<div className="block block-link-shadow text-left shadow-light">
													<div className="block-content block-content-full clearfix py-3 payment-select-block">
														<div className="float-right mt-10">
															<img
																src="/assets/img/various/paytm.png"
																alt={gateway.name}
																className="img-fluid"
															/>
														</div>
														<div className="font-size-h3 font-w600">
															{localStorage.getItem("checkoutPaytmText")}
														</div>
														<div className="font-size-sm font-w600 text-muted">
															{localStorage.getItem("checkoutPaytmSubText")}
														</div>
													</div>
												</div>
											</div>
										)}
										{gateway.name === "Flutterwave" && (
											<React.Fragment>
												<FlutterWave
													user={this.props.user}
													total={formatPrice(parseFloat(this.getTotalAfterCalculation()))}
													placeOrder={this.__placeOrder}
													reset={this.resetPage}
												/>
												<div
													className="col-12 paymentGatewayBlock"
													onClick={() => this.__processFlutterWave()}
												>
													<div className="block block-link-shadow text-left shadow-light">
														<div className="block-content block-content-full clearfix py-3 payment-select-block">
															<div className="float-right mt-10">
																<img
																	src="/assets/img/various/flutterwave.png"
																	alt={gateway.name}
																	className="img-fluid"
																/>
															</div>
															<div className="font-size-h3 font-w600">
																{localStorage.getItem("checkoutFlutterwaveText")}
															</div>
															<div className="font-size-sm font-w600 text-muted">
																{localStorage.getItem("checkoutFlutterwaveSubText")}
															</div>
														</div>
													</div>
												</div>
											</React.Fragment>
										)}
										{gateway.name === "Razorpay" && (
											<div
												className="col-12 paymentGatewayBlock"
												// onClick={() => this.__handleRazorPay()}
												onClick={() => this.__placeOrder("", "RAZORPAY")}
											>
												<div className="block block-link-shadow text-left shadow-light">
													<div className="block-content block-content-full clearfix py-3 payment-select-block">
														<div className="float-right mt-10">
															<img
																src="/assets/img/various/razorpay.png"
																alt={gateway.name}
																className="img-fluid"
															/>
														</div>
														<div className="font-size-h3 font-w600">
															{localStorage.getItem("checkoutRazorpayText")}
														</div>
														<div className="font-size-sm font-w600 text-muted">
															{localStorage.getItem("checkoutRazorpaySubText")}
														</div>
													</div>
												</div>
											</div>
										)}
										{gateway.name === "PayStack" && (
											<div className="col-12 mb-4 mt-4 paymentGatewayBlock">
												<img
													src="/assets/img/various/paystack.png"
													alt={gateway.name}
													className="paystack-absolute-logo"
												/>
												<PaystackButton
													text={localStorage.getItem("paystackPayText")}
													class="payButton"
													callback={this.callback}
													close={this.close}
													disabled={false}
													embed={false}
													reference={this.getReference()}
													email={this.props.user.data.email}
													amount={parseInt(parseFloat(this.getTotalAfterCalculation() * 100))}
													paystackkey={localStorage.getItem("paystackPublicKey")}
													tag="button"
													currency={localStorage.getItem("currencyId")}
												/>
											</div>
										)}
										{gateway.name === "Paypal" && (
											<div className="col-12 paymentGatewayBlock">
												<PaypalExpressBtn
													env={localStorage.getItem("paypalEnv")}
													client={client}
													currency={localStorage.getItem("currencyId")}
													total={parseFloat(this.getTotalAfterCalculation())}
													shipping={1}
													onError={this.onError}
													onSuccess={this.onSuccess}
													onCancel={this.onCancel}
													style={{
														size: "responsive",
														color: "silver",
														shape: "rect",
													}}
												/>
											</div>
										)}
										{gateway.name === "MercadoPago" && (
											<div
												className="col-12 paymentGatewayBlock"
												onClick={() => this.__placeOrder("", "MERCADOPAGO")}
											>
												<div className="block block-link-shadow text-left shadow-light">
													<div className="block-content block-content-full clearfix py-3 payment-select-block">
														<div className="float-right mt-10">
															<img
																src="/assets/img/various/mercadopago.png"
																alt={gateway.name}
																className="img-fluid"
															/>
														</div>
														<div className="font-size-h3 font-w600">
															{localStorage.getItem("checkoutMercadoPagoText")}
														</div>
														<div className="font-size-sm font-w600 text-muted">
															{localStorage.getItem("checkoutMercadoPagoSubText")}
														</div>
													</div>
												</div>
											</div>
										)}
										{gateway.name === "PayMongo" &&
											(this.state.showPaymongoForm ? (
												<div className="col-12 paymentGatewayBlock">
													<div className="block block-link-shadow text-left shadow-light">
														<div className="block-content block-content-full clearfix py-3 payment-select-block">
															<form onSubmit={this.handlePaymongo}>
																<PaymentInputsContainer>
																	{({
																		meta,
																		getCardNumberProps,
																		getExpiryDateProps,
																		getCVCProps,
																	}) => (
																		<React.Fragment>
																			<div className="font-size-h4 font-w600 mb-2">
																				{localStorage.getItem(
																					"checkoutPayMongoText"
																				)}
																			</div>
																			<input
																				className="form-control edit-address-input"
																				{...getCardNumberProps({
																					onChange: this.handleInput,
																				})}
																				name="paymongoCCNumber"
																				value={this.state.paymongoCCNumber}
																				placeholder={localStorage.getItem(
																					"checkoutCardNumber"
																				)}
																			/>
																			<input
																				className="form-control edit-address-input"
																				{...getExpiryDateProps({
																					onChange: this.handleInput,
																				})}
																				name="paymongoCCExp"
																				value={this.state.paymongoCCExp}
																				placeholder={localStorage.getItem(
																					"checkoutCardExpiration"
																				)}
																			/>
																			<input
																				className="form-control edit-address-input"
																				{...getCVCProps({
																					onChange: this.handleInput,
																				})}
																				value={this.state.paymongoCCCvv}
																				name="paymongoCCCvv"
																				placeholder={localStorage.getItem(
																					"checkoutCardCvv"
																				)}
																			/>
																			{meta.isTouched && meta.error && (
																				<span>Error: {meta.error}</span>
																			)}
																		</React.Fragment>
																	)}
																</PaymentInputsContainer>
																<div className="mt-20 px-15 pt-15 button-block">
																	<button
																		type="submit"
																		className="btn btn-main"
																		style={{
																			backgroundColor: localStorage.getItem(
																				"storeColor"
																			),
																		}}
																	>
																		{localStorage.getItem("checkoutPayText")}{" "}
																		{localStorage.getItem("currencySymbolAlign") ===
																			"left" &&
																			localStorage.getItem("currencyFormat")}
																		{this.getTotalAfterCalculation()}
																		{localStorage.getItem("currencySymbolAlign") ===
																			"right" &&
																			localStorage.getItem("currencyFormat")}
																	</button>
																</div>
															</form>
														</div>
													</div>
												</div>
											) : (
												<div
													className="col-12 paymentGatewayBlock"
													onClick={() => this.__showPaymongoForm()}
												>
													<div className="block block-link-shadow text-left shadow-light">
														<div className="block-content block-content-full clearfix py-3 payment-select-block">
															<div className="float-right mt-10">
																<img
																	src="/assets/img/various/paymongo.png"
																	alt={gateway.name}
																	className="img-fluid"
																/>
															</div>
															<div className="font-size-h3 font-w600">
																{localStorage.getItem("checkoutPayMongoText")}
															</div>
															<div className="font-size-sm font-w600 text-muted">
																{localStorage.getItem("checkoutPayMongoSubText")}
															</div>
														</div>
													</div>
												</div>
											))}
									</React.Fragment>
								))}
							</div>
						</React.Fragment>
					)}
				</div>

				<div className="progress push m-0 progress-transparent" style={{ height: "8px" }}>
					<div
						className="progress-bar progress-bar-striped progress-bar-animated hidden"
						role="progressbar"
						id="progressBar"
						style={{
							backgroundColor: localStorage.getItem("storeColor"),
							width: "10%",
						}}
					/>
				</div>
				<div className="mb-0 px-15" id="checkoutMessageOnIdle">
					{localStorage.getItem("checkoutMessageOnIdle") !== "<p><br></p>" &&
						localStorage.getItem("checkoutMessageOnIdle") !== "null" &&
						(localStorage.getItem("checkoutMessageOnIdle") !== "" && (
							<div
								dangerouslySetInnerHTML={{
									__html: localStorage.getItem("checkoutMessageOnIdle"),
								}}
							/>
						))}
				</div>
				<p id="checkoutMessageOnProcess" className="checkout-message-on-process mb-0 mt-15 text-center hidden">
					{localStorage.getItem("checkoutMessageOnProcess")}
				</p>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	addresses: state.addresses.addresses,
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
	coupon: state.coupon.coupon,
	checkout: state.checkout.checkout,
	restaurant_info: state.items.restaurant_info,
	delivery_datetime: state.delivery_datetime.delivery_datetime,		
	deliveryCharges: state.delivery_datetime.deliveryCharges
});

export default connect(
	mapStateToProps,
	{ placeOrder, updateUserInfo, getRestaurantInfoById, setDeliveryDateTime, setExpressDeliveryCharges }
)(PaymentList);
