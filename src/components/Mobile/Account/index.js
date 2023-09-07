import React, { Component } from "react";

import Footer from "../Footer";
import Logout from "./Logout";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import UserInfo from "./UserInfo";
import UserMenu from "./UserMenu";
import { connect } from "react-redux";
import { getPages } from "../../../services/pages/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";
import { updateUserInfo } from "../../../services/user/actions";
class Account extends Component {
	state = {
		avatarPopup: false,
	};
	componentDidMount() {
		const { user } = this.props;
		if (localStorage.getItem("storeColor") !== null) {
			if (user.success) {
				this.props.getPages();
				this.updateUserInfo(user);
			}
		}
	}
	updateUserInfo = () => {
		const { user } = this.props;
		this.props.updateUserInfo(user.data.id, user.data.auth_token).then((response) => {
			if (response) {
				if (response.payload.data.id) {
					this.setState({ avatarPopup: false });
				}
			}
		});
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					console.log("Fetching Translation Data...");
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	handleOnChange = (event) => {
		// console.log(event.target.value);
		this.props.getSingleLanguageData(event.target.value);
		localStorage.setItem("userPreferedLanguage", event.target.value);
	};

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user, pages } = this.props;

		if (!user.success) {
			return (
				//redirect to login page if not loggedin
				<Redirect to={"/login"} />
			);
		}
		// const languages = JSON.parse(localStorage.getItem("state")).languages;
		// console.log(languages);
		const languages = this.props.languages;

		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("footerAccount")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				<UserInfo
					user_info={user.data}
					updateUserInfo={this.updateUserInfo}
					avatarPopup={this.state.avatarPopup}
				/>

				<UserMenu pages={pages} />

				<Logout />

				<Footer active_account={true} />

				{languages && languages.length > 1 && (
					<div className="mt-4 d-flex align-items-center justify-content-center mb-100">
						<div className="mr-2">{localStorage.getItem("changeLanguageText")}</div>
						<select
							onChange={this.handleOnChange}
							defaultValue={
								localStorage.getItem("userPreferedLanguage")
									? localStorage.getItem("userPreferedLanguage")
									: languages.filter((lang) => lang.is_default === 1)[0].id
							}
							className="form-control language-select"
						>
							{languages.map((language) => (
								<option value={language.id} key={language.id}>
									{language.language_name}
								</option>
							))}
						</select>
					</div>
				)}
				<div className="mb-100" />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	pages: state.pages.pages,
	languages: state.languages.languages,
	language: state.languages.language,
});

export default connect(
	mapStateToProps,
	{ getPages, getSingleLanguageData, updateUserInfo }
)(Account);
