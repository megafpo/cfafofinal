import { combineReducers } from "redux";

import settingsReducer from "./settings/reducer";
import locationsReducer from "./locations/reducer";
import popularLocationReducer from "./popularLocations/reducer";
import promoSliderReducer from "./promoSlider/reducer";
import itemsReducer from "./items/reducer";
import cartReducer from "./cart/reducer";
import totalReducer from "./total/reducer";
import couponReducer from "./coupon/reducer";
import userReducer from "./user/reducer";
import pagesReducer from "./pages/reducer";
import searchReducer from "./searchRestaurants/reducer";
import addressesReducer from "./addresses/reducer";
import checkoutReducer from "./checkout/reducer";
import confirmCartReducer from "./confirmCart/reducer";
import ordersReducer from "./orders/reducer";
import paymentGatewayReducer from "./paymentgateways/reducer";
import notificationReducer from "./notification/reducer";
import restaurantReducer from "./restaurant/reducer";
import ratingReducer from "./rating/reducer";
import alertReducer from "./alert/reducer";

import languageReducer from "./languages/reducer";

import deliveryUserReducer from "./Delivery/user/reducer";
import deliveryOrdersReducer from "./Delivery/orders/reducer";
import deliverySingleOrderReducer from "./Delivery/singleorder/reducer";
import gpsLocationReducer from "./Delivery/gpslocation/reducer";
import acceptToDeliver from "./Delivery/deliveryprogress/reducer";
import deliveryTimeSlotReducer from "./Delivery/deliverytimeslot/reducer";
import helperReducer from "./helper/reducer";

export default combineReducers({
	settings: settingsReducer,
	locations: locationsReducer,
	popular_locations: popularLocationReducer,
	promo_slides: promoSliderReducer,
	items: itemsReducer,
	total: totalReducer,
	cart: cartReducer,
	coupon: couponReducer,
	user: userReducer,
	pages: pagesReducer,
	searches: searchReducer,
	addresses: addressesReducer,
	checkout: checkoutReducer,
	confirmCart: confirmCartReducer,
	orders: ordersReducer,
	paymentgateways: paymentGatewayReducer,
	delivery_user: deliveryUserReducer,
	delivery_orders: deliveryOrdersReducer,
	single_delivery_order: deliverySingleOrderReducer,
	gps_location: gpsLocationReducer,
	accepted_order: acceptToDeliver,
	notification_token: notificationReducer,
	restaurant: restaurantReducer,
	languages: languageReducer,
	rating: ratingReducer,
	alert: alertReducer,
	helper: helperReducer,
	delivery_datetime: deliveryTimeSlotReducer,
});
