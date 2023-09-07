import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";
import React from "react";
import store from "./services/store";

import CheckVersion from "./components/CheckVersion";
import InAppNotification from "./components/Mobile/InAppNotification";
import PWAPrompt from "react-ios-pwa-prompt";
import { Offline, Online } from "react-detect-offline";
import OfflineComponent from "./components/Mobile/OfflineComponent";
import CustomCssProvider from "./components/CustomCssProvider";
import PWAInstallation from "./components/Mobile/PWAInstallation";

const polling = {
	enabled: false,
};

const Root = ({ children, initialState = {} }) => (
	<React.Fragment>
		<Provider store={store(initialState)}>
			<CustomCssProvider />
			<div
				className="height-100 overlay-loading hidden"
				style={{ backgroundColor: "rgba(96, 125, 139, 0.45)" }}
				id="gpsLoadingScreen"
			>
				<div className="spin-load" />
			</div>

			<Online polling={polling}>
				{children}
				<img className="cart-empty-img hidden" src="/assets/img/various/offline.png" alt="offline" />
				{/* <CheckVersion /> */}
				{/* <InAppNotification /> */}
				<PWAInstallation />
				{localStorage.getItem("enIOSPWAPopup") === "true" && (
					<PWAPrompt
						delay={2500}
						copyTitle={localStorage.getItem("iOSPWAPopupTitle")}
						copyBody={localStorage.getItem("iOSPWAPopupBody")}
						copyShareButtonLabel={localStorage.getItem("iOSPWAPopupShareButtonLabel")}
						copyAddHomeButtonLabel={localStorage.getItem("iOSPWAPopupAddButtonLabel")}
						copyClosePrompt={localStorage.getItem("iOSPWAPopupCloseButtonLabel")}
					/>
				)}
			</Online>
			<Offline polling={polling}>
				<OfflineComponent />
			</Offline>
		</Provider>
	</React.Fragment>
);

serviceWorker.register();

export default Root;
