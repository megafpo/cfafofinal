import { GET_PAYMENT_GATEWAYS } from "./actionTypes";

const initialState = {
    paymentgateways: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_PAYMENT_GATEWAYS:
            return { ...state, paymentgateways: action.payload };
        default:
            return state;
    }
}
