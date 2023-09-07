import { SEND_DELIVERY_GUY_GPS_LOCATION, GET_DELIVERY_GUY_GPS_LOCATION } from "./actionTypes";

const initialState = {
    set_delivery_guy_gps_location: [],
    get_delivery_guy_gps_location: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SEND_DELIVERY_GUY_GPS_LOCATION:
            return { ...state, set_delivery_guy_gps_location: action.payload };
        case GET_DELIVERY_GUY_GPS_LOCATION:
            return { ...state, get_delivery_guy_gps_location: action.payload };
        default:
            return state;
    }
}
