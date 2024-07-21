const generateAccessToken = async () => {
	try {
		const response = await fetch(
			"https://test.api.amadeus.com/v1/security/oauth2/token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "client_credentials",
					client_id: "hhGItXNOfcq9f5n4hNq3DDM5FDgy8IB1",
					client_secret: "IvMsEOBxlxFP4eOe",
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		console.log("Access Token:", data.access_token);
		token = data.access_token;
		return data.access_token;
	} catch (error) {
		console.error("Error fetching the access token:", error);
	}
};

const fetchPOI = async () => {
	const baseUrl = "https://test.api.amadeus.com/v1";
	const token = await generateAccessToken();
	const lat = localStorage.getItem("lat");
	const long = localStorage.getItem("long");

	try {
		const pointsOfInterestRequest = await fetch(
			`${baseUrl}/shopping/activities?latitude=${lat}&longitude=${long}&radius=1`,
			{
				headers: {Authorization: `Bearer ${token}`},
			}
		);

		console.log(long, lat);

		if (!pointsOfInterestRequest.ok) {
			throw new Error(
				`HTTP error! Status: ${pointsOfInterestRequest.status}`
			);
		}

		const pointsOfInterestResponse = await pointsOfInterestRequest.json();
		console.log(pointsOfInterestResponse.data);
	} catch (error) {
		console.log("Error fetching points of interest:", error);
	}
};

fetchPOI();
