import { CONFIRM_CART } from "./actionTypes";
import { CHECK_CART_ITEMS_AVAILABILITY_URL } from "../../configs";
import Axios from "axios";

export const checkConfirmCart = () => dispatch => {
	const confirmCart = true;
	return dispatch({ type: CONFIRM_CART, payload: confirmCart });
};

export const checkCartItemsAvailability = items => dispatch => {
	return Axios.post(CHECK_CART_ITEMS_AVAILABILITY_URL, {
		items: items
	})
		.then(response => {
			const data = response.data;
			// console.log(data);
			return data;
			// return dispatch({ type: APPLY_COUPON, payload: coupon });
		})
		.catch(function(error) {
			console.log(error);
		});
};
