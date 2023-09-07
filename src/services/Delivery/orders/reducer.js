import { GET_DELIVERY_ORDERS } from "./actionTypes";

const initialState = {
    delivery_orders: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_DELIVERY_ORDERS:
            return { ...state, delivery_orders: action.payload };
        default:
            return state;
    }
}
