import React, { Component } from "react";
import { loadCart, removeProduct } from "../../../services/cart/actions";

import DelayLink from "../../helpers/delayLink";
import Ink from "react-ink";
import { connect } from "react-redux";
import { formatPrice } from "../../helpers/formatPrice";
import { updateCart } from "../../../services/total/actions";
import Dialog from "@material-ui/core/Dialog";
import { removeCoupon } from "../../../services/coupon/actions";

class Cart extends Component {
	state = {
		isOpen: false,
		removeProductFromPreviousRestaurant: false,
		open: false,
		product: [],
	};
	componentDidMount() {
		const { cartProducts } = this.props;
		if (cartProducts.length) {
			this.setState({ isOpen: true });
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.newProduct !== this.props.newProduct) {
			this.addProduct(nextProps.newProduct);
		}

		if (nextProps.productToRemove !== this.props.productToRemove) {
			this.removeProduct(nextProps.productToRemove);
		}
	}

	openFloatCart = () => {
		this.setState({ isOpen: true });
	};

	closeFloatCart = () => {
		this.setState({ isOpen: false });
	};

	handlePopup = () => {
		this.setState({ open: !this.state.open });
	};

	addProduct = (product) => {
		const { cartProducts, updateCart } = this.props;
		//get restaurant id and save to localStorage as active restaurant

		localStorage.setItem("cleared", "false");
		let productAlreadyInCart = false;
		let differentRestaurant = false;
		let cartUpdateflag = true;
		cartProducts.forEach((cp) => {
			if (cartUpdateflag) {
				if (product.restaurant_id === cp.restaurant_id) {
					localStorage.setItem("activeRestaurant", product.restaurant_id);
				}
				// first check if the restaurent id matches with items in cart
				// if restaurant id doesn't match, then remove all products from cart
				// then continue to add the new product to cart
				if (cp.restaurant_id === product.restaurant_id) {
					// then add the item to cart or increment count
					if (cp.id === product.id) {
						//check if product has customizations, and if the customization matches with any
						if (JSON.stringify(cp.selectedaddons) === JSON.stringify(product.selectedaddons)) {
							// increment the item quantity by 1
							cp.quantity += 1;
							productAlreadyInCart = true;
							differentRestaurant = false;
							this.setUserSelected();
						}
					}
				} else {
					// else if restaurant id doesn't match, then remove all products from cart
					this.setState({ removeProductFromPreviousRestaurant: true, open: true });

					differentRestaurant = true;
					cartUpdateflag = false;

					this.setState({ product: product });
					// setTimeout(() => {
					// 	this.setState({ removeProductFromPreviousRestaurant: false });
					// }, 4 * 1000);

					// cartProducts.splice(0, cartProducts.length);
				}
			}
		});

		if (!productAlreadyInCart && !differentRestaurant) {
			localStorage.setItem("activeRestaurant", product.restaurant_id);
			cartProducts.push(product);
		}

		if (cartUpdateflag) {
			updateCart(cartProducts);
		}
		this.openFloatCart();
	};

	setUserSelected = () => {
		// console.log("Delivery Type: " + this.props.restaurant_info.delivery_type);
		localStorage.getItem("userPreferredSelection") === "DELIVERY" &&
			this.props.restaurant_info.delivery_type === 1 &&
			localStorage.setItem("userSelected", "DELIVERY");
		localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
			this.props.restaurant_info.delivery_type === 2 &&
			localStorage.setItem("userSelected", "SELFPICKUP");
		localStorage.getItem("userPreferredSelection") === "DELIVERY" &&
			this.props.restaurant_info.delivery_type === 3 &&
			localStorage.setItem("userSelected", "DELIVERY");
		localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
			this.props.restaurant_info.delivery_type === 3 &&
			localStorage.setItem("userSelected", "SELFPICKUP");
	};

	removeProduct = (product) => {
		const { cartProducts, updateCart } = this.props;

		const index = cartProducts.findIndex((p) => p.id === product.id);

		//if product is in the cart then index will be greater than 0
		if (index >= 0) {
			cartProducts.forEach((cp) => {
				if (cp.id === product.id) {
					if (cp.quantity === 1) {
						//if quantity is 1 then remove product from cart
						cartProducts.splice(index, 1);
					} else {
						//else decrement the quantity by 1
						cp.quantity -= product.quantity;
					}
				}
			});

			updateCart(cartProducts);
			if (cartProducts.length < 1) {
				this.closeFloatCart();
				localStorage.removeItem("activeRestaurant");
			}
		}
	};

