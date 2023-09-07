import React, { Component } from "react";

class V2 extends Component {
	render() {
		return (
			<React.Fragment>
				<div
					className={`d-flex ${
						localStorage.getItem("desktopV2AppDirection") === "LEFT" ? "flex-row" : "flex-row-reverse"
					}`}
				>
					<div>
						<iframe
							title="appIframe"
							src={window.location}
							frameBorder="0"
							style={{
								height: "99.5vh",
								width: "550px",
								boxShadow: "0px 0px 5px 2px #E0E0E0",
							}}
						/>
					</div>
					<div
						className="desktop-v2-wallpaper"
						style={{
							backgroundImage: `url(${localStorage.getItem("desktopV2Wallpaper")})`,
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
							width: "100%",
						}}
					>
						<div className="desktop-custom-html">
							<a href="https://google.com">
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1024px-Google_Play_Store_badge_EN.svg.png"
									alt="playstore"
								/>
							</a>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default V2;
