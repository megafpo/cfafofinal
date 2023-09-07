import { APPLY_COUPON, COUPON_ERROR } from "./actionTypes";

const initialState = {
	coupon: [],
	coupon_error: "",
};

export default function(state = initialState, action) {
	switch (action.type) {
		case APPLY_COUPON:
			return { ...state, coupon: action.payload };
		case COUPON_ERROR:
			return { ...state, coupon_error: action.payload };

		default:
			return state;
	}
}