	getTotalItemsInCart = () => {
		if (localStorage.getItem("countQuantityAsTotalItemsOnCart") === "true") {
			let total = 0;
			this.props.cartProducts.forEach((item) => {
				total += item.quantity;
			});
			return total;
		} else {
			return this.props.cartTotal.productQuantity;
		}
	};

	clearCart = () => {
		const { cartProducts, updateCart, removeCoupon } = this.props;
		cartProducts.splice(0, cartProducts.length);
		this.closeFloatCart();
		removeCoupon();
		setTimeout(() => {
			updateCart(cartProducts);
		}, 500);
		this.addProduct(this.state.product);
		this.openFloatCart();
		this.setState({ open: !this.state.open, product: [] });
		localStorage.setItem("cleared", "true");
		this.setUserSelected();
	};

	render() {
		const { cartTotal, cartProducts } = this.props;

		let classes = ["float-cart"];

		if (!!this.state.isOpen) {
			classes.push("float-cart--open");
		}

		return (
			<React.Fragment>
				{this.state.removeProductFromPreviousRestaurant && (
					<React.Fragment>
						<Dialog
							fullWidth={true}
							fullScreen={false}
							open={this.state.open}
							onClose={this.state.handlePopup}
							style={{ width: "100%", margin: "auto" }}
							PaperProps={{ style: { backgroundColor: "#fff", borderRadius: "4px" } }}
						>
							<div className="container" style={{ borderRadius: "5px", height: "200px" }}>
								<React.Fragment>
									<div className="px-10 col-12 py-3 d-flex justify-content-between align-items-center">
										<h1 className="mt-2 mb-0 font-weight-black h4">
											{localStorage.getItem("cartReplaceItemTitle")}
										</h1>
									</div>
									<div className="px-10 mb-20">{localStorage.getItem("cartReplaceItemSubTitle")}</div>
									<div className="d-flex justify-content-center">
										<div className="text-center mr-4">
											<button
												className="btn clear-cart-btn"
												onClick={this.handlePopup}
												style={{ borderColor: localStorage.getItem("storeColor") }}
											>
												{localStorage.getItem("cartReplaceItemActionNo")}
											</button>
										</div>

										<div className="text-center">
											<button
												className="btn clear-cart-btn text-white"
												onClick={this.clearCart}
												style={{
													backgroundColor: localStorage.getItem("storeColor"),
													borderColor: localStorage.getItem("storeColor"),
												}}
											>
												{localStorage.getItem("cartReplaceItemActionYes")}
											</button>
										</div>
									</div>
								</React.Fragment>
							</div>
						</Dialog>
					</React.Fragment>
					// <Fade duration={250} bottom>
					// 	<div className="auth-error going-different-restaurant-notify">
					// 		<div className="">{localStorage.getItem("itemsRemovedMsg")}</div>
					// 	</div>
					// </Fade>
				)}

				<div
					className={classes.join(" ")}
					style={{
						backgroundColor: localStorage.getItem("cartColorBg"),
						color: localStorage.getItem("cartColorText"),
					}}
				>
					{cartProducts.length ? (
						<DelayLink to={"/cart"} delay={200} className="text-white">
							<span>
								{this.getTotalItemsInCart()} {localStorage.getItem("floatCartItemsText")}
							</span>
							<span className="pl-5 pr-5">&nbsp;|&nbsp;</span>
							<span>
								{localStorage.getItem("currencySymbolAlign") === "left" &&
									localStorage.getItem("currencyFormat")}
								{formatPrice(cartTotal.totalPrice)}
								{localStorage.getItem("currencySymbolAlign") === "right" &&
									localStorage.getItem("currencyFormat")}
							</span>
							{/* <span>{`${localStorage.getItem("currencyFormat")} ${formatPrice(cartTotal.totalPrice)}`}</span> */}
							<span className="pull-right">
								{localStorage.getItem("floatCartViewCartText")} <i className="si si-basket" />
							</span>
							<Ink duration="500" />
						</DelayLink>
					) : (
						<span>&nbsp;</span>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
	newProduct: state.cart.productToAdd,
	productToRemove: state.cart.productToRemove,
	cartTotal: state.total.data,
	restaurant_info: state.items.restaurant_info,
});

export default connect(
	mapStateToProps,
	{ loadCart, updateCart, removeProduct, removeCoupon }
)(Cart);
