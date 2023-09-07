import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";

import { withRouter } from "react-router-dom";

import Fade from "react-reveal/Fade";

import { connect } from "react-redux";
import {
	getDeliveryRestaurants,
	getSelfpickupRestaurants,
	getFavoriteRestaurants,
} from "../../../../services/restaurant/actions";
import BackWithSearch from "../../Elements/BackWithSearch";

class FavoriteRestaurantList extends Component {
	state = {
		total: null,
		restaurants: [],
		loading: false,
		loading_more: true,
		selfpickup: false,
		userPreferredSelectionDelivery: true,
		userPreferredSelectionSelfPickup: false,
		no_restaurants: false,
		data: [],
		review_data: [],
		isHomeDelivery: true,
	};

	componentDidMount() {
		this.getMyFavoriteRestaurants();

		if (localStorage.getItem("userPreferredSelection") === "DELIVERY") {
			this.setState({ userPreferredSelectionDelivery: true, isHomeDelivery: true });
			// this.filterDelivery();
		}
		if (
			localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
			localStorage.getItem("enSPU") === "true"
		) {
			this.setState({ userPreferredSelectionSelfPickup: true, isHomeDelivery: false });
			// this.filterSelfPickup();
		} else {
			localStorage.setItem("userPreferredSelection", "DELIVERY");
			localStorage.setItem("userSelected", "DELIVERY");
			this.setState({ userPreferredSelectionDelivery: true, isHomeDelivery: true });
		}
	}

	getMyFavoriteRestaurants = () => {
		if (localStorage.getItem("userSetAddress")) {
			this.setState({
				loading: true,
			});
			const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
			this.props.getFavoriteRestaurants(userSetAddress.lat, userSetAddress.lng).then((restaurants) => {
				if (restaurants && restaurants.payload.length) {
					this.setState({
						total: restaurants.payload.length,
						no_restaurants: false,
						loading: false,
						loading_more: false,
					});
				} else {
					this.setState({
						total: 0,
						no_restaurants: true,
						loading: false,
						loading_more: false,
					});
				}
			});
		}
	};

