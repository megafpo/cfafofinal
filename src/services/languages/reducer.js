import { GET_ALL_LANGUAGES, GET_SINGLE_LANGUAGE_DATA } from "./actionTypes";

const initialState = {
    languages: [],
    language: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_LANGUAGES:
            return { ...state, languages: action.payload };
        case GET_SINGLE_LANGUAGE_DATA:
            return { ...state, language: action.payload };
        default:
            return state;
    }
}
