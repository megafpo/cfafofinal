import React, { Component } from "react";

class Hero extends Component {
	componentDidMount() {
		if (this.props.itemId || this.props.restaurant) {
			console.log("trigger use app button");
			this.__useApp();
			setTimeout(() => {
				this.forceUpdate();
			}, 2000);
		}
	}

	__useApp = () => {
		if (this.refs.phoneView) {
			this.refs.phoneView.classList.remove("blured");
		}
		if (this.refs.phone) {
			this.refs.phone.classList.add("phone-use");
		}
		localStorage.setItem("useAppClicked", "true");
	};
	render() {
		return (
			<React.Fragment>
				<div className="container-fluid p-0 main-container-desktop">
					<div className="container">
						<div className="row">
							<div className="col-md-6">
								<div className="col-md-12 left-col">
									<img
										src={`/assets/img/logos/${localStorage.getItem("storeLogo")}`}
										alt={localStorage.getItem("storeName")}
										className="desktop-logo"
									/>
									<h1 className="desktop-title">{localStorage.getItem("desktopHeading")}</h1>
									<h3
										className="desktop-subtitle"
										dangerouslySetInnerHTML={{
											__html: localStorage.getItem("desktopSubHeading"),
										}}
									/>
									<div
										className="btn-unblur"
										onClick={this.__useApp}
										style={{
											backgroundColor: localStorage.getItem("storeColor"),
										}}
									>
										{localStorage.getItem("desktopUseAppButton")}
									</div>
								</div>
							</div>
							<div className="col-md-6 mt-50">
								<div
									className={`col-md-12 ${localStorage.getItem("useAppClicked") !== "true" &&
										"blured"}`}
									ref="phoneView"
								>
									<div
										className={`phone ${localStorage.getItem("useAppClicked") === "true" &&
											"phone-use"}`}
										ref="phone"
									>
										<div className="notch" />
										<div className="iframe-wrapper">
											<iframe
												title="appIframe"
												src={window.location}
												frameBorder="0"
												id="appIframe"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Hero;
