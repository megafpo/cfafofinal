import {
    DELETE_ADDRESS,
    GET_ADDRESSES,
    SAVE_ADDRESS,
    SET_DEFAULT
} from "./actionTypes";
import {
    DELETE_ADDRESS_URL,
    GET_ADDRESSES_URL,
    SAVE_ADDRESS_URL,
    SET_DEFAULT_URL
} from "../../configs";

import Axios from "axios";

export const getAddresses = (user_id, token, restaurant_id) => dispatch => {
    Axios.post(GET_ADDRESSES_URL, {
        user_id: user_id,
        token: token,
        restaurant_id: restaurant_id
    })
        .then(response => {
            const addresses = response.data;
            return dispatch({
                type: GET_ADDRESSES,
                payload: addresses
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const saveAddress = (
    user_id,
    token,
    lat,
    lng,
    address,
    house,
    tag,
    get_only_default_address
) => dispatch => {
    Axios.post(SAVE_ADDRESS_URL, {
        token: token,
        user_id: user_id,
        latitude: lat,
        longitude: lng,
        address: address,
        house: house,
        tag: tag,
        get_only_default_address: get_only_default_address
    })
        .then(response => {
            const addresses = response.data;
            return dispatch({
                type: SAVE_ADDRESS,
                payload: addresses
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const deleteAddress = (user_id, address_id, token) => dispatch => {
    Axios.post(DELETE_ADDRESS_URL, {
        token: token,
        user_id: user_id,
        address_id: address_id
    })
        .then(response => {
            const addresses = response.data;
            return dispatch({
                type: DELETE_ADDRESS,
                payload: addresses
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const setDefaultAddress = (user_id, address_id, token) => dispatch => {
    return Axios.post(SET_DEFAULT_URL, {
        token: token,
        user_id: user_id,
        address_id: address_id
    })
        .then(response => {
            const addresses = response.data;
            return dispatch({
                type: SET_DEFAULT,
                payload: addresses
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};
