import { SEARCH_LOCATIONS } from "./actionTypes";

const initialState = {
    locations: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SEARCH_LOCATIONS:
            return { ...state, locations: action.payload };
        default:
            return state;
    }
}
