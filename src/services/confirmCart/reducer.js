import { CONFIRM_CART } from "./actionTypes";

const initialState = {
    confirmCart: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CONFIRM_CART:
            return { ...state, confirmCart: action.payload };
        default:
            return state;
    }
}
