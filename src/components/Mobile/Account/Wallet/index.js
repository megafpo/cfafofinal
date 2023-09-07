import React, { Component } from "react";

import BackWithSearch from "../../Elements/BackWithSearch";
import ContentLoader from "react-content-loader";
import { Redirect } from "react-router";
import TransactionList from "./TransactionList";
import { connect } from "react-redux";
import { getWalletTransactions } from "../../../../services/user/actions";

class Wallet extends Component {
	state = {
		no_transactions: false
	};

	componentDidMount() {
		const { user } = this.props;
		if (user.success) {
			this.props.getWalletTransactions(user.data.auth_token, user.data.id);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.wallet.transactions.length === 0) {
			this.setState({ no_transactions: true });
		}
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const { user, wallet } = this.props;

		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		if (!user.success) {
			return <Redirect to={"/login"} />;
		}
		return (
			<React.Fragment>
				<BackWithSearch
					boxshadow={true}
					has_title={true}
					title={localStorage.getItem("accountMyWallet")}
					disable_search={true}
					goto_accounts_page={true}
				/>
				<div className="block-content block-content-full pt-80 pb-80 height-100-percent px-15">
					<h3 className="btn btn-lg btn-outline-secondary btn-square d-block" style={{ borderColor: "#eee" }}>
						{localStorage.getItem("walletName")}{" "}
						<span style={{ color: localStorage.getItem("storeColor") }}>
							{localStorage.getItem("currencySymbolAlign") === "left" &&
								localStorage.getItem("currencyFormat")}
							{wallet.balance}
							{localStorage.getItem("currencySymbolAlign") === "right" &&
								localStorage.getItem("currencyFormat")}
						</span>
					</h3>
					{wallet.transactions && wallet.transactions.length === 0 && !this.state.no_transactions && (
						<ContentLoader
							height={600}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="0" y="0" rx="0" ry="0" width="75" height="22" />
							<rect x="0" y="30" rx="0" ry="0" width="350" height="18" />
							<rect x="0" y="60" rx="0" ry="0" width="300" height="18" />
							<rect x="0" y="90" rx="0" ry="0" width="100" height="18" />

							<rect x="0" y={0 + 170} rx="0" ry="0" width="75" height="22" />
							<rect x="0" y={30 + 170} rx="0" ry="0" width="350" height="18" />
							<rect x="0" y={60 + 170} rx="0" ry="0" width="300" height="18" />
							<rect x="0" y={90 + 170} rx="0" ry="0" width="100" height="18" />

							<rect x="0" y={0 + 340} rx="0" ry="0" width="75" height="22" />
							<rect x="0" y={30 + 340} rx="0" ry="0" width="350" height="18" />
							<rect x="0" y={60 + 340} rx="0" ry="0" width="300" height="18" />
							<rect x="0" y={90 + 340} rx="0" ry="0" width="100" height="18" />
						</ContentLoader>
					)}
					{wallet.transactions && wallet.transactions.length === 0 && (
						<div className="text-center mt-50 font-w600 text-muted">
							{localStorage.getItem("noWalletTransactionsText")}
						</div>
					)}

					{wallet.transactions &&
						wallet.transactions.map(transaction => (
							<TransactionList key={transaction.id} transaction={transaction} />
						))}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
	wallet: state.user.wallet
});

export default connect(mapStateToProps, { getWalletTransactions })(Wallet);
