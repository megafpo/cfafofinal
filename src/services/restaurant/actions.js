import {
	CHECK_RESTAURANT_OPERATION_SERVICE,
	GET_RESTAURANTS_BASED_ON_CATEGORY,
	GET_RESTAURANTS_CATEGORIES,
	GET_DELIVERY_RESTAURANTS,
	GET_SELFPICKUP_RESTAURANTS,
	GET_FAVORITE_RESTAURANTS,
} from "./actionTypes";
import {
	CHECK_RESTAURANT_OPERATION_SERVICE_URL,
	GET_RESTAURANTS_CATEGORIES_URL,
	GET_FILTERED_RESTAURANTS_URL,
	GET_DELIVERY_RESTAURANTS_URL,
	GET_SELFPICKUP_RESTAURANTS_URL,
	GET_FAVORITE_RESTAURANTS_URL,
} from "../../configs";
import Axios from "axios";

export const checkRestaurantOperationService = (restaurant_id, latitude, longitude) => (dispatch) => {
	Axios.post(CHECK_RESTAURANT_OPERATION_SERVICE_URL, {
		restaurant_id: restaurant_id,
		latitude: latitude,
		longitude: longitude,
	})
		.then((response) => {
			const coupon = response.data;
			return dispatch({ type: CHECK_RESTAURANT_OPERATION_SERVICE, payload: coupon });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getRestaurantsBasedOnCategory = (lat, lng, category_ids) => (dispatch) => {
	Axios.post(GET_FILTERED_RESTAURANTS_URL, {
		latitude: lat,
		longitude: lng,
		category_ids: category_ids,
	})
		.then((response) => {
			const filtered_restaurants = response.data;
			return dispatch({
				type: GET_RESTAURANTS_BASED_ON_CATEGORY,
				payload: filtered_restaurants,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getRestaurantsCategories = (slug) => (dispatch) => {
	Axios.post(GET_RESTAURANTS_CATEGORIES_URL)
		.then((response) => {
			const restaurants_categories = response.data;
			return dispatch({
				type: GET_RESTAURANTS_CATEGORIES,
				payload: restaurants_categories,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getDeliveryRestaurants = (lat, lng) => (dispatch) => {
	return Axios.post(GET_DELIVERY_RESTAURANTS_URL, {
		latitude: lat,
		longitude: lng,
	})
		.then((response) => {
			const restaurants = response.data;
			return dispatch({
				type: GET_DELIVERY_RESTAURANTS,
				payload: restaurants,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getSelfpickupRestaurants = (lat, lng) => (dispatch) => {
	return Axios.post(GET_SELFPICKUP_RESTAURANTS_URL, {
		latitude: lat,
		longitude: lng,
	})
		.then((response) => {
			const restaurants = response.data;
			return dispatch({
				type: GET_SELFPICKUP_RESTAURANTS,
				payload: restaurants,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getFavoriteRestaurants = (lat, lng) => (dispatch, getState) => {
	return Axios.post(GET_FAVORITE_RESTAURANTS_URL, {
		token: getState().user.user.data.auth_token,
		latitude: lat,
		longitude: lng,
	})
		.then((response) => {
			const restaurants = response.data;
			return dispatch({
				type: GET_FAVORITE_RESTAURANTS,
				payload: restaurants,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const clearRestaurantList = () => (dispatch) => {
	const restaurants = [];
	return dispatch({
		type: GET_DELIVERY_RESTAURANTS,
		payload: restaurants,
	});
};
