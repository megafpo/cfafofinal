import React, { Component } from "react";

import { Link } from "react-router-dom";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";

class ItemSearchList extends Component {
	render() {
		const { items } = this.props;
		// console.log(items);

		return (
			<React.Fragment>
				<div className="bg-white mb-50 mt-10">
					<h5 className="px-15 mb-1 text-muted">{localStorage.getItem("exploreItemsText")}</h5>
					{items.map((item) => (
						<div key={item.id} className="col-xs-12 col-sm-12 restaurant-block">
							<Link
								to={{
									pathname: "../stores/" + item.restaurant.slug + "/" + item.id,
									state: {
										fromExplorePage: true,
									},
								}}
								className="block block-link-shadow text-center light-bottom-border"
							>
								{item.image !== null && (
									<div className="block-content block-content-full pt-2">
										<LazyLoad>
											<img src={item.image} alt={item.name} className="restaurant-image mt-0" />
										</LazyLoad>
									</div>
								)}
								<div
									className={`block-content block-content-full restaurant-info ${item.image ===
										null && "pl-20"}`}
								>
									<div className="font-w600 mb-5">
										{localStorage.getItem("showVegNonVegBadge") === "true" &&
											item.is_veg !== null && (
												<React.Fragment>
													{item.is_veg ? (
														<img
															src="/assets/img/various/veg-icon-bg.png"
															alt="Veg"
															style={{ width: "1rem" }}
															className="mr-1"
														/>
													) : (
														<img
															src="/assets/img/various/non-veg-icon-bg.png"
															alt="Non-Veg"
															style={{ width: "1rem" }}
															className="mr-1"
														/>
													)}
												</React.Fragment>
											)}
										{item.name}
									</div>
									<div className="font-size-sm font-w600 truncate-text">
										<span className="text-muted">
											{localStorage.getItem("exlporeByRestaurantText")}
										</span>{" "}
										<span style={{ color: localStorage.getItem("storeColor") }}>
											{item.restaurant.name}
										</span>
									</div>

									<div className="font-size-sm font-w600 text-muted">
										{localStorage.getItem("currencySymbolAlign") === "left" &&
											localStorage.getItem("currencyFormat")}
										{item.price}
										{localStorage.getItem("currencySymbolAlign") === "right" &&
											localStorage.getItem("currencyFormat")}
									</div>
									<br />
								</div>

								<Ink duration="500" />
							</Link>
						</div>
					))}
				</div>
			</React.Fragment>
		);
	}
}

export default ItemSearchList;
