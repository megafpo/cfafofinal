import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import Meta from "../../helpers/meta";
import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import Footer from "../Footer";
import AlertList from "./AlertList";
import {
	getUserNotifications,
	markAllNotificationsRead,
	markOneNotificationRead,
} from "../../../services/alert/actions";
import Ink from "react-ink";

class Alerts extends Component {
	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		if (this.props.alerts.length) {
			document.getElementsByTagName("body")[0].classList.add("bg-grey-light");
		}

		const { user } = this.props;
		if (localStorage.getItem("storeColor") !== null) {
			if (user.success) {
				this.props.getUserNotifications(user.data.id, user.data.auth_token);
			}
		}
	}

	handleMarkAllRead = () => {
		const { user } = this.props;

		if (user.success) {
			this.props.markAllNotificationsRead(user.data.id, user.data.auth_token);
		}
	};

	handleNotificationClick = (alert) => {
		const { user } = this.props;
		console.log("Notification Clicked");
		if (user.success) {
			this.props.markOneNotificationRead(user.data.id, alert.id, user.data.auth_token).then((response) => {
				const data = JSON.parse(alert.data);
				const unique_order_id = data.unique_order_id;
				const custom_notification = data.custom_notification;
				const click_action = data.click_action;
				const is_wallet_alert = data.is_wallet_alert;

				if (unique_order_id) {
					console.log("Order tracking notification");
					this.context.router.history.push(`/running-order/${unique_order_id}`);
				}
				if (custom_notification && click_action) {
					console.log("Custom Notification");
					window.location.href = click_action;
				}
				if (is_wallet_alert) {
					this.context.router.history.push("/my-wallet");
				}
			});
		}
	};

	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey-light");
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user, alerts } = this.props;

		if (!user.success) {
			return (
				//redirect to login page if not loggedin
				<Redirect to={"/login"} />
			);
		}

		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("footerAlerts")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>

				<BackWithSearch
					boxshadow={true}
					has_title={true}
					title={localStorage.getItem("footerAlerts")}
					disable_search={true}
				/>
				<div className="block-content block-content-full mb-100">
					{alerts.length ? (
						<React.Fragment>
							<button
								className="btn btn-sm btn-clear-alerts float-right mt-50 mb-3"
								style={{ position: "relative" }}
								onClick={this.handleMarkAllRead}
							>
								{localStorage.getItem("markAllAlertReadText")} <i className="si si-check ml-1" />
								<Ink duration={500} hasTouch={true} />
							</button>
							<div className="clearfix" />
							{alerts.map((alert) => (
								<React.Fragment key={alert.id}>
									<AlertList alert={alert} handleNotificationClick={this.handleNotificationClick} />
								</React.Fragment>
							))}
						</React.Fragment>
					) : (
						<div className="text-center mt-50 font-w600 text-muted pt-100">
							<div className="pb-10">
								<i className="si si-bell" style={{ fontSize: "10rem", color: "#eee" }} />
							</div>
							<p style={{ color: "#ccc" }}>{localStorage.getItem("noNewAlertsText")}</p>
						</div>
					)}
				</div>
				<Footer active_alerts={true} />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	alerts: state.alert.alerts,
});

export default connect(
	mapStateToProps,
	{ getUserNotifications, markAllNotificationsRead, markOneNotificationRead }
)(Alerts);
