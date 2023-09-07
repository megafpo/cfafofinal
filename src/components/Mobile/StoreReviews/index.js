import React, { Component } from "react";
import { connect } from "react-redux";
import { getReviewsForStore } from "../../../services/rating/actions";
import Meta from "../../helpers/meta";
import BackWithSearch from "../Elements/BackWithSearch";
import Loading from "../../helpers/loading";
import RestaurantInfo from "../Items/RestaurantInfo";
import { getRestaurantInfo, getRestaurantInfoForLoggedInUser } from "../../../services/items/actions";

class StoreReviews extends Component {
	static contextTypes = {
		router: () => null,
	};

	state = {
		loading: true,
	};

	componentDidMount() {
		// console.log(this.props.match.params.slug);
		const { user } = this.props;

		user.success
			? this.props.getRestaurantInfoForLoggedInUser(this.props.match.params.slug)
			: this.props.getRestaurantInfo(this.props.match.params.slug);

		this.props.getReviewsForStore(this.props.match.params.slug).then((response) => {
			if (response) {
				this.setState({ loading: false });
			}
		});
	}
	getRatingStars = (rating) => {
		var colorClass = "rating-green";
		// 4-5 = green, 3 = orange, < 2 = red
		if (rating <= 3) {
			colorClass = "rating-orange";
		}
		if (rating <= 2) {
			colorClass = "rating-red";
		}
		return (
			<span className={"store-rating " + colorClass}>
				{rating} <i className="fa fa-star text-white" />
			</span>
		);
	};
	render() {
		const { reviews, restaurant_info } = this.props;

		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("reviewsPageTitle")}
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
					title={localStorage.getItem("reviewsPageTitle")}
					disable_search={true}
					homeButton={true}
				/>
				{this.state.loading ? (
					<Loading />
				) : (
					<React.Fragment>
						{/* <RestaurantInfo restaurant={restaurant_info} /> */}
						<RestaurantInfo
							history={this.props.history}
							restaurant={restaurant_info}
							withLinkToRestaurant={true}
						/>
						<div className="pt-20 px-15 height-100 bg-light">
							{reviews.map((review) => (
								<div className="single-review">
									<p className="mb-0">
										<strong>{review.username}</strong>{" "}
										<span className="ml-1">{this.getRatingStars(review.rating_store)}</span>
									</p>
									<p className="mb-2">{review.review_store}</p>
								</div>
							))}
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	reviews: state.rating.reviews,
	restaurant_info: state.items.restaurant_info,
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{
		getReviewsForStore,
		getRestaurantInfo,
		getRestaurantInfoForLoggedInUser,
	}
)(StoreReviews);
