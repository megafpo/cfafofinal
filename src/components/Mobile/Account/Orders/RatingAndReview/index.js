import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import { addRating, getOrderDetails } from "../../../../../services/rating/actions";
import { connect } from "react-redux";
import BackWithSearch from "../../../Elements/BackWithSearch";
import { Redirect } from "react-router";
import Loading from "../../../../helpers/loading";
import Ink from "react-ink";
import Meta from "../../../../helpers/meta";
import Roll from "react-reveal/Roll";

export class RateAndReview extends Component {
	static contextTypes = {
		router: () => null,
	};
	state = {
		order_id: "",
		loading: false,
		rating_store: 0,
		rating_delivery: 0,
		review_store: "",
		review_delivery: "",
		required_error: false,
		completed: false,
		rating_delivery_icon: "",
		rating_store_icon: "",
	};

	componentDidMount() {
		this.setState({ order_id: this.props.match.params.id });
		if (this.props.user.success) {
			this.setState({
				user_id: this.props.user.data.id,
				auth_token: this.props.user.data.auth_token,
			});

			this.props.getOrderDetails(this.props.match.params.id, this.props.user.data.auth_token);
		}
	}

	onDeliveryRating = (nextValue, prevValue, name) => {
		this.setState({ rating_delivery: nextValue });
		switch (nextValue) {
			case 5:
				this.setState({ rating_delivery_icon: "rating-5.png" });
				break;
			case 4:
				this.setState({ rating_delivery_icon: "rating-4.png" });
				break;

			case 3:
				this.setState({ rating_delivery_icon: "rating-3.png" });
				break;

			case 2:
				this.setState({ rating_delivery_icon: "rating-2.png" });
				break;

			case 1:
				this.setState({ rating_delivery_icon: "rating-1.png" });
				break;
			default:
				break;
		}
	};

	renderDeliveryReviewIcon = () => {
		return (
			<Roll bottom>
				<img
					src={`/assets/img/various/${this.state.rating_delivery_icon}`}
					alt="review"
					className="img-fluid review-icon"
				/>
			</Roll>
		);
	};
	renderStoreReviewIcon = () => {
		return (
			<Roll bottom>
				<img
					src={`/assets/img/various/${this.state.rating_store_icon}`}
					alt="review"
					className="img-fluid review-icon"
				/>
			</Roll>
		);
	};
	onStoreRating = (nextValue, prevValue, name) => {
		this.setState({ rating_store: nextValue });
		switch (nextValue) {
			case 5:
				this.setState({ rating_store_icon: "rating-5.png" });
				break;
			case 4:
				this.setState({ rating_store_icon: "rating-4.png" });
				break;

			case 3:
				this.setState({ rating_store_icon: "rating-3.png" });
				break;

			case 2:
				this.setState({ rating_store_icon: "rating-2.png" });
				break;

			case 1:
				this.setState({ rating_store_icon: "rating-1.png" });
				break;
			default:
				break;
		}
	};

	feedbackComment = (event) => {
		event.preventDefault();
		this.setState({ [event.target.name]: event.target.value });
	};

