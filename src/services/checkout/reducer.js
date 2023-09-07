import { PLACE_ORDER } from "./actionTypes";

const initialState = {
    checkout: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case PLACE_ORDER:
            return { ...state, checkout: action.payload };
        default:
            return state;
    }
}
