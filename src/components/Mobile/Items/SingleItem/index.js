import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../services/cart/actions";
import {
	getRestaurantInfo,
	getRestaurantItems,
	getSingleItem,
	resetInfo,
	resetItems,
	getRestaurantInfoForLoggedInUser,
} from "../../../../services/items/actions";

import Customization from "../Customization";
import Fade from "react-reveal/Fade";
import FloatCart from "../../FloatCart";
import Ink from "react-ink";
import ItemBadge from "../ItemList/ItemBadge";
import LazyLoad from "react-lazyload";

import { Redirect } from "react-router";
import RestaurantInfo from "../RestaurantInfo";

import { connect } from "react-redux";
import ContentLoader from "react-content-loader";

import { getSettings } from "../../../../services/settings/actions";

import { getAllLanguages, getSingleLanguageData } from "../../../../services/languages/actions";

class SingleItem extends Component {
	state = {
		update: true,
		is_active: 1,
		loading: true,
		item_loading: true,
	};
	forceStateUpdate = () => {
		setTimeout(() => {
			this.forceUpdate();
			if (this.state.update) {
				this.setState({ update: false });
			} else {
				this.setState({ update: true });
			}
		}, 100);
	};

	componentDidMount() {
		this.props.getSettings();
		this.props.getAllLanguages();

		const { user } = this.props;
		user.success
			? this.props.getRestaurantInfoForLoggedInUser(this.props.restaurant)
			: this.props.getRestaurantInfo(this.props.restaurant);

		this.props.getSingleItem(this.props.itemId).then((response) => {
			if (response) {
				if (response.payload.id) {
					this.setState({ item_loading: false });
				}
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.restaurant_info.is_active === "undefined") {
			this.setState({ loading: true });
		}
		if (nextProps.restaurant_info.is_active === 1 || nextProps.restaurant_info.is_active === 0) {
			this.setState({ loading: false });
			this.setState({ is_active: nextProps.restaurant_info.is_active });
		}
		if (!this.state.is_active) {
			document.getElementsByTagName("html")[0].classList.add("page-inactive");
		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					// console.log("Fetching Translation Data...");
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	componentWillUnmount() {
		document.getElementsByTagName("html")[0].classList.remove("page-inactive");
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		// if (localStorage.getItem("storeColor") === null) {
		// 	return <Redirect to={"/"} />;
		// }

		const { addProduct, removeProduct, cartProducts, single_item } = this.props;
		return (
			<React.Fragment>
				<RestaurantInfo
					history={this.props.history}
					restaurant={this.props.restaurant_info}
					withLinkToRestaurant={true}
				/>

				{single_item.id && (
					<div className="single-item px-15 mt-20 pb-100">
						<span className="hidden">{(single_item.quantity = 1)}</span>
						<div
							className="category-list-item single-item-img"
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							{this.state.item_loading ? (
								<ContentLoader
									height={400}
									width={window.innerWidth}
									speed={1.2}
									primaryColor="#f3f3f3"
									secondaryColor="#ecebeb"
								>
									<rect x="0" y="0" rx="4" ry="4" width={window.innerWidth} height="290" />
									<rect x="0" y="300" rx="0" ry="0" width="115" height="20" />
									<rect x="0" y="325" rx="0" ry="0" width="75" height="16" />

									<rect x={window.innerWidth - 100} y="300" rx="4" ry="4" width="115" height="35" />
									<rect x={window.innerWidth - 50} y="300" rx="4" ry="4" width="115" height="35" />
								</ContentLoader>
							) : (
								<React.Fragment>
									{single_item.image !== "" && (
										<LazyLoad>
											<img
												src={single_item.image}
												alt={single_item.name}
												style={{ width: "100%", height: "auto" }}
											/>

											<React.Fragment>
												{cartProducts.find((cp) => cp.id === single_item.id) !== undefined && (
													<Fade duration={150}>
														<div
															className="quantity-badge-list"
															style={{
																backgroundColor: localStorage.getItem("storeColor"),
															}}
														>
															<span>
																{single_item.addon_categories.length ? (
																	<React.Fragment>
																		<i
																			className="si si-check"
																			style={{
																				lineHeight: "1.3rem",
																			}}
																		/>
																	</React.Fragment>
																) : (
																	<React.Fragment>
																		{
																			cartProducts.find(
																				(cp) => cp.id === single_item.id
																			).quantity
																		}
																	</React.Fragment>
																)}
															</span>
														</div>
													</Fade>
												)}
											</React.Fragment>
										</LazyLoad>
									)}

									<div className="single-item-meta">
										<div className="item-actions pull-right pb-0 mt-2">
											<div
												className="btn-group btn-group-sm"
												role="group"
												aria-label="btnGroupIcons1"
											>
												{single_item.is_active ? (
													<React.Fragment>
														{single_item.addon_categories.length ? (
															<button
																disabled
																type="button"
																className="btn btn-add-remove mr-2"
																style={{
																	color: localStorage.getItem("cartColor-bg"),
																}}
															>
																<span className="btn-dec">-</span>
																<Ink duration="500" />
															</button>
														) : (
															<button
																type="button"
																className="btn btn-add-remove mr-2"
																style={{
																	color: localStorage.getItem("cartColor-bg"),
																}}
																onClick={() => {
																	single_item.quantity = 1;
																	removeProduct(single_item);
																	this.forceStateUpdate();
																}}
															>
																<span className="btn-dec">-</span>
																<Ink duration="500" />
															</button>
														)}

														{single_item.addon_categories.length ? (
															<Customization
																product={single_item}
																addProduct={addProduct}
																forceUpdate={this.forceStateUpdate}
															/>
														) : (
															<button
																type="button"
																className="btn btn-add-remove"
																style={{
																	color: localStorage.getItem("cartColor-bg"),
																}}
																onClick={() => {
																	addProduct(single_item);
																	this.forceStateUpdate();
																}}
															>
																<span className="btn-inc">+</span>
																<Ink duration="500" />
															</button>
														)}
													</React.Fragment>
												) : (
													<div className="text-danger text-item-not-available">
														{localStorage.getItem("cartItemNotAvailable")}
													</div>
												)}
											</div>
										</div>

										<div className="item-name font-w600 mt-2">
											{localStorage.getItem("showVegNonVegBadge") === "true" &&
												single_item.is_veg !== null && (
													<React.Fragment>
														{single_item.is_veg ? (
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
											{single_item.name}
										</div>
										<div className="item-price">
											{localStorage.getItem("hidePriceWhenZero") === "true" &&
											single_item.price === "0.00" ? null : (
												<React.Fragment>
													{single_item.old_price > 0 && (
														<span className="strike-text mr-1">
															{" "}
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}{" "}
															{single_item.old_price}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</span>
													)}

													<span>
														{localStorage.getItem("currencySymbolAlign") === "left" &&
															localStorage.getItem("currencyFormat")}{" "}
														{single_item.price}
														{localStorage.getItem("currencySymbolAlign") === "right" &&
															localStorage.getItem("currencyFormat")}
													</span>

													{single_item.old_price > 0 &&
														localStorage.getItem("showPercentageDiscount") === "true" && (
															<React.Fragment>
																<span
																	className="price-percentage-discount mb-0 ml-1"
																	style={{
																		color: localStorage.getItem("cartColorBg"),
																	}}
																>
																	{parseFloat(
																		((parseFloat(single_item.old_price) -
																			parseFloat(single_item.price)) /
																			parseFloat(single_item.old_price)) *
																			100
																	).toFixed(0)}
																	{localStorage.getItem("itemPercentageDiscountText")}
																</span>
															</React.Fragment>
														)}
												</React.Fragment>
											)}

											{single_item.addon_categories.length > 0 && (
												<span
													className="ml-2 customizable-item-text"
													style={{
														color: localStorage.getItem("storeColor"),
													}}
												>
													{localStorage.getItem("customizableItemText")}
												</span>
											)}
										</div>
										<ItemBadge item={single_item} />
										{single_item.desc !== null ? (
											<div className="mt-2 mb-100">
												<div
													dangerouslySetInnerHTML={{
														__html: single_item.desc,
													}}
												/>
											</div>
										) : (
											<br />
										)}
									</div>
								</React.Fragment>
							)}
						</div>
					</div>
				)}

				{!this.state.loading && (
					<React.Fragment>
						{this.state.is_active ? (
							<FloatCart />
						) : (
							<div className="auth-error no-click">
								<div className="error-shake">{localStorage.getItem("notAcceptingOrdersMsg")}</div>
							</div>
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	restaurant_info: state.items.restaurant_info,
	cartProducts: state.cart.products,
	single_item: state.items.single_item,
	settings: state.settings.settings,
	languages: state.languages.languages,
	language: state.languages.language,
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{
		getRestaurantInfo,
		getRestaurantItems,
		resetItems,
		resetInfo,
		getSingleItem,
		addProduct,
		removeProduct,
		getSettings,
		getAllLanguages,
		getSingleLanguageData,
		getRestaurantInfoForLoggedInUser,
	}
)(SingleItem);
