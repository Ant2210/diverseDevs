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
					client_id: travelApiKey,
					client_secret: travelApiSecret,
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
		if (
			localStorage.getItem("lat") === null ||
			localStorage.getItem("long") === null
		) {
			alert("Please select a country first");
			return;
		}

		const pointsOfInterestRequest = await fetch(
			`${baseUrl}/shopping/activities?latitude=${lat}&longitude=${long}&radius=1`,
			{
				headers: {Authorization: `Bearer ${token}`},
			}
		);

		console.log(long, lat);

		if (
			localStorage.getItem("lat") === null ||
			localStorage.getItem("long") === null
		) {
			alert("Please select a country first");
		}

		if (!pointsOfInterestRequest.ok) {
			throw new Error(
				`HTTP error! Status: ${pointsOfInterestRequest.status}`
			);
		}

		const pointsOfInterestResponse = await pointsOfInterestRequest.json();
		const poiData = pointsOfInterestResponse.data.slice(0, 25);
		console.log(poiData);
		// localStorage.clear();

		if (poiData.length === 0) {
			alert("No points of interest found in the selected country");
			return;
		}

		const poiContainer = document.getElementById("poi-data");
		poiContainer.innerHTML = "";

		poiData.forEach((poi) => {
			const card = `
        <div class="card col col-md-6 my-3" style="width: 18rem;">
          <img src="${poi.pictures[0]}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${poi.name}</h5>
             <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="http://www.google.com/search?q=${poi.name}" target="_blank" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      `;
			poiContainer.innerHTML += card;
		});
	} catch (error) {
		console.log("Error fetching points of interest:", error);
	}
};

fetchPOI();
