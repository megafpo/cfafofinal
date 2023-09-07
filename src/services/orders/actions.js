import { GET_ORDERS, CANCEL_ORDER } from "./actionTypes";
import { GET_ORDERS_URL, GET_ORDER_CANCEL_URL } from "../../configs";
import Axios from "axios";

export const getOrders = (token) => (dispatch) => {
	Axios.post(GET_ORDERS_URL, {
		token: token,
	})
		.then((response) => {
			const orders = response.data;
			return dispatch({ type: GET_ORDERS, payload: orders });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const cancelOrder = (token, user_id, order_id) => (dispatch) => {
	Axios.post(GET_ORDER_CANCEL_URL, {
		token: token,
		user_id: user_id,
		order_id: order_id,
	})
		.then((response) => {
			const res = response.data;
			return dispatch({ type: CANCEL_ORDER, payload: res });
		})
		.catch(function(error) {
			console.log(error);
		});
};
