import React, { Component } from "react";

import DelayLink from "../../../helpers/delayLink";

import PagePopup from "./PagePopup";
import VATNumber from "./VATNumber";
import Ink from "react-ink";

import Flip from "react-reveal/Flip";

class UserMenu extends Component {
	state = {
		open: false,
	};
	handleVATNumber = () => {
		this.setState({ open: !this.state.open });
	};

	render() {
		const { pages } = this.props;
		return (
			<React.Fragment>
				<h6 className="mx-15 mt-3">{localStorage.getItem("accountMyAccount")}</h6>

				<div className="account-menu ml-15 my-3">
					<div className="my-account-menu-item-block col p-0 mr-3">
						<DelayLink to={"/my-addresses"} delay={200}>
							<div className="text-center my-account-menu-item">
								<Flip top delay={100}>
									<div>
										<i className="si si-home" />
									</div>
								</Flip>
							</div>
							<div className="text-center">{localStorage.getItem("accountManageAddress")}</div>
							<Ink duration="500" />
						</DelayLink>
					</div>

					<div className="my-account-menu-item-block col p-0 mr-3">
						<DelayLink to={"/my-orders"} delay={200}>
							<div className="text-center my-account-menu-item">
								<Flip top delay={250}>
									<div>
										<i className="si si-bag" />
									</div>
								</Flip>
							</div>
							<div className="text-center">{localStorage.getItem("accountMyOrders")}</div>
							<Ink duration="500" />
						</DelayLink>
					</div>

					<div className="my-account-menu-item-block col p-0 mr-3">
						<DelayLink to={"/my-wallet"} delay={200}>
							<div className="text-center my-account-menu-item">
								<Flip top delay={350}>
									<div>
										<i className="si si-wallet" />
									</div>
								</Flip>
							</div>
							<div className="text-center">{localStorage.getItem("accountMyWallet")}</div>
							<Ink duration="500" />
						</DelayLink>
					</div>

					<div className="my-account-menu-item-block col p-0 mr-3">
						<DelayLink to={"/my-favorite-stores"} delay={200}>
							<div className="text-center my-account-menu-item">
								<Flip top delay={450}>
									<div>
										<i className="si si-heart" />
									</div>
								</Flip>
							</div>
							<div className="text-center">{localStorage.getItem("accountMyFavouriteStores")}</div>
							<Ink duration="500" />
						</DelayLink>
					</div>

					{localStorage.getItem("showCustomerVatNumber") === "true" && (
						<div className="my-account-menu-item-block col p-0 mr-3" onClick={this.handleVATNumber}>
							<div className="text-center my-account-menu-item">
								<Flip top delay={550}>
									<div>
										<i className="si si-tag" />
									</div>
								</Flip>
							</div>
							<div className="text-center">{localStorage.getItem("accountTaxVatText")}</div>
							<Ink duration="500" />
						</div>
					)}
				</div>

				<div className="mx-15 my-3">
					<h6>{localStorage.getItem("accountHelpFaq")}</h6>
					<div className="account-pages">
						{pages.map((page) => (
							<div key={page.id}>
								<PagePopup page={page} />
							</div>
						))}
					</div>
				</div>

				<VATNumber handlePopup={this.handleVATNumber} open={this.state.open} user_info={this.props.user_info} />
			</React.Fragment>
		);
	}
}

export default UserMenu;
