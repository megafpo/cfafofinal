import { GET_PAGES, GET_SINGLE_PAGE, CLEAR_SINGLE_PAGE } from "./actionTypes";
import { GET_PAGES_URL, GET_SINGLE_PAGE_URL } from "../../configs";
import Axios from "axios";

export const getPages = () => dispatch => {
    Axios.post(GET_PAGES_URL)
        .then(response => {
            const pages = response.data;
            return dispatch({
                type: GET_PAGES,
                payload: pages
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const getSinglePage = slug => dispatch => {
    Axios.post(GET_SINGLE_PAGE_URL, {
        slug: slug
    })
        .then(response => {
            const pages = response.data;
            return dispatch({
                type: GET_SINGLE_PAGE,
                payload: pages
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const clearSinglePage = () => dispatch => {
    const single_page = [];
    return dispatch({
        type: CLEAR_SINGLE_PAGE,
        payload: single_page
    });
};
