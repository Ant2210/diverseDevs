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

	const loader = document.getElementById("loader");
	const poiDataContainer = document.getElementById("poi-data");
	const searchResults = document.getElementById("search-results");
	const mapAnimation = document.getElementById("map-animation");

	loader.classList.remove("d-none");
	poiDataContainer.innerHTML = "";
	searchResults.classList.add("d-none");
	mapAnimation.classList.add("d-none");

	try {
		if (!lat || !long) {
			poiDataContainer.innerHTML =
				"Search for beautiful places in any city";
			loader.classList.add("d-none");
			mapAnimation.classList.remove("d-none");
			return;
		}

		const pointsOfInterestRequest = await fetch(
			`${baseUrl}/shopping/activities?latitude=${lat}&longitude=${long}&radius=1`,
			{
				headers: {Authorization: `Bearer ${token}`},
			}
		);

		if (!pointsOfInterestRequest.ok) {
			throw new Error(
				`HTTP error! Status: ${pointsOfInterestRequest.status}`
			);
		}

		const pointsOfInterestResponse = await pointsOfInterestRequest.json();
		const poiData = pointsOfInterestResponse.data.slice(0, 25);

		if (poiData.length === 0) {
			document.getElementById("poi-data").innerHTML =
				"Sorry, there was a problem fetching the data. Please try again later.";
			loader.classList.add("d-none");
			mapAnimation.classList.remove("d-none");
			return;
		}

		const truncateDescription = (description, maxLength) => {
			if (!description) {
				return "No further info, click on More info to find out more";
			}
			return description.length > maxLength
				? description.slice(0, maxLength) + "..."
				: description;
		};

		const poiContainer = document.getElementById("poi-data");
		poiContainer.innerHTML = "";

		poiData.forEach((poi) => {
			const imageUrl =
				poi.pictures[0] === undefined ? noImage : poi.pictures[0];
			const description = poi.description
				? truncateDescription(poi.description, 100)
				: "No further info, click on More info to find out more";
			const card = `
        <div class="card col-6 my-3 p-0 mx-auto" style="width: 18rem;">
          <div class="card-img-container">
						<img src="${imageUrl}" class="card-img-top" alt="...">
					</div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${poi.name}</h5>
             <p class="card-text flex-grow-1">${description}</p>
            <a href="http://www.google.com/search?q=${poi.name}" target="_blank" class="btn btn-primary mt-auto">More info</a>
          </div>
        </div>
      `;
			poiContainer.innerHTML += card;
		});
		loader.classList.add("d-none");
		searchResults.classList.remove("d-none");
		searchResults.innerHTML = `Showing results for ${localStorage.getItem(
			"city"
		)}`;
		localStorage.clear();
	} catch (error) {
		console.log("Error fetching points of interest:", error);
		loader.classList.add("d-none");
		mapAnimation.classList.remove("d-none");
	}
};

fetchPOI();

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const searchInput = document.getElementById("search-input");
	const searchValue = searchInput.value.trim();
	const latsAndLongs = [
		{
			country: "India",
			city: "Bangalore",
			lat: 12.9716,
			long: 77.5946,
		},
		{
			country: "Spain",
			city: "Barcelona",
			lat: 41.3851,
			long: 2.1734,
		},
		{
			country: "Germany",
			city: "Berlin",
			lat: 52.52,
			long: 13.405,
		},
		{
			country: "United Kingdom",
			city: "London",
			lat: 51.5074,
			long: -0.1278,
		},
		{
			country: "United States",
			city: "New York",
			lat: 40.7128,
			long: -74.006,
		},
		{
			country: "France",
			city: "Paris",
			lat: 48.8566,
			long: 2.3522,
		},
	];

	const selectedLocation = latsAndLongs.find(
		(obj) =>
			obj.country.toLowerCase() === searchValue.toLowerCase() ||
			obj.city.toLowerCase() === searchValue.toLowerCase()
	);

	if (selectedLocation) {
		localStorage.setItem("lat", selectedLocation.lat);
		localStorage.setItem("long", selectedLocation.long);
		localStorage.setItem("city", selectedLocation.city);
		fetchPOI();
	} else {
		document.getElementById("search-results").classList.add("d-none");
		document.getElementById("poi-data").innerHTML =
			"Sorry, your search did not match any results. We are always adding new cities and countries. Please try again soon.";
		document.getElementById("map-animation").classList.remove("d-none");
	}
});
