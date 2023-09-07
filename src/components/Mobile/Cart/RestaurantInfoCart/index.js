import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import Dialog from "@material-ui/core/Dialog";
import Ink from "react-ink";

import Slide from "react-reveal/Slide";

class RestaurantInfoCart extends Component {
	state = {
		open: false,
		isHomeDelivery: true,
	};

	componentDidMount() {
		if (localStorage.getItem("enSPU") === "false") {
			this.setState({ userPreferredSelectionDelivery: true, isHomeDelivery: true });
		} else {
			if (localStorage.getItem("userSelected") === "DELIVERY") {
				this.setState({ userPreferredSelectionDelivery: true, isHomeDelivery: true });
			}
			if (localStorage.getItem("userSelected") === "SELFPICKUP") {
				this.setState({ userPreferredSelectionSelfPickup: true, isHomeDelivery: false });
			}
		}
	}

	handlePopup = () => {
		this.setState({ open: !this.state.open });
	};

	setDeliveryType = (data) => {
		this.setState(
			{
				isHomeDelivery: data === "delivery" ? true : false,
			},
			() => {
				if (this.state.isHomeDelivery) {
					this.setState({ userPreferredSelectionDelivery: true, userPreferredSelectionSelfPickup: false });
					localStorage.setItem("userPreferredSelection", "DELIVERY");
					localStorage.setItem("userSelected", "DELIVERY");
				} else if (!this.state.isHomeDelivery) {
					this.setState({ userPreferredSelectionSelfPickup: true, userPreferredSelectionDelivery: false });
					localStorage.setItem("userPreferredSelection", "SELFPICKUP");
					localStorage.setItem("userSelected", "SELFPICKUP");
				}

				setTimeout(() => {
					this.setState({ open: !this.state.open });
					window.location.reload();
				}, 500);
			}
		);
	};

	displaySliderForDeliveryType = () => {
		return (
			<div className="d-flex justify-content-center">
				<div
					onClick={() => {
						this.setDeliveryType("delivery");
					}}
					className="position-relative cart-delivery-type-img mr-30"
					style={{
						filter: localStorage.getItem("userSelected") === "DELIVERY" ? "grayscale(0)" : "grayscale(1)",
					}}
				>
					<Slide left duration={350}>
						<img
							src="assets/img/various/home-delivery.png"
							className="img-fluid"
							alt={localStorage.getItem("deliveryTypeDelivery")}
						/>

						<p className="text-center font-weight-bold text-muted mb-0 mt-1">
							{localStorage.getItem("deliveryTypeDelivery")}
						</p>
					</Slide>
					<Ink duration="500" />
				</div>
				<div
					onClick={() => {
						this.setDeliveryType("selfpickup");
					}}
					className="position-relative cart-delivery-type-img"
					style={{
						filter: localStorage.getItem("userSelected") === "SELFPICKUP" ? "grayscale(0)" : "grayscale(1)",
					}}
				>
					<Slide right duration={350}>
						<img
							src="assets/img/various/self-pickup.png"
							className="img-fluid"
							alt={localStorage.getItem("deliveryTypeSelfPickup")}
						/>

						<p className="text-center font-weight-bold text-muted mb-0 mt-1">
							{localStorage.getItem("deliveryTypeSelfPickup")}
						</p>
					</Slide>
					<Ink duration="500" />
				</div>
			</div>
		);
	};

	render() {
		const { restaurant } = this.props;
		return (
			<React.Fragment>
				<div className="bg-white">
					{restaurant.length === 0 ? (
						<ContentLoader
							height={150}
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
							<div className="bg-light pb-10 d-flex store-info-cartpage" style={{ paddingTop: "5rem" }}>
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
										<div className="col-2 p-0 text-left store-rating-block">
											<i
												className="fa fa-star"
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
							</div>
							{localStorage.getItem("enSPU") === "true" && restaurant.delivery_type === 3 && (
								<div className="px-15 py-1 bg-light" style={{ fontSize: "12px" }}>
									<p className="mb-0">
										{localStorage.getItem("cartDeliveryTypeOptionAvailableText")}
									</p>
									<span className="mr-1">
										{localStorage.getItem("cartDeliveryTypeSelectedText")}:{" "}
									</span>
									<span
										className="font-weight-bold mr-1"
										style={{ color: localStorage.getItem("storeColor") }}
									>
										{localStorage.getItem("userSelected") === "DELIVERY"
											? localStorage.getItem("deliveryTypeDelivery")
											: localStorage.getItem("deliveryTypeSelfPickup")}
									</span>
									<span onClick={this.handlePopup}>
										(<u>{localStorage.getItem("cartDeliveryTypeChangeButtonText")}</u>)
									</span>
								</div>
							)}

							<Dialog
								fullWidth={true}
								fullScreen={false}
								open={this.state.open}
								onClose={this.handlePopup}
								style={{ width: "100%", margin: "auto" }}
								PaperProps={{ style: { backgroundColor: "#fff", borderRadius: "4px" } }}
							>
								<div className="container" style={{ borderRadius: "4px", height: "220px" }}>
									<div className="col-12 pt-20 pb-30">
										<h1 className="mt-2 mb-0 font-weight-black h4 mb-30 text-center">
											{localStorage.getItem("cartChooseDeliveryTypeTitle")}
										</h1>
										{this.displaySliderForDeliveryType()}
									</div>
								</div>
							</Dialog>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default RestaurantInfoCart;
