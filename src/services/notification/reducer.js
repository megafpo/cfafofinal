import { NOTIFICATION_TOKEN } from "./actionTypes";

const initialState = {
    notification_token: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case NOTIFICATION_TOKEN:
            return { ...state, notification_token: action.payload };
        default:
            return state;
    }
}
