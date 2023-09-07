import { GET_ALERTS, SET_ALERT_UNREAD_TOTAL } from "./actionTypes";
import { GET_ALERTS_URL, MARK_ALL_NOTIFICATIONS_READ_URL, MARK_ONE_NOTIFICATION_READ_URL } from "../../configs";
import Axios from "axios";

export const getUserNotifications = (user_id, token) => dispatch => {
	Axios.post(GET_ALERTS_URL, {
		user_id: user_id,
		token: token
	})
		.then(response => {
			const data = response.data;
			const unread_alerts_count = data.filter(alert => alert.is_read === 0).length;
			return [
				dispatch({ type: GET_ALERTS, payload: data }),
				dispatch({ type: SET_ALERT_UNREAD_TOTAL, payload: unread_alerts_count })
			];
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const markAllNotificationsRead = (user_id, token) => dispatch => {
	Axios.post(MARK_ALL_NOTIFICATIONS_READ_URL, {
		user_id: user_id,
		token: token
	})
		.then(response => {
			const data = response.data;
			const unread_alerts_count = data.filter(alert => alert.is_read === 0).length;
			return [
				dispatch({ type: GET_ALERTS, payload: data }),
				dispatch({ type: SET_ALERT_UNREAD_TOTAL, payload: unread_alerts_count })
			];
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const markOneNotificationRead = (user_id, notification_id, token) => dispatch => {
	return Axios.post(MARK_ONE_NOTIFICATION_READ_URL, {
		user_id: user_id,
		notification_id: notification_id,
		token: token
	})
		.then(response => {
			const data = response.data;

			const unread_alerts_count = data.filter(alert => alert.is_read === 0).length;

			return [
				dispatch({ type: GET_ALERTS, payload: data }),
				dispatch({ type: SET_ALERT_UNREAD_TOTAL, payload: unread_alerts_count })
			];
		})
		.catch(function(error) {
			console.log(error);
		});
};

// export const setAlertUnreadTotal = total => dispatch => {
// 	return dispatch({ type: SET_ALERT_UNREAD_TOTAL, payload: total });
// };
