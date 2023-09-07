import React, { Component } from "react";

import { checkUserRunningOrder, updateUserInfo, checkBan } from "../../../services/user/actions";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import BillDetails from "./BillDetails";
import CartCheckoutBlock from "./CartCheckoutBlock";
import CartItems from "./CartItems";
import Coupon from "./Coupon";
import DelayLink from "../../helpers/delayLink";
import Footer from "../Footer";
import Ink from "react-ink";
import Meta from "../../helpers/meta";
import OrderComment from "./OrderComment";
import { Redirect } from "react-router";
import RestaurantInfoCart from "./RestaurantInfoCart";
import { calculateDistance } from "../../helpers/calculateDistance";
import calculateDistanceGoogle from "../../helpers/calculateDistanceGoogle.js";
import { connect } from "react-redux";
import { getRestaurantInfoById, getRestaurantInfoAndOperationalStatus } from "../../../services/items/actions";
import { updateCart } from "../../../services/total/actions";
import { formatPrice } from "../../helpers/formatPrice";
import { addProduct } from "../../../services/cart/actions";

import { checkCartItemsAvailability } from "../../../services/confirmCart/actions";
import { GoogleApiWrapper } from "google-maps-react";
import Loading from "../../helpers/loading";
import UserBan from "../UserBan";
import { removeCoupon } from "../../../services/coupon/actions";
import Swing from "react-reveal/Swing";
import OrderScheduling from "../Modules/OrderScheduling";
import ExpressDelivery from "./ExpressDelivery";

class Cart extends Component {
	static contextTypes = {
		router: () => null,
	};

	state = {
		loading: true,
		alreadyRunningOrders: false,
		is_operational_loading: true,
		is_operational: true,
		distance: 0,
		is_active: false,
		min_order_satisfied: false,
		process_cart_loading: false,
		is_all_items_available: false,
		process_distance_calc_loading: false,
		userBan: false,
		tips: [],
		tips_percentage: [],
		tipsPercentageSetting: false,
		tipsAmountSetting: false,
		others: false,
		percentage: false,
		selectedTips: {
			type: "amount",
			value: 0,
		},
		is_tips_show: true,
		deliveryDates: [],		
		deliveryCharges: 0,
	};

	componentDidMount() {
		//remove tip on reload/first-load
		localStorage.removeItem("cart_tips");

		localStorage.removeItem("fromCart");

		const { user } = this.props;
		if (user.success) {
			this.props.checkBan(user.data.auth_token).then((response) => {
				if (response) {
					if (!response.success) {
						this.setState({ userBan: true, loading: false });
					} else {
						this.cartOperationalSteps();
					}
				} else {
					setTimeout(() => {
						this.fetchCheckBanAgain(user.data.auth_token);
					}, 2500);
				}
			});

			this.setState({
				tips: localStorage.getItem("tips") !== null && localStorage.getItem("tips").split(","),
				tips_percentage:
					localStorage.getItem("tips_percentage") !== null &&
					localStorage.getItem("tips_percentage").split(","),
				tipsAmountSetting:
					localStorage.getItem("showTipsAmount") !== null &&
					JSON.parse(localStorage.getItem("showTipsAmount").toLowerCase()),
				tipsPercentageSetting:
					localStorage.getItem("showTipsPercentage") !== null &&
					JSON.parse(localStorage.getItem("showTipsPercentage").toLowerCase()),
			});

			// console.log(localStorage.getItem("userSelected"));
			if (localStorage.getItem("userSelected") === "SELFPICKUP") {
				this.setState({ is_tips_show: true });
			} else {
				this.setState({ is_tips_show: false });
			}
		} else {
			this.cartOperationalSteps();
		}
	}

	fetchCheckBanAgain = (token) => {
		this.props.checkBan(token).then((response) => {
			if (response) {
				if (!response.success) {
					this.setState({ userBan: true, loading: false });
				} else {
					this.cartOperationalSteps();
				}
			}
		});
	};

