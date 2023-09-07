import React, { Component } from "react";
import Axios from "axios";

import { addProduct, removeProduct } from "../../../../services/cart/actions";

import Collapsible from "react-collapsible";
import ContentLoader from "react-content-loader";
import Customization from "../../Items/Customization";
// import Fade from "react-reveal/Fade";
import Ink from "react-ink";
import ItemBadge from "../../Items/ItemList/ItemBadge";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";

// import RecommendedItems from "./Items/ItemList/";
import ShowMore from "react-show-more";

import { connect } from "react-redux";
import { searchItem, clearSearch } from "../../../../services/items/actions";

import { List, AutoSizer, CellMeasurer, CellMeasurerCache, WindowScroller } from "react-virtualized";
import { getRestaurantInfo, getRestaurantItems } from "../../../../services/items/actions";

class TestComponent extends Component {
	constructor(props) {
		super(props);
		const cache = new CellMeasurerCache({
			fixedWidth: true,
			defaultHeight: 50,
		});
		this.cache = cache;
	}
	state = {
		update: true,
		items_backup: [],
		searching: false,
		data: [],
		filterText: null,
		filter_items: [],
	};

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);

		this.props.getRestaurantInfo("the-halal-guys-yoxsvgo8eluufwd").then((response) => {
			if (response) {
				if (response.payload.id) {
					//get items
					this.props.getRestaurantItems("the-halal-guys-yoxsvgo8eluufwd");
				}
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps.restaurant_items);
		// if (this.props.restaurant_items !== nextProps.restaurant_items) {
		this.setState({ data: nextProps.restaurant_items.items });
		// }
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

	searchItem = (event) => {
		if (event.target.value.length > 0) {
			this.setState({ filterText: event.target.value });
			this.props.searchItem(
				this.state.filter_items,
				event.target.value,
				localStorage.getItem("itemSearchText"),
				localStorage.getItem("itemSearchNoResultText")
			);
			this.setState({ searching: true });
		}
		if (event.target.value.length === 0) {
			this.setState({ filterText: null });
			// console.log("Cleared");

			this.props.clearSearch(this.state.items_backup);
			this.setState({ searching: false });
		}
	};

	// static getDerivedStateFromProps(props, state) {
	// 	if (props.data !== state.data) {
	// 		if (state.filterText !== null) {
	// 			return {
	// 				data: props.data,
	// 			};
	// 		} else {
	// 			return {
	// 				items_backup: props.data,
	// 				data: props.data,
	// 				filter_items: props.data.items,
	// 			};
	// 		}
	// 	}
	// 	return null;
	// }

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

	rowRenderer = ({ index, parent, key, style }) => {
		const { addProduct, removeProduct, cartProducts, restaurant } = this.props;
		const { data } = this.state;
		return (
			<CellMeasurer key={key} cache={this.cache} parent={parent} columnIndex={0} rowIndex={index}>
				<div style={style}>
					{data.items &&
						Object.keys(data.items).map((category, index) => (
							<div key={category} id={category + index}>
								{/* <Collapsible trigger={category} open={true}> */}
								<Collapsible
									trigger={category}
									open={
										index === 0
											? true
											: localStorage.getItem("expandAllItemMenu") === "true"
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
												{item.image !== "" && (
													<LazyLoad>
														<Link to={restaurant.slug + "/" + item.id}>
															<React.Fragment>
																{cartProducts.find((cp) => cp.id === item.id) !==
																	undefined && (
																	<React.Fragment>
																		<div className="position-relative">
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

																{/* <Fade duration={500}> */}
																<img
																	src={item.image}
																	alt={item.name}
																	className="flex-item-image"
																/>
																{/* </Fade> */}
															</React.Fragment>
														</Link>
													</LazyLoad>
												)}
												<div
													className={
														item.image !== "" ? "flex-item-name" : "flex-item-name ml-0"
													}
												>
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
													<span className="item-name">{item.name}</span>{" "}
													{item.desc !== null ? (
														<React.Fragment>
															<br />
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
														</React.Fragment>
													) : (
														<br />
													)}
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
														{item.addon_categories.length > 0 && (
															<React.Fragment>
																<span
																	className="ml-2 customizable-item-text"
																	style={{
																		color: localStorage.getItem("storeColor"),
																	}}
																>
																	{localStorage.getItem("customizableItemText")}
																</span>
																<br />
															</React.Fragment>
														)}
													</span>
													<ItemBadge item={item} />
												</div>

												<div className="item-actions pull-right pb-0 mt-10">
													<div
														className="btn-group btn-group-sm"
														role="group"
														aria-label="btnGroupIcons1"
													>
														{item.is_active ? (
															<React.Fragment>
																{item.addon_categories.length ? (
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

																{item.addon_categories.length ? (
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
												</div>
											</div>
										</React.Fragment>
									))}
								</Collapsible>
							</div>
						))}
				</div>
			</CellMeasurer>
		);
	};

	render() {
		const { data } = this.state;
		console.log(data);
		console.log(data.length);
		return (
			<React.Fragment>
				<div className="p-15">
					<WindowScroller>
						{({ height, isScrolling, onChildScroll, scrollTop }) => (
							<List
								autoHeight
								height={height}
								isScrolling={isScrolling}
								onScroll={onChildScroll}
								scrollTop={scrollTop}
								rowCount={data.length}
								width={window.innerWidth - 15}
								deferredMeasurementCache={this.cache}
								rowHeight={this.cache.rowHeight}
								rowRenderer={this.rowRenderer}
							/>
						)}
					</WindowScroller>
				</div>
			</React.Fragment>
		);
	}
}

// export default TestComponent;

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
	restaurant_info: state.items.restaurant_info,
	restaurant_items: state.items.restaurant_items,
});

export default connect(
	mapStateToProps,
	{ addProduct, removeProduct, searchItem, clearSearch, getRestaurantInfo, getRestaurantItems }
)(TestComponent);
