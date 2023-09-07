import { GET_POPULAR_LOCATIONS } from "./actionTypes";

const initialState = {
    popular_locations: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_POPULAR_LOCATIONS:
            return { ...state, popular_locations: action.payload };
        default:
            return state;
    }
}
