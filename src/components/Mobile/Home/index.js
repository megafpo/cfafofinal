import * as firebase from "firebase/app";

import React, { Component } from "react";

import Footer from "../Footer";
import Meta from "../../helpers/meta";
import Nav from "../Nav";
import PromoSlider from "./PromoSlider";
import { Redirect } from "react-router";
import RestaurantList from "./RestaurantList";
import { connect } from "react-redux";
import { getPromoSlides } from "../../../services/promoSlider/actions";

import messaging from "../../../init-fcm";
import { saveNotificationToken } from "../../../services/notification/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";
import { getUserNotifications } from "../../../services/alert/actions";
import { resetInfo, resetItems, resetBackup } from "../../../services/items/actions";
import CategoryList from "./CategoryList";
import { Link } from "react-router-dom";

import Dialog from "@material-ui/core/Dialog";
import GpsSelector from "../Location/PopularPlaces/GpsSelector";
import Ink from "react-ink";

class Home extends Component {
	static contextTypes = {
		router: () => null,
	};

	state = {
		open: false,
	};

	async componentDidMount() {
		this.props.resetItems();
		this.props.resetInfo();
		this.props.resetBackup();

		const { user } = this.props;

		const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));

		this.props.getPromoSlides(userSetAddress.lat, userSetAddress.lng);

		if (user.success) {
			this.props.getUserNotifications(user.data.id, user.data.auth_token);
		}

		if (user.success) {
			if (localStorage.getItem("enablePushNotification") === "true") {
				if (firebase.messaging.isSupported()) {
					let handler = this.props.saveNotificationToken;
					messaging
						.requestPermission()
						.then(async function() {
							const push_token = await messaging.getToken();
							handler(push_token, user.data.id, user.data.auth_token);
						})
						.catch(function(err) {
							console.log("Unable to get permission to notify.", err);
						});
				}
			}
		}

		const userAlreadySelected = !JSON.parse(localStorage.getItem("userSetAddress")).hasOwnProperty(
			"businessLocation"
		);

		if (localStorage.getItem("userAlreadySelectedLocation") === null) {
			if (userAlreadySelected) {
				this.setState({ open: false });
			} else {
				this.setState({ open: true });
			}
		}
	}

	componentWillReceiveProps(nextProps) {
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

	handlePopularLocationClick = (location) => {
		const userSetAddress = {
			lat: location.latitude,
			lng: location.longitude,
			address: location.name,
			house: null,
			tag: null,
			businessLocation: true,
		};
		localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));

		const saveUserSetAddress = new Promise((resolve) => {
			localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
			localStorage.setItem("userAlreadySelectedLocation", "true");
			resolve("Location Saved");
		});
		saveUserSetAddress.then(() => {
			window.location.reload();
		});
	};

	componentWillUnmount() {
		// navigator.serviceWorker.removeEventListener("message", message => console.log(message));
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}

		const { history, user, promo_slides, popular_locations } = this.props;

		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("seoMetaTitle")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>

				<div className="height-100-percent bg-white mb-50">
					<Nav
						logo={true}
						active_nearme={true}
						disable_back_button={true}
						history={history}
						loggedin={user.success}
					/>

					{/* Passing slides as props to PromoSlider */}
					{localStorage.getItem("showPromoSlider") === "true" && (
						<React.Fragment>
							{promo_slides && promo_slides.mainSlides && promo_slides.mainSlides.length > 0 && (
								<PromoSlider
									slides={promo_slides.mainSlides}
									size={promo_slides.mainSlides[0]["promo_slider"]["size"]}
								/>
							)}
						</React.Fragment>
					)}

					{localStorage.getItem("mockSearchOnHomepage") === "true" && (
						<Link to="explore">
							<div
								className={`mock-search-block px-15 pb-10 ${
									localStorage.getItem("showPromoSlider") === "false"
										? "pt-15"
										: "" + promo_slides.mainSlides === "null"
										? "pt-15"
										: ""
								}`}
							>
								<div className="px-15 d-flex justify-content-between">
									<div>
										<span>{localStorage.getItem("mockSearchPlaceholder")}</span>
									</div>
									<div>
										<i className="si si-magnifier" />
									</div>
								</div>
							</div>
						</Link>
					)}

					{localStorage.getItem("customHomeMessage") !== "<p></p>" &&
						localStorage.getItem("customHomeMessage") !== "<p><br></p>" &&
						localStorage.getItem("customHomeMessage") !== "null" &&
						(localStorage.getItem("customHomeMessage") !== "" && (
							<div
								style={{
									position: "relative",
									background: "#f8f9fa",
								}}
								dangerouslySetInnerHTML={{
									__html: localStorage.getItem("customHomeMessage"),
								}}
							/>
						))}
					{/* <RestaurantList user={user} slides={promo_slides.otherSlides} /> */}
					<CategoryList user={user} slides={promo_slides.mainSlides}  otherSlides={promo_slides.otherSlides} otherSecondSlides={promo_slides.otherSecondSlides}/>
					<Footer active_nearme={true} />
				</div>

				<Dialog
					maxWidth={false}
					fullWidth={true}
					fullScreen={true}
					open={this.state.open}
					onClose={this.toggleSchedulePopup}
					style={{ margin: "auto", position: "absolute", bottom: "0", top: "60%" }}
					PaperProps={{
						style: {
							backgroundColor: "#fff",
							overflowY: "hidden",
						},
					}}
				>
					<div>
						<GpsSelector fetchGpsAutomaticallyAndroid={true} />
						<div className="p-15 popularLocationPopup">
							{popular_locations && popular_locations.length > 0 && (
								<React.Fragment>
									<h4 className="text-muted h4">{localStorage.getItem("searchPopularPlaces")}</h4>

									<div style={{ overflowY: "scroll", height: "11rem" }}>
										{popular_locations.map((location) => (
											<button
												key={location.id}
												type="button"
												className="btn btn-rounded btn-alt-secondary btn-md mb-15 mr-15"
												style={{
													position: "relative",
													backgroundColor:
														location.is_default && localStorage.getItem("storeColor"),
													color: location.is_default && "#fff",
												}}
												onClick={() => {
													this.handlePopularLocationClick(location);
												}}
											>
												<Ink duration="500" />
												{location.name}
											</button>
										))}
									</div>
								</React.Fragment>
							)}
						</div>
					</div>
				</Dialog>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	promo_slides: state.promo_slides.promo_slides,
	user: state.user.user,
	locations: state.locations.locations,
	languages: state.languages.languages,
	language: state.languages.language,
	popular_locations: state.popular_locations.popular_locations,
});

export default connect(
	mapStateToProps,
	{
		getPromoSlides,
		saveNotificationToken,
		getSingleLanguageData,
		getUserNotifications,
		resetInfo,
		resetItems,
		resetBackup,
	}
)(Home);
