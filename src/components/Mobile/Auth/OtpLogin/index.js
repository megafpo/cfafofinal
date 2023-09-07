import React, { Component } from "react";

import { loginWithOtp, generateOtpForLogin } from "../../../../services/user/actions";

import BackButton from "../../Elements/BackButton";
import { Redirect } from "react-router";
import SimpleReactValidator from "simple-react-validator";
import { connect } from "react-redux";
import { getSingleLanguageData } from "../../../../services/languages/actions";
import Loading from "../../../helpers/loading";
import LightSpeed from "react-reveal/LightSpeed";
import OtpInput from "react-otp-input";

class OtpLogin extends Component {
	constructor() {
		super();
		this.validator = new SimpleReactValidator({
			autoForceUpdate: this,
			messages: {
				required: localStorage.getItem("fieldValidationMsg"),
				email: localStorage.getItem("emailValidationMsg"),
				regex: localStorage.getItem("phoneValidationMsg"),
			},
		});
	}

	state = {
		loading: false,
		email: "",
		phone: "",
		password: "",
		otp: "",
		numInputs: "6",
		error: false,
		email_phone_already_used: false,
		invalid_otp: false,
		showResendOtp: false,
		countdownStart: false,
		countDownSeconds: 30,
		email_pass_error: false,
		countryCodeSelect: "",
		newUser: false,
	};

	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		const countryCode = localStorage.getItem("phoneCountryCode");
		const countryCodesArr = countryCode.split(",");
		this.setState({ countryCodeSelect: countryCodesArr[0].replace(/\s/g, "") });
	}

	handleInputChange = (event) => {
		if (event.target.name === "phone") {
			this.setState({ phone: this.state.countryCodeSelect + event.target.value.replace(/^0+/, "") });
			this.setState({ onlyPhone: event.target.value.replace(/^0+/, "") });
		} else {
			this.setState({ [event.target.name]: event.target.value.trim() });
		}
	};
	handleOtpInput = (otp) => this.setState({ otp });

	handleCountryCodeChange = (event) => {
		const { target } = event;
		this.setState({ countryCodeSelect: target.value }, () => {
			this.setState({ phone: target.value + this.state.onlyPhone });
		});
	};

	__sendOtp = (event) => {
		event.preventDefault();
		if (!this.state.newUser && this.validator.fieldValid("phone")) {
			this.setState({ loading: true });
			this.props.generateOtpForLogin(this.state.phone, this.state.email);
		} else if (this.state.newUser && this.validator.fieldValid("phone") && this.validator.fieldValid("email")) {
			this.setState({ loading: true });
			this.props.generateOtpForLogin(this.state.phone, this.state.email);
		} else {
			this.setState({ loading: false });
			console.log("validation failed");
			this.validator.showMessages();
		}
	};

	__loginWithOtp = (event) => {
		event.preventDefault();
		this.props.loginWithOtp(
			this.state.phone,
			this.state.otp,
			this.state.name,
			this.state.email,
			this.getLocationFromLocalStorage()
		);
		this.setState({ loading: true });
	};

	handleCountDown = () => {
		setTimeout(() => {
			this.setState({ showResendOtp: true });
			clearInterval(this.intervalID);
		}, 30000 + 1000);
		this.intervalID = setInterval(() => {
			console.log("interval going on");
			this.setState({
				countDownSeconds: this.state.countDownSeconds - 1,
			});
		}, 1000);
	};

	resendOtp = () => {
		if (this.validator.fieldValid("phone")) {
			this.setState({ countDownSeconds: 15, showResendOtp: false });
			this.props.generateOtpForLogin(this.state.phone, this.state.email).then((response) => {
				if (!response.payload.otp) {
					this.setState({ error: false });
				}
			});
		}
	};

	handleOnChange = (event) => {
		this.props.getSingleLanguageData(event.target.value);
		localStorage.setItem("userPreferedLanguage", event.target.value);
	};

	componentWillReceiveProps(nextProps) {
		const { user } = this.props;
		if (user !== nextProps.user) {
			this.setState({ loading: false });
		}
		if (nextProps.user.success) {
			if (nextProps.user.data.default_address !== null) {
				const userSetAddress = {
					lat: nextProps.user.data.default_address.latitude,
					lng: nextProps.user.data.default_address.longitude,
					address: nextProps.user.data.default_address.address,
					house: nextProps.user.data.default_address.house,
					tag: nextProps.user.data.default_address.tag,
				};
				localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
			}
			// this.context.router.history.goBack();
			if (navigator.userAgent === "frutriAndroidWebViewUA") {
				if (window.Android !== "undefined") {
					window.Android.registerFcm(nextProps.user.data.auth_token);
				}
			}
		}
		if (nextProps.user.email_phone_already_used) {
			this.setState({ email_phone_already_used: true });
		}

		if (nextProps.user.otp) {
			this.setState({ email_phone_already_used: false, error: false });
			//otp sent, hide reg form and show otp form
			document.getElementById("loginForm").classList.add("hidden");
			document.getElementById("otpForm").classList.remove("hidden");

			//start countdown
			this.setState({ countdownStart: true });
			this.handleCountDown();
			this.validator.hideMessages();
		}

		if (!nextProps.user.otp && nextProps.user.new_user) {
			console.log("New User");
			this.setState({ newUser: true });
			this.validator.hideMessages();
		}

		if (!nextProps.user) {
			this.setState({ error: true });
		}

		if (nextProps.user.enter_phone_after_social_login) {
			this.validator.hideMessages();
			document.getElementById("loginForm").classList.add("hidden");
			// populate name & email
			console.log("ask to fill the phone number and send otp process...");
		}

		if (nextProps.user.data === "DONOTMATCH") {
			//email and pass donot match
			this.setState({ error: false, email_pass_error: false, invalid_otp: true });
		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					console.log("Fetching Translation Data...");
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	handleCountDown = () => {
		setTimeout(() => {
			this.setState({ showResendOtp: true });
			clearInterval(this.intervalID);
		}, 30000 + 1000);
		this.intervalID = setInterval(() => {
			console.log("interval going on");
			this.setState({
				countDownSeconds: this.state.countDownSeconds - 1,
			});
		}, 1000);
	};

	processDefaultCountryCode = () => {
		const countryCode = localStorage.getItem("phoneCountryCode");
		const countryCodesArr = countryCode.split(",");
		if (countryCodesArr.length === 0) {
			return <span className="country-code" />;
		}
		if (countryCodesArr.length === 1) {
			return <span className="country-code">{countryCodesArr[0].replace(/\s/g, "")}</span>;
		}
		if (countryCodesArr.length > 1) {
			return (
				<select
					name="countryCodeSelect"
					onChange={this.handleCountryCodeChange}
					className="country-code--dropdown"
				>
					{countryCodesArr.map((countryCode) => (
						<option key={countryCode} value={countryCode.replace(/\s/g, "")}>
							{countryCode.replace(/\s/g, "")}
						</option>
					))}
				</select>
			);
		}
	};

	componentWillUnmount() {
		//clear countdown
		clearInterval(this.intervalID);
	}

	getLocationFromLocalStorage = () => {
		const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));

		if (userSetAddress === null) {
			return null;
		} else {
			if (userSetAddress.hasOwnProperty("businessLocation")) {
				return null;
			} else {
				return userSetAddress;
			}
		}
	};

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}

		const { user } = this.props;
		if (user.success) {
			if (localStorage.getItem("fromCartToLogin") === "1") {
				localStorage.removeItem("fromCartToLogin");
				return (
					//redirect to cart page
					<Redirect to={"/cart"} />
				);
			} else {
				return (
					//redirect to account page
					<Redirect to={"/my-account"} />
				);
			}
		}

		const languages = this.props.languages;

		return (
			<React.Fragment>
				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("loginErrorMessage")}</div>
					</div>
				)}
				{this.state.email_phone_already_used && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("emailPhoneAlreadyRegistered")}</div>
					</div>
				)}
				{this.state.invalid_otp && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("invalidOtpMsg")}</div>
					</div>
				)}

				{this.state.loading && <Loading />}
				<div className="cust-auth-header">
					<div className="input-group">
						<div className="input-group-prepend">
							<BackButton history={this.props.history} />
						</div>
					</div>
					<LightSpeed right delay={500}>
						<img
							src="/assets/img/various/login-illustration.png"
							className="login-image pull-right"
							alt="login-header"
						/>
					</LightSpeed>
					<div className="login-texts px-15 mt-30 pb-20">
						{!this.state.newUser ? (
							<React.Fragment>
								<span className="login-title">{localStorage.getItem("loginLoginTitle")}</span>
								<br />
								<span className="login-subtitle">{localStorage.getItem("loginLoginSubTitle")}</span>
							</React.Fragment>
						) : (
							<React.Fragment>
								<span className="login-title">{localStorage.getItem("registerRegisterTitle")}</span>
								<br />
								<span className="login-subtitle">
									{localStorage.getItem("registerRegisterSubTitle")}
								</span>
							</React.Fragment>
						)}
					</div>
				</div>

				<div className="bg-white">
					<form onSubmit={this.__sendOtp} id="loginForm">
						<div className="form-group px-15 pt-30">
							<div className="col-md-9 pb-5">
								<div>
									{this.processDefaultCountryCode()}
									<span>
										<input
											name="phone"
											type="tel"
											onChange={this.handleInputChange}
											className="form-control phone-number-country-code auth-input"
											placeholder={localStorage.getItem("loginLoginPhoneLabel")}
										/>
										{this.validator.message("phone", this.state.phone, [
											"required",
											{ regex: ["^\\+[1-9]\\d{1,14}$"] },
											{ min: ["8"] },
										])}
									</span>
								</div>
							</div>
							{this.state.newUser && (
								<div id="newUserFields">
									<div className="col-md-9 pb-5">
										<input
											type="text"
											name="name"
											onChange={this.handleInputChange}
											className="form-control auth-input"
											placeholder={localStorage.getItem("loginLoginNameLabel")}
										/>
										{this.validator.message("name", this.state.name, "required|string")}
									</div>

									<div className="col-md-9 pb-5">
										<input
											type="text"
											name="email"
											onChange={this.handleInputChange}
											className="form-control auth-input"
											placeholder={localStorage.getItem("loginLoginEmailLabel")}
										/>
										{this.validator.message("email", this.state.email, "required|email")}
									</div>
								</div>
							)}
						</div>

						<div className="mt-20 mx-10 d-flex justify-content-center">
							<button
								type="submit"
								className="btn btn-main"
								style={{
									backgroundColor: localStorage.getItem("storeColor"),
									width: "90%",
									borderRadius: "4px",
								}}
							>
								{!this.state.newUser
									? localStorage.getItem("firstScreenLoginBtn")
									: localStorage.getItem("registerRegisterTitle")}
							</button>
						</div>
					</form>
					<form onSubmit={this.__loginWithOtp} id="otpForm" className="hidden">
						<div className="form-group px-15 pt-30">
							<div className="col-md-9">
								<OtpInput
									value={this.state.otp}
									onChange={this.handleOtpInput}
									numInputs={this.state.numInputs}
									isInputNum={true}
									containerStyle="login-with-otp-input-container"
									inputStyle="login-with-otp-input"
									shouldAutoFocus={true}
								/>
							</div>

							<div className="col-md-9 mt-20">
								<button
									type="submit"
									className="btn btn-main"
									style={{
										backgroundColor: localStorage.getItem("storeColor"),
										borderRadius: "4px",
									}}
									disabled={this.state.otp.length < this.state.numInputs}
								>
									{localStorage.getItem("verifyOtpBtnText")}
								</button>
							</div>

							<div className="mt-30 mb-10">
								{this.state.showResendOtp && (
									<div className="resend-otp" onClick={this.resendOtp}>
										{localStorage.getItem("resendOtpMsg")} {this.state.phone}
									</div>
								)}

								{this.state.countDownSeconds > 0 && (
									<div className="resend-otp countdown">
										{localStorage.getItem("resendOtpCountdownMsg")} {this.state.countDownSeconds}
									</div>
								)}
							</div>
						</div>
					</form>
					<div>
						<div className="wave-container login-bottom-wave">
							<svg viewBox="0 0 120 28" className="wave-svg">
								<defs>
									<filter id="goo">
										<feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
										<feColorMatrix
											in="blur"
											mode="matrix"
											values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 13 -9"
											result="goo"
										/>
										<xfeBlend in="SourceGraphic" in2="goo" />
									</filter>
									<path
										id="wave"
										d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 28 h -240 z"
									/>
								</defs>

								<use id="wave3" className="wave" xlinkHref="#wave" x="0" y="-2" />
								<use id="wave2" className="wave" xlinkHref="#wave" x="0" y="0" />
							</svg>
						</div>
					</div>
				</div>

				{this.state.newUser && (
					<React.Fragment>
						{localStorage.getItem("registrationPolicyMessage") !== "null" ? (
							<div
								className="mt-20 mb-20 d-flex align-items-center justify-content-center auth-custom-msg-block"
								dangerouslySetInnerHTML={{
									__html: localStorage.getItem("registrationPolicyMessage"),
								}}
							/>
						) : (
							<div className="mb-100" />
						)}
					</React.Fragment>
				)}

				{languages && languages.length > 1 && (
					<div className="mt-4 d-flex align-items-center justify-content-center mb-100">
						<div className="mr-2">{localStorage.getItem("changeLanguageText")}</div>
						<select
							onChange={this.handleOnChange}
							defaultValue={
								localStorage.getItem("userPreferedLanguage")
									? localStorage.getItem("userPreferedLanguage")
									: languages.filter((lang) => lang.is_default === 1)[0].id
							}
							className="form-control language-select"
						>
							{languages.map((language) => (
								<option value={language.id} key={language.id}>
									{language.language_name}
								</option>
							))}
						</select>
					</div>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	language: state.languages.language,
	languages: state.languages.languages,
});

export default connect(
	mapStateToProps,
	{
		loginWithOtp,
		generateOtpForLogin,
		getSingleLanguageData,
	}
)(OtpLogin);
