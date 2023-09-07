import React, { Component } from "react";
import SimpleReactValidator from "simple-react-validator";
import { Redirect } from "react-router";
import BackButton from "../../Elements/BackButton";

import { connect } from "react-redux";
import {
    sendPasswordResetMail,
    verifyPasswordResetOtp,
    changeUserPassword
} from "../../../../services/user/actions";

class ForgotPassword extends Component {
    constructor() {
        super();
        this.validator = new SimpleReactValidator({
            autoForceUpdate: this,
            messages: {
                required: localStorage.getItem("fieldValidationMsg"),
                email: localStorage.getItem("emailValidationMsg"),
                min: localStorage.getItem("minimumLengthValidationMessage")
            }
        });
    }

    state = {
        loading: false,
        email: "",
        code: "",
        password: "",
        show_mail_form: true,
        show_code_validation_form: false,
        show_password_change_form: false,
        error: false,
        error_msg: "",
        dontHaveOtp: true,
        completed: false
    };

    static contextTypes = {
        router: () => null
    };

    handleInputChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleAlreadyHaveOtp = () => {
        if (this.validator.fieldValid("email")) {
            this.setState(
                {
                    show_mail_form: false,
                    show_code_validation_form: true,
                    dontHaveOtp: false
                },
                () => {
                    this.refs.otpInput.focus();
                }
            );
        } else {
            this.refs.emailInput.focus();
            this.validator.showMessages();
        }
    };
    handleDontHaveOtp = () => {
        this.setState(
            {
                show_mail_form: true,
                show_code_validation_form: false,
                dontHaveOtp: true
            },
            () => {
                this.refs.emailInput.focus();
            }
        );
    };
    handleSendEmail = event => {
        event.preventDefault();
        if (this.validator.fieldValid("email")) {
            this.refs.otpEmailSendBtn.setAttribute("disabled", "disabled");
            this.props.sendPasswordResetMail(this.state.email);
            this.setState({ loading: true });
        } else {
            console.log("Email Validation Failed");
            this.validator.showMessages();
            this.refs.emailInput.focus();
        }
    };

    handleValidateCode = event => {
        event.preventDefault();
        if (this.validator.fieldValid("code")) {
            this.refs.otpVerifyBtn.setAttribute("disabled", "disabled");
            this.props.verifyPasswordResetOtp(
                this.state.email,
                this.state.code
            );
            this.setState({ loading: true });
        } else {
            console.log("Code Validation Failed");
            this.validator.showMessages();
            this.refs.otpInput.focus();
        }
    };

    handleChangePassword = event => {
        event.preventDefault();
        if (this.validator.fieldValid("password")) {
            this.refs.changePassBtn.setAttribute("disabled", "disabled");
            this.props.changeUserPassword(
                this.state.email,
                this.state.code,
                this.state.password
            );
            this.setState({ loading: true });
        } else {
            console.log("Password Validation Failed");
            this.validator.showMessages();
            this.refs.passwordInput.focus();
        }
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.reset_mail !== nextProps.reset_mail) {
            if (nextProps.reset_mail.success) {
                console.log("Mail Sending Success");
                this.setState({
                    loading: false,
                    show_mail_form: false,
                    show_code_validation_form: true,
                    show_password_change_form: false
                });
            } else {
                console.log("Mail Sending Failed");
                this.refs.otpEmailSendBtn.removeAttribute(
                    "disabled",
                    "disabled"
                );
                this.setState({ loading: false, error: true });
                if (nextProps.reset_mail.error_code === "UNF") {
                    this.setState({
                        error_msg: localStorage.getItem(
                            "userNotFoundErrorMessage"
                        )
                    });
                } else {
                    this.setState({
                        error_msg: localStorage.getItem("loginErrorMessage")
                    });
                }
            }
        }

