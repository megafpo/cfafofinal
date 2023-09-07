import { ACCEPT_TO_DELIVER, PICKEDUP_ORDER, DELIVER_ORDER } from "./actionTypes";
import { GET_SINGLE_DELIVERY_ORDER } from "../singleorder/actionTypes";
import { ACCEPT_TO_DELIVER_URL, PICKEDUP_ORDER_URL, DELIVER_ORDER_URL } from "../../../configs";
import Axios from "axios";

export const acceptToDeliverOrder = (token, delivery_guy_id, order_id) => dispatch => {
    Axios.post(ACCEPT_TO_DELIVER_URL, {
        token: token,
        delivery_guy_id: delivery_guy_id,
        order_id: order_id
    })
        .then(response => {
            const accepted_order = response.data;
            dispatch({ type: ACCEPT_TO_DELIVER, payload: accepted_order });
            dispatch({ type: GET_SINGLE_DELIVERY_ORDER, payload: accepted_order });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const pickupOrder = (token, order_id) => dispatch => {
    Axios.post(PICKEDUP_ORDER_URL, {
        token: token,
        order_id: order_id
    })
        .then(response => {
            const pickup_order = response.data;
            dispatch({ type: PICKEDUP_ORDER, payload: pickup_order });
            dispatch({ type: GET_SINGLE_DELIVERY_ORDER, payload: pickup_order });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const deliverOrder = (token, order_id, delivery_pin) => dispatch => {
    Axios.post(DELIVER_ORDER_URL, {
        token: token,
        order_id: order_id,
        delivery_pin: delivery_pin
    })
        .then(response => {
            const pickup_order = response.data;
            dispatch({ type: DELIVER_ORDER, payload: pickup_order });
            dispatch({ type: GET_SINGLE_DELIVERY_ORDER, payload: pickup_order });
        })
        .catch(function(error) {
            console.log(error);
        });
};
