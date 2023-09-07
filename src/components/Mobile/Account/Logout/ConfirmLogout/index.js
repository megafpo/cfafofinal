import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";

class ConfirmLogout extends Component {
	state = {
		open: false,
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.confirmLogoutOpen === false) {
			this.setState({ open: false });
		}
		if (nextProps.confirmLogoutOpen === true) {
			this.setState({ open: true });
		}
	}

	handleClose = () => {
		this.setState({ open: false });
	};
	render() {
		return (
			<React.Fragment>
				<Dialog
					fullWidth={true}
					fullScreen={false}
					open={this.state.open}
					onClose={this.handleClose}
					style={{ width: "200px", margin: "auto" }}
					PaperProps={{ style: { backgroundColor: "#fff", borderRadius: "10px" } }}
				>
					<div className="container" style={{ borderRadius: "10px" }} onClick={this.props.handleLogout}>
						<div className="row d-flex justify-content-center mt-30 mb-10 align-items-center flex-column">
							<i className="si si-power logout-icon" style={{ fontSize: "3.2rem" }} />
							<div className="d-flex justify-content-center my-10 text-uppercase font-w700">
								{localStorage.getItem("accountLogout")}
							</div>
						</div>
					</div>
				</Dialog>
			</React.Fragment>
		);
	}
}

export default ConfirmLogout;
