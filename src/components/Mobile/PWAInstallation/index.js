import React, { Component } from "react";
import { isAndroid } from "react-device-detect";
import Jello from "react-reveal/Jello";
import Ink from "react-ink";

let deferredPrompt;

class PWAInstallation extends Component {
	state = {
		installable: false,
	};

	async componentDidMount() {
		window.addEventListener("beforeinstallprompt", (e) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			// Update UI notify the user they can install the PWA
			this.setState({ installable: true });
		});

		window.addEventListener("appinstalled", () => {
			// Log install to analytics
			deferredPrompt = null;
			this.setState({ installable: false });

			console.log("INSTALL: Success");
		});
	}

	handleInstallClick = (e) => {
		// Hide the app provided install promotion
		this.setState({ installable: false });
		// Show the install prompt
		if (deferredPrompt) {
			deferredPrompt.prompt();
			// Wait for the user to respond to the prompt
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === "accepted") {
					console.log("User accepted the install prompt");
				} else {
					console.log("User dismissed the install prompt");
				}
			});
		}
	};

	render() {
		if (this.props.type === "footer") {
			return (
				<React.Fragment>
					{this.state.installable && isAndroid && (
						<div className="d-flex justify-content-center footer-pwa">
							<div
								className={`d-flex fixed-pwa-install ${
									localStorage.getItem("footerStyleType") === "FLOAT"
										? "footer-float"
										: "footer-fixed"
								}`}
							>
								<div>
									<p className="mb-0 mr-3">{localStorage.getItem("pwaInstallFooterMessage")}</p>
								</div>
								<div>
									<button
										className="btn btn-success btn-md position-relative"
										onClick={this.handleInstallClick}
									>
										{localStorage.getItem("pwaInstallFooterInstallText")}
										<Ink duration={250} />
									</button>
								</div>
							</div>
						</div>
					)}
				</React.Fragment>
			);
		} else if (this.props.type === "header") {
			return (
				<React.Fragment>
					{this.state.installable && isAndroid && (
						<Jello>
							<div className="d-flex align-items-center nav-pwa" onClick={this.handleInstallClick}>
								<i className="si si-screen-smartphone pwa-phone-icon" />
							</div>
						</Jello>
					)}
				</React.Fragment>
			);
		} else {
			return null;
		}
	}
}

export default PWAInstallation;
