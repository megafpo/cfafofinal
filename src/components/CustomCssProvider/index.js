import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

class CustomCssProvider extends Component {
	render() {
		return (
			<React.Fragment>
				{localStorage.getItem("customCSS") !== null && (
					<Helmet>
						{/* load light mode css for delivery app */}
						{localStorage.getItem("deliveryAppLightMode") === "true" && (
							<link
								rel="stylesheet"
								type="text/css"
								href="/assets/css/delivery-app-light.css?v=2.9.1-BUILD-01"
							/>
						)}
						<style type="text/css">{localStorage.getItem("customCSS")}</style>
					</Helmet>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	settings: state.settings.settings,
});

export default connect(
	mapStateToProps,
	{}
)(CustomCssProvider);
