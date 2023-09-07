import { GET_SINGLE_DELIVERY_ORDER } from "./actionTypes";
import { GET_SINGLE_DELIVERY_ORDER_URL } from "../../../configs";
import Axios from "axios";

export const getSingleDeliveryOrder = (token, unique_order_id) => (dispatch) => {
	return Axios.post(GET_SINGLE_DELIVERY_ORDER_URL, {
		token: token,
		unique_order_id: unique_order_id,
	})
		.then((response) => {
			const single_delivery_order = response.data;
			return dispatch({ type: GET_SINGLE_DELIVERY_ORDER, payload: single_delivery_order });
		})
		.catch(function(error) {
			console.log(error);
		});
};
