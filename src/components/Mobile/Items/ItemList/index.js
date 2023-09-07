import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../services/cart/actions";

import Collapsible from "react-collapsible";
import ContentLoader from "react-content-loader";
import Customization from "../Customization";

import Ink from "react-ink";
import ItemBadge from "./ItemBadge";
import { Link } from "react-router-dom";

import RecommendedItems from "./RecommendedItems";
import ShowMore from "react-show-more";

import { connect } from "react-redux";
import { searchItem, clearSearch } from "../../../../services/items/actions";

import ProgressiveImage from "react-progressive-image";
import LazyLoad from "react-lazyload";
import { debounce } from "../../../helpers/debounce";
import PromoSlider from "../../Home/PromoSlider";	

class ItemList extends Component {
	state = {
		update: true,
		items_backup: [],
		searching: false,
		data: [],
		filterText: null,
		filter_items: [],
		items: [],
		queryLengthError: false,
	};

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
	}

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

	searchForItem = (e) => {
		this.searchItem(e.target.value);
	};

	searchItem = debounce((event) => {
		if (event.length >= 3) {
			this.setState({ filterText: event });
			this.props.searchItem(
				this.state.items,
				event,
				localStorage.getItem("itemSearchText"),
				localStorage.getItem("itemSearchNoResultText")
			);
			this.setState({ searching: true, queryLengthError: false });
		} else {
			this.setState({ queryLengthError: true });
		}
		if (event.length === 0) {
			this.setState({ filterText: null, queryLengthError: false });
			// console.log("Cleared");

			this.props.clearSearch(this.state.items_backup);
			this.setState({ searching: false });
		}
	}, 500);

	inputFocus = () => {
		this.refs.searchGroup.classList.add("search-shadow-light");
	};

	handleClickOutside = (event) => {
		if (this.refs.searchGroup && !this.refs.searchGroup.contains(event.target)) {
			this.refs.searchGroup.classList.remove("search-shadow-light");
		}
	};

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}

	static getDerivedStateFromProps(props, state) {
		if (props.data !== state.data) {
			if (state.filterText !== null) {
				return {
					data: props.data,
				};
			} else if (state.filterText === null) {
				return {
					items_backup: props.data,
					data: props.data,
					filter_items: props.data.items,
				};
			}
		}
		if (props.restaurant_backup_items && state.items >= 0) {
			let arr = [];
			if (props.restaurant_backup_items.hasOwnProperty("items")) {
				Object.keys(props.restaurant_backup_items.items).forEach((keys) => {
					props.restaurant_backup_items.items[keys].forEach((itemsList) => {
						arr.push(itemsList);
					});
				});
			}
			return { items: arr };
		}
		return null;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState !== this.state.data) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		const { addProduct, removeProduct, cartProducts, restaurant } = this.props;
		const { data } = this.state;
		var catArray=Object.keys(data.items).map((category, index) => {return category})	
		catArray.forEach(function(category,i){	
			if(category === localStorage.getItem("selectedCategory")){	
				catArray.splice(i, 1);	
				catArray.unshift(category);	
			}
		});
		return (
			<React.Fragment>
				<div className="col-12 mt-10">
					<div className="input-group" ref="searchGroup" onClick={this.inputFocus}>
						<input
							type="text"
							className="form-control items-search-box"
							placeholder={localStorage.getItem("itemSearchPlaceholder")}
							onChange={this.searchForItem}
						/>
						<div className="input-group-append">
							<span className="input-group-text items-search-box-icon">
								<i className="si si-magnifier" />
							</span>
						</div>
					</div>
				</div>
				{this.props.promo_slides && this.props.promo_slides.restaurantDetailSlides && this.props.promo_slides.restaurantDetailSlides.length > 0 && (	
					<React.Fragment>	
							<PromoSlider	
								slides={this.props.promo_slides.restaurantDetailSlides}	
								size={this.props.promo_slides.restaurantDetailSlides[0]["promo_slider"]["size"]}	
								secondarySlider={true}	
							/>	
					</React.Fragment>	
				)}
				<div>
					{this.state.queryLengthError && (
						<div className="auth-error">
							<div className="">{localStorage.getItem("searchAtleastThreeCharsMsg")}</div>
						</div>
					)}
				</div>

				<div className={`bg-grey-light mt-20 ${restaurant && !restaurant.certificate ? "mb-100" : null}`}>
					{/* {!this.state.searching && (
						<div className="px-5">
							{!data.recommended ? (
								<ContentLoader
									height={480}
									width={400}
									speed={1.2}
									primaryColor="#f3f3f3"
									secondaryColor="#ecebeb"
								>
									<rect x="10" y="22" rx="4" ry="4" width="185" height="137" />
									<rect x="10" y="168" rx="0" ry="0" width="119" height="18" />
									<rect x="10" y="193" rx="0" ry="0" width="79" height="18" />

									<rect x="212" y="22" rx="4" ry="4" width="185" height="137" />
									<rect x="212" y="168" rx="0" ry="0" width="119" height="18" />
									<rect x="212" y="193" rx="0" ry="0" width="79" height="18" />

									<rect x="10" y="272" rx="4" ry="4" width="185" height="137" />
									<rect x="10" y="418" rx="0" ry="0" width="119" height="18" />
									<rect x="10" y="443" rx="0" ry="0" width="79" height="18" />

									<rect x="212" y="272" rx="4" ry="4" width="185" height="137" />
									<rect x="212" y="418" rx="0" ry="0" width="119" height="18" />
									<rect x="212" y="443" rx="0" ry="0" width="79" height="18" />
								</ContentLoader>
							) : null}
							{data.recommended && data.recommended.length > 0 && (
								<h3 className="px-10 py-10 recommended-text mb-0">
									{localStorage.getItem("itemsPageRecommendedText")}
								</h3>
							)}

							<div
								className={
									localStorage.getItem("recommendedLayoutV2") === "true"
										? "product-slider"
										: "row m-0"
								}
							>
								{!data.recommended
									? null
									: data.recommended.map((item) => (
											<RecommendedItems
												restaurant={restaurant}
												shouldUpdate={this.state.update}
												update={this.forceStateUpdate}
												product={item}
												addProduct={addProduct}
												removeProduct={removeProduct}
												key={item.id}
											/>
									  ))}
							</div>
						</div>
					)} */}
					{data.items &&
						catArray.map((category, index) => (
							<div key={category} id={category + index}>
								<Collapsible
									trigger={category}
									open={
										localStorage.getItem("selectedCategory") === category
											? true
											: this.props.menuClicked
									}
								>
									{data.items[category].map((item) => (
										<React.Fragment key={item.id}>
											<span className="hidden">{(item.quantity = 1)}</span>
											<div
												className="category-list-item"
												style={{
													display: "flex",
													justifyContent: "space-between",
												}}
											>
												{item.image !== null && (
													<React.Fragment>
														<Link to={restaurant.slug + "/" + item.id}>
															<React.Fragment>
																{this.state.searching ? (
																	<img
																		src={item.image}
																		alt={item.name}
																		className="flex-item-image"
																	/>
																) : (
																	<LazyLoad>
																		<ProgressiveImage
																			src={item.image}
																			placeholder="/assets/img/various/blank-white.jpg"
																		>
																			{(src, loading) => (
																				<img
																					style={{
																						opacity: loading ? "0.5" : "1",
																					}}
																					src={src}
																					alt={item.name}
																					className="flex-item-image"
																				/>
																			)}
																		</ProgressiveImage>
																	</LazyLoad>
																)}

																{cartProducts.find((cp) => cp.id === item.id) !==
																	undefined && (
																	<React.Fragment>
																		<div style={{ position: "absolute", top: "0" }}>
																			<div
																				className="quantity-badge-list"
																				style={{
																					backgroundColor: localStorage.getItem(
																						"storeColor"
																					),
																				}}
																			>
																				<span>
																					{item.addon_categories.length ? (
																						<React.Fragment>
																							<i
																								className="si si-check"
																								style={{
																									lineHeight:
																										"1.3rem",
																								}}
																							/>
																						</React.Fragment>
																					) : (
																						<React.Fragment>
																							{
																								cartProducts.find(
																									(cp) =>
																										cp.id ===
																										item.id
																								).quantity
																							}
																						</React.Fragment>
																					)}
																				</span>
																			</div>
																		</div>
																	</React.Fragment>
																)}
															</React.Fragment>
															{localStorage.getItem("showVegNonVegBadge") === "true" &&
																item.is_veg !== null && (
																	<React.Fragment>
																		{item.is_veg ? (
																			<img
																				src="/assets/img/various/veg-icon-bg.png"
																				alt="Veg"
																				className="mr-1 veg-non-veg-badge"
																			/>
																		) : (
																			<img
																				src="/assets/img/various/non-veg-icon-bg.png"
																				alt="Non-Veg"
																				className="mr-1 veg-non-veg-badge"
																			/>
																		)}
																	</React.Fragment>
																)}
														</Link>
													</React.Fragment>
												)}
												<div
													className={
														item.image !== null ? "flex-item-name ml-12" : "flex-item-name"
													}
												>
													{item.image === null && (
														<React.Fragment>
															<React.Fragment>
																{cartProducts.find((cp) => cp.id === item.id) !==
																	undefined && (
																	<React.Fragment>
																		<div>
																			<div
																				className="quantity-badge-list--no-image"
																				style={{
																					backgroundColor: localStorage.getItem(
																						"storeColor"
																					),
																				}}
																			>
																				<span>
																					{item.addon_categories.length ? (
																						<React.Fragment>
																							<i
																								className="si si-check"
																								style={{
																									lineHeight:
																										"1.3rem",
																								}}
																							/>
																						</React.Fragment>
																					) : (
																						<React.Fragment>
																							{
																								cartProducts.find(
																									(cp) =>
																										cp.id ===
																										item.id
																								).quantity
																							}
																						</React.Fragment>
																					)}
																				</span>
																			</div>
																		</div>
																	</React.Fragment>
																)}
															</React.Fragment>
															<React.Fragment>
																{localStorage.getItem("showVegNonVegBadge") ===
																	"true" &&
																	item.is_veg !== null && (
																		<React.Fragment>
																			{item.is_veg ? (
																				<img
																					src="/assets/img/various/veg-icon-bg.png"
																					alt="Veg"
																					className="mr-1 veg-non-veg-badge-noimage"
																				/>
																			) : (
																				<img
																					src="/assets/img/various/non-veg-icon-bg.png"
																					alt="Non-Veg"
																					className="mr-1 veg-non-veg-badge-noimage"
																				/>
																			)}
																		</React.Fragment>
																	)}
															</React.Fragment>
														</React.Fragment>
													)}
													<span className="item-name">{item.name}</span>{" "}
													<ItemBadge item={item} />
													<span className="item-price">
														{localStorage.getItem("hidePriceWhenZero") === "true" &&
														item.price === "0.00" ? null : (
															<React.Fragment>
																{item.old_price > 0 && (
																	<span className="strike-text mr-1">
																		{" "}
																		{localStorage.getItem("currencySymbolAlign") ===
																			"left" &&
																			localStorage.getItem("currencyFormat")}{" "}
																		{item.old_price}
																		{localStorage.getItem("currencySymbolAlign") ===
																			"right" &&
																			localStorage.getItem("currencyFormat")}
																	</span>
																)}

																<span>
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}{" "}
																	{item.price}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</span>

																{item.old_price > 0 &&
																localStorage.getItem("showPercentageDiscount") ===
																	"true" ? (
																	<React.Fragment>
																		<p
																			className="price-percentage-discount mb-0"
																			style={{
																				color: localStorage.getItem(
																					"cartColorBg"
																				),
																			}}
																		>
																			{parseFloat(
																				((parseFloat(item.old_price) -
																					parseFloat(item.price)) /
																					parseFloat(item.old_price)) *
																					100
																			).toFixed(0)}
																			{localStorage.getItem(
																				"itemPercentageDiscountText"
																			)}
																		</p>
																	</React.Fragment>
																) : (
																	<br />
																)}
															</React.Fragment>
														)}
													</span>
													{item.desc !== null ? (
														<div className="item-desc-short">
															<ShowMore
																lines={1}
																more={localStorage.getItem("showMoreButtonText")}
																less={localStorage.getItem("showLessButtonText")}
																anchorclassName="show-more ml-1"
															>
																<div
																	dangerouslySetInnerHTML={{
																		__html: item.desc,
																	}}
																/>
															</ShowMore>
														</div>
													) : null}
												</div>

												<div className="item-actions pull-right pb-0">
													<div
														className="btn-group btn-group-sm"
														role="group"
														aria-label="btnGroupIcons1"
													>
														{item.is_active ? (
															<React.Fragment>
																{item.addon_categories &&
																item.addon_categories.length ? (
																	<button
																		disabled
																		type="button"
																		className="btn btn-add-remove"
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
																		className="btn btn-add-remove"
																		style={{
																			color: localStorage.getItem("cartColor-bg"),
																		}}
																		onClick={() => {
																			item.quantity = 1;
																			removeProduct(item);
																			this.forceStateUpdate();
																		}}
																	>
																		<span className="btn-dec">-</span>
																		<Ink duration="500" />
																	</button>
																)}

																{item.addon_categories &&
																item.addon_categories.length ? (
																	<Customization
																		product={item}
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
																			addProduct(item);
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
													{item.addon_categories && item.addon_categories.length > 0 && (
														<React.Fragment>
															<span
																className="customizable-item-text d-block text-center"
																style={{
																	color: localStorage.getItem("storeColor"),
																}}
															>
																{localStorage.getItem("customizableItemText")}
															</span>
															<br />
														</React.Fragment>
													)}
												</div>
											</div>
										</React.Fragment>
									))}
								</Collapsible>
							</div>
						))}
					<div className="mb-50" />
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
});

export default connect(
	mapStateToProps,
	{ addProduct, removeProduct, searchItem, clearSearch }
)(ItemList);
