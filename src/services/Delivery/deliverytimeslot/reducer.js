import { SET_DELIVERY_DATE_TIME, GET_DELIVERY_TIMESLOT, SET_EXPRESS_DELIVERY_CHARGES } from "./actionTypes";


const initialState = {
    delivery_datetime: {},
    ordersLimit:[],
    timeslotAvailability:[],
    deliveryCharges:"0"
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_DELIVERY_DATE_TIME:
            return { ...state, delivery_datetime: action.payload };
        case SET_EXPRESS_DELIVERY_CHARGES:
            return { ...state, deliveryCharges: action.payload };
        case GET_DELIVERY_TIMESLOT:
            return { ...state,timeslotAvailability:action.payload};
        default:
            return state;
    }
}
