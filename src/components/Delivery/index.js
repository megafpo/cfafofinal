import * as firebase from "firebase/app";

import React, { Component } from "react";

import Meta from "../helpers/meta";
import Orders from "./Orders";

import { Redirect } from "react-router";
import { connect } from "react-redux";

import messaging from "../../init-fcm";
import { saveNotificationToken } from "../../services/notification/actions";
import ShareLiveLocation from "./ShareLiveLocation";
import DeliveryDesktop from "./DeliveryDesktop";

class Delivery extends Component {
	async componentDidMount() {
		if (document.querySelector("#mainManifest")) {
			document.querySelector("#mainManifest").setAttribute("href", "/delivery-manifest.json");
		}
		if (document.getElementsByTagName("body")) {
			document.getElementsByTagName("body")[0].classList.remove("bg-grey");
			document.getElementsByTagName("body")[0].classList.add("delivery-dark-bg");
		}

		const { delivery_user } = this.props;

		if (delivery_user.success) {
			if (firebase.messaging.isSupported()) {
				let handler = this.props.saveNotificationToken;
				messaging
					.requestPermission()
					.then(async function() {
						const push_token = await messaging.getToken();
						handler(push_token, delivery_user.data.id, delivery_user.data.auth_token);
					})
					.catch(function(err) {
						console.log("Unable to get permission to notify.", err);
					});
				// navigator.serviceWorker.addEventListener("message", message => console.log(message));
			}
		}
	}

	render() {
		if (window.innerWidth > 768) {
			return <DeliveryDesktop />;
		}
		const { delivery_user } = this.props;

		if (!delivery_user.success) {
			return <Redirect to={"/delivery/login"} />;
		}
		return (
			<React.Fragment>
				<Meta
					seotitle="Delivery Orders"
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>

				<Orders />
				{navigator.userAgent !== "frutriAndroidWebViewUA" && <ShareLiveLocation />}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
});

export default connect(
	mapStateToProps,
	{ saveNotificationToken }
)(Delivery);
