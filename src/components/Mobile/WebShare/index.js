import React, { Component } from "react";
import Ink from "react-ink";

class WebShare extends Component {
	state = {
		shareButton: false,
		androidShareButton: false,
	};
	componentDidMount() {
		if (navigator.share) {
			this.setState({ shareButton: true });
		}
		if (navigator.userAgent === "frutriAndroidWebViewUA") {
			if (window.Android !== "undefined") {
				this.setState({ shareButton: false, androidShareButton: true });
			}
		}
	}
	shareLink = (data) => {
		if (navigator.share) {
			navigator
				.share({
					url: data.link,
				})
				.then(() => console.log("Successful share"))
				.catch((error) => console.log("Error sharing", error));
		}
	};

	shareLinkViaAndroidApp = (data) => {
		if (navigator.userAgent === "frutriAndroidWebViewUA") {
			if (window.Android !== "undefined") {
				window.Android.shareDataThroughIntent(data.link);
			}
		}
	};

	render() {
		return (
			<React.Fragment>
				{this.state.shareButton && (
					<button
						type="button"
						className="btn search-navs-btns nav-share-btn"
						style={{ position: "relative" }}
						onClick={() => this.shareLink(this.props)}
					>
						<i className="si si-share" />
						<Ink duration="500" />
					</button>
				)}
				{this.state.androidShareButton && (
					<button
						type="button"
						className="btn search-navs-btns nav-share-btn"
						style={{ position: "relative" }}
						onClick={() => this.shareLinkViaAndroidApp(this.props)}
					>
						<i className="si si-share" />
						<Ink duration="500" />
					</button>
				)}
			</React.Fragment>
		);
	}
}

export default WebShare;
