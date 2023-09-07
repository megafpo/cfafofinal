import React, { Component } from "react";

class ItemBadge extends Component {
	render() {
		return (
			<React.Fragment>
				<span className="item-badge-collection">
					{this.props.item.is_recommended === 1 ? (
						<span
							className="item-badge"
							style={{ backgroundColor: localStorage.getItem("recommendedBadgeColor") }}
						>
							{localStorage.getItem("recommendedBadgeText")}
						</span>
					) : null}
					{this.props.item.is_popular === 1 ? (
						<span
							className="item-badge"
							style={{ backgroundColor: localStorage.getItem("popularBadgeColor") }}
						>
							{localStorage.getItem("popularBadgeText")}
						</span>
					) : null}
					{this.props.item.is_new === 1 ? (
						<span className="item-badge" style={{ backgroundColor: localStorage.getItem("newBadgeColor") }}>
							{localStorage.getItem("newBadgeText")}
						</span>
					) : null}
				</span>
			</React.Fragment>
		);
	}
}

export default ItemBadge;
