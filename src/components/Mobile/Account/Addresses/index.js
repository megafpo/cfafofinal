import React, { Component } from "react";
import { deleteAddress, getAddresses, saveAddress, setDefaultAddress } from "../../../../services/addresses/actions";
import { clearRestaurantList } from "../../../../services/restaurant/actions";

import AddressList from "./AddressList";
import BackWithSearch from "../../Elements/BackWithSearch";
import ContentLoader from "react-content-loader";
import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateUserInfo } from "../../../../services/user/actions";
import Loading from "../../../helpers/loading";

class Addresses extends Component {
	static contextTypes = {
		router: () => null,
	};

	state = {
		no_address: false,
		loading: false,
		restaurant_id: null,
	};

	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.add("bg-light");

		const { user } = this.props;
		if (typeof this.props.location.state !== "undefined") {
			this.setState({ restaurant_id: this.props.location.state.restaurant_id }, () => {
				if (localStorage.getItem("storeColor") !== null) {
					if (user.success) {
						this.props.getAddresses(user.data.id, user.data.auth_token, this.state.restaurant_id);
						this.props.updateUserInfo(user.data.id, user.data.auth_token);
					}
				}
			});
		} else {
			if (localStorage.getItem("storeColor") !== null) {
				if (user.success) {
					this.props.getAddresses(user.data.id, user.data.auth_token, this.state.restaurant_id);
					this.props.updateUserInfo(user.data.id, user.data.auth_token);
				}
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.addresses.length === 0) {
			this.setState({ no_address: true, loading: false });
		}
		this.setState({ loading: false });
	}

	handleSaveNewAddress = (data) => {
		const { user } = this.props;
		if (user.success) {
			this.setState({ loading: true });
			this.props.saveAddress(user.data.id, user.data.auth_token, data);
		}
	};

	handleSetDefaultAddress = (address_id, address) => {
		const { user } = this.props;
		if (user.success) {
			this.props.setDefaultAddress(user.data.id, address_id, user.data.auth_token).then(() => {
				this.setState({ loading: true });
				const saveUserSetAddress = new Promise((resolve) => {
					const userSetAddress = {
						lat: address.latitude,
						lng: address.longitude,
						address: address.address,
						house: address.house,
						tag: address.tag,
					};
					localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
					resolve("Address Saved");
				});
				saveUserSetAddress.then(() => {
					this.setState({ loading: false });
					if (localStorage.getItem("fromCart") === "1") {
						localStorage.removeItem("fromCart");
						this.context.router.history.push("/cart");
					} else {
						//remove restaurants list...
						this.props.clearRestaurantList();
						this.context.router.history.goBack();
					}
				});
			});
		}
	};

	handleDeleteAddress = (address_id) => {
		const { user } = this.props;
		if (user.success) {
			this.setState({ loading: true });
			this.props.deleteAddress(user.data.id, address_id, user.data.auth_token);
		}
	};

	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-light");
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}

		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}

		const { addresses, user } = this.props;

		if (!user.success) {
			return <Redirect to="/login" />;
		}

		return (
			<React.Fragment>
				{this.state.loading ? (
					<Loading />
				) : (
					<React.Fragment>
						<BackWithSearch
							boxshadow={true}
							has_title={true}
							title={localStorage.getItem("accountManageAddress")}
							disable_search={true}
							homeButton={true}
						/>
						<div className="block-content block-content-full pt-80 pb-80 height-100-percent">
							{addresses.length === 0 && !this.state.no_address && (
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

							{addresses.length ? (
								addresses.map((address) => (
									<AddressList
										handleDeleteAddress={this.handleDeleteAddress}
										deleteButton={true}
										key={address.id}
										address={address}
										user={user}
										fromCartPage={this.state.restaurant_id === null ? false : true}
										handleSetDefaultAddress={this.handleSetDefaultAddress}
									/>
								))
							) : (
								<div className="text-center mt-50 font-w600 text-muted">
									{localStorage.getItem("noAddressText")}
								</div>
							)}
						</div>
						<DelayLink
							to="/search-location"
							className="btn-new-address"
							style={{
								backgroundColor: localStorage.getItem("storeColor"),
								zIndex: "2",
							}}
						>
							{localStorage.getItem("buttonNewAddress")}
							<Ink duration={200} />
						</DelayLink>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	addresses: state.addresses.addresses,
});

export default connect(
	mapStateToProps,
	{
		getAddresses,
		saveAddress,
		deleteAddress,
		updateUserInfo,
		setDefaultAddress,
		clearRestaurantList,
	}
)(Addresses);
