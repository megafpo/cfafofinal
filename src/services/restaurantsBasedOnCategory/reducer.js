import { GET_RESTAURANTS_BASED_ON_CATEGORY } from "./actionTypes";
import { GET_RESTAURANTS_CATEGORIES } from "./actionTypes";

const initialState = {
    filtered_restaurants: [],
    restaurants_categories: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_RESTAURANTS_BASED_ON_CATEGORY:
            return { ...state, filtered_restaurants: action.payload };
        case GET_RESTAURANTS_CATEGORIES:
            return { ...state, restaurants_categories: action.payload };
        default:
            return state;
    }
}
