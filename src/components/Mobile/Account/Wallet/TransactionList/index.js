import React, { Component } from "react";

import Moment from "react-moment";

class TransactionList extends Component {
	render() {
		const { transaction } = this.props;
		return (
			<React.Fragment>
				<div className="slider-wrapper transaction-wrapper">
					<div className="d-flex">
						<div className="mr-4">
							{transaction.type === "deposit" && (
								<span className="btn btn-square btn-sm btn-outline-success min-width-125">
									{localStorage.getItem("walletDepositText")}
								</span>
							)}
							{transaction.type === "withdraw" && (
								<span className="btn btn-square btn-sm btn-outline-danger min-width-125">
									{localStorage.getItem("walletWithdrawText")}
								</span>
							)}
						</div>
						<div className="mr-4 font-w700">
							{localStorage.getItem("currencySymbolAlign") === "left" &&
								localStorage.getItem("currencyFormat")}
							{transaction.amount / 100}
							{localStorage.getItem("currencySymbolAlign") === "right" &&
								localStorage.getItem("currencyFormat")}
						</div>
						<div className="mr-4">{transaction.meta["description"]}</div>
						<div className="mr-4">
							{localStorage.getItem("showFromNowDate") === "true" ? (
								<Moment fromNow>{transaction.created_at}</Moment>
							) : (
								<Moment format="DD/MM/YYYY hh:mma">{transaction.created_at}</Moment>
							)}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default TransactionList;
