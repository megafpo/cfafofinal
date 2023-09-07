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

import { FORCE_RELOAD } from "../helper/actionTypes";

import {
	GET_RESTAURANT_INFO_BY_ID_URL,
	GET_RESTAURANT_INFO_URL,
	GET_RESTAURANT_ITEMS_URL,
	GET_SINGLE_ITEM_URL,
	GET_RESTAURANT_INFO_AND_OPERATIONAL_STATUS_URL,
	ADD_TO_FAVORITE_RESTAURANT_URL,
	GET_FAVORITE_RESTAURANT_FOR_LOGGED_IN_URL,
} from "../../configs";

import Axios from "axios";
import FuzzySearch from "fuzzy-search";

export const getRestaurantInfoAndOperationalStatus = (id, latitude, longitude) => (dispatch) => {
	return Axios.post(GET_RESTAURANT_INFO_AND_OPERATIONAL_STATUS_URL, {
		id: id,
		latitude: latitude,
		longitude: longitude,
	})
		.then((response) => {
			const restaurant_info = response.data;
			return dispatch({ type: GET_RESTAURANT_INFO, payload: restaurant_info });
		})
		.catch(function(error) {
			console.log(error);
			if (error.response.status === 400) {
				const force_reload = true;
				return dispatch({ type: FORCE_RELOAD, payload: force_reload });
			}
		});
};

export const getRestaurantInfo = (slug) => (dispatch, getState) => {
	return Axios.post(GET_RESTAURANT_INFO_URL + "/" + slug)
		.then((response) => {
			const restaurant_info = response.data;
			return dispatch({ type: GET_RESTAURANT_INFO, payload: restaurant_info });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getRestaurantInfoForLoggedInUser = (slug) => (dispatch, getState) => {
	return Axios.post(GET_FAVORITE_RESTAURANT_FOR_LOGGED_IN_URL + "/" + slug, {
		token: getState().user.user.data.auth_token,
	})
		.then((response) => {
			const restaurant_info = response.data;
			return dispatch({ type: GET_RESTAURANT_INFO_FOR_LOGGED_IN_USER, payload: restaurant_info });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getRestaurantInfoById = (id) => (dispatch) => {
	return Axios.post(GET_RESTAURANT_INFO_BY_ID_URL + "/" + id)
		.then((response) => {
			const restaurant_info = response.data;
			return dispatch({
				type: GET_RESTAURANT_INFO_BY_ID,
				payload: restaurant_info,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getRestaurantItems = (slug) => (dispatch) => {
	Axios.post(GET_RESTAURANT_ITEMS_URL + "/" + slug)
		.then((response) => {
			const restaurant_items = response.data;
			return dispatch({ type: GET_RESTAURANT_ITEMS, payload: restaurant_items });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getSingleItem = (id) => (dispatch) => {
	return Axios.post(GET_SINGLE_ITEM_URL, {
		id: id,
	})
		.then((response) => {
			const item = response.data;
			return dispatch({ type: SINGLE_ITEM, payload: item });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const resetItems = () => (dispatch) => {
	const empty = [];
	return dispatch({ type: RESET_ITEMS, payload: empty });
};
export const resetBackup = () => (dispatch) => {
	const empty = [];
	return dispatch({ type: RESET_BACKUP, payload: empty });
};

export const resetInfo = () => (dispatch) => {
	const empty = [];
	return dispatch({ type: RESET_INFO, payload: empty });
};

export const searchItem = (itemList, itemName, searchFoundText, noResultText) => (dispatch, getState) => {
	const searchResultText = searchFoundText + itemName;
	const noSearchFoundText = noResultText + itemName;

	let foodItems = [];

	const searcher = new FuzzySearch(itemList, ["name"], {
		caseSensitive: false,
	});
	foodItems = searcher.search(itemName);

	if (foodItems.length > 0) {
		return dispatch({
			type: SEARCH_ITEM,
			payload: { items: { [searchResultText]: foodItems } },
		});
	} else if (foodItems.length <= 0) {
		return dispatch({
			type: SEARCH_ITEM,
			payload: { items: { [noSearchFoundText]: foodItems } },
		});
	}
};

export const clearSearch = (data) => (dispatch) => {
	return dispatch({ type: CLEAR_SEARCH, payload: data });
};

export const setFavoriteRest = (token, rest_id) => (dispatch) => {
	return Axios.post(ADD_TO_FAVORITE_RESTAURANT_URL, {
		token: token,
		id: rest_id,
	})
		.then((response) => {
			const restaurant = response.data;
			return dispatch({ type: SET_FAVORITE_REST, payload: restaurant });
		})
		.catch(function(error) {
			console.log(error);
		});
};
