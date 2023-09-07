import { FORCE_RELOAD } from "./actionTypes";

const initialState = {
	force_reload: false,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case FORCE_RELOAD:
			return { ...state, force_reload: action.payload };
		default:
			return state;
	}
}
