import React, { Component } from "react";

class OrderComment extends Component {
	state = {
		comment: "",
	};

	componentDidMount() {
		this.setState({ comment: localStorage.getItem("orderComment") });
	}

	handleInput = (event) => {
		this.setState({ comment: event.target.value });
		localStorage.setItem("orderComment", event.target.value);
	};

	render() {
		return (
			<React.Fragment>
				<textarea
					className="form-control order-comment"
					type="text"
					placeholder={localStorage.getItem("cartSuggestionPlaceholder")}
					onChange={this.handleInput}
					value={this.state.comment || ""}
					rows="1"
				/>
			</React.Fragment>
		);
	}
}

export default OrderComment;
