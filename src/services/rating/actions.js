import { GET_REVIEWS_OF_STORE, ADD_RATING_FOR_ORDER, GET_RATABLE_ORDER_DETAILS } from "./actionTypes";
import { GET_RESTAURANT_INFO } from "../items/actionTypes";

import { GET_REVIEWS_OF_STORE_URL, ADD_RATING_URL, GET_RATABLE_ORDER_DETAILS_URL } from "../../configs";
import Axios from "axios";

export const getReviewsForStore = (slug) => (dispatch) => {
	return Axios.get(GET_REVIEWS_OF_STORE_URL + "/" + slug)
		.then((response) => {
			const restaurant = response.data.restaurant;
			const reviews = response.data.reviews;

			return [
				dispatch({ type: GET_RESTAURANT_INFO, payload: restaurant }),
				dispatch({ type: GET_REVIEWS_OF_STORE, payload: reviews }),
			];
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const addRating = (data) => (dispatch) => {
	return Axios.post(ADD_RATING_URL, {
		order_id: data.order_id,
		token: data.auth_token,
		rating_store: data.rating_store,
		rating_delivery: data.rating_delivery,
		review_store: data.review_store,
		review_delivery: data.review_delivery,
	})
		.then((response) => {
			const rating = response.data;
			return dispatch({
				type: ADD_RATING_FOR_ORDER,
				payload: rating,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getOrderDetails = (order_id, token) => (dispatch) => {
	Axios.post(GET_RATABLE_ORDER_DETAILS_URL, {
		order_id: order_id,
		token: token,
	})
		.then((response) => {
			const rating = response.data;
			return dispatch({
				type: GET_RATABLE_ORDER_DETAILS,
				payload: rating,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};
