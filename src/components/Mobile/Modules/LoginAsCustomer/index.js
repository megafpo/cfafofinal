import React, { Component } from "react";

import Loading from "../../../helpers/loading";
import SimpleReactValidator from "simple-react-validator";
import { loginAsCustomer, registerGuestUser } from "../../../../services/user/actions";
import { connect } from "react-redux";
import Location from "../../Location";
import { Helmet } from "react-helmet";

class LoginAsCustomer extends Component {
	constructor() {
		super();
		this.validator = new SimpleReactValidator({
			autoForceUpdate: this,
			messages: {
				required: localStorage.getItem("fieldValidationMsg"),
				string: localStorage.getItem("nameValidationMsg"),
				email: localStorage.getItem("emailValidationMsg"),
				regex: localStorage.getItem("phoneValidationMsg"),
				min: localStorage.getItem("minimumLengthValidationMessage"),
			},
		});
	}

	static contextTypes = {
		router: () => null,
	};

	state = {
		loading: true,
		guestUser: false,
		statusMsg: "",
		countryCodeSelect: "",
		name: "",
		email: "",
		phone: "",
		password: "",
		loggedinAsCustomer: false,
		email_phone_already_used: false,
		error: false,
		errorMessage: "",
		guestRegisterSuccess: false,
	};

	componentDidMount() {
		const countryCode = localStorage.getItem("phoneCountryCode");
		const countryCodesArr = countryCode.split(",");
		this.setState({ countryCodeSelect: countryCodesArr[0].replace(/\s/g, "") });

		const user_id = this.props.match.params.id;

		if (typeof user_id === "undefined") {
			this.setState({ loading: false, guestUser: true });
		} else {
			this.setState({ guestUser: false });

			this.props.loginAsCustomer(user_id).then((response) => {
				// console.log(response[0]);
				if (response && response[0].payload && response[0].payload.success) {
					this.setState({ loading: false, loggedinAsCustomer: true });
				}
			});
		}
	}

