import React, { Component } from "react";

class UserBan extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="bg-white">
					<div className="d-flex justify-content-center mt-100 mb-20">
						<img
							className="offline-mode-img text-center"
							src="/assets/img/various/user-ban.png"
							alt="user-ban"
						/>
					</div>

					{localStorage.getItem("userInActiveMessage") !== "<p><br></p>" &&
						localStorage.getItem("userInActiveMessage") !== "null" &&
						(localStorage.getItem("userInActiveMessage") !== "" && (
							<div
								dangerouslySetInnerHTML={{
									__html: localStorage.getItem("userInActiveMessage"),
								}}
							/>
						))}
				</div>
			</React.Fragment>
		);
	}
}

export default UserBan;
