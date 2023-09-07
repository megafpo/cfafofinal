import {
	GET_RESTAURANT_INFO,
	GET_RESTAURANT_INFO_BY_ID,
	GET_RESTAURANT_ITEMS,
	RESET_INFO,
	RESET_ITEMS,
	RESET_BACKUP,
	SINGLE_ITEM,
	SEARCH_ITEM,
	CLEAR_SEARCH,
	SET_FAVORITE_REST,
	GET_RESTAURANT_INFO_FOR_LOGGED_IN_USER,
} from "./actionTypes";

const initialState = {
	restaurant_info: [],
	restaurant_items: [],
	single_item: [],
	restaurant_backup_items: [],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_RESTAURANT_INFO:
			return { ...state, restaurant_info: action.payload };
		case GET_RESTAURANT_INFO_BY_ID:
			return { ...state, restaurant_info: action.payload };
		case GET_RESTAURANT_ITEMS:
			return { ...state, restaurant_items: action.payload, restaurant_backup_items: action.payload };
		case RESET_ITEMS:
			return { ...state, restaurant_items: action.payload };
		case RESET_BACKUP:
			return { ...state, restaurant_backup_items: action.payload };
		case RESET_INFO:
			return { ...state, restaurant_info: action.payload };
		case SINGLE_ITEM:
			return { ...state, single_item: action.payload };
		case SEARCH_ITEM:
			return { ...state, restaurant_items: action.payload };
		case CLEAR_SEARCH:
			return { ...state, restaurant_items: action.payload };
		case SET_FAVORITE_REST:
			return { ...state, restaurant_info: action.payload };
		case GET_RESTAURANT_INFO_FOR_LOGGED_IN_USER:
			return { ...state, restaurant_info: action.payload };
		default:
			return state;
	}
}
