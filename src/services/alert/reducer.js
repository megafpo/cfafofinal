import { GET_ALERTS, SET_ALERT_UNREAD_TOTAL } from "./actionTypes";

const initialState = {
	alerts: [],
	alertUnreadTotal: 0
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_ALERTS:
			return { ...state, alerts: action.payload };
		case SET_ALERT_UNREAD_TOTAL:
			return { ...state, alertUnreadTotal: action.payload };
		default:
			return state;
	}
}
