import React, { Component } from "react";

import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSettings } from "../../../services/settings/actions";
import { loginDeliveryUser } from "../../../services/Delivery/user/actions";
import { getAllLanguages } from "../../../services/languages/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";
import Loading from "../../helpers/loading";
import LightSpeed from "react-reveal/LightSpeed";

class Login extends Component {
	state = {
		loading: false,
		email: "",
		password: "",
		error: false,
	};
	static contextTypes = {
		router: () => null,
	};
	componentDidMount() {
		this.props.getSettings();

		// setTimeout(() => {
		// 	this.setState({ error: false });
		// }, 380);

		this.props.getAllLanguages();

		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
		document.getElementsByTagName("body")[0].classList.add("delivery-dark-bg");
	}

	handleOnChange = (event) => {
		// console.log(event.target.value);
		this.props.getSingleLanguageData(event.target.value);
		localStorage.setItem("userPreferedLanguage", event.target.value);
	};

	handleInputEmail = (event) => {
		this.setState({ email: event.target.value.trim() });
	};
	handleInputPassword = (event) => {
		this.setState({ password: event.target.value });
	};

	handleLogin = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		this.props.loginDeliveryUser(this.state.email, this.state.password);
	};

	componentWillReceiveProps(nextProps) {
		const { delivery_user } = this.props;
		if (delivery_user !== nextProps.delivery_user) {
			this.setState({ loading: false });
			if (nextProps.delivery_user.success === false) {
				this.setState({ error: true });
			}
		}

		if (nextProps.delivery_user.success) {
			if (navigator.userAgent === "frutriAndroidWebViewUA") {
				if (window.Android !== "undefined") {
					window.Android.registerFcm(
						nextProps.delivery_user.data.auth_token,
						nextProps.delivery_user.data.id
					);
				}
			}
		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					// console.log("NEXT", nextProps.languages);
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const { delivery_user } = this.props;
		if (delivery_user.success) {
			return <Redirect to={"/delivery"} />;
		}

		return (
			<React.Fragment>
				<Meta
					seotitle="Login"
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("emailPassDonotMatch")}</div>
					</div>
				)}
				{this.state.loading && <Loading />}

				<div className="mt-50 mb-50">
					<div className="text-center clipped-delivery-login-header">
						<img
							src="/assets/img/logos/logo.png"
							alt={localStorage.getItem("storeName")}
							width="120"
							className="delivery-login-logo"
						/>
						<LightSpeed left duration={1000}>
							<img
								src="/assets/img/various/delivery-bike.svg"
								alt={this.props.title}
								className="delivery-bike-img"
							/>
						</LightSpeed>
					</div>

					<div className="delivery-login-texts px-15 mt-50 pb-10 text-center">
						<span className="delivery-login-title">{localStorage.getItem("loginLoginTitle")}</span>
						<br />
						<span className="delivery-login-subtitle">{localStorage.getItem("loginLoginSubTitle")}</span>
					</div>

					<div className="height-70 delivery-dark-bg">
						<form onSubmit={this.handleLogin}>
							<div className="form-group px-15 pt-30">
								<label className="col-12 edit-address-input-label">
									{localStorage.getItem("loginLoginEmailLabel")}
								</label>
								<div className="col-md-9 pb-5">
									<input
										type="text"
										name="email"
										onChange={this.handleInputEmail}
										className="form-control delivery-login-input"
									/>
								</div>
								<label className="col-12 edit-address-input-label">
									{localStorage.getItem("loginLoginPasswordLabel")}
								</label>
								<div className="col-md-9">
									<input
										type="password"
										name="password"
										onChange={this.handleInputPassword}
										className="form-control delivery-login-input"
									/>
								</div>
							</div>
							<div className="mt-20 px-30 button-block">
								<button
									type="submit"
									className="btn delivery-login-button"
									style={{ backgroundColor: localStorage.getItem("storeColor") }}
								>
									{localStorage.getItem("loginLoginTitle")}
								</button>
							</div>
						</form>

						{this.props.languages && this.props.languages.length > 1 && (
							<div className="mt-100 d-flex align-items-center justify-content-center">
								<div className="mr-2 edit-address-input-label">
									{localStorage.getItem("changeLanguageText")}
								</div>
								<select
									onChange={this.handleOnChange}
									defaultValue={
										localStorage.getItem("userPreferedLanguage")
											? localStorage.getItem("userPreferedLanguage")
											: this.props.languages.filter((lang) => lang.is_default === 1)[0].id
									}
									className="form-control delivery-language-select"
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
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	languages: state.languages.languages,
	language: state.languages.language,
});

export default connect(
	mapStateToProps,
	{ loginDeliveryUser, getSettings, getAllLanguages, getSingleLanguageData }
)(Login);
