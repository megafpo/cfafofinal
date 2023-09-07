import React, { Component } from "react";
import Moment from "react-moment";
import Ink from "react-ink";

class AlertList extends Component {
	render() {
		const { alert, handleNotificationClick } = this.props;
		const data = JSON.parse(alert.data);

		return (
			<React.Fragment>
				<div className="row">
					<div className="col-md-12">
						<div
							className={`block block-link-shadow mb-3 ${alert.is_read && "bg-grey"}`}
							style={{
								boxShadow: !alert.is_read ? "rgba(225, 225, 225, 0.34) 0px 1px 4px 1px" : "0",
								opacity: !alert.is_read ? "1" : "0.8",
								pointerEvents: !alert.is_read ? "auto" : "none",
								borderRadius: "3px",
								position: "relative"
							}}
							onClick={() => handleNotificationClick(alert)}
						>
							{data.custom_image && (
								<img
									src={data.custom_image}
									className="img-fluid mb-2"
									alt={data.title}
									style={{ filter: alert.is_read ? "grayscale(0.9)" : "none" }}
								/>
							)}
							<div className="block-content block-content-full clearfix py-2">
								<span className="text-muted pull-right" style={{ fontSize: "0.9rem" }}>
									{localStorage.getItem("showFromNowDate") === "true" ? (
										<Moment fromNow>{alert.created_at}</Moment>
									) : (
										<Moment format="DD/MM/YYYY hh:mma">{alert.created_at}</Moment>
									)}
								</span>
								<div>
									<div className={`font-w600 font-size-h4 mb-5 ${alert.is_read && "text-muted"}`}>
										{data.title}
									</div>
									<div className="font-size-sm text-muted">
										{data.is_wallet_alert && data.transaction_type === "deposit" && (
											<strong className="text-success mr-2 font-size-sm">
												{localStorage.getItem("walletDepositText")}
											</strong>
										)}
										{data.is_wallet_alert && data.transaction_type === "withdraw" && (
											<strong className="text-danger mr-2 font-size-sm">
												{localStorage.getItem("walletWithdrawText")}
											</strong>
										)}
										{data.message}{" "}
									</div>
									{!alert.is_read && (
										<div className="alert-notify-bell">
											<i
												className="si si-bell"
												style={{ color: localStorage.getItem("storeColor") }}
											></i>
										</div>
									)}
								</div>
							</div>
							<Ink duration={500} hasTouch={false} />
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default AlertList;
