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
		return data.access_token;
	} catch (error) {
		console.error("Error fetching the access token:", error);
	}
};

const startAtSpecificTime = (hour, minute, intervalMinutes, callback) => {
	const now = new Date();
	const start = new Date();

	start.setHours(hour, minute, 0, 0);

	if (now > start) {
		// If the time has already passed today, set it for tomorrow
		start.setDate(start.getDate() + 1);
	}

	const firstDelay = start - now;

	setTimeout(() => {
		callback(); // Execute the callback initially
		setInterval(callback, intervalMinutes * 60 * 1000); // Set the interval for subsequent executions
	}, firstDelay);
};

// Set to run at 18:40 today and then every 29 minutes
startAtSpecificTime(18, 40, 29, generateAccessToken);
