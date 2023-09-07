import React, { Component } from "react";

import Ink from "react-ink";

import Modal from "react-responsive-modal";

class Customization extends Component {
	state = {
		open: false,
	};

	_processAddons = (product) => {
		let addons = [];
		addons["selectedaddons"] = [];

		let radio = document.querySelectorAll("input[type=radio]:checked");
		for (let i = 0; i < radio.length; i++) {
			addons["selectedaddons"].push({
				addon_category_name: radio[i].name,
				addon_id: radio[i].getAttribute("data-addon-id"),
				addon_name: radio[i].getAttribute("data-addon-name"),
				price: radio[i].value,
			});
		}

		let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

		for (let i = 0; i < checkboxes.length; i++) {
			addons["selectedaddons"].push({
				addon_category_name: checkboxes[i].name,
				addon_id: checkboxes[i].getAttribute("data-addon-id"),
				addon_name: checkboxes[i].getAttribute("data-addon-name"),
				price: checkboxes[i].value,
			});
		}

		this.props.addProduct(Object.assign(addons, product));
	};

	handlePopupOpen = () => {
		this.setState({ open: true });
		//for forcing state update every 100ms to prevent misuse of changing addon price
		this.rerenderInterval = setInterval(() => {
			this.props.forceUpdate();
		}, 100);
	};
	handlePopupClose = () => {
		this.setState({ open: false });
		this.props.forceUpdate();
		clearInterval(this.rerenderInterval);
	};

	componentWillUnmount() {
		clearInterval(this.rerenderInterval);
	}

	render() {
		const { product } = this.props;
		return (
			<React.Fragment>
				<button
					type="button"
					className="btn btn-add-remove"
					style={{
						color: localStorage.getItem("cartColor-bg"),
					}}
					onClick={this.handlePopupOpen}
				>
					<span className="btn-inc">+</span>
					<Ink duration="500" />
				</button>
				<Modal open={this.state.open} onClose={this.handlePopupClose} closeIconSize={32}>
					<div
						style={{
							marginTop: "5rem",
							textAlign: "left",
						}}
					>
						<h3 className="mb-2">{localStorage.getItem("customizationHeading")}</h3>
						<hr className="mb-30 mt-10" style={{ borderColor: "#ccc" }} />
						{product.addon_categories.map((addon_category) => (
							<div key={addon_category.id} className="addon-category-block">
								<React.Fragment>
									<p className="addon-category-name mb-2">{addon_category.name}</p>
									{addon_category.addons.length && (
										<React.Fragment>
											{addon_category.addons.map((addon, index) => (
												<React.Fragment key={addon.id}>
													<div className="form-group addon-list">
														<input
															type={
																addon_category.type === "SINGLE" ? "radio" : "checkbox"
															}
															className={
																addon_category.type === "SINGLE"
																	? "magic-radio"
																	: "magic-checkbox"
															}
															name={addon_category.name}
															data-addon-id={addon.id}
															data-addon-name={addon.name}
															value={addon.price}
															defaultChecked={
																addon_category.type === "SINGLE" && index === 0 && true
															}
															id={`uId${addon_category.id}`}
															onClick={() => {
																if (addon_category.addon_limit > 0) {
																	var uId = addon_category.id;
																	var checks = document.querySelectorAll(
																		"#uId" + uId
																	);
																	var max = addon_category.addon_limit;
																	for (var i = 0; i < checks.length; i++) {
																		checks[i].onclick = selectiveCheck;
																		function selectiveCheck() {
																			var checkedChecks = document.querySelectorAll(
																				"#uId" + uId + ":checked"
																			);
																			if (checkedChecks.length >= max + 1)
																				return false;
																		}
																	}
																}
															}}
														/>
														{addon_category.type === "SINGLE" && (
															<label htmlFor={addon.name} />
														)}

														<label className="text addon-label" htmlFor={addon.name}>
															{addon.name}{" "}
															<span className="addon-label-price ml-1">
																{localStorage.getItem("hidePriceWhenZero") === "true" &&
																addon.price === "0.00" ? null : (
																	<React.Fragment>
																		{localStorage.getItem("currencySymbolAlign") ===
																			"left" &&
																			localStorage.getItem("currencyFormat")}
																		{addon.price}{" "}
																		{localStorage.getItem("currencySymbolAlign") ===
																			"right" &&
																			localStorage.getItem("currencyFormat")}
																	</React.Fragment>
																)}
															</span>
														</label>
													</div>
												</React.Fragment>
											))}
										</React.Fragment>
									)}
									<hr className="mb-20" />
								</React.Fragment>
							</div>
						))}
						<button
							className="btn btn-lg btn-customization-done"
							onClick={() => {
								this._processAddons(product);
								this.handlePopupClose();
							}}
							style={{
								backgroundColor: localStorage.getItem("cartColorBg"),
								color: localStorage.getItem("cartColorText"),
							}}
						>
							{localStorage.getItem("customizationDoneBtnText")}
						</button>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default Customization;
