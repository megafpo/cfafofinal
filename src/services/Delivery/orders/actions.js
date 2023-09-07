import { GET_DELIVERY_ORDERS } from "./actionTypes";
import { GET_DELIVERY_ORDERS_URL } from "../../../configs";
import Axios from "axios";

export const getDeliveryOrders = token => dispatch => {
    Axios.post(GET_DELIVERY_ORDERS_URL, {
        token: token
    })
        .then(response => {
            const delivery_orders = response.data;
            return dispatch({ type: GET_DELIVERY_ORDERS, payload: delivery_orders });
        })
        .catch(function(error) {
            console.log(error);
        });
};