	cartOperationalSteps = () => {
		const { user } = this.props;

		this.setState({ loading: false });
		if (this.props.cartProducts.length) {
			document.getElementsByTagName("body")[0].classList.add("bg-grey");
			this.checkForItemsAvailability();
		}

		if (user.success) {
			this.props.checkUserRunningOrder(user.data.id, user.data.auth_token);
			if (this.props.cartProducts.length > 0) {
				this.props.updateUserInfo(user.data.id, user.data.auth_token).then((updatedUser) => {
					// console.log("THIS SHOULD BE CALLED: UPDATED USER", updatedUser);
					if (typeof updatedUser !== "undefined") {
						if (updatedUser.payload.data.default_address !== null) {
							const userSetAddress = {
								lat: updatedUser.payload.data.default_address.latitude,
								lng: updatedUser.payload.data.default_address.longitude,
								address: updatedUser.payload.data.default_address.address,
								house: updatedUser.payload.data.default_address.house,
								tag: updatedUser.payload.data.default_address.tag,
							};

							const saveUserSetAddress = new Promise((resolve) => {
								localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
								resolve("Address Saved");
							});
							saveUserSetAddress.then(() => {
								this.initRestaurantInfoApi();
							});
						} else {
							this.initRestaurantInfoApi();
						}
					} else {
						console.warn("Failed to fetch update user info... Solution: Reload Page");
					}
				});
			}
		} else {
			this.initRestaurantInfoApi();
			this.setState({ alreadyRunningOrders: false });
		}
	};

