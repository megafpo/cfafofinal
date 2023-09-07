import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

class AvatarSelector extends Component {
	state = {
		open: false,
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.avatarPopupOpen === false) {
			this.setState({ open: false });
		}
		if (nextProps.avatarPopupOpen === true) {
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
					maxWidth={false}
					fullWidth={true}
					fullScreen={true}
					open={this.state.open}
					onClose={this.handleClose}
				>
					<DialogTitle id="responsive-dialog-title">{localStorage.getItem("chooseAvatarText")}</DialogTitle>

					<div className="container">
						<div className="row">
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user1.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user1"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user2.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user2"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user3.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user3"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user4.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user4"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user5.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user5"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user6.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user6"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user7.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user7"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user8.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user8"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user9.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user9"
								/>
							</div>
							<div className="col-3">
								<img
									src="/assets/img/various/avatars/user10.gif"
									alt="Avatar"
									style={{ width: "85px" }}
									onClick={this.props.handleAvatarChange}
									data-name="user10"
								/>
							</div>
						</div>
						<div className="d-flex justify-content-center mt-50">
							<button className="btn btn-default btn-md" onClick={this.handleClose}>
								{localStorage.getItem("cancelGoBackBtn")}
							</button>
						</div>
					</div>
				</Dialog>
			</React.Fragment>
		);
	}
}

export default AvatarSelector;
