import React, { Component } from "react";
import Home from "./Home";

class Mobile extends Component {
	state = {
		showGdpr: false,
	};
	componentDidMount() {
		setTimeout(() => {
			if (document.getElementsByClassName("popup-content")[0]) {
				document.getElementsByClassName("popup-content")[0].style.backgroundColor = "transparent";
			}
		}, 100);

		if (!localStorage.getItem("gdprAccepted")) {
			localStorage.setItem("gdprAccepted", "false");
			if (localStorage.getItem("showGdpr") === "true") {
				this.setState({ showGdpr: true });
			}
		}

		if (localStorage.getItem("showGdpr") === "true" && localStorage.getItem("gdprAccepted") === "false") {
			this.setState({ showGdpr: true });
		}
	}
	handleGdprClick = () => {
		localStorage.setItem("gdprAccepted", "true");
		this.setState({ showGdpr: false });
	};
	render() {
		return (
			<React.Fragment>
				{this.state.showGdpr && (
					<div className="fixed-gdpr-mobile">
						<span
							dangerouslySetInnerHTML={{
								__html: localStorage.getItem("gdprMessage"),
							}}
						/>
						<span>
							<button
								className="btn btn-sm ml-2"
								style={{ backgroundColor: localStorage.getItem("storeColor") }}
								onClick={this.handleGdprClick}
							>
								{localStorage.getItem("gdprConfirmButton")}
							</button>
						</span>
					</div>
				)}
				<Home languages={this.props.languages} />
			</React.Fragment>
		);
	}
}

export default Mobile;