	initRestaurantInfoApi = () => {
		if (localStorage.getItem("activeRestaurant") !== null && this.props.cartProducts.length > 0) {
			this.props.getRestaurantInfoById(localStorage.getItem("activeRestaurant")).then((response) => {
				if (response) {
					if (response.payload.id) {
						this.__doesRestaurantOperatesAtThisLocation(response.payload);
					}
				}
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.restaurant_info.id) {
			this.__isRestaurantActive(nextProps.restaurant_info);

			this.__checkMinOrderSatisfied(nextProps.restaurant_info, nextProps.cartTotal);
			this.getNextWeek(nextProps.restaurant_info);
		}

		if (nextProps.running_order) {
			this.setState({ alreadyRunningOrders: true });
		}
		if (nextProps.force_reload) {
			this.setState({ loading: true });
			window.location.reload();
		}
		this.setState({		
			deliveryCharges: nextProps.deliveryCharges		
		})
	}

	addProductQuantity = (product) => {
		const { cartProducts, updateCart } = this.props;
		let productAlreadyInCart = false;

		cartProducts.forEach((cp) => {
			if (cp.id === product.id) {
				if (JSON.stringify(cp.selectedaddons) === JSON.stringify(product.selectedaddons)) {
					cp.quantity += 1;
					productAlreadyInCart = true;
				}
			}
		});

		if (!productAlreadyInCart) {
			cartProducts.push(product);
		}

		updateCart(cartProducts);
	};

	removeProductQuantity = (product) => {
		const { cartProducts, updateCart } = this.props;

		const index = cartProducts.findIndex(
			(p) => p.id === product.id && JSON.stringify(p) === JSON.stringify(product)
		);
		//if product is in the cart then index will be greater than 0
		if (index >= 0) {
			cartProducts.forEach((cp) => {
				if (cp.id === product.id) {
					if (JSON.stringify(cp) === JSON.stringify(product)) {
						if (cp.quantity === 1) {
							//if quantity is 1 then remove product from cart
							cartProducts.splice(index, 1);
						} else {
							//else decrement the quantity by 1
							cp.quantity -= 1;
						}
					}
				}
			});

			updateCart(cartProducts);
			this.props.removeCoupon();
		}
	};

	removeProduct = (product) => {
		// console.log(product);
		// console.log(product.id);

		const { cartProducts, updateCart } = this.props;
		const index = cartProducts.findIndex((cp) => cp.id === product.id);

		// console.log(index);
		cartProducts.splice(index, 1);
		// console.log(cartProducts);
		updateCart(cartProducts);
		this.props.removeCoupon();
		this.checkForItemsAvailability();
	};

	getNextWeek = (restaurant_info) => {
		console.log("RESTAUTR",restaurant_info)
		console.log("RESTAUTR=>>>>>>>>>>",this.props)
		const { timeSlotAvailability } = this.props;
		console.log("timeSlotAvailability=>>>>>>>>>>",timeSlotAvailability)
		if (restaurant_info.id) {
			var d = new Date().toDateString(); //today date with current time
			var date = d.substr(4) // today date with 0:00 a.m.
			var dailytimeSlotLimit = new Date(date).getTime() + 12 *60*60*1000; // today date with 12:p.m.

			var firstDay = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
			var nextWeek = new Date(firstDay.getTime() + 1 * 24 * 60 * 60 * 1000);
			var daylist = this.getdates(firstDay, nextWeek);
			var t = daylist.map((v) => {
				var d = v.toDateString();
				var day = d.substr(0, 3)
				var date = d.substr(4)
				if (day == "Mon")
					return { day: "Monday", date: date }
				if (day == "Tue")
					return { day: "Tuesday", date: date }
				if (day == "Wed")
					return { day: "Wednesnday", date: date }
				if (day == "Thu")
					return { day: "Thursday", date: date }
				if (day == "Fri")
					return { day: "Friday", date: date }
				if (day == "Sat")
					return { day: "Saturday", date: date }
				if (day == "Sun")
					return { day: "Sunday", date: date }
			})
			if (restaurant_info.delivery_time_slot) {
				let timeSlots = []
				if (restaurant_info.enable_timeslot1) {
					if (restaurant_info.timeslot1)
						timeSlots.push(restaurant_info.timeslot1)
				}
				if (restaurant_info.enable_timeslot2) {
					if (restaurant_info.timeslot2)
						timeSlots.push(restaurant_info.timeslot2)
				}
				if (restaurant_info.enable_timeslot3) {
					if (restaurant_info.timeslot3)
						timeSlots.push(restaurant_info.timeslot3)
				}
				for (var i = 0; i < t.length; i++) {
					t[i].time = [];
					for (var j = 0; j < timeSlots.length; j++) {
						t[i].time.push({ time: timeSlots[j] })
					}
				}
				if(restaurant_info.enable_same_day_timeslot){
					var today = new Date(new Date().getTime());
					var todayTimeSlot = {
						day: "Today",
						date: today.toDateString().substr(4),
						time: [{time : restaurant_info.same_day_timeslot}]
					}
					
					if(timeSlotAvailability !== undefined){
						for(var j=0; j < timeSlotAvailability.length; j++){
							if(todayTimeSlot.date == timeSlotAvailability[j].delivery_date){
								for(var k=0;k < todayTimeSlot.time.length;k++){
									if(todayTimeSlot.time.time == timeSlotAvailability[j].delivery_timeslot){
										if(timeSlotAvailability[j].unavailable == 1){
											todayTimeSlot.time.unavailable=1
											break;
										}else{
											todayTimeSlot.time.unavailable=0
											break;
										}
										
									}
								}				
							}
						}
					}
					if((new Date().getTime() < dailytimeSlotLimit) && !todayTimeSlot.time.unavailable){
						t.unshift(todayTimeSlot)
					}
				}
			}
			
			this.setState({
				deliveryDates: t
			})
		}
	}

	getdates = (start, end) => {
		for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
			arr.push(new Date(dt));
		}
		return arr;
	};

	__doesRestaurantOperatesAtThisLocation = (restaurant_info) => {
		//send user lat long to helper, check with the current restaurant lat long and setstate accordingly
		const { user } = this.props;

		if (user.success && user.data.default_address !== null) {
			let self = this;
			let distance = 0;
			if (localStorage.getItem("enGDMA") === "true") {
				this.setState({ process_distance_calc_loading: true });
				distance = calculateDistanceGoogle(
					restaurant_info.longitude,
					restaurant_info.latitude,
					user.data.default_address.longitude,
					user.data.default_address.latitude,
					this.props.google,
					function(distance) {
						console.log("Distance:", distance);
						self.setState(
							{ distance: distance, process_distance_calc_loading: false },
							self.__processRestaurantOperationalState(
								restaurant_info.id,
								user.data.default_address.latitude,
								user.data.default_address.longitude
							)
						);
					}
				);
			} else {
				distance = calculateDistance(
					restaurant_info.longitude,
					restaurant_info.latitude,
					user.data.default_address.longitude,
					user.data.default_address.latitude
				);
				this.setState(
					{ distance: distance },
					this.__processRestaurantOperationalState(
						restaurant_info.id,
						user.data.default_address.latitude,
						user.data.default_address.longitude
					)
				);
			}
		} else {
			//if Google Distance Matrix API is enabled
			let self = this;
			let distance = 0;
			if (localStorage.getItem("userSetAddress") !== null) {
				if (localStorage.getItem("enGDMA") === "true") {
					distance = calculateDistanceGoogle(
						restaurant_info.longitude,
						restaurant_info.latitude,
						JSON.parse(localStorage.getItem("userSetAddress")).lng,
						JSON.parse(localStorage.getItem("userSetAddress")).lat,
						this.props.google,
						function(distance) {
							console.log(distance);
							self.setState(
								{ distance: distance },
								self.__processRestaurantOperationalState(
									restaurant_info.id,
									JSON.parse(localStorage.getItem("userSetAddress")).lat,
									JSON.parse(localStorage.getItem("userSetAddress")).lng
								)
							);
						}
					);
				} else {
					distance = calculateDistance(
						restaurant_info.longitude,
						restaurant_info.latitude,
						JSON.parse(localStorage.getItem("userSetAddress")).lng,
						JSON.parse(localStorage.getItem("userSetAddress")).lat
					);
					this.setState(
						{ distance: distance },
						this.__processRestaurantOperationalState(
							restaurant_info.id,
							JSON.parse(localStorage.getItem("userSetAddress")).lat,
							JSON.parse(localStorage.getItem("userSetAddress")).lng
						)
					);
				}
			} else {
				this.setState({
					is_operational: true,
					is_operational_loading: false,
				});
			}

			console.log("Distance -> ", this.state.distance);
		}
	};

	__processRestaurantOperationalState = (id, lat, lng) => {
		this.props.getRestaurantInfoAndOperationalStatus(id, lat, lng).then((response) => {
			if (response) {
				if (response.payload.is_operational) {
					this.setState({
						is_operational: true,
						is_operational_loading: false,
					});
				} else {
					this.setState({
						is_operational: false,
						is_operational_loading: false,
					});
				}
			}
		});
	};

	__isRestaurantActive = (restaurant_info) => {
		if (restaurant_info.is_active) {
			this.setState({
				is_active: true,
			});
		}
	};

	__checkMinOrderSatisfied = (restaurant_info, cartTotal) => {
		if (restaurant_info.min_order_price > 0) {
			//if not null, then check the min order price with the order total
			const totalPrice = parseFloat(formatPrice(cartTotal.totalPrice));
			const minOrderPrice = parseFloat(formatPrice(restaurant_info.min_order_price));
			if (totalPrice >= minOrderPrice) {
				// console.log("Order Can Be Placed", totalPrice + " -- " + minOrderPrice);
				this.setState({ min_order_satisfied: true });
			} else {
				// console.log("Order CANNOT Be Placed", totalPrice + " -- " + minOrderPrice);
				this.setState({ min_order_satisfied: false });
			}
		} else {
			// if null, then set to satisfied to true...
			// console.log("Min order price is not set");
			this.setState({ min_order_satisfied: true });
		}
	};

	checkForItemsAvailability = () => {
		const { checkCartItemsAvailability, cartProducts, addProduct, updateCart } = this.props;
		this.handleProcessCartLoading(true);
		checkCartItemsAvailability(cartProducts).then((response) => {
			this.handleProcessCartLoading(false);
			this.setState({ process_cart_loading: false });
			if (response && response.length) {
				let isSomeInactive = false;
				response.map((arrItem) => {
					//find the item in the cart
					let item = cartProducts.find((item) => item.id === arrItem.id);

					//get new price and is_active status and set it.
					item.is_active = arrItem.is_active;
					item.price = arrItem.price;
					addProduct(item);

					if (!isSomeInactive) {
						if (!arrItem.is_active) {
							isSomeInactive = true;
						}
					}
					return item;
				});
				if (isSomeInactive) {
					this.handleItemsAvailability(false);
				} else {
					this.handleItemsAvailability(true);
				}
			}
			updateCart(this.props.cartProducts);
		});
	};

	handleProcessCartLoading = (value) => {
		this.setState({ process_cart_loading: value });
	};

	handleItemsAvailability = (value) => {
		this.setState({ is_all_items_available: value });
	};

	showOtherText = (type) => {
		localStorage.setItem("cart_tips", JSON.stringify({ type: type, value: 0 }));
		this.setState({
			others: type === "total",
			percentage: type === "percentage",
			selectedTips: { type: type, value: 0 },
		});
	};
	addTip = (type, value) => {
		localStorage.setItem("cart_tips", JSON.stringify({ type: type, value: value }));
		//localStorage.setItem("cart_tips", JSON.stringify({ type : value});
		this.setState({ others: false, percentage: false, selectedTips: { type: type, value: value } });
	};
	addTipInPercentage = (type, value) => {
		let calculatedValue = (this.props.cartTotal.totalPrice * value) / 100;
		localStorage.setItem("cart_tips", JSON.stringify({ type: type, value: calculatedValue }));
		//localStorage.setItem("cart_tips", JSON.stringify({ type : value});
		this.setState({ others: false, percentage: false, selectedTips: { type: type, value: calculatedValue } });
	};
	// onInputchange = (event) => {
	// 	this.setState({
	// 		[event.target.name]: event.target.value,
	// 		selectedTips: { type: event.target.name, value: event.target.value },
	// 	});
	// 	// localStorage.setItem("orderComment", event.target.value);
	// };
	restrictAlphabates = (e) => {
		const re = /^[0-9\b]+$/;
		// let value = e.target.value;
		let { value, min, max } = e.target;
		value = Math.max(Number(min), Math.min(Number(max), Number(value)));

		if (e.target.value === "" || re.test(e.target.value)) {
			if (e.target.name === "percentageValue" && value !== "") {
				let calculatedValue = (this.props.cartTotal.totalPrice * value) / 100;
				localStorage.setItem("cart_tips", JSON.stringify({ type: "percentage", value: calculatedValue }));
				this.setState({
					[e.target.name]: value,
					selectedTips: { type: e.target.name, value: calculatedValue },
				});
			}
			if (e.target.name === "flatAmount" && value !== "") {
				localStorage.setItem("cart_tips", JSON.stringify({ type: "total", value: value }));
				this.setState({
					[e.target.name]: value,
					selectedTips: { type: e.target.name, value: value },
				});
			}
		}

		this.setState({ value });
	};

	removeTip = () => {
		this.setState({ others: false, percentage: false, selectedTips: { type: "amount", value: 0 } });
		localStorage.removeItem("cart_tips");

		this.setState({ tipsAmountSetting: false, tipsPercentageSetting: false }, () => {
			this.setState({
				tipsAmountSetting: JSON.parse(localStorage.getItem("showTipsAmount").toLowerCase()),
				tipsPercentageSetting: JSON.parse(localStorage.getItem("showTipsPercentage").toLowerCase()),
			});
		});
	};

	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
		//if cart not confirmed, then remove tip
		if (!this.props.confirmCart) {
			localStorage.removeItem("cart_tips");
		}
	}

