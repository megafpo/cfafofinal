import React, { Component } from "react";

import DelayLink from "../../helpers/delayLink";
import Ink from "react-ink";
import Meta from "../../helpers/meta";
import { NavLink } from "react-router-dom";
import ProgressiveImage from "react-progressive-image";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSettings } from "../../../services/settings/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";

class FirstScreen extends Component {
	state = {
		splashVersion: 1,
	};
	componentDidMount() {
		if (localStorage.getItem("storeColor")) {
			setTimeout(() => {
				this.removeSplashScreen();
			}, 1000);
		}
		let splashVersion = Math.random() * Math.floor(9999999);
		localStorage.setItem("splashVersion", splashVersion);
		this.setState({ splashVersion: splashVersion });
	}

	removeSplashScreen = () => {
		if (document.getElementById("firstScreenSplash")) {
			document.getElementById("firstScreenSplash").remove();
		}
		if (document.getElementById("firstScreenMain")) {
			document.getElementById("firstScreenMain").classList.remove("hidden");
		}
	};

	handleOnChange = (event) => {
		// console.log(event.target.value);
		this.props.getSingleLanguageData(event.target.value);
		localStorage.setItem("userPreferedLanguage", event.target.value);
	};

	componentWillReceiveProps(nextProps) {
		const { settings } = this.props;
		if (settings !== nextProps.settings) {
			//settings received, then hide the splash screen after 2s
			setTimeout(() => {
				this.removeSplashScreen();
			}, 1000);
		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
				// console.log("Called 1");
			} else {
				if (nextProps.languages.length) {
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	render() {
		const { user } = this.props;

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
				<div>
					<div className="col-12 p-0" id="firstScreenSplash">
						<div className="block m-0">
							<div className="block-content p-0">
								<img
									src={`/assets/img/splash/splash.jpg?v=${this.state.splashVersion}`}
									className="img-fluid"
									alt={localStorage.getItem("storeName")}
									style={{
										width: "100%",
									}}
								/>
							</div>
						</div>
					</div>
					<div
						className="col-12 p-0 hidden"
						id="firstScreenMain"
						style={{ height: `${window.innerHeight}px` }}
					>
						<div className="block m-0 ">
							<div className="block-content p-0">
								{localStorage.getItem("firstScreenHeroImage") && (
									<ProgressiveImage
										delay={100}
										src={localStorage.getItem("firstScreenHeroImage")}
										placeholder={localStorage.getItem("firstScreenHeroImageSm")}
									>
										{(src, loading) => (
											<img
												src={src}
												alt={localStorage.getItem("storeName")}
												className="img-fluid"
												style={{
													filter: loading ? "blur(1.2px) brightness(0.9)" : "none",
													width: `${window.innerWidth}px`,
												}}
											/>
										)}
									</ProgressiveImage>
								)}
							</div>
						</div>
						<div className="block m-0">
							<div className="block-content pt-10">
								<h1 className="welcome-heading mt-10">{localStorage.getItem("firstScreenHeading")}</h1>
								<h2 className="welcome-subheading text-center mt-10 mb-10">
									{localStorage.getItem("firstScreenSubHeading")}
								</h2>
								<DelayLink
									to="/search-location"
									delay={200}
									className="btn btn-lg btn-setup-location"
									style={{
										backgroundColor: localStorage.getItem("storeColor"),
										position: "relative",
									}}
								>
									{localStorage.getItem("firstScreenSetupLocation")}
									<Ink duration="500" hasTouch="true" />
								</DelayLink>
								{user.success ? (
									<p className="login-block font-w500 mb-0 firstscreen-loggedin-message-block">
										{localStorage.getItem("firstScreenWelcomeMessage")} {user.data.name}
									</p>
								) : (
									<p className="login-block mb-0 firstscreen-login-link-block">
										{localStorage.getItem("firstScreenLoginText")}{" "}
										<NavLink
											to="/login"
											style={{ color: localStorage.getItem("storeColor") }}
											className="firstscreen-login-link"
										>
											{localStorage.getItem("firstScreenLoginBtn")}
										</NavLink>
									</p>
								)}

								{this.props.languages && this.props.languages.length > 1 && (
									<div className="mt-4 d-flex align-items-center justify-content-center mb-100">
										<div className="mr-2">{localStorage.getItem("changeLanguageText")}</div>
										<select
											onChange={this.handleOnChange}
											defaultValue={
												localStorage.getItem("userPreferedLanguage")
													? localStorage.getItem("userPreferedLanguage")
													: this.props.languages.filter((lang) => lang.is_default === 1)[0].id
											}
											className="form-control language-select"
										>
											{this.props.languages.map((language) => (
												<option value={language.id} key={language.id}>
													{language.language_name}
												</option>
											))}
										</select>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	settings: state.settings.settings,
	user: state.user.user,
	languages: state.languages.languages,
	language: state.languages.language,
});

export default connect(
	mapStateToProps,
	{ getSettings, getSingleLanguageData }
)(FirstScreen);
