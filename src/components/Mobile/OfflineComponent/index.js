import React, { Component } from "react";

class OfflineComponent extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="bg-white">
					<div className="d-flex justify-content-center mt-100 mb-20">
						<img
							className="offline-mode-img text-center"
							src="/assets/img/various/offline.png"
							alt={localStorage.getItem("offlineTitleMessage")}
						/>
					</div>
					<h2 className="text-center font-w700 mb-3">{localStorage.getItem("offlineTitleMessage")}</h2>
					<h2 className="text-muted text-center font-size-md">
						{localStorage.getItem("offlineSubTitleMessage")}
					</h2>
				</div>
			</React.Fragment>
		);
	}
}

export default OfflineComponent;
