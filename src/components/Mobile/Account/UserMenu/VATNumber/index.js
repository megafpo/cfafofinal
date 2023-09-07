import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import { updateUserInfo, saveVATNumber } from "../../../../../services/user/actions";
import { connect } from "react-redux";

class VATNumber extends Component {
	state = {
		vatNumber: null,
	};

	handleInputChange = (e) => {
		this.setState({ vatNumber: e.target.value });
	};

	saveVATNumber = () => {
		const { user } = this.props;
		this.props.saveVATNumber(user.data.auth_token, this.state.vatNumber).then((data) => {
			if (data) {
				this.props.updateUserInfo(user.data.id, user.data.auth_token);
				this.props.handlePopup();
			}
		});
	};

	render() {
		const { user } = this.props;
		return (
			<React.Fragment>
				<Dialog
					fullWidth={true}
					fullScreen={false}
					open={this.props.open}
					onClose={this.props.handlePopup}
					style={{ width: "100%", margin: "auto" }}
					PaperProps={{ style: { backgroundColor: "#fff", borderRadius: "4px" } }}
				>
					<div className="container" style={{ borderRadius: "5px" }}>
						<React.Fragment>
							<div className="col-12 py-3 d-flex justify-content-between align-items-center">
								<h1 className="mt-2 mb-0 font-weight-black h4 text-center">
									{localStorage.getItem("accountTaxVatText")}
								</h1>
							</div>

							<div className="form-group">
								<div className="col-md-9 pb-5">
									<input
										type="text"
										name="vatnumber"
										defaultValue={
											user.data.tax_number ? user.data.tax_number : this.state.vatNumber
										}
										onChange={this.handleInputChange}
										className="form-control edit-address-input"
										autoFocus={true}
									/>

									<div className="mt-20 button-block">
										<button
											type="submit"
											className="btn btn-md btn-block text-white"
											style={{
												backgroundColor: localStorage.getItem("storeColor"),
												height: "3rem",
												textTransform: "uppercase",
											}}
											disabled={this.state.vatNumber === "" ? true : false}
											onClick={this.saveVATNumber}
										>
											{localStorage.getItem("customerVatSave")}
										</button>
									</div>
								</div>
							</div>
						</React.Fragment>
					</div>
				</Dialog>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	vat_number: state.user.vat_number,
});

export default connect(
	mapStateToProps,
	{ updateUserInfo, saveVATNumber }
)(VATNumber);
