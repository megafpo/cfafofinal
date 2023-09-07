import React, { Component } from "react";
import { cancelOrder, getOrders } from "../../../../services/orders/actions";
import { GET_ORDERS_URL } from "../../../../configs";
import BackWithSearch from "../../Elements/BackWithSearch";
import ContentLoader from "react-content-loader";
import OrderList from "./OrderList";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import Axios from "axios";
import Meta from "../../../helpers/meta";

class Orders extends Component {
	state = {
		no_orders: false,
		cancelSuccess: false,
		orders: [],
		next_page: GET_ORDERS_URL,
		loading: false,
		loading_more: false,
	};

	componentDidMount() {
		const { user } = this.props;
		if (user.success) {
			this.__getOrders(user.data.auth_token);
		}
	}

	__getOrders = (token) => {
		if (!this.state.loading) {
			this.setState({
				loading: true,
			});
			this.registerScrollEvent();
			Axios.post(this.state.next_page, {
				token: token,
			}).then((response) => {
				const paginator = response.data;
				const orders = paginator.data;
				// console.log("Next Page URL: " + paginator.next_page_url);
				if (orders.length) {
					this.setState({
						orders: [...this.state.orders, ...orders],
						next_page: paginator.next_page_url,
						loading: false,
						loading_more: false,
					});
				} else {
					this.setState({
						orders: [],
						loading: false,
						loading_more: false,
					});
				}

				if (!paginator.next_page_url) {
					this.removeScrollEvent();
				}
			});
		}
	};

	registerScrollEvent() {
		window.addEventListener("scroll", this.scrollFunc);
	}

	removeScrollEvent() {
		window.removeEventListener("scroll", this.scrollFunc);
	}

	scrollFunc = () => {
		if (
			document.documentElement.scrollTop + 50 + window.innerHeight > document.documentElement.offsetHeight ||
			document.documentElement.scrollTop + 50 + window.innerHeight === document.documentElement.offsetHeight
		) {
			const { user } = this.props;
			this.setState({ loading_more: true });
			this.__getOrders(user.data.auth_token);
		}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.cancel !== nextProps.cancel) {
			//call to handle afterCancellation from parent
			if (nextProps.cancel.success) {
				this.setState({ cancelSuccess: true });
				const { user } = this.props;
				if (user.success) {
					// this.props.getOrders(user.data.auth_token);
					window.location.reload();
				}
			}
		}
	}

	componentWillUnmount() {
		this.removeScrollEvent();
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const { user } = this.props;
		const { orders } = this.state;
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		if (!user.success) {
			return <Redirect to={"/login"} />;
		}
		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("accountMyOrders")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				<BackWithSearch
					boxshadow={true}
					has_title={true}
					title={localStorage.getItem("accountMyOrders")}
					disable_search={true}
					goto_accounts_page={true}
					homeButton={true}
				/>
				{this.state.cancelSuccess && (
					<div className="auth-error cancel-success">
						<div className="">{localStorage.getItem("orderCancelledText")}</div>
					</div>
				)}
				<div className="block-content block-content-full pt-80 pb-80 height-100-percent px-15">
					{this.state.loading && (
						<ContentLoader
							height={500}
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
					{!this.state.loading && orders.length === 0 && (
						<div className="text-center mt-50 font-w600 text-muted">
							{localStorage.getItem("noOrdersText")}
						</div>
					)}
					{orders.map((order) => (
						<OrderList
							key={order.id}
							order={order}
							user={user}
							cancelOrder={this.props.cancelOrder}
							cancel={this.props.cancel}
						/>
					))}
					{this.state.loading_more && (
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
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	// orders: state.orders.orders,
	cancel: state.orders.cancel,
});

export default connect(
	mapStateToProps,
	{ getOrders, cancelOrder }
)(Orders);
