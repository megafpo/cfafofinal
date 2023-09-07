import React, { Component } from "react";
import Modal from "react-responsive-modal";
import Ink from "react-ink";

class PagePopup extends Component {
	state = {
		open: false,
	};
	handlePopupOpen = () => {
		this.setState({ open: true });
	};
	handlePopupClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { page } = this.props;
		return (
			<React.Fragment>
				<div className="pages-badge mr-3 mb-2 position-relative" onClick={this.handlePopupOpen}>
					{page.name}
					<Ink duration="500" />
				</div>

				<Modal open={this.state.open} onClose={this.handlePopupClose} closeIconSize={32}>
					<div className="mt-50" dangerouslySetInnerHTML={{ __html: page.body }} />
				</Modal>
			</React.Fragment>
		);
	}
}

export default PagePopup;
