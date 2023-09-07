import React, { Component } from "react";
import Desktop from "../../../Desktop";
import SingleItem from "../SingleItem";

class SingleItemParent extends Component {
	render() {
		return (
			<React.Fragment>
				{window.innerWidth >= 768 ? (
					<Desktop restaurant={this.props.match.params.restaurant} itemId={this.props.match.params.id} />
				) : (
					<SingleItem
						restaurant={this.props.match.params.restaurant}
						itemId={this.props.match.params.id}
						history={this.props.history}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default SingleItemParent;
