import { BrowserRouter, Route, Switch } from "react-router-dom";

import App from "./components/App";
import Loadable from "react-loadable";
import Loading from "./components/helpers/loading";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import withTracker from "./withTracker";

// import NotFound from "./components/NotFound";
const NotFound = Loadable({
	loader: () => import("./components/NotFound"),
	loading: () => <Loading />,
});

// import Location from "./components/Mobile/Location";
const Location = Loadable({
	loader: () => import("./components/Mobile/Location"),
	loading: () => <Loading />,
});

// import Items from "./components/Mobile/Items";
// const Items = Loadable({
// 	loader: () => import("./components/Mobile/Items"),
// 	loading: () => <Loading />,
// });

// import Login from "./components/Mobile/Auth/Login";
const Login = Loadable({
	loader: () => import("./components/Mobile/Auth"),
	loading: () => <Loading />,
});

// import Register from "./components/Mobile/Auth/Register";
const Register = Loadable({
	loader: () => import("./components/Mobile/Auth/Register"),
	loading: () => <Loading />,
});

// import CartPage from "./components/Mobile/Cart";
const CartPage = Loadable({
	loader: () => import("./components/Mobile/Cart"),
	loading: () => <Loading />,
});

// import Account from "./components/Mobile/Account";
const Account = Loadable({
	loader: () => import("./components/Mobile/Account"),
	loading: () => <Loading />,
});

// import Explore from "./components/Mobile/Explore";
const Explore = Loadable({
	loader: () => import("./components/Mobile/Explore"),
	loading: () => <Loading />,
});

// import Addresses from "./components/Mobile/Account/Addresses";
const Addresses = Loadable({
	loader: () => import("./components/Mobile/Account/Addresses"),
	loading: () => <Loading />,
});

// import Checkout from "./components/Mobile/Checkout";
const Checkout = Loadable({
	loader: () => import("./components/Mobile/Checkout"),
	loading: () => <Loading />,
});

// import RunningOrder from "./components/Mobile/RunningOrder";
const RunningOrder = Loadable({
	loader: () => import("./components/Mobile/RunningOrder"),
	loading: () => <Loading />,
});

// import Orders from "./components/Mobile/Account/Orders";
const Orders = Loadable({
	loader: () => import("./components/Mobile/Account/Orders"),
	loading: () => <Loading />,
});

// import WalletPage from "./components/Mobile/Account/Wallet";
const WalletPage = Loadable({
	loader: () => import("./components/Mobile/Account/Wallet"),
	loading: () => <Loading />,
});
/* Delivery */
// import Delivery from "./components/Delivery";
const Delivery = Loadable({
	loader: () => import("./components/Delivery"),
	loading: () => <Loading />,
});

// import DeliveryLogin from "./components/Delivery/Login";
const DeliveryLogin = Loadable({
	loader: () => import("./components/Delivery/Login"),
	loading: () => <Loading />,
});

// import DeliveryOrders from "./components/Delivery/Orders";
const DeliveryOrders = Loadable({
	loader: () => import("./components/Delivery/Orders"),
	loading: () => <Loading />,
});

// import ViewOrder from "./components/Delivery/ViewOrder";
const ViewOrder = Loadable({
	loader: () => import("./components/Delivery/ViewOrder"),
	loading: () => <Loading />,
});

// import GeoLocationPage from "./components/Mobile/GeoLocationPage";
const GeoLocationPage = Loadable({
	loader: () => import("./components/Mobile/GeoLocationPage"),
	loading: () => <Loading />,
});

// import SingleItem from "./components/Mobile/Items/SingleItem";
// const SingleItem = Loadable({
// 	loader: () => import("./components/Mobile/Items/SingleItem"),
// 	loading: () => <Loading />,
// });

const ItemsParent = Loadable({
	loader: () => import("./components/Mobile/Items/ItemsParent"),
	loading: () => <Loading />,
});

const SingleItemParent = Loadable({
	loader: () => import("./components/Mobile/Items/SingleItemParent"),
	loading: () => <Loading />,
});

const SinglePage = Loadable({
	loader: () => import("./components/SinglePage"),
	loading: () => <Loading />,
});

const ForgotPassword = Loadable({
	loader: () => import("./components/Mobile/Auth/ForgotPassword"),
	loading: () => <Loading />,
});

