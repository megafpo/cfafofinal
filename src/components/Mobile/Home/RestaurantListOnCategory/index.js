import React, { Component } from "react";

import { getRestaurantsBasedOnCategory, getRestaurantsCategories } from "../../../../services/restaurant/actions";
import { connect } from "react-redux";
import ContentLoader from "react-content-loader";
import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import PromoSlider from "../PromoSlider";

import { Redirect } from "react-router";

import Meta from "../../../helpers/meta";
import Nav from "../../Nav";
import Fade from "react-reveal/Fade";

export class RestaurantListOnCategory extends Component {
	state = {
		selectedOption: null,
		options: [],
		defaultValues: [],
		checkboxChecked: false,
		checkedCount: 0,
		loading: true,
	};

	//getting all restaurants before rendering
	componentDidMount() {
		this.props.getRestaurantsCategories();

		this.setState({ checkedCount: JSON.parse(localStorage.getItem("categorySelectOptions")).length });
	}

	_processSelectedCheckboxs = () => {
		this.setState({ loading: true });
		let selectedOption = [];

		let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
		this.setState({ checkedCount: checkboxes.length });

		if (checkboxes.length === 0) {
			console.log("Came here");

			localStorage.removeItem("categorySelectOptions");
		} else {
			for (let i = 0; i < checkboxes.length; i++) {
				selectedOption.push({
					value: parseInt(checkboxes[i].getAttribute("data-value")),
					label: checkboxes[i].getAttribute("data-label"),
				});
			}

			return new Promise((resolve, reject) => {
				localStorage.setItem("categorySelectOptions", JSON.stringify(selectedOption));
				let categorySelectOptions = JSON.parse(localStorage.getItem("categorySelectOptions"));
				let latandlng = JSON.parse(localStorage.getItem("userSetAddress"));

				if (categorySelectOptions) {
					let categoryIds = [];
					categorySelectOptions.map((restaurantCategories) => {
						return categoryIds.push(parseInt(restaurantCategories.value));
					});
					this.props.getRestaurantsBasedOnCategory(latandlng.lat, latandlng.lng, categoryIds);
				}
				let data = JSON.parse(localStorage.getItem("categorySelectOptions"));
				if (data) {
					resolve(this.sortRestaurantCategoriesOptions());
				} else {
					reject(new Error("Promise rejected"));
				}
			});
		}
	};

	// called when you click category from restaurant list page
	filterRestaurants() {
		let categorySelectOptions = JSON.parse(localStorage.getItem("categorySelectOptions"));
		let latandlng = JSON.parse(localStorage.getItem("userSetAddress"));

		if (categorySelectOptions) {
			let categoryIds = [];
			categorySelectOptions.map((restaurantCategories) => {
				return categoryIds.push(parseInt(restaurantCategories.value));
			});
			this.props.getRestaurantsBasedOnCategory(latandlng.lat, latandlng.lng, categoryIds);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.restaurants_categories.categories !== nextProps.restaurants_categories.categories) {
			this.setState({ selectedOption: nextProps.restaurants_categories.categories });
		}

		if (this.props.filtered_restaurants !== nextProps.filtered_restaurants) {
			this.setState({ loading: false });
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.restaurants_categories !== prevProps.restaurants_categories) {
			this.filterRestaurants();
			this.selectRestaurantsCategories(this.props.restaurants_categories);
		}
	}

	callAfterDefaultRestaurantsCategoriesSelected = () => {
		this.handleChange(this.state.defaultValues);
	};

	selectRestaurantsCategories = (restaurants_categories) => {
		let arr = [];
		if (restaurants_categories) {
			restaurants_categories.categories.map((restaurantCatogory) => {
				let restaurantCateories = {
					value: restaurantCatogory.id,
					label: restaurantCatogory.name,
				};
				if (restaurantCateories) {
					arr.push(restaurantCateories);
				}
				return null;
			});
			if (arr.length > 0) {
				this.setState({
					options: arr,
				});
				localStorage.setItem("allSelectableOptions", JSON.stringify(arr));
				return new Promise((resolve, reject) => {
					let data = JSON.parse(localStorage.getItem("allSelectableOptions"));
					if (data) {
						resolve(this.sortRestaurantCategoriesOptions());
					} else {
						reject(new Error("Promise rejected"));
					}
				});
			}
		}
	};

	checkIfChecked = (value) => {
		return JSON.parse(localStorage.getItem("categorySelectOptions")).some(
			(categories) => value === categories.value
		);
	};

