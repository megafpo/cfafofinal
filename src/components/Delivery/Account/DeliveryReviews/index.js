import React, { Component } from "react";

class DeliveryReviews extends Component {
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
		return (
			<React.Fragment>
				<div className="delivery-account-orders-block p-15 mb-20">
					<p className="mb-0">
						<span className="ml-1">{this.getRatingStars(this.props.rating)}</span>
					</p>
					<p className="mb-2">{this.props.review}</p>
				</div>
			</React.Fragment>
		);
	}
}

export default DeliveryReviews;
