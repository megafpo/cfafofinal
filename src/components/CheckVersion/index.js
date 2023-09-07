import React, { Component } from "react";
import Axios from "axios";
import { getSettings } from "../../services/settings/actions";
import { connect } from "react-redux";
import { getSingleLanguageData, getAllLanguages } from "../../services/languages/actions";
import { logoutUser } from "../../services/user/actions";

class CheckVersion extends Component {
	state = {
		updating: false,
	};

	componentDidMount() {
		Axios.get("/version.json").then((response) => {
			//getting new data from version.json file
			const forceNewSettingsServerVersion = response.data.forceNewSettingsVersion;
			const forceCacheClearServerVersion = response.data.forceCacheClearVersion;
			// const forceLogoutAllCustomers = response.data.forceLogoutAllCustomers;
			//logging all data
			// console.log("Client Settings Version: ", localStorage.getItem("forceNewSettingsVersion"));
			// console.log("Server Settings Version: ", forceNewSettingsServerVersion);
			// console.log("Client Cache Version: ", localStorage.getItem("forceCacheClearVersion"));
			// console.log("Server Cache Version: ", forceCacheClearServerVersion);

			//firstime user donot have settings so set setting... and donot load updating section
			if (
				localStorage.getItem("forceNewSettingsVersion") === null &&
				localStorage.getItem("forceCacheClearVersion") === null
			) {
				localStorage.setItem("forceNewSettingsVersion", forceNewSettingsServerVersion);
				localStorage.setItem("forceCacheClearVersion", forceCacheClearServerVersion);
			} else {
				//settings are already set so old user so call update method if settings changed
				if (localStorage.getItem("forceNewSettingsVersion") !== forceNewSettingsServerVersion) {
					console.warn("Getting New Settings");
					this.props.getSettings();
					localStorage.setItem("forceNewSettingsVersion", forceNewSettingsServerVersion);
				}

				if (localStorage.getItem("forceCacheClearVersion") !== forceCacheClearServerVersion) {
					const clearLocalStorage = () => {
						return new Promise((resolve) => {
							console.warn("Clear Local Storage");
							// take some backup
							let geoLocation = localStorage.getItem("geoLocation");
							let userSetAddress = localStorage.getItem("userSetAddress");
							let storeColor = localStorage.getItem("storeColor");
							let storeLogo = localStorage.getItem("storeLogo");
							let updatingMessage = localStorage.getItem("updatingMessage");
							let userPreferedLanguage = localStorage.getItem("userPreferedLanguage");

							let activeRestaurant =
								localStorage.getItem("activeRestaurant") !== null
									? localStorage.getItem("activeRestaurant")
									: 1;
							//clear
							localStorage.clear();

							//then push the backup again
							if (geoLocation !== null) {
								localStorage.setItem("geoLocation", geoLocation);
							}
							if (userSetAddress !== null) {
								localStorage.setItem("userSetAddress", userSetAddress);
							}
							localStorage.setItem("storeColor", storeColor);
							localStorage.setItem("storeLogo", storeLogo);
							localStorage.setItem("updatingMessage", updatingMessage);
							localStorage.setItem("activeRestaurant", activeRestaurant);
							if (userPreferedLanguage !== null) {
								localStorage.setItem("userPreferedLanguage", userPreferedLanguage);
							}

							resolve("Completed clearLocalStorage");
						});
					};

					const clearCacheStorage = () => {
						return new Promise((resolve) => {
							console.warn("Clear Cache Storage");
							navigator.serviceWorker.getRegistrations().then(function(registrations) {
								for (let registration of registrations) {
									registration.unregister();
								}
							});
							if (caches) {
								// console.log("CACHES:", caches);
								caches.keys().then(function(names) {
									for (let name of names) caches.delete(name);
								});
							}
							resolve("Completed clearCacheStorage");
						});
					};

					const fetchSettingsAndLanguage = () => {
						return new Promise((resolve) => {
							console.warn("Fetch Settings and Translations");
							this.props.getSettings();

							if (localStorage.getItem("userPreferedLanguage") !== null) {
								this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
								resolve("Completed fetchSettingsAndLanguage");
							} else {
								this.props.getAllLanguages().then((languages) => {
									console.log(languages);
									console.log("Fetching Translation Data...");
									const id = languages.payload.filter((lang) => lang.is_default === 1)[0].id;
									this.props.getSingleLanguageData(id).then(() => {
										resolve("Completed fetchSettingsAndLanguage");
									});
								});
							}
						});
					};

					const updateClientVersion = () => {
						return new Promise((resolve) => {
							console.warn("Update Client Version");
							localStorage.setItem("forceNewSettingsVersion", forceNewSettingsServerVersion);
							localStorage.setItem("forceCacheClearVersion", forceCacheClearServerVersion);
							resolve("Completed updateClientVersion");
						});
					};

					const reloadBrowser = () => {
						return new Promise((resolve) => {
							setTimeout(() => {
								this.setState({ updating: false }, () => {
									window.location.reload(true);
									resolve("Completed reloadBrowser");
								});
							}, 3 * 1000);
						});
					};

					async function doProcess() {
						await clearLocalStorage();
						await clearCacheStorage();
						await fetchSettingsAndLanguage();
						await updateClientVersion();
						await reloadBrowser();
					}
					this.setState({ updating: true });
					// Promise.all([clearLocalStorage(), clearCacheStorage(), updateClientVersion(), reloadBrowser()]);

					doProcess();
				}
				// if (localStorage.getItem("forceLogoutAllCustomers") !== null) {
				// 	if (localStorage.getItem("forceLogoutAllCustomers") !== forceLogoutAllCustomers) {
				// 		console.log("Logged out");
				// 		this.props.logoutUser();
				// 		localStorage.setItem("forceLogoutAllCustomers", forceLogoutAllCustomers);
				// 	}
				// } else {
				// 	localStorage.setItem("forceLogoutAllCustomers", forceLogoutAllCustomers);
				// }
			}
		});
	}
	render() {
		const { updating } = this.state;
		return (
			<React.Fragment>
				{updating && (
					<React.Fragment>
						<div className="update-full-notification">
							<span className="spin-load" />
						</div>
						<div className="update-full-notification" style={{ zIndex: 9999999999 }}>
							<h1 className="d-flex" style={{ marginTop: "8rem" }}>
								{localStorage.getItem("updatingMessage")}
							</h1>
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

// export default CheckVersion;
const mapStateToProps = (state) => ({
	settings: state.settings.settings,
});

export default connect(
	mapStateToProps,
	{ getSettings, getSingleLanguageData, getAllLanguages, logoutUser }
)(CheckVersion);
