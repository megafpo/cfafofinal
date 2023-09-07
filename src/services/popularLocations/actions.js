import { GET_POPULAR_LOCATIONS } from "./actionTypes";
import { GET_POPULAR_LOCATIONS_URL } from "../../configs";
import Axios from "axios";

export const getPopularLocations = () => (dispatch) => {
	return Axios.post(GET_POPULAR_LOCATIONS_URL)
		.then((response) => {
			const popular_locations = response.data;
			return dispatch({
				type: GET_POPULAR_LOCATIONS,
				payload: popular_locations,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};