const RestaurantListOnCategory = Loadable({
	loader: () => import("./components/Mobile/Home/RestaurantListOnCategory"),
	loading: () => <Loading />,
});

const RatingAndReview = Loadable({
	loader: () => import("./components/Mobile/Account/Orders/RatingAndReview"),
	loading: () => <Loading />,
});
const ViewStoreReviews = Loadable({
	loader: () => import("./components/Mobile/StoreReviews"),
	loading: () => <Loading />,
});

const Alerts = Loadable({
	loader: () => import("./components/Mobile/Alerts"),
	loading: () => <Loading />,
});

const FavoriteRestaurantList = Loadable({
	loader: () => import("./components/Mobile/Home/FavoriteRestaurants"),
	loading: () => <Loading />,
});

const LoginAsCustomer = Loadable({
	loader: () => import("./components/Mobile/Modules/LoginAsCustomer"),
	loading: () => <Loading />,
});

const ScrollToTop = () => {
	window.scrollTo(0, 0);
	return null;
};

ReactDOM.render(
	<Root>
		<BrowserRouter>
			<React.Fragment>
				<Route component={ScrollToTop} />
				<Switch>
					{/* <Route exact strict  path="/:url*" render={props => <Redirect to={`${props.location.pathname}/`} />} /> */}
					<Route path={"/"} exact component={withTracker(App)} />

					{/* Test Routes*/}
					{/* <Route path={"/saurabh/test"} exact component={TestComponent} /> */}

					<Route path={"/search-location"} exact component={withTracker(Location)} />
					<Route path={"/my-location"} exact component={withTracker(GeoLocationPage)} />

					<Route path={"/categories/stores"} exact component={withTracker(RestaurantListOnCategory)} />

					{/* <Route path={"/stores/:restaurant"} exact component={withTracker(Items)} /> */}
					<Route path={"/stores/:restaurant"} exact component={withTracker(ItemsParent)} />
					{/* <Route path={"/stores/:restaurant/:id"} exact component={withTracker(SingleItem)} /> */}
					<Route path={"/stores/:restaurant/:id"} exact component={withTracker(SingleItemParent)} />

					<Route path={"/explore"} exact component={withTracker(Explore)} />

					<Route path={"/login"} exact component={withTracker(Login)} />
					<Route path={"/login/forgot-password"} exact component={withTracker(ForgotPassword)} />
					<Route path={"/register"} exact component={withTracker(Register)} />

					<Route path={"/my-account"} exact component={withTracker(Account)} />
					<Route path={"/alerts"} exact component={withTracker(Alerts)} />
					<Route path={"/my-addresses"} exact component={withTracker(Addresses)} />
					<Route path={"/my-wallet"} exact component={withTracker(WalletPage)} />
					<Route path={"/my-orders"} exact component={withTracker(Orders)} />
					<Route path={"/rate-order/:id"} exact component={withTracker(RatingAndReview)} />
					<Route path={"/reviews/:slug"} exact component={withTracker(ViewStoreReviews)} />

					<Route path={"/checkout"} exact component={withTracker(Checkout)} />
					<Route path={"/running-order/:unique_order_id"} exact component={withTracker(RunningOrder)} />

					<Route path={"/cart"} exact component={withTracker(CartPage)} />

					<Route path={"/pages/:slug"} exact component={withTracker(SinglePage)} />
					<Route path={"/my-favorite-stores"} exact component={withTracker(FavoriteRestaurantList)} />
					{/* Delivery Routes */}
					<Route path={"/delivery"} exact component={Delivery} />
					<Route path={"/delivery/login"} exact component={DeliveryLogin} />
					<Route path={"/delivery/orders"} exact component={DeliveryOrders} />
					<Route path={"/delivery/orders/:unique_order_id"} exact component={ViewOrder} />
					<Route path={"/delivery/completed-orders"} exact component={Delivery} />
					{/* Common Routes */}
					{/* Admin Login as Customer Module Routes */}
					<Route path={"/auth/login-as-customer/:id?"} exact component={LoginAsCustomer} />
					{/* END Admin Login as Customer Module Routes */}
					<Route component={NotFound} />
				</Switch>
			</React.Fragment>
		</BrowserRouter>
	</Root>,
	document.getElementById("root")
);
