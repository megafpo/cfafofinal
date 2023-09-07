import { GET_PROMO_SLIDER } from "./actionTypes";
import { GET_PROMO_SLIDER_URL } from "../../configs";
import Axios from "axios";

export const getPromoSlides = (lat, lng) => (dispatch) => {
	Axios.post(GET_PROMO_SLIDER_URL, {
		latitude: lat,
		longitude: lng,
	})
		.then((response) => {
			const promo_slides = response.data;
			return dispatch({ type: GET_PROMO_SLIDER, payload: promo_slides });
		})
		.catch(function(error) {
			console.log(error);
		});
};
