import React, { Component } from "react";

import { connect } from "react-redux";
import { logoutUser } from "../../../../services/user/actions";
import ConfirmLogout from "./ConfirmLogout";
import Ink from "react-ink";

class Logout extends Component {
	state = {
		confirmLogoutPopupOpen: false,
	};

	openConfirmLogout = () => {
		this.setState({ confirmLogoutPopupOpen: true });
	};

	handleLogout = () => {
		this.props.logoutUser();
	};

	render() {
		return (
			<React.Fragment>
				<ConfirmLogout
					confirmLogoutOpen={this.state.confirmLogoutPopupOpen}
					handleLogout={() => this.handleLogout()}
				/>
				<div className="account-logout mx-15 position-relative" onClick={this.openConfirmLogout}>
					<div className="flex-auto logout-text">
						<i className="si si-power logout-icon mr-1" /> {localStorage.getItem("accountLogout")}
					</div>
					<Ink duration="500" />
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(
	mapStateToProps,
	{ logoutUser }
)(Logout);
