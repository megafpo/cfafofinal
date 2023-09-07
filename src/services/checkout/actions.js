import { PLACE_ORDER } from "./actionTypes";
import { PLACE_ORDER_URL } from "../../configs";
import { APPLY_COUPON } from "../coupon/actionTypes";

import Axios from "axios";
import { updateCart } from "../total/actions";

export const placeOrder = (
	user,
	order,
	coupon,
	location,
	order_comment,
	total,
	method,
	payment_token,
	delivery_type,
	partial_wallet,
	distance,
	pending_payment,
	tipAmount,
	cash_change_amount,
	delivery_datetime,	
	deliveryCharges
) => (dispatch, getState) => {
	return Axios.post(PLACE_ORDER_URL, {
		token: user.data.auth_token,
		user: user,
		order: order,
		coupon: coupon,
		location: location,
		order_comment: order_comment,
		total: total,
		method: method,
		payment_token: payment_token,
		delivery_type: delivery_type,
		partial_wallet: partial_wallet,
		dis: distance,
		pending_payment: pending_payment,
		tipAmount: tipAmount,
		cash_change_amount: cash_change_amount,
		schedule_date:
			localStorage.getItem("orderDate") !== null ? JSON.parse(localStorage.getItem("orderDate")) : null,
		schedule_slot:
			localStorage.getItem("orderSlot") !== null ? JSON.parse(localStorage.getItem("orderSlot")) : null,
		delivery_datetime: delivery_datetime,		
		delivery_charges: deliveryCharges,
	})
		.then((response) => {
			const checkout = response.data;
			console.log("From Checkout");
			if (checkout.success) {
				dispatch({ type: PLACE_ORDER, payload: checkout });

				const state = getState();
				// console.log(state);
				const cartProducts = state.cart.products;
				// const user = state.user.user;
				localStorage.removeItem("orderComment");
				localStorage.removeItem("orderSlot");
				localStorage.removeItem("orderDate");
				for (let i = cartProducts.length - 1; i >= 0; i--) {
					// remove all items from cart
					cartProducts.splice(i, 1);
				}

				dispatch(updateCart(cartProducts));

				localStorage.removeItem("appliedCoupon");
				const coupon = [];
				dispatch({ type: APPLY_COUPON, payload: coupon });
			} else {
				return checkout;
			}
		})
		.catch(function(error) {
			return error.response;
		});
};
