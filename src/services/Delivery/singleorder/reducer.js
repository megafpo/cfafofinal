import { GET_SINGLE_DELIVERY_ORDER } from "./actionTypes";

const initialState = {
    single_delivery_order: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_SINGLE_DELIVERY_ORDER:
            return { ...state, single_delivery_order: action.payload };
        default:
            return state;
    }
}
