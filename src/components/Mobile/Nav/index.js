import React, { Component } from "react";

import Ink from "react-ink";
import { Link } from "react-router-dom";

import PWAInstallation from "../PWAInstallation";

// import { Tooltip } from "@material-ui/core";
// import { withStyles } from "@material-ui/core/styles";

// const HtmlTooltip = withStyles((theme) => ({
// 	tooltip: {
// 		backgroundColor: "#4caf50",
// 		color: "#f4f4f5",
// 		fontSize: "0.75rem",
// 		padding: "6px 8px",
// 		margin: " 10px -8px",
// 		fontWeight: "400",
// 	},
// 	arrow: {
// 		color: "#4caf50",
// 	},
// }))(Tooltip);

class Nav extends Component {
	static contextTypes = {
		router: () => null,
	};
	// state = {
	// 	tooltipOpen: true,
	// };

	// componentDidMount() {
	// 	this.registerScrollEvent();
	// }

	// registerScrollEvent() {
	// 	window.addEventListener("scroll", this.scrollFunc);
	// }

	// removeScrollEvent() {
	// 	window.removeEventListener("scroll", this.scrollFunc);
	// }

	// scrollFunc = () => {
	// 	if (document.documentElement.scrollTop > 150) {
	// 		this.setState({ tooltipOpen: false });
	// 	} else {
	// 		this.setState({ tooltipOpen: true });
	// 	}
	// };

	render() {
		return (
			<React.Fragment>
				<div className="col-12 p-0 sticky-top">
					<div className="block m-0">
						<div className="block-content p-0">
							<div className="input-group search-box">
								{!this.props.disable_back_button && (
									<div className="input-group-prepend">
										<button
											type="button"
											className="btn search-navs-btns"
											style={{ position: "relative" }}
										>
											<i className="si si-arrow-left" />
											<Ink duration="500" />
										</button>
									</div>
								)}
								<p className="form-control search-input">
									{this.props.logo &&
										(this.props.logoLink ? (
											<Link to="/">
												<img
													src={`/assets/img/logos/${localStorage.getItem("storeLogo")}`}
													alt={localStorage.getItem("storeName")}
													className="store-logo"
												/>
											</Link>
										) : (
											<img
												src={`/assets/img/logos/${localStorage.getItem("storeLogo")}`}
												alt={localStorage.getItem("storeName")}
												className="store-logo"
											/>
										))}
								</p>
								<div className="input-group-append">
									<PWAInstallation type={"header"} />
									<button
										type="submit"
										className="btn nav-location truncate-text"
										style={{ position: "relative", maxWidth: window.innerWidth - 130 }}
										onClick={() => {
											this.context.router.history.push("/search-location");
										}}
									>
										{localStorage.getItem("userSetAddress") && (
											<React.Fragment>
												{JSON.parse(localStorage.getItem("userSetAddress")).businessLocation ===
												true ? (
													<span>
														{JSON.parse(localStorage.getItem("userSetAddress")).address}
													</span>
												) : (
													<span>
														{JSON.parse(localStorage.getItem("userSetAddress")).tag !==
														null ? (
															<strong className="text-uppercase mr-1">
																{JSON.parse(localStorage.getItem("userSetAddress")).tag}
															</strong>
														) : null}

														{JSON.parse(localStorage.getItem("userSetAddress")).house !==
														null ? (
															<span>
																{JSON.parse(localStorage.getItem("userSetAddress"))
																	.house.length > 12
																	? `${JSON.parse(
																			localStorage.getItem("userSetAddress")
																	  ).house.substring(0, 12)}...`
																	: JSON.parse(localStorage.getItem("userSetAddress"))
																			.house}
															</span>
														) : (
															<span>
																{JSON.parse(localStorage.getItem("userSetAddress"))
																	.address.length > 18
																	? `${JSON.parse(
																			localStorage.getItem("userSetAddress")
																	  ).address.substring(0, 18)}...`
																	: JSON.parse(localStorage.getItem("userSetAddress"))
																			.address}
															</span>
														)}
													</span>
												)}
											</React.Fragment>
										)}
										<i
											className="si si-arrow-right nav-location-icon ml-1"
											style={{ color: localStorage.getItem("storeColor") }}
										/>
										<Ink duration="500" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Nav;