	render() {
		return (
			<React.Fragment>
				<BackWithSearch
					boxshadow={true}
					has_title={true}
					title={localStorage.getItem("favouriteStoresPageTitle")}
					disable_search={true}
					goto_accounts_page={true}
					homeButton={true}
				/>
				<div className="bg-white mb-100">
					{this.state.no_restaurants && (
						<div
							className={"bg-light " + (localStorage.getItem("enSPU") === "true" ? "sticky-top" : "pt-3")}
						>
							<div className="px-15 py-3 d-flex justify-content-between align-items-center pt-100">
								<h1 className="restaurant-count mb-0 mr-2">
									{localStorage.getItem("noRestaurantMessage")}
								</h1>
							</div>
						</div>
					)}
					{this.state.loading ? (
						<ContentLoader
							height={378}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="30" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="60" rx="0" ry="0" width="165" height="16" />

							<rect x="20" y="145" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="155" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="185" rx="0" ry="0" width="165" height="16" />

							<rect x="20" y="270" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="280" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="310" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					) : (
						<React.Fragment>
							{this.props.restaurants.length === 0 ? (
								<ContentLoader
									height={378}
									width={400}
									speed={1.2}
									primaryColor="#f3f3f3"
									secondaryColor="#ecebeb"
								>
									<rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
									<rect x="144" y="30" rx="0" ry="0" width="115" height="18" />
									<rect x="144" y="60" rx="0" ry="0" width="165" height="16" />

									<rect x="20" y="145" rx="4" ry="4" width="80" height="78" />
									<rect x="144" y="155" rx="0" ry="0" width="115" height="18" />
									<rect x="144" y="185" rx="0" ry="0" width="165" height="16" />

									<rect x="20" y="270" rx="4" ry="4" width="80" height="78" />
									<rect x="144" y="280" rx="0" ry="0" width="115" height="18" />
									<rect x="144" y="310" rx="0" ry="0" width="165" height="16" />
								</ContentLoader>
							) : (
								<div className="pt-50">
									{this.props.restaurants.map((restaurant, index) => (
										<React.Fragment key={restaurant.id}>
											<LazyLoad>
												<div className="col-xs-12 col-sm-12 restaurant-block">
													<DelayLink
														to={"../stores/" + restaurant.slug}
														delay={200}
														className="block text-center mb-3"
														clickAction={() => {
															localStorage.getItem("userPreferredSelection") ===
																"DELIVERY" &&
																restaurant.delivery_type === 1 &&
																localStorage.setItem("userSelected", "DELIVERY");
															localStorage.getItem("userPreferredSelection") ===
																"SELFPICKUP" &&
																restaurant.delivery_type === 2 &&
																localStorage.setItem("userSelected", "SELFPICKUP");
															localStorage.getItem("userPreferredSelection") ===
																"DELIVERY" &&
																restaurant.delivery_type === 3 &&
																localStorage.setItem("userSelected", "DELIVERY");
															localStorage.getItem("userPreferredSelection") ===
																"SELFPICKUP" &&
																restaurant.delivery_type === 3 &&
																localStorage.setItem("userSelected", "SELFPICKUP");
														}}
													>
														<div
															className={`block-content block-content-full ${
																restaurant.is_featured && restaurant.is_active
																	? "ribbon ribbon-bookmark ribbon-warning pt-2"
																	: "pt-2"
															} `}
														>
															{restaurant.is_featured ? (
																<React.Fragment>
																	{restaurant.custom_featured_name == null ? (
																		<div className="ribbon-box">
																			{localStorage.getItem(
																				"restaurantFeaturedText"
																			)}
																		</div>
																	) : (
																		<div className="ribbon-box">
																			{restaurant.custom_featured_name}
																		</div>
																	)}
																</React.Fragment>
															) : null}

															<Fade duration={500}>
																<img
																	src={restaurant.image}
																	alt={restaurant.name}
																	className={`restaurant-image ${!restaurant.is_active &&
																		"restaurant-not-active"}`}
																/>
															</Fade>
														</div>
														<div className="block-content block-content-full restaurant-info">
															<div className="font-w600 mb-5 text-dark">
																{restaurant.name}
															</div>
															<div className="font-size-sm text-muted truncate-text text-muted">
																{restaurant.description}
															</div>
															{!restaurant.is_active && (
																<span className="restaurant-not-active-msg">
																	{localStorage.getItem("restaurantNotActiveMsg")}
																</span>
															)}
															<hr className="my-10" />
															<div className="text-center restaurant-meta mt-5 d-flex align-items-center justify-content-between text-muted">
																<div className="col-2 p-0 text-left store-rating-block">
																	<i
																		className={`fa fa-star pr-1 ${!restaurant.is_active &&
																			"restaurant-not-active"}`}
																		style={{
																			color: localStorage.getItem("storeColor"),
																		}}
																	/>{" "}
																	{restaurant.avgRating === "0"
																		? restaurant.rating
																		: restaurant.avgRating}
																</div>
																<div className="col-4 p-0 text-center store-distance-block">
																	{this.state.selfpickup ? (
																		<span>
																			<i className="si si-pointer pr-1" />
																			{restaurant.distance &&
																				restaurant.distance.toFixed(1)}{" "}
																			Km
																		</span>
																	) : (
																		<span>
																			<i className="si si-clock pr-1" />{" "}
																			{restaurant.delivery_time}{" "}
																			{localStorage.getItem("homePageMinsText")}
																		</span>
																	)}
																</div>
																<div className="col-6 p-0 text-center store-avgprice-block">
																	<i className="si si-wallet" />{" "}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" && (
																		<React.Fragment>
																			{localStorage.getItem("currencyFormat")}
																			{restaurant.price_range}{" "}
																		</React.Fragment>
																	)}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" && (
																		<React.Fragment>
																			{restaurant.price_range}
																			{localStorage.getItem(
																				"currencyFormat"
																			)}{" "}
																		</React.Fragment>
																	)}
																	{localStorage.getItem("homePageForTwoText")}
																</div>
															</div>
														</div>
														<Ink duration="500" hasTouch={false} />
													</DelayLink>
												</div>
											</LazyLoad>
										</React.Fragment>
									))}
								</div>
							)}
						</React.Fragment>
					)}

					{this.state.loading_more ? (
						<div className="">
							<ContentLoader
								height={120}
								width={400}
								speed={1.2}
								primaryColor="#f3f3f3"
								secondaryColor="#ecebeb"
							>
								<rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
								<rect x="144" y="35" rx="0" ry="0" width="115" height="18" />
								<rect x="144" y="65" rx="0" ry="0" width="165" height="16" />
							</ContentLoader>
						</div>
					) : null}
				</div>
			</React.Fragment>
		);
	}
}

// export default withRouter(FavoriteRestaurantList);

const mapStateToProps = (state) => ({
	restaurants: state.restaurant.favoriteRestaurants,
});

export default withRouter(
	connect(
		mapStateToProps,
		{
			getDeliveryRestaurants,
			getSelfpickupRestaurants,
			getFavoriteRestaurants,
		}
	)(FavoriteRestaurantList)
);
