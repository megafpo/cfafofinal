import { GET_ADDRESSES, SAVE_ADDRESS, DELETE_ADDRESS, SET_DEFAULT } from "./actionTypes";

const initialState = {
    addresses: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ADDRESSES:
            return { ...state, addresses: action.payload };
        case SAVE_ADDRESS:
            return { ...state, addresses: action.payload };
        case DELETE_ADDRESS:
            return { ...state, addresses: action.payload };
        case SET_DEFAULT:
            return { ...state, addresses: action.payload };
        default:
            return state;
    }
}