	sortRestaurantCategoriesOptions = () => {
		let categorySelectOptions = JSON.parse(localStorage.getItem("categorySelectOptions"));
		let allSelectableOptions = JSON.parse(localStorage.getItem("allSelectableOptions"));

		let checkedOptions = new Set(categorySelectOptions.map((category) => category.value));
		let sortedOptions = [
			...categorySelectOptions,
			...allSelectableOptions.filter((category) => !checkedOptions.has(category.value)),
		];

		if (sortedOptions.length === allSelectableOptions.length) {
			this.setState({
				options: sortedOptions,
			});
		}
	};

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("categorySelectOptions") === null) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("userSetAddress") === null) {
			// this.context.router.history.push("/search-location");
			console.log("Redirect to search location");
			return <Redirect to="/search-location" />;
		}

		const { selectedOption } = this.state;
		const { history, user } = this.props;
		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("seoMetaTitle")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				<Nav
					logo={true}
					logoLink={true}
					active_nearme={true}
					disable_back_button={true}
					history={history}
					loggedin={user.success}
				/>
				{this.state.options.length > 0 && selectedOption !== null && (
					<React.Fragment>
						<div className="category-checkboxes-block px-15 mt-20" ref="categoryOptions">
							<div className="filter-count-block">
								{localStorage.getItem("categoriesFiltersText")} {this.state.checkedCount}
							</div>
							{this.state.options.map((category) => (
								<label key={category.value} style={{ position: "relative" }}>
									<input
										type="checkbox"
										value={category.value}
										defaultChecked={this.checkIfChecked(category.value)}
										onChange={this._processSelectedCheckboxs}
										data-label={category.label}
										data-value={category.value}
									/>
									<span>{category.label}</span>
									<Ink duration="500" hasTouch={true} />
								</label>
							))}
						</div>
					</React.Fragment>
				)}
				{this.state.loading ? (
					<ContentLoader height={378} width={400} speed={1.2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
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
						{this.props.filtered_restaurants.length === 0 ? (
							<React.Fragment>
								<div className="d-flex justify-content-center mt-100">
									<img
										className="explore-bg"
										src="/assets/img/various/explore-bg.png"
										alt={localStorage.getItem("restaurantSearchPlaceholder")}
									/>
								</div>
								<h4 className="d-flex justify-content-center filter-no-found">
									{localStorage.getItem("categoriesNoRestaurantsFoundText")}
								</h4>
							</React.Fragment>
						) : (
							this.props.filtered_restaurants.map((restaurant, index) => (
								<React.Fragment key={restaurant.id}>
									<div className="col-xs-12 col-sm-12 restaurant-block">
										<DelayLink
											to={"../stores/" + restaurant.slug}
											delay={200}
											className="block text-center mb-3"
											clickAction={() => {
												// localStorage.getItem("userPreferredSelection") === "DELIVERY" &&
												// 	restaurant.delivery_type === 1 &&
												// 	localStorage.setItem("userSelected", "DELIVERY");
												// localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
												// 	restaurant.delivery_type === 2 &&
												// 	localStorage.setItem("userSelected", "SELFPICKUP");
												// localStorage.getItem("userPreferredSelection") === "DELIVERY" &&
												// 	restaurant.delivery_type === 3 &&
												// 	localStorage.setItem("userSelected", "DELIVERY");
												// localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
												// 	restaurant.delivery_type === 3 &&
												// 	localStorage.setItem("userSelected", "SELFPICKUP");
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
																{localStorage.getItem("restaurantFeaturedText")}
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
												<div className="font-w600 mb-5 text-dark">{restaurant.name}</div>
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
													<div className="col-2 p-0 text-left">
														<i
															className="fa fa-star pr-1"
															style={{
																color: localStorage.getItem("storeColor"),
															}}
														/>{" "}
														{restaurant.avgRating === "0"
															? restaurant.rating
															: restaurant.avgRating}
													</div>
													<div className="col-4 p-0 text-center">
														<i className="si si-clock pr-1" /> {restaurant.delivery_time}{" "}
														{localStorage.getItem("homePageMinsText")}
													</div>
													<div className="col-6 p-0 text-center">
														<i className="si si-wallet pr-1" />{" "}
														{localStorage.getItem("currencySymbolAlign") === "left" &&
															localStorage.getItem("currencyFormat")}
														{restaurant.price_range}{" "}
														{localStorage.getItem("currencySymbolAlign") === "right" &&
															localStorage.getItem("currencyFormat")}
														{localStorage.getItem("homePageForTwoText")}
													</div>
												</div>
											</div>
											<Ink duration="500" hasTouch={false} />
										</DelayLink>
									</div>
									{localStorage.getItem("showPromoSlider") === "true" && (
										<React.Fragment>
											{this.props.slides && this.props.slides.length > 0 && (
												<React.Fragment>
													{index ===
														this.props.slides[0]["promo_slider"]["position_id"] - 1 && (
														<PromoSlider
															slides={this.props.slides}
															size={this.props.slides[0]["promo_slider"]["size"]}
															secondarySlider={true}
														/>
													)}
												</React.Fragment>
											)}
										</React.Fragment>
									)}
								</React.Fragment>
							))
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	restaurants_categories: state.restaurant.restaurants_categories,
	filtered_restaurants: state.restaurant.filtered_restaurants,
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{ getRestaurantsBasedOnCategory, getRestaurantsCategories }
)(RestaurantListOnCategory);
