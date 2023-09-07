import {
	LOGIN_USER,
	REGISTER_USER,
	LOGOUT_USER,
	UPDATE_USER_INFO,
	SEND_OTP,
	VERIFY_OTP,
	RUNNING_ORDER,
	GET_WALLET_TRANSACTIONS,
	SEND_PASSWORD_RESET_EMAIL,
	VERIFY_PASSWORD_RESET_OTP,
	CHANGE_USER_PASSWORD,
	SAVE_VAT_NUMBER,
	GENERATE_OTP_FOR_LOGIN,
} from "./actionTypes";

const initialState = {
	user: [],
	running_order: false,
	wallet: [],
	reset_mail: [],
	validate_email_otp: [],
	change_password: [],
	vat_number: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case LOGIN_USER:
			return { ...state, user: action.payload };
		case REGISTER_USER:
			return { ...state, user: action.payload };
		case LOGOUT_USER:
			return { ...state, user: action.payload };
		case UPDATE_USER_INFO:
			return { ...state, user: action.payload };
		case SEND_OTP:
			return { ...state, user: action.payload };
		case VERIFY_OTP:
			return { ...state, user: action.payload };
		case RUNNING_ORDER:
			return { ...state, running_order: action.payload };
		case GET_WALLET_TRANSACTIONS:
			return { ...state, wallet: action.payload };
		case SEND_PASSWORD_RESET_EMAIL:
			return { ...state, reset_mail: action.payload };
		case VERIFY_PASSWORD_RESET_OTP:
			return { ...state, validate_email_otp: action.payload };
		case CHANGE_USER_PASSWORD:
			return { ...state, change_password: action.payload };
		case SAVE_VAT_NUMBER:
			return { ...state, vat_number: action.payload };
		case GENERATE_OTP_FOR_LOGIN:
			return { ...state, user: action.payload };
		default:
			return state;
	}
}
