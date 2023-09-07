import { GET_REVIEWS_OF_STORE, ADD_RATING_FOR_ORDER, GET_RATABLE_ORDER_DETAILS } from "./actionTypes";

const initialState = {
	done_rating: [],
	order: [],
	reviews: [],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case ADD_RATING_FOR_ORDER:
			return { ...state, done_rating: action.payload };
		case GET_RATABLE_ORDER_DETAILS:
			return { ...state, order: action.payload };
		case GET_REVIEWS_OF_STORE:
			return { ...state, reviews: action.payload };
		default:
			return state;
	}
}
