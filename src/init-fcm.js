import "firebase/messaging";

import * as firebase from "firebase/app";

let messaging;

if (firebase.messaging.isSupported()) {
	if (
		localStorage.getItem("firebasePublic") !== "null" &&
		localStorage.getItem("firebaseSenderId") !== "null" &&
		localStorage.getItem("firebasePublic") !== null &&
		localStorage.getItem("firebaseSenderId") !== null
	) {
		const initializedFirebaseApp = firebase.initializeApp({
			messagingSenderId: localStorage.getItem("firebaseSenderId"),
		});
		messaging = initializedFirebaseApp.messaging();
		messaging.usePublicVapidKey(localStorage.getItem("firebasePublic"));
	} else {
		const initializedFirebaseApp = firebase.initializeApp({
			messagingSenderId: "587656068333",
		});
		messaging = initializedFirebaseApp.messaging();
		messaging.usePublicVapidKey(
			"BH5L8XrGsNpki5uF1008FbZzgKKZN-NmhOwdWL5Lxh5r3nsgZ6N_Dged1IYXXCCJwpnrXzs52G_v3vM_naO0hxY"
		);
	}
}
export default messaging;
