import React, { Component } from "react";

import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";

class RestaurantSearchList extends Component {
	render() {
		const { restaurants } = this.props;
		return (
			<React.Fragment>
				<div className="bg-white mb-50 mt-30">
					<h5 className="px-15 mb-1 text-muted">{localStorage.getItem("exploreRestautantsText")}</h5>
					{restaurants.map((restaurant) => (
						<div key={restaurant.id} className="col-xs-12 col-sm-12 restaurant-block">
							<DelayLink
								to={"../stores/" + restaurant.slug}
								delay={200}
								className="block block-link-shadow text-center light-bottom-border"
							>
								<div className="block-content block-content-full pt-2">
									<LazyLoad>
										<img
											src={restaurant.image}
											alt={restaurant.name}
											className={`restaurant-image mt-0 ${!restaurant.is_active &&
												"restaurant-not-active"}`}
										/>
									</LazyLoad>
								</div>
								<div className="block-content block-content-full restaurant-info">
									<h4 className="font-w600 mb-5 text-dark">{restaurant.name}</h4>
									<div className="font-size-sm text-muted truncate-text text-muted">
										{restaurant.description}
									</div>
									{!restaurant.is_active && (
										<span className="restaurant-not-active-msg">
											{localStorage.getItem("restaurantNotActiveMsg")}
										</span>
									)}
									<div className="text-center restaurant-meta mt-5 d-flex align-items-center justify-content-between text-muted">
										<div className="col-2 p-0 text-left store-rating-block">
											<i
												className={`fa fa-star pr-1 ${!restaurant.is_active &&
													"restaurant-not-active"}`}
												style={{
													color: localStorage.getItem("storeColor"),
												}}
											/>{" "}
											{restaurant.avgRating === "0" ? restaurant.rating : restaurant.avgRating}
										</div>
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

								<Ink duration="500" />
							</DelayLink>
						</div>
					))}
				</div>
			</React.Fragment>
		);
	}
}

export default RestaurantSearchList;
