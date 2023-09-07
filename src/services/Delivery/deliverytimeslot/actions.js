import { SET_DELIVERY_DATE_TIME, SET_EXPRESS_DELIVERY_CHARGES, GET_DELIVERY_TIMESLOT } from "./actionTypes";
import Axios from "axios";
import { GET_DELIVERY_TIMESLOT_URL } from "../../../configs";


export const setDeliveryDateTime = (date, timeslot) => dispatch => {
    console.log("SETDATE:",date, timeslot)
    if(date === 0 && timeslot === 0)
    dispatch({ type: SET_DELIVERY_DATE_TIME, payload: {} });     
    else
    dispatch({ type: SET_DELIVERY_DATE_TIME, payload: {delivery_date:date, delivery_timeslot:timeslot} });     
};

export const setExpressDeliveryCharges = (deliveryCharges) => dispatch => {
    console.log("EEEE",deliveryCharges)
    dispatch({ type: SET_EXPRESS_DELIVERY_CHARGES, payload: deliveryCharges });     
};

export const getDeliveryTimeSlot = (date, restaurant_id) => dispatch => {
    console.log("GET",date,restaurant_id)
    Axios.post(GET_DELIVERY_TIMESLOT_URL, {
        delivery_date: date,
        restaurant_id: restaurant_id
    }).then(response => {
        console.log("DATAAAAAAAAAA",response.data)
        const ordersLimit = response.data;
        dispatch({ type: GET_DELIVERY_TIMESLOT, payload: ordersLimit });
    }).catch(function(error) {
            console.log(error);
    });
};




