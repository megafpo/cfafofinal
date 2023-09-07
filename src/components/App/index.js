import React, { Component } from "react";

import Desktop from "../../components/Desktop";
import Mobile from "../../components/Mobile";
import { connect } from "react-redux";
import { getSettings } from "../../services/settings/actions";

import { getAllLanguages, getSingleLanguageData } from "../../services/languages/actions";
import { getPopularLocations } from "../../services/popularLocations/actions";

class App extends Component {
	state = {
		proceedForward: false,
		primaryLocationError: false,
	};

	componentDidMount() {
		if (localStorage.getItem("userSetAddress") !== null) {
			this.setState({ proceedForward: true });
		}

		this.props.getSettings().then(() => {
			this.props.getAllLanguages();
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.languages !== nextProps.languages) {
			if (nextProps.languages.length) {
				var id;
				if (localStorage.getItem("userPreferedLanguage") !== null) {
					id = localStorage.getItem("userPreferedLanguage");
				} else {
					id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
				}

				this.props.getSingleLanguageData(id).then(() => {
					this.props.getPopularLocations().then((response) => {
						if (response && response.payload) {
							if (
								localStorage.getItem("userSetAddress") === null ||
								localStorage.getItem("userSetAddress") === "{}"
							) {
								const location = response.payload.filter((loc) => loc.is_default === 1)[0];
								if (typeof location === "undefined") {
									// alert("Set a default primary location");
									this.setState({ primaryLocationError: true });
								} else {
									const userSetAddress = {
										lat: location.latitude,
										lng: location.longitude,
										address: location.name,
										house: null,
										tag: null,
										businessLocation: true,
									};
									const saveUserSetAddress = new Promise((resolve) => {
										localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
										resolve("Location Saved");
									});
									saveUserSetAddress.then(() => {
										this.setState({ proceedForward: true });
									});
								}
							}
						}
					});
				});
			}
		}
	}

	render() {
		return (
			<React.Fragment>
				{this.state.primaryLocationError && (
					<div
						className="primaryLocationErrorCustomerApp pt-15 px-15"
						style={{ minHeight: "100vh", backgroundColor: "#f0f0f0" }}
					>
						<div className="d-flex justify-content-center" style={{ opacity: "0.5" }}>
							<img src="https://www.freeiconspng.com/uploads/error-icon-3.png" alt="Error Message" />
						</div>
						<h4 className="mb-0">Critical Error</h4>
						<p>Primary location is not set by Admin.</p>
						<h4 className="mb-2">Steps to resolve this issue</h4>
						<ol>
							<li>Login to the Admin Dashboard</li>
							<li>
								You will automatically be redirected to the Popular Geo Location page{" "}
								<span className="small">(or goto Settings > Popular Geo Locations)</span>
							</li>
							<li>
								If you do not have any location, create a new location. If you already have locations,
								mark anyone as primary{" "}
								<span className="small">(by clicking the check-mark button)</span>
							</li>
							<li>Then reload this page</li>
						</ol>
					</div>
				)}
				{this.state.proceedForward && (
					<React.Fragment>
						{window.innerWidth <= 768 ? (
							<Mobile languages={this.props.languages} />
						) : (
							<Desktop languages={this.props.languages} />
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	settings: state.settings.settings,
	user: state.user.user,
	notification_token: state.notification_token.notification_token,
	languages: state.languages.languages,
	language: state.languages.language,
});

export default connect(
	mapStateToProps,
	{ getSettings, getAllLanguages, getSingleLanguageData, getPopularLocations }
)(App);