	render() {
		if (this.state.userBan) {
			return <UserBan />;
		}
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (!this.props.cartProducts.length) {
			document.getElementsByTagName("body")[0].classList.remove("bg-grey");
		}
		const { cartTotal, cartProducts, restaurant_info, user } = this.props;

		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("cartPageTitle")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>

				{(this.state.loading ||
					this.state.process_distance_calc_loading ||
					this.state.process_cart_loading) && (
					<div className="height-100 overlay-loading ongoing-payment-spin">
						<div className="spin-load" />
					</div>
				)}

				{!this.state.loading && (
					<React.Fragment>
						<BackWithSearch
							boxshadow={true}
							has_title={true}
							title={localStorage.getItem("cartPageTitle")}
							disable_search={true}
							homeButton={true}
						/>
						{cartProducts.length ? (
							<React.Fragment>
								{localStorage.getItem("customCartMessage") !== "<p><br></p>" &&
									localStorage.getItem("customCartMessage") !== "null" &&
									(localStorage.getItem("customCartMessage") !== "" && (
										<div
											style={{
												position: "relative",
												paddingTop: "4rem",
												marginBottom: "-3rem",
											}}
											dangerouslySetInnerHTML={{
												__html: localStorage.getItem("customCartMessage"),
											}}
										/>
									))}

								<RestaurantInfoCart restaurant={restaurant_info} />

								{user.success &&
									parseInt(restaurant_info.is_schedulable) === 1 &&
									parseInt(restaurant_info.accept_scheduled_orders) === 1 &&
									localStorage.getItem("enableOrderSchedulingOnCustomer") === "true" &&
									restaurant_info.schedule_data !== null &&
									this.state.is_active && <OrderScheduling restaurant={restaurant_info} />}

								<div className="p-15">
									<div
										className="block-content block-content-full bg-white pt-10 pb-5"
										style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}
									>
										<h2 className="item-text mb-10">
											{localStorage.getItem("cartItemsInCartText")}
										</h2>
										{cartProducts.map((item, index) => (
											<CartItems
												item={item}
												addProductQuantity={this.addProductQuantity}
												removeProductQuantity={this.removeProductQuantity}
												removeProduct={this.removeProduct}
												key={item.name + item.id + index}
											/>
										))}
									</div>
									<OrderComment />
								</div>
								{this.props.restaurant_info.delivery_time_slot ?		
									<div>		
										<ExpressDelivery deliveryDates={this.state.deliveryDates} />		
									</div> : null}
								{(this.state.tipsAmountSetting || this.state.tipsPercentageSetting) && (
									<div className="mx-15 mb-15 tips-block">
										{this.state.tips && this.state.is_tips_show === false && (
											<div className="block-content block-content-full bg-white pt-10 pb-5">
												<div
													className={
														!this.state.tipsAmountSetting &&
														!this.state.tipsPercentageSetting
															? "d-none"
															: "d-show"
													}
												>
													<p className="item-text mb-10">
														<strong>{localStorage.getItem("tipsForDeliveryText")}</strong>
													</p>
													<p> {localStorage.getItem("tipsThanksText")}.</p>
												</div>
												{this.state.tipsAmountSetting && (
													<div className="tip-switch-field">
														{this.state.tips.map((tipAmount, index) => (
															<div key={index} className="tips">
																<input
																	type="radio"
																	value={tipAmount}
																	id={index}
																	name="switch-two"
																	onClick={() => this.addTip("amount", tipAmount)}
																/>
																<label
																	htmlFor={index}
																	className={` ${index > 0 && "ml-5"}`}
																>
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}
																	{tipAmount}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</label>
															</div>
														))}
														<div className="tips">
															<input
																type="radio"
																value="other"
																id="others"
																name="switch-two"
																onClick={(event) => this.showOtherText("total")}
															/>
															<label htmlFor="others" className="ml-5">
																{localStorage.getItem("tipsOtherText")}
															</label>
														</div>
													</div>
												)}
												{this.state.others && (
													<input
														className="form-control custom-tip-input mb-15"
														name="flatAmount"
														type="text"
														placeholder={localStorage.getItem(
															"cartTipAmountPlaceholderText"
														)}
														value={this.state.flatAmount || ""}
														onChange={this.restrictAlphabates}
														onKeyPress={this.restrictAlphabates}
														min="0"
														max="10000"
													/>
												)}
												{this.state.tipsPercentageSetting && (
													<div className="tip-switch-field">
														{this.state.tips_percentage.map((tipPercentage, index) => (
															<div key={index} className="tips_percentage">
																<input
																	type="radio"
																	value={tipPercentage}
																	id={`${index}_tips_percentage`}
																	name="switch-two"
																	onClick={() =>
																		this.addTipInPercentage("amount", tipPercentage)
																	}
																/>
																<label
																	htmlFor={`${index}_tips_percentage`}
																	className={` ${index > 0 && "ml-5"}`}
																>
																	{" "}
																	{tipPercentage}%
																</label>
															</div>
														))}
														<div className="tips">
															<input
																type="radio"
																value="percentage"
																id="percentage"
																name="switch-two"
																onClick={() => this.showOtherText("percentage")}
															/>
															<label htmlFor="percentage" className="ml-5">
																{localStorage.getItem("tipsOtherText")}
															</label>
														</div>
													</div>
												)}
												{this.state.percentage && (
													<input
														className="form-control custom-tip-input mb-15"
														name="percentageValue"
														type="text"
														placeholder={localStorage.getItem(
															"cartTipPercentagePlaceholderText"
														)}
														value={this.state.percentageValue || ""}
														onChange={this.restrictAlphabates}
														onKeyPress={this.restrictAlphabates}
														min="0"
														max="100"
													/>
												)}
											</div>
										)}
									</div>
								)}

								<div>
									<Coupon subtotal={this.props.cartTotal.totalPrice} />
									{this.state.alreadyRunningOrders && (
										<div className="px-15">
											<div className="auth-error ongoing-order-notify">
												<DelayLink to="/my-orders" delay={250} className="ml-2">
													{localStorage.getItem("ongoingOrderMsg")}{" "}
													<i
														className="si si-arrow-right ml-1"
														style={{
															fontSize: "0.7rem",
														}}
													/>
													<Ink duration="500" />
												</DelayLink>
											</div>
										</div>
									)}
								</div>

								{Object.keys(this.props.restaurant_info).length > 0 && (
									<div>
										<BillDetails
											total={cartTotal.totalPrice}
											distance={this.state.distance}
											alreadyRunningOrders={this.state.alreadyRunningOrders}
											tips={this.state.selectedTips}
											removeTip={this.removeTip}
											deliveryCharges={this.state.deliveryCharges}
										/>
									</div>
								)}

								{this.state.is_operational_loading ? (
									<Loading />
								) : (
									<React.Fragment>
										{this.state.is_active ? (
											<React.Fragment>
												{this.state.min_order_satisfied ? (
													<React.Fragment>
														{this.state.is_all_items_available && (
															<CartCheckoutBlock
																restaurant_id={this.props.restaurant_info.id}
																cart_page={this.context.router.route.location.pathname}
																is_operational_loading={
																	this.state.is_operational_loading
																}
																is_operational={this.state.is_operational}
																handleProcessCartLoading={this.handleProcessCartLoading}
																checkForItemsAvailability={
																	this.checkForItemsAvailability
																}
																handleItemsAvailability={this.handleItemsAvailability}
															/>
														)}
													</React.Fragment>
												) : (
													<div className="auth-error no-click">
														<div className="error-shake">
															{localStorage.getItem("restaurantMinOrderMessage")}{" "}
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}
															{this.props.restaurant_info.min_order_price}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</div>
													</div>
												)}
											</React.Fragment>
										) : (
											<div className="auth-error no-click">
												<div className="error-shake">
													{this.props.restaurant_info && this.props.restaurant_info.name} :{" "}
													{localStorage.getItem("notAcceptingOrdersMsg")}
												</div>
											</div>
										)}
									</React.Fragment>
								)}
							</React.Fragment>
						) : (
							<div className="bg-white cart-empty-block">
								<Swing>
									<div className="d-flex justify-content-center">
										<img
											className="cart-empty-img"
											src="/assets/img/various/cart-empty.png"
											alt={localStorage.getItem("cartEmptyText")}
										/>
									</div>
								</Swing>
								<h2 className="cart-empty-text mt-50 text-center">
									{localStorage.getItem("cartEmptyText")}
								</h2>
								{this.state.alreadyRunningOrders && (
									<div
										className="auth-error ongoing-order-notify"
										style={{
											position: "fixed",
											bottom: "4.5rem",
										}}
									>
										<DelayLink to="/my-orders" delay={250} className="ml-2">
											{localStorage.getItem("ongoingOrderMsg")}{" "}
											<i className="si si-arrow-right ml-1" style={{ fontSize: "0.7rem" }} />
											<Ink duration="500" />
										</DelayLink>
									</div>
								)}

								<Footer active_cart={true} />
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
	cartTotal: state.total.data,
	user: state.user.user,
	running_order: state.user.running_order,
	restaurant: state.restaurant,
	coupon: state.coupon.coupon,
	force_reload: state.helper.force_reload,
	tips: state.tips,
	tips_percentage: state.tips_percentage,
	confirmCart: state.confirmCart.confirmCart,
	deliveryCharges: state.delivery_datetime.deliveryCharges,		
	delivery_datetime: state.delivery_datetime.delivery_datetime,		
	timeslotAvailability:state.delivery_datetime.timeslotAvailability,
});

export default GoogleApiWrapper({
	apiKey: localStorage.getItem("googleApiKey"),
	LoadingContainer: Loading,
})(
	connect(
		mapStateToProps,
		{
			checkUserRunningOrder,
			updateCart,
			getRestaurantInfoById,
			updateUserInfo,
			addProduct,
			checkCartItemsAvailability,
			checkBan,
			getRestaurantInfoAndOperationalStatus,
			removeCoupon,
		}
	)(Cart)
);
