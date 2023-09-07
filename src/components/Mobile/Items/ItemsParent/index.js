import React, { Component } from "react";
import Desktop from "../../../Desktop";
import Items from "../../Items";

class ItemsParent extends Component {
	render() {
		return (
			<React.Fragment>
				{window.innerWidth >= 768 ? (
					<Desktop restaurant={this.props.match.params.restaurant} />
				) : (
					<Items restaurant={this.props.match.params.restaurant} history={this.props.history} />
				)}
			</React.Fragment>
		);
	}
}

export default ItemsParent;
