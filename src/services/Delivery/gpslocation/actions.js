import { SEND_DELIVERY_GUY_GPS_LOCATION, GET_DELIVERY_GUY_GPS_LOCATION } from "./actionTypes";
import { SEND_DELIVERY_GUY_GPS_LOCATION_URL, GET_DELIVERY_GUY_GPS_LOCATION_URL } from "../../../configs";
import Axios from "axios";

export const sendDeliveryGuyGpsLocation = (token, user_id, delivery_lat, delivery_long, heading) => dispatch => {
    Axios.post(SEND_DELIVERY_GUY_GPS_LOCATION_URL, {
        token: token,
        user_id: user_id,
        delivery_lat: delivery_lat,
        delivery_long: delivery_long,
        heading: heading
    })
        .then(response => {
            const data = response.data;
            return dispatch({ type: SEND_DELIVERY_GUY_GPS_LOCATION, payload: data });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const getDeliveryGuyGpsLocation = (token, order_id) => dispatch => {
    Axios.post(GET_DELIVERY_GUY_GPS_LOCATION_URL, {
        token: token,
        order_id: order_id
    })
        .then(response => {
            const data = response.data;
            return dispatch({ type: GET_DELIVERY_GUY_GPS_LOCATION, payload: data });
        })
        .catch(function(error) {
            console.log(error);
        });
};
