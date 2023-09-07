import { APPLY_COUPON, COUPON_ERROR } from "./actionTypes";
import { APPLY_COUPON_URL } from "../../configs";
import Axios from "axios";

export const applyCoupon = (token, coupon, restaurant_id, subtotal) => (dispatch) => {
	return Axios.post(APPLY_COUPON_URL, {
		token: token,
		coupon: coupon,
		restaurant_id: restaurant_id,
		subtotal: subtotal,
	})
		.then((response) => {
			const coupon = response.data;

			return [dispatch({ type: APPLY_COUPON, payload: coupon }), dispatch({ type: COUPON_ERROR, payload: null })];
		})
		.catch(function(error) {
			console.log(error);
			if (error.response.status === 401) {
				return dispatch({ type: COUPON_ERROR, payload: "NOTLOGGEDIN" });
			}
		});
};

export const removeCoupon = () => (dispatch) => {
	console.log("Triggred Coupon Removed");

	const coupon = { hideMessage: true, coupon_error: "" };
	return dispatch({ type: APPLY_COUPON, payload: coupon });
};

export const couponApplied = (coupon, percentage_discount) => (dispatch) => {
	coupon.appliedAmount = percentage_discount;
	return dispatch({ type: APPLY_COUPON, payload: coupon });
};
