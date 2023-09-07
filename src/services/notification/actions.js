import { NOTIFICATION_TOKEN } from "./actionTypes";
import { NOTIFICATION_TOKEN_URL } from "../../configs";
import Axios from "axios";

export const saveNotificationToken = (push_token, user_id, token) => (dispatch) => {
	Axios.post(NOTIFICATION_TOKEN_URL, {
		push_token: push_token,
		user_id: user_id,
		token: token,
	})
		.then((response) => {
			if (response.data) {
				console.log("Notification Token Saved");
			}
			const token = response.data;

			return dispatch({ type: NOTIFICATION_TOKEN, payload: token });
		})
		.catch(function(error) {
			console.log(error);
		});
};
