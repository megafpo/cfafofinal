import { GET_PAGES, GET_SINGLE_PAGE, CLEAR_SINGLE_PAGE } from "./actionTypes";

const initialState = {
    pages: [],
    single_page: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_PAGES:
            return { ...state, pages: action.payload };
        case GET_SINGLE_PAGE:
            return { ...state, single_page: action.payload };
        case CLEAR_SINGLE_PAGE:
            return { ...state, single_page: action.payload };
        default:
            return state;
    }
}
