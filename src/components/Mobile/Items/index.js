import React, { Component } from "react";
import {
	getRestaurantInfo,
	getRestaurantItems,
	getRestaurantInfoForLoggedInUser,
	resetInfo,
} from "../../../services/items/actions";

import FloatCart from "../FloatCart";
import ItemList from "./ItemList";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import RestaurantInfo from "./RestaurantInfo";
import { connect } from "react-redux";
import Ink from "react-ink";
import Fade from "react-reveal/Fade";
import Flip from "react-reveal/Flip";

import { getSettings } from "../../../services/settings/actions";

import { getAllLanguages, getSingleLanguageData } from "../../../services/languages/actions";

class Items extends Component {
	static contextTypes = {
		router: () => null,
	};
	state = {
		is_active: 1,
		loading: true,
		menuListOpen: false,
		menuClicked: false,
	};
	componentDidMount() {
		this.props.getSettings();
		this.props.getAllLanguages();

		//if currentLocation doesnt exists in localstorage then redirect the user to firstscreen
		//else make API calls
		const { user } = this.props;
		let info = user.success
			? this.props.getRestaurantInfoForLoggedInUser(this.props.restaurant)
			: this.props.getRestaurantInfo(this.props.restaurant);
		if (info) {
			info.then((response) => {
				if (response) {
					if (response.payload.id) {
						//get items
						this.props.getRestaurantItems(this.props.restaurant);
					} else {
						//404, redirect to homepage
						this.context.router.history.push("/");
					}

					if (response.payload.delivery_type === 1) {
						localStorage.setItem("userSelected", "DELIVERY");
					}
					if (response.payload.delivery_type === 2) {
						localStorage.setItem("userSelected", "SELFPICKUP");
					}
					if (
						response.payload.delivery_type === 3 &&
						localStorage.getItem("userPreferredSelection") === "DELIVERY"
					) {
						// localStorage.setItem("userSelected", "DELIVERY");
					}
					if (
						response.payload.delivery_type === 3 &&
						localStorage.getItem("userPreferredSelection") === "SELFPICKUP"
					) {
						// localStorage.setItem("userSelected", "SELFPICKUP");
					}
					if (response.payload.is_active === "undefined") {
						this.setState({ loading: true });
					}
					if (response.payload.is_active === 1 || response.payload.is_active === 0) {
						this.setState({ loading: false });
						this.setState({ is_active: response.payload.is_active });
					}
				}
			});
		}

		if (localStorage.getItem("userSelected") === null) {
			localStorage.setItem("userSelected", "DELIVERY");
		}
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillReceiveProps(nextProps) {
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

	handleMenuOpen = () => {
		this.setState({ menuListOpen: true });
		document.getElementsByTagName("html")[0].classList.add("noscroll");
		document.getElementsByTagName("body")[0].classList.add("noscroll");
	};

	handleClickOutside = (event) => {
		if (this.refs.menuItemBlock && !this.refs.menuItemBlock.contains(event.target)) {
			document.getElementsByTagName("html")[0].classList.remove("noscroll");
			document.getElementsByTagName("body")[0].classList.remove("noscroll");
			this.setState({ menuListOpen: false });
		}
	};

	//when menu-item clicked, go to that division and change menuListOpen =false
	handleMenuItemClick = (event) => {
		this.setState({ menuClicked: true });
		// console.log(event.currentTarget.dataset.name);
		const categoryBlock = document.getElementById(event.currentTarget.dataset.name);

		setTimeout(
			() => {
				categoryBlock.scrollIntoView();
				window.scrollBy(0, -40);
				this.setState({ menuListOpen: false });
				document.getElementsByTagName("html")[0].classList.remove("noscroll");
				document.getElementsByTagName("body")[0].classList.remove("noscroll");
			},
			this.state.menuClicked ? 0 : 500
		);
	};

	componentWillUnmount() {
		this.props.resetInfo();
		document.removeEventListener("mousedown", this.handleClickOutside);
		document.getElementsByTagName("html")[0].classList.remove("page-inactive");
		document.getElementsByTagName("html")[0].classList.remove("noscroll");
		document.getElementsByTagName("body")[0].classList.remove("noscroll");
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}

		// if (localStorage.getItem("storeColor") === null) {
		// 	return <Redirect to={"/"} />;
		// }

		return (
			<React.Fragment>
				<Meta
					seotitle={`${this.props.restaurant_info.name} | ${localStorage.getItem("seoMetaTitle")}`}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={`${this.props.restaurant_info.name} | ${localStorage.getItem("seoOgTitle")}`}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={`${this.props.restaurant_info.name} | ${localStorage.getItem("seoTwitterTitle")}`}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				<div key={this.props.restaurant}>
					<RestaurantInfo
						history={this.props.history}
						restaurant={this.props.restaurant_info}
						withLinkToRestaurant={false}
					/>
					<ItemList
						data={this.props.restaurant_items}
						restaurant={this.props.restaurant_info}
						menuClicked={this.state.menuClicked}
						shouldItemsListUpdate={localStorage.getItem("cleared")}
						restaurant_backup_items={this.props.restaurant_backup_items}
					/>
				</div>
				{this.props.restaurant_info.certificate && (
					<div className="mb-100 text-center certificate-code">
						{localStorage.getItem("certificateCodeText")} {this.props.restaurant_info.certificate}
					</div>
				)}
				<div>
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
				</div>

				<div className="menu-list-container">
					{this.state.menuListOpen ? (
						<React.Fragment>
							<div className="menu-open-backdrop" />
							<div className="menu-items-block" ref="menuItemBlock">
								<div className="menu-item-block-inner">
									{this.props.restaurant_items.items && (
										<React.Fragment>
											{Object.keys(this.props.restaurant_items.items).map((category, index) => (
												<div
													className="menu-item-block-single"
													key={category}
													onClick={this.handleMenuItemClick}
													data-name={category + index}
												>
													<Fade bottom duration={150 * index}>
														<div className="menu-item-block-single-name">{category}</div>
														<div className="menu-item-block-single-quantity">
															{
																Object.keys(this.props.restaurant_items.items[category])
																	.length
															}
														</div>
													</Fade>
												</div>
											))}
										</React.Fragment>
									)}
								</div>
							</div>
						</React.Fragment>
					) : (
						<div
							className="menu-button-block-main"
							onClick={this.handleMenuOpen}
							style={{ bottom: this.props.cartTotal.productQuantity > 0 ? "5rem" : "2rem" }}
						>
							<Flip bottom>
								<button
									className="btn btn-menu-list"
									style={{ backgroundColor: localStorage.getItem("storeColor") }}
								>
									<i className="si si-list mr-1" /> {localStorage.getItem("itemsMenuButtonText")}
									<Ink duration="500" hasTouch={false} />
								</button>
							</Flip>
						</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	restaurant_info: state.items.restaurant_info,
	restaurant_items: state.items.restaurant_items,
	cartTotal: state.total.data,
	settings: state.settings.settings,
	languages: state.languages.languages,
	language: state.languages.language,
	user: state.user.user,
	restaurant_backup_items: state.items.restaurant_backup_items,
});

export default connect(
	mapStateToProps,
	{
		getRestaurantInfo,
		getRestaurantItems,
		getSettings,
		getAllLanguages,
		getSingleLanguageData,
		getRestaurantInfoForLoggedInUser,
		resetInfo,
	}
)(Items);
