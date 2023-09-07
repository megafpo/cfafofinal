import React, { Component } from "react";

class RestaurantInfo extends Component {
	render() {
		const order = this.props.order;
		return (
			<React.Fragment>
				<div className="block-content block-content-full">
					<img src={order.restaurant.image} alt={order.restaurant.name} className="restaurant-image" />
				</div>
				<div className="block-content block-content-full restaurant-info">
					<div className="font-w600 mb-5">{order.restaurant.name}</div>
					<div className="font-size-sm text-muted truncate-text">{order.restaurant.description}</div>
				</div>
			</React.Fragment>
		);
	}
}

export default RestaurantInfo;
