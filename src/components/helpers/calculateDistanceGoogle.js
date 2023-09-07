import { calculateDistance } from "./calculateDistance";

const calculateDistanceGoogle = (lon1, lat1, lon2, lat2, google, fn) => {
	const origins = [{ lat: parseFloat(lat1), lng: parseFloat(lon1) }];
	const destinations = [{ lat: parseFloat(lat2), lng: parseFloat(lon2) }];
	const travelMode = google.maps.TravelMode.DRIVING;
	const service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
		{
			origins: origins,
			destinations: destinations,
			travelMode: travelMode,
		},
		(response, status) => {
			console.log("RESPONSE", response);
			console.log("STATUS", response.rows[0].elements[0].status);

			if (response.rows[0].elements[0].status === "OK") {
				let distance = (response.rows[0].elements[0].distance.value / 1000).toFixed(1);
				fn(distance);
			} else {
				console.log("Falling back to basic distance calculation");
				let distance = calculateDistance(lon1, lat1, lon2, lat2);
				fn(distance);
			}
		}
	);
};

export default calculateDistanceGoogle;
