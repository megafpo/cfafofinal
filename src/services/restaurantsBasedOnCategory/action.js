import { GET_RESTAURANTS_BASED_ON_CATEGORY } from "./actionTypes";
import { GET_RESTAURANTS_CATEGORIES } from "./actionTypes";
import { GET_RESTAURANTS_CATEGORIES_URL, GET_FILTERED_RESTAURANTS_URL } from "../../configs";

import Axios from "axios";

export const getRestaurantsBasedOnCategory = (lat,lng,category_ids) => dispatch => {
        Axios.post(GET_FILTERED_RESTAURANTS_URL, {
        latitude: lat,
        longitude: lng,
        category_ids: category_ids
    })
        .then(response => {
            const filtered_restaurants = response.data;
            return dispatch({
                type: GET_RESTAURANTS_BASED_ON_CATEGORY,
                payload: filtered_restaurants
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const getRestaurantsCatgories = slug => dispatch => {
    Axios.post(GET_RESTAURANTS_CATEGORIES_URL)
        .then(response => {
            const restaurants_categories = response.data;
            return dispatch({
                type: GET_RESTAURANTS_CATEGORIES,
                payload: restaurants_categories
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};
