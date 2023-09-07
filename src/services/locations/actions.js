import { SEARCH_LOCATIONS } from "./actionTypes";
import { SEARCH_LOCATIONS_URL } from "../../configs";
import Axios from "axios";

export const searchLocations = query => dispatch => {
    Axios.post(SEARCH_LOCATIONS_URL + "/" + query)
        .then(response => {
            const locations = response.data;
            return dispatch({ type: SEARCH_LOCATIONS, payload: locations });
        })
        .catch(function(error) {
            console.log(error);
        });
};
