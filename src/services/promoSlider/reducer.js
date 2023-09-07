import { GET_PROMO_SLIDER } from "./actionTypes";

const initialState = {
    promo_slides: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_PROMO_SLIDER:
            return { ...state, promo_slides: action.payload };
        default:
            return state;
    }
}
