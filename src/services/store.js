import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

export default (initialState) => {
	initialState = JSON.parse(window.localStorage.getItem("state")) || initialState;
	const middleware = [thunk];

	const store = createStore(
		rootReducer,
		initialState,
		compose(
			applyMiddleware(...middleware)
			// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		)
	);

	store.subscribe(() => {
		const state = store.getState();
		//save the config to localstorage
		for (const setting in state.settings.settings) {
			if (state.settings.settings.hasOwnProperty(setting)) {
				const element = state.settings.settings[setting];
				localStorage.setItem(element.key, element.value);
			}
		}

		for (const translation in state.languages.language) {
			if (state.languages.language.hasOwnProperty(translation)) {
				const trans = state.languages.language[translation];
				localStorage.setItem(translation, trans);
			}
		}

		const persist = {
			cart: state.cart,
			total: state.total,
			items: state.items,
			pages: state.pages,
			user: state.user,
			addresses: state.addresses,
			delivery_user: state.delivery_user,
			languages: state.languages.languages,
			settings: state.settings,
			popular_locations: state.popular_locations,
			// searches: state.searches,
		};
		localStorage.setItem("state", JSON.stringify(persist));

		// const user = {
		//     user: state.user
		// };
		// window.localStorage.setItem("user", JSON.stringify(user.user));
	});

	return store;
};
