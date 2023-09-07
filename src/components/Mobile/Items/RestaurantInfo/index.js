import React, { Component } from "react";

import BackWithSearch from "../../Elements/BackWithSearch";
import ContentLoader from "react-content-loader";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setFavoriteRest } from "../../../../services/items/actions";

class RestaurantInfo extends Component {
	state = {
		withLinkToRestaurant: false,
		isFavorite: false,
	};

	componentDidMount() {
		this.setState({ withLinkToRestaurant: this.props.withLinkToRestaurant });

		if (this.props.history.location.state && this.props.history.location.state.fromExplorePage) {
			this.setState({ withLinkToRestaurant: this.props.history.location.state.fromExplorePage });
		}

		this.registerScrollEvent();
	}

	componentWillUnmount() {
		this.removeScrollEvent();
	}

	fixedRestaurantInfo = (hidden) => {
		if (this.child) {
			if (hidden) {
				this.child.heading.classList.add("hidden");
			} else {
				this.child.heading.classList.remove("hidden");
			}
		}
	};

	registerScrollEvent() {
		window.addEventListener("scroll", this.scrollFunc);
	}
	removeScrollEvent() {
		window.removeEventListener("scroll", this.scrollFunc);
	}
	scrollFunc = () => {
		if (document.documentElement.scrollTop > 55) {
			let hidden = false;
			this.fixedRestaurantInfo(hidden);
		}
		if (document.documentElement.scrollTop < 55) {
			let hidden = true;
			this.fixedRestaurantInfo(hidden);
		}
	};

	setFavoriteRestaurant = () => {
		const { restaurant_info, user } = this.props;
		if (user.success) {
			if (restaurant_info.is_favorited) {
				this.refs.heartIcon.classList.remove("is-active");
			} else {
				this.refs.heartIcon.classList.add("is-active");
			}
			this.props.setFavoriteRest(user.data.auth_token, restaurant_info.id);
		}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.restaurant_info !== prevState.restaurant_info) {
			return {
				data: nextProps.restaurant_info,
			};
		} else {
			return null;
		}
	}

	render() {
		const { history, restaurant, user } = this.props;
		return (
			<React.Fragment>
				<div className="bg-white">
					<BackWithSearch
						ref={(node) => {
							this.child = node;
						}}
						history={history}
						boxshadow={false}
						has_restaurant_info={true}
						restaurant={restaurant}
						disable_search={true}
						homeButton={true}
						shareButton={true}
					/>

					{restaurant.length === 0 ? (
						<ContentLoader
							height={170}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="20" y="70" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="85" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="115" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					) : (
						<React.Fragment>
							<Link
								to={"../../stores/" + restaurant.slug}
								className={`store-info-itemspage ${this.state.withLinkToRestaurant ? "" : "no-click"}`}
							>
								<div className="d-flex pt-50">
									<div className="px-15 mt-5">
										<img
											src={restaurant.image}
											alt={restaurant.name}
											className="restaurant-image mt-0"
										/>
									</div>

									<div className="mt-5 pb-15 w-100">
										<h4 className="font-w600 mb-5 text-dark">{restaurant.name}</h4>
										<div className="font-size-sm text-muted truncate-text text-muted">
											{restaurant.description}
										</div>
										{restaurant.is_pureveg === 1 && (
											<p className="mb-0">
												<span className="font-size-sm pr-1 text-muted">
													{localStorage.getItem("pureVegText")}
												</span>
												<img
													src="/assets/img/various/pure-veg.png"
													alt="PureVeg"
													style={{ width: "20px" }}
												/>
											</p>
										)}
										<div className="text-center restaurant-meta mt-5 d-flex align-items-center justify-content-between text-muted">
											{restaurant.avgRating === "0" ? (
												<div className="col-2 p-0 text-left">
													<i
														className="fa fa-star"
														style={{
															color: localStorage.getItem("storeColor"),
														}}
													/>{" "}
													{restaurant.rating}
												</div>
											) : (
												<Link
													to={"/reviews/" + restaurant.slug}
													style={{ display: "contents" }}
													className="yes-click"
												>
													<div className="col-2 p-0 text-left store-rating-block">
														<i
															className="fa fa-star"
															style={{
																color: localStorage.getItem("storeColor"),
															}}
														/>{" "}
														{restaurant.avgRating}
													</div>
												</Link>
											)}

											<div className="col-4 p-0 text-center store-distance-block">
												<i className="si si-clock" /> {restaurant.delivery_time}{" "}
												{localStorage.getItem("homePageMinsText")}
											</div>
											<div className="col-6 p-0 text-center store-avgprice-block">
												<i className="si si-wallet" />{" "}
												{localStorage.getItem("currencySymbolAlign") === "left" && (
													<React.Fragment>
														{localStorage.getItem("currencyFormat")}
														{restaurant.price_range}{" "}
													</React.Fragment>
												)}
												{localStorage.getItem("currencySymbolAlign") === "right" && (
													<React.Fragment>
														{restaurant.price_range}
														{localStorage.getItem("currencyFormat")}{" "}
													</React.Fragment>
												)}
												{localStorage.getItem("homePageForTwoText")}
											</div>
										</div>
									</div>
								</div>
							</Link>
							{user.success && (
								<span onClick={this.setFavoriteRestaurant}>
									<div
										ref="heartIcon"
										className={`heart ${restaurant.is_favorited && "is-active"}`}
									/>
								</span>
							)}
						</React.Fragment>
					)}
				</div>
				{restaurant.custom_message !== "<p><br></p>" &&
					restaurant.custom_message !== "null" &&
					(restaurant.custom_message !== "" && (
						<div
							style={{
								position: "relative",
								background: "#fff",
							}}
							dangerouslySetInnerHTML={{
								__html: restaurant.custom_message,
							}}
						/>
					))}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	restaurant_info: state.items.restaurant_info,
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{ setFavoriteRest }
)(RestaurantInfo);
