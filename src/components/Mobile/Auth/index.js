import React, { Component } from "react";

import Login from "./Login";
import Meta from "../../helpers/meta";
import OtpLogin from "./OtpLogin";
import { connect } from "react-redux";

class Auth extends Component {
	state = {
		enOLnR: "",
	};
	componentDidMount() {
		const enOLnR = this.props.settings && this.props.settings.find((data) => data.key === "enOLnR");
		this.setState({ enOLnR: enOLnR.value });
	}

	render() {
		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("seoMetaTitle")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				{this.state.enOLnR === "true" ? <OtpLogin /> : <Login />}
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
)(Auth);
