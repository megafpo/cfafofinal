import {
	LOGIN_DELIVERY_USER,
	LOGOUT_DELIVERY_USER,
	UPDATE_DELIVERY_USER_INFO,
	UPDATE_DELIVERY_ORDER_HISTORY,
} from "./actionTypes";
import {
	LOGIN_DELIVERY_USER_URL,
	UPDATE_DELIVERY_USER_INFO_URL,
	TOGGLE_DELIVERY_GUY_STATUS_URL,
} from "../../../configs";

import Axios from "axios";

export const loginDeliveryUser = (email, password) => (dispatch) => {
	Axios.post(LOGIN_DELIVERY_USER_URL, {
		email: email,
		password: password,
	})
		.then((response) => {
			const delivery_user = response.data;
			return dispatch({ type: LOGIN_DELIVERY_USER, payload: delivery_user });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const logoutDeliveryUser = () => (dispatch) => {
	const delivery_user = [];
	dispatch({
		type: LOGOUT_DELIVERY_USER,
		payload: delivery_user,
	});
};

export const updateDeliveryUserInfo = (user_id, token) => (dispatch) => {
	Axios.post(UPDATE_DELIVERY_USER_INFO_URL, {
		token: token,
		user_id: user_id,
	})
		.then((response) => {
			const data = { delivery_user: response.data, order_history: response.data.data.orders };
			return dispatch({ type: UPDATE_DELIVERY_USER_INFO, payload: data });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const updateDeliveryOrderHistory = (order_history) => (dispatch) => {
	dispatch({
		type: UPDATE_DELIVERY_ORDER_HISTORY,
		payload: order_history,
	});
};

export const toggleDeliveryGuyStatus = (token, force_offline = false) => (dispatch) => {
	return Axios.post(TOGGLE_DELIVERY_GUY_STATUS_URL, {
		token: token,
		toggle_status: true,
		force_offline: force_offline,
	})
		.then((response) => {
			const data = { delivery_user: response.data, order_history: response.data.data.orders };
			return dispatch({ type: UPDATE_DELIVERY_USER_INFO, payload: data });
		})
		.catch(function(error) {
			console.log(error);
		});
};