        if (this.props.validate_email_otp !== nextProps.validate_email_otp) {
            if (nextProps.validate_email_otp.success) {
                console.log("OTP Validation Success");
                this.setState({
                    loading: false,
                    show_mail_form: false,
                    show_code_validation_form: false,
                    show_password_change_form: true
                });
            } else {
                console.log("OTP Validation Failed");
                this.refs.otpVerifyBtn.removeAttribute("disabled", "disabled");
                this.setState({ loading: false, error: true });
                if (nextProps.validate_email_otp.error_code === "UNF") {
                    console.log("userNotFoundErrorMessage");
                    this.setState({
                        error_msg: localStorage.getItem(
                            "userNotFoundErrorMessage"
                        )
                    });
                }
                if (nextProps.validate_email_otp.error_code === "IVOTP") {
                    console.log("invalidOtpErrorMessage");
                    this.setState({
                        error_msg: localStorage.getItem(
                            "invalidOtpErrorMessage"
                        )
                    });
                }
                if (nextProps.validate_email_otp.error_code === "SWR") {
                    console.log("loginErrorMessage");
                    this.setState({
                        error_msg: localStorage.getItem("loginErrorMessage")
                    });
                }
            }
        }

        if (this.props.change_password !== nextProps.change_password) {
            if (nextProps.change_password.success) {
                console.log("Password Change Success");
                this.setState(
                    {
                        loading: false,
                        show_mail_form: false,
                        show_code_validation_form: false,
                        show_password_change_form: false,
                        error: false,
                        completed: true
                    },
                    () => {
                        setTimeout(() => {
                            console.log("Redirecting to login page");
                            this.context.router.history.push("/login");
                        }, 2000);
                    }
                );
            } else {
                console.log("Password Change Failed");
                this.refs.changePassBtn.removeAttribute("disabled", "disabled");
                this.setState({ loading: false, error: true });
                if (nextProps.change_password.error_code === "UNF") {
                    this.setState({
                        error_msg: localStorage.getItem(
                            "userNotFoundErrorMessage"
                        )
                    });
                }
                if (nextProps.change_password.error_code === "IVOTP") {
                    this.setState({
                        error_msg: localStorage.getItem(
                            "invalidOtpErrorMessage"
                        )
                    });
                }
                if (nextProps.change_password.error_code === "SWR") {
                    this.setState({
                        error_msg: localStorage.getItem("loginErrorMessage")
                    });
                }
            }
        }
    }

    render() {
        if (window.innerWidth > 768) {
            return <Redirect to="/" />;
        }
        if (localStorage.getItem("storeColor") === null) {
            return <Redirect to={"/"} />;
        }

        return (
            <React.Fragment>
                {this.state.error && (
                    <div className="auth-error">
                        <div className="error-shake">
                            {this.state.error_msg}
                        </div>
                    </div>
                )}

                <div style={{ backgroundColor: "#f2f4f9" }}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <BackButton history={this.props.history} />
                        </div>
                    </div>
                    <img
                        src="/assets/img/login-header.png"
                        className="login-image pull-right mr-15"
                        alt="login-header"
                    />
                    <div className="login-texts px-15 mt-50 pb-20">
                        <span className="login-title">
                            {localStorage.getItem("resetPasswordPageTitle")}
                        </span>
                        <br />
                        <span className="login-subtitle">
                            {localStorage.getItem("resetPasswordPageSubTitle")}
                        </span>
                    </div>
                </div>

                <div className="bg-white">
                    {this.state.show_mail_form && (
                        <React.Fragment>
                            <form onSubmit={this.handleSendEmail}>
                                <div className="form-group px-15 pt-30">
                                    <label className="col-12 edit-address-input-label">
                                        {localStorage.getItem(
                                            "loginLoginEmailLabel"
                                        )}{" "}
                                        {this.validator.message(
                                            "email",
                                            this.state.email,
                                            "required|email"
                                        )}
                                    </label>
                                    <div className="col-md-9 pb-5">
                                        <input
                                            type="text"
                                            name="email"
                                            onChange={this.handleInputChange}
                                            className="form-control edit-address-input"
                                            ref="emailInput"
                                        />
                                    </div>
                                </div>
                                <div className="mt-20 px-15 pt-15 button-block">
                                    <button
                                        type="submit"
                                        className="btn btn-main"
                                        style={{
                                            backgroundColor: localStorage.getItem(
                                                "storeColor"
                                            )
                                        }}
                                        ref="otpEmailSendBtn"
                                        required
                                    >
                                        {localStorage.getItem(
                                            "sendOtpOnEmailButtonText"
                                        )}
                                    </button>
                                </div>
                            </form>
                            {this.state.dontHaveOtp && (
                                <div className="d-flex justify-content-center mt-50">
                                    <div
                                        className="p-10 btn resend-otp w-75"
                                        onClick={this.handleAlreadyHaveOtp}
                                    >
                                        {localStorage.getItem(
                                            "alreadyHaveResetOtpButtonText"
                                        )}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    )}

                    {this.state.show_code_validation_form && (
                        <React.Fragment>
                            <form onSubmit={this.handleValidateCode}>
                                <div className="form-group px-15 pt-30">
                                    <label className="col-12 edit-address-input-label">
                                        {localStorage.getItem(
                                            "enterResetOtpMessageText"
                                        )}{" "}
                                        {this.state.email}{" "}
                                        {this.validator.message(
                                            "code",
                                            this.state.code,
                                            "required"
                                        )}
                                    </label>
                                    <div className="col-md-9 pb-5">
                                        <input
                                            ref="otpInput"
                                            type="text"
                                            name="code"
                                            onChange={this.handleInputChange}
                                            className="form-control edit-address-input"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-20 px-15 pt-15 button-block">
                                    <button
                                        type="submit"
                                        className="btn btn-main"
                                        style={{
                                            backgroundColor: localStorage.getItem(
                                                "storeColor"
                                            )
                                        }}
                                        ref="otpVerifyBtn"
                                    >
                                        {localStorage.getItem(
                                            "verifyResetOtpButtonText"
                                        )}
                                    </button>
                                </div>
                            </form>
                            {!this.state.dontHaveOtp && (
                                <div className="d-flex justify-content-center mt-50">
                                    <div
                                        className="p-10 btn resend-otp w-75"
                                        onClick={this.handleDontHaveOtp}
                                    >
                                        {localStorage.getItem(
                                            "dontHaveResetOtpButtonText"
                                        )}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    )}

                    {this.state.show_password_change_form && (
                        <form onSubmit={this.handleChangePassword}>
                            <p className="text-muted font-w700 px-15 mt-20 mb-0">
                                {localStorage.getItem("enterNewPasswordText")}
                            </p>
                            <div className="form-group px-15 pt-30">
                                <label className="col-12 edit-address-input-label">
                                    {localStorage.getItem(
                                        "newPasswordLabelText"
                                    )}{" "}
                                    {this.validator.message(
                                        "password",
                                        this.state.password,
                                        "required|min:8"
                                    )}
                                </label>
                                <div className="col-md-9 pb-5">
                                    <input
                                        ref="passwordInput"
                                        type="text"
                                        name="password"
                                        onChange={this.handleInputChange}
                                        className="form-control edit-address-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-20 px-15 pt-15 button-block">
                                <button
                                    type="submit"
                                    className="btn btn-main"
                                    style={{
                                        backgroundColor: localStorage.getItem(
                                            "storeColor"
                                        )
                                    }}
                                    ref="changePassBtn"
                                >
                                    {localStorage.getItem(
                                        "setNewPasswordButtonText"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {this.state.loading && (
                        <div className="d-flex justify-content-center">
                            <img
                                src="/assets/img/various/spinner.svg"
                                alt="Loading..."
                                style={{ width: "50px" }}
                            />
                        </div>
                    )}
                    {this.state.completed && (
                        <div className="d-flex justify-content-center mt-20">
                            <img
                                src="/assets/img/order-placed.gif"
                                alt="Completed"
                                style={{ width: "100px" }}
                            />
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    reset_mail: state.user.reset_mail,
    validate_email_otp: state.user.validate_email_otp,
    change_password: state.user.change_password
});

export default connect(mapStateToProps, {
    sendPasswordResetMail,
    verifyPasswordResetOtp,
    changeUserPassword
})(ForgotPassword);
