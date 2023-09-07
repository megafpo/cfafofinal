import React, { Component } from "react";
import AvatarSelector from "./AvatarSelector";
import { connect } from "react-redux";
import { changeAvatar } from "../../../../services/user/actions";
import Loading from "../../../helpers/loading";

class UserInfo extends Component {
	state = {
		avatarPopupOpen: false,
		loading: false,
	};
	openAvatarPopup = () => {
		this.setState({ avatarPopupOpen: true });
	};
	handleAvatarChange = (e) => {
		this.setState({ loading: true });
		this.props
			.changeAvatar(this.props.user_info.auth_token, e.target.getAttribute("data-name"))
			.then((response) => {
				if (response && response.success) {
					this.props.updateUserInfo();
					this.setState({ loading: false });
					// this.setState({ avatarPopupOpen: false });
				}
			});
	};
	componentWillReceiveProps(nextProps) {
		this.setState({ avatarPopupOpen: nextProps.avatarPopup });
	}
	render() {
		const { user_info } = this.props;
		return (
			<React.Fragment>
				{this.state.loading && <Loading />}
				<AvatarSelector
					avatarPopupOpen={this.state.avatarPopupOpen}
					handleAvatarChange={this.handleAvatarChange}
				/>
				<div className="block-content block-content-full bg-light">
					<div className="d-flex justify-content-between align-items-center">
						<div>
							<h2 className="font-w600 mb-10">{user_info.name}</h2>
							<p className="text-muted">
								{user_info.phone} <br /> {user_info.email}
							</p>
						</div>
						<div>
							{user_info.avatar == null ? (
								<img
									src="/assets/img/various/avatars/user2.gif"
									alt={user_info.name}
									style={{ width: "100px" }}
									onClick={this.openAvatarPopup}
								/>
							) : (
								<img
									src={`/assets/img/various/avatars/${user_info.avatar}.gif`}
									alt={user_info.name}
									style={{ width: "100px" }}
									onClick={this.openAvatarPopup}
								/>
							)}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(
	mapStateToProps,
	{ changeAvatar }
)(UserInfo);
