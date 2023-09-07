import { CLEAR_SEARCH, SEARCH_RESTAURANTS } from "./actionTypes";

import Axios from "axios";
import { SEARCH_RESTAURANTS_URL } from "../../configs";

export const searchRestaurants = (lat, lng, query) => dispatch => {
    Axios.post(SEARCH_RESTAURANTS_URL, {
        latitude: lat,
        longitude: lng,
        q: query
    })
        .then(response => {
            const restaurants = response.data;
            return dispatch({ type: SEARCH_RESTAURANTS, payload: restaurants });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const clearSearch = () => dispatch => {
    const restaurants = [];
    console.log("Search Cleared");
    return dispatch({ type: CLEAR_SEARCH, payload: restaurants });
};