	submitRating = () => {
		if (this.props.order) {
			if (this.props.order.delivery_type === 1) {
				if (this.state.rating_delivery === 0 || this.state.rating_store === 0) {
					this.setState({
						required_error: true,
					});
					return;
				}
			}
			if (this.props.order.delivery_type === 2) {
				if (this.state.rating_store === 0) {
					this.setState({
						required_error: true,
					});
					return;
				}
			}
		}

		this.setState({ loading: true });
		this.props.addRating(this.state).then((response) => {
			if (response && response.payload.success) {
				//successfully saved
				this.context.router.history.goBack();
			}
		});
		this.setState({
			restaurant_rating: 0,
			delivery_rating: 0,
			comment: "",
		});
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.order !== nextProps.order) {
			this.setState({ loading: false });
			if (nextProps.order.rating !== null) {
				this.context.router.history.push("/");
			}
		}
	}

	render() {
		const { rating_store, rating_delivery } = this.state;
		console.log("Store " + rating_store);
		console.log("Delivery" + rating_delivery);
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user } = this.props;
		if (!user.success) {
			return (
				//redirect to login page if not loggedin
				<Redirect to={"/login"} />
			);
		}

		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("rarModRatingPageTitle")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				{this.state.required_error && (
					<div className="auth-error mb-50">
						<div className="error-shake">{localStorage.getItem("ratingsRequiredMessage")}</div>
					</div>
				)}
				{this.state.loading && <Loading />}
				<div className="col-12 p-0 mb-5">
					<BackWithSearch
						boxshadow={true}
						has_title={true}
						title={localStorage.getItem("rarModRatingPageTitle")}
						disable_search={true}
						goto_accounts_page={true}
					/>
				</div>
				{this.state.completed ? (
					<div className="d-flex justify-content-center pt-80">
						<img src="/assets/img/order-placed.gif" alt="Completed" className="img-fluid w-50" />
					</div>
				) : (
					<React.Fragment>
						<div className="block-content block-content-full pt-80 px-15">
							<form className="rating-form">
								{this.props.order.delivery_type === 1 && (
									<React.Fragment>
										<div className="pt-30">
											<div className="d-flex justify-content-between">
												<div className="form-group mb-0">
													<label className="col-12 text-muted">
														{localStorage.getItem("rarModDeliveryRatingTitle")}
													</label>
													<div className="col-md-9 pb-5">
														<StarRatingComponent
															name="rating_delivery"
															starCount={5}
															value={rating_delivery}
															onStarClick={this.onDeliveryRating}
														/>
													</div>
												</div>

												<div>
													{this.state.rating_delivery_icon && this.renderDeliveryReviewIcon()}
												</div>
											</div>

											<div className="form-group mb-0">
												<label className="col-12 text-muted">
													{localStorage.getItem("rarReviewBoxTitleDeliveryFeedback")}
												</label>
												<div className="col-md-9 pb-5">
													<textarea
														placeholder={localStorage.getItem(
															"rarReviewBoxTextPlaceHolderText"
														)}
														value={this.state.review_delivery}
														onChange={this.feedbackComment}
														className="feedback-textarea"
														name="review_delivery"
													/>
												</div>
											</div>
										</div>
										<hr className="mt-20" />
									</React.Fragment>
								)}
								<div className="pt-10">
									<div className="d-flex justify-content-between">
										<div className="form-group mb-0">
											<label className="col-12 text-muted">
												{localStorage.getItem("rarModRestaurantRatingTitle")}
											</label>
											<div className="col-md-9 pb-5">
												<StarRatingComponent
													name="rating_store"
													starCount={5}
													value={rating_store}
													onStarClick={this.onStoreRating}
												/>
											</div>
										</div>
										<div>{this.state.rating_store_icon && this.renderStoreReviewIcon()}</div>
									</div>
									<div className="form-group mb-0">
										<label className="col-12 text-muted">
											{localStorage.getItem("rarReviewBoxTitleStoreFeedback")}
										</label>
										<div className="col-md-9 pb-5">
											<textarea
												placeholder={localStorage.getItem("rarReviewBoxTextPlaceHolderText")}
												value={this.state.review_store}
												onChange={this.feedbackComment}
												className="feedback-textarea"
												name="review_store"
											/>
										</div>
									</div>
								</div>
								<button
									className="btn-fixed-bottom"
									style={{ backgroundColor: localStorage.getItem("storeColor") }}
									onClick={this.submitRating}
									type="button"
								>
									{localStorage.getItem("rarSubmitButtonText")}
									<Ink duration={250} />
								</button>
							</form>
						</div>
						<div className="mb-100" />
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => ({
	user: state.user.user,
	order: state.rating.order,
});

export default connect(
	mapStateToProps,
	{ addRating, getOrderDetails }
)(RateAndReview);
