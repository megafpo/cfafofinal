import { GET_PAYMENT_GATEWAYS } from "./actionTypes";
import { GET_PAYMENT_GATEWAYS_URL } from "../../configs";
import Axios from "axios";

export const getPaymentGateways = (token, restaurant_id) => (dispatch) => {
	return Axios.post(GET_PAYMENT_GATEWAYS_URL, {
		token: token,
		restaurant_id: restaurant_id,
	})
		.then((response) => {
			const paymentgateways = response.data;
			return dispatch({ type: GET_PAYMENT_GATEWAYS, payload: paymentgateways });
		})
		.catch(function(error) {
			console.log(error);
		});
};
