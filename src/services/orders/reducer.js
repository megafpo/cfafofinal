import { GET_ORDERS, CANCEL_ORDER } from "./actionTypes";

const initialState = {
    orders: [],
    cancel: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ORDERS:
            return { ...state, orders: action.payload };
        case CANCEL_ORDER:
            return { ...state, cancel: action.payload };
        default:
            return state;
    }
}
