import { LOGIN_DELIVERY_USER, LOGOUT_DELIVERY_USER, UPDATE_DELIVERY_USER_INFO, UPDATE_DELIVERY_ORDER_HISTORY } from "./actionTypes";

const initialState = {
    delivery_user: [],
    order_history: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN_DELIVERY_USER:
            return { ...state, delivery_user: action.payload };
        case LOGOUT_DELIVERY_USER:
            return { ...state, delivery_user: action.payload };
        case UPDATE_DELIVERY_USER_INFO:
            return { ...state, delivery_user: action.payload.delivery_user, order_history: action.payload.order_history };
        case UPDATE_DELIVERY_ORDER_HISTORY:
            return { ...state, order_history: action.payload };
        default:
            return state;
    }
}
