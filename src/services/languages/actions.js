import { GET_ALL_LANGUAGES, GET_SINGLE_LANGUAGE_DATA } from "./actionTypes";

import Axios from "axios";
import { GET_ALL_LANGUAGES_URL, GET_SINGLE_LANGUAGE_DATA_URL } from "../../configs";

export const getAllLanguages = () => (dispatch) => {
	return Axios.post(GET_ALL_LANGUAGES_URL)
		.then((response) => {
			const languages = response.data;
			return dispatch({ type: GET_ALL_LANGUAGES, payload: languages });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getSingleLanguageData = (id) => (dispatch) => {
	return Axios.post(GET_SINGLE_LANGUAGE_DATA_URL, {
		id: id,
	})
		.then((response) => {
			const language = response.data;

			return dispatch({ type: GET_SINGLE_LANGUAGE_DATA, payload: language });
		})
		.catch(function(error) {
			console.log(error);
		});
};