	handleInputChange = (event) => {
		if (event.target.name === "phone") {
			this.setState({ phone: this.state.countryCodeSelect + event.target.value.replace(/^0+/, "") });
			this.setState({ onlyPhone: event.target.value.replace(/^0+/, "") });
		} else {
			this.setState({ [event.target.name]: event.target.value });
		}
	};
	handleCountryCodeChange = (event) => {
		const { target } = event;
		this.setState({ countryCodeSelect: target.value }, () => {
			this.setState({ phone: target.value + this.state.onlyPhone });
		});
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

	handleGuestRegister = (event) => {
		event.preventDefault();

		if (
			this.validator.fieldValid("name") &&
			this.validator.fieldValid("email") &&
			this.validator.fieldValid("phone") &&
			this.validator.fieldValid("password")
		) {
			this.setState({ loading: true });
			this.props.registerGuestUser(this.state.name, this.state.phone, this.state.email, this.state.password);
		} else {
			console.log("Validation Failed");
			this.validator.showMessages();
		}
	};

	componentWillReceiveProps(newProps) {
		const { user } = this.props;

		if (user !== newProps.user) {
			this.setState({ loading: false });
		}

		if (newProps.user.success) {
			if (newProps.user.data.default_address !== null) {
				const userSetAddress = {
					lat: newProps.user.data.default_address.latitude,
					lng: newProps.user.data.default_address.longitude,
					address: newProps.user.data.default_address.address,
					house: newProps.user.data.default_address.house,
					tag: newProps.user.data.default_address.tag,
				};
				localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
			}
		}

		if (newProps.user.email_phone_already_used) {
			this.setState({ email_phone_already_used: true });
		}
		if (!newProps.user) {
			this.setState({ error: true });
		}
		if (newProps.user.success) {
			if (this.state.guestUser) {
				console.log("User Registered and Loggedin");
				this.setState({ guestRegisterSuccess: true });
				setTimeout(() => {
					this.context.router.history.push("/search-location");
				}, 1880);
			}
		}
	}
	render() {
		const { user } = this.props;
		return (
			<React.Fragment>
				<Helmet>
					<style type="text/css">{`
                    .location-back-button {
                        display: none;
                    }
                    `}</style>
				</Helmet>
				{this.state.loading && <Loading />}
				{this.state.email_phone_already_used && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("emailPhoneAlreadyRegistered")}</div>
					</div>
				)}

				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake">
							{this.state.errorMessage !== ""
								? this.state.errorMessage
								: localStorage.getItem("loginErrorMessage")}
						</div>
					</div>
				)}

				{this.state.guestRegisterSuccess && (
					<React.Fragment>
						<div
							className="update-full-notification d-block"
							style={{ zIndex: 9999999999, backgroundColor: "#fff" }}
						>
							<div style={{ marginTop: "15rem" }}>
								<img
									src="/assets/img/order-placed.gif"
									alt="Successful"
									className="img-fluid"
									style={{ width: "120px" }}
								/>
							</div>
							<div style={{ marginTop: "4rem" }} className="text-center">
								<h3 className="text-dark mb-2">Registration Successful</h3>
								<h5 className="mb-0"> Loggedin as {this.props.user.data.name}</h5>
							</div>

							<div style={{ marginTop: "4rem" }} className="text-center text-muted">
								<p className="text-muted small"> Redirecting please wait...</p>
							</div>
						</div>
					</React.Fragment>
				)}

				{this.state.guestUser ? (
					<React.Fragment>
						<div className="cust-auth-header">
							<div className="input-group">
								<div className="input-group-prepend" />
							</div>
							<div className="login-texts px-15 mt-30 pb-20">
								<span className="login-title text-capitalize">Guest Customer</span>
								<br />
								<span className="login-subtitle">Enter the details</span>
							</div>
						</div>

						<div className="bg-white">
							<form onSubmit={this.handleGuestRegister} id="registerForm">
								<div className="form-group px-15 pt-30">
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

									<div className="col-md-9 pb-5">
										<input
											type="text"
											name="email"
											onChange={this.handleInputChange}
											className="form-control auth-input"
											placeholder="Email is optional"
										/>
										{this.validator.message("email", this.state.email, "email")}
									</div>
									<div className="col-md-9">
										<input
											type="password"
											name="password"
											onChange={this.handleInputChange}
											className="form-control auth-input"
											placeholder="Password is optional"
										/>
										{this.validator.message("password", this.state.password, "min:6")}
									</div>
								</div>
								<div className="mt-20 mx-15 d-flex justify-content-center">
									<button
										type="submit"
										className="btn btn-main"
										style={{
											backgroundColor: localStorage.getItem("storeColor"),
											width: "90%",
											borderRadius: "4px",
										}}
									>
										{localStorage.getItem("firstScreenRegisterBtn")}
									</button>
								</div>
							</form>
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className="cust-auth-header">
							<div className="input-group">
								<div className="input-group-prepend" />
							</div>
							<div className="login-texts px-15 mt-30 pb-20">
								<span className="login-title text-capitalize">
									{this.state.loggedinAsCustomer ? (
										<React.Fragment>Loggedin as {user.data.name}</React.Fragment>
									) : (
										<span>Logging in as Customer</span>
									)}
								</span>
								<br />
								<span className="login-subtitle">
									{this.state.loggedinAsCustomer ? (
										<React.Fragment>
											Phone: {user.data.phone} <br />
											Email: {user.data.email}
										</React.Fragment>
									) : (
										<span>Please Wait...</span>
									)}
								</span>
							</div>
						</div>

						{this.state.loggedinAsCustomer && (
							<React.Fragment>
								<Location />
							</React.Fragment>
						)}
					</React.Fragment>
				)}

				<p>{this.state.statusMsg}</p>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	settings: state.settings.settings,
	addresses: state.addresses.addresses,
});

export default connect(
	mapStateToProps,
	{ loginAsCustomer, registerGuestUser }
)(LoginAsCustomer);
