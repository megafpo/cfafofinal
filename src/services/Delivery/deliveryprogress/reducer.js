import { ACCEPT_TO_DELIVER, PICKEDUP_ORDER } from "./actionTypes";

const initialState = {
    accepted_order: [],
    pickedup_order: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case ACCEPT_TO_DELIVER:
            return { ...state, accepted_order: action.payload };
        case PICKEDUP_ORDER:
            return { ...state, pickedup_order: action.payload };
        default:
            return state;
    }
}
