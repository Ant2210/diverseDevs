document.addEventListener("DOMContentLoaded", () => {
	const colors = [
		"#01ab48",
		"#fdd900",
		"#ff6801",
		"#ff0092",
		"#9b2a78",
		"#014ca7",
	];
	const bannedList = [
		"AF",
		"BD",
		"BN",
		"ID",
		"IR",
		"IQ",
		"KW",
		"LB",
		"MY",
		"MV",
		"MM",
		"OM",
		"PK",
		"PS",
		"QA",
		"SA",
		"LK",
		"TM",
		"AE",
		"UZ",
		"YE",
		"SZ",
		"BI",
		"CM",
		"TD",
		"KM",
		"EG",
		"ER",
		"ET",
		"GH",
		"GN",
		"KE",
		"LR",
		"LY",
		"MW",
		"MR",
		"MA",
		"NA",
		"NG",
		"SN",
		"SL",
		"SO",
		"SS",
		"SD",
		"TZ",
		"GM",
		"TG",
		"TN",
		"UG",
		"ZM",
		"ZW",
		"GD",
		"GY",
		"JM",
		"LC",
		"VC",
		"KI",
		"PG",
		"AS",
		"SB",
		"TO",
		"TV",
		"RU",
	]; // IDs of paths that should be gray

	const paths = document.querySelectorAll("#mapSVG path");
	const mapWrapper = document.querySelector("#map-wrapper");
	const svg = document.querySelector("#mapSVG");
	const zoomInButton = document.querySelector("#zoom-in");
	const zoomOutButton = document.querySelector("#zoom-out");
	const recenterButton = document.querySelector("#recenter");
	const hammer = new Hammer(mapWrapper);

	hammer.get("pan").set({direction: Hammer.DIRECTION_ALL});
	hammer.get("pinch").set({enable: true});

	let posX = 0,
		posY = 0;
	let scale = 1;
	let lastPosX = 0,
		lastPosY = 0;
	let lastScale = 1;
	let isDragging = false;

	hammer.on("panmove", (e) => {
		hideTooltips();
		isDragging = true;
		posX = lastPosX + e.deltaX;
		posY = lastPosY + e.deltaY;
		applyTransform();
	});

	hammer.on("panend", () => {
		lastPosX = posX;
		lastPosY = posY;
		setTimeout(() => {
			isDragging = false;
		}, 100);
	});

	hammer.on("pinchmove", (e) => {
		hideTooltips();
		isDragging = true;
		scale = Math.max(1, Math.min(lastScale * e.scale, 20)); // Set zoom limits
		applyTransform();
	});

	hammer.on("pinchend", () => {
		lastScale = scale;
		setTimeout(() => {
			isDragging = false;
		}, 100);
	});

	zoomInButton.addEventListener("click", () => {
		hideTooltips();
		scale = Math.min(scale * 1.2, 20);
		lastScale = scale;
		applyTransform();
	});

	zoomOutButton.addEventListener("click", () => {
		hideTooltips();
		scale = Math.max(scale / 1.2, 0.1);
		if (scale <= 0.7) {
			// Check if scale is 90% or less
			scale = 1; // Reset to original size
			posX = 0;
			posY = 0;
			lastPosX = 0;
			lastPosY = 0;
		}
		lastScale = scale;
		applyTransform();
	});

	recenterButton.addEventListener("click", () => {
		hideTooltips();
		scale = 1;
		posX = 0;
		posY = 0;
		lastPosX = 0;
		lastPosY = 0;
		lastScale = 1;
		applyTransform();
	});

	mapWrapper.addEventListener("wheel", (event) => {
		hideTooltips();
		event.preventDefault();
		if (event.deltaY < 0) {
			scale = Math.min(scale * 1.1, 20);
		} else {
			scale = Math.max(scale / 1.1, 0.1);
			if (scale <= 0.9) {
				scale = 1; // Reset to original size
				posX = 0;
				posY = 0;
				lastPosX = 0;
				lastPosY = 0;
			}
		}
		lastScale = scale;
		applyTransform();
	});

	const applyTransform = () => {
		svg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
	};

	const getRandomColor = () => {
		return colors[Math.floor(Math.random() * colors.length)];
	};

	const assignRandomColors = () => {
		paths.forEach((path) => {
			const fillColor = bannedList.includes(path.id)
				? "gray"
				: getRandomColor();
			path.setAttribute("fill", fillColor);
			path.setAttribute("data-bs-toggle", "tooltip");
			path.setAttribute("title", path.getAttribute("title"));
		});

		const tooltipTriggerList = document.querySelectorAll(
			'[data-bs-toggle="tooltip"]'
		);
		tooltipTriggerList.forEach((tooltipTriggerEl) => {
			new bootstrap.Tooltip(tooltipTriggerEl);
		});
	};

	const hideTooltips = () => {
		const tooltipTriggerList = document.querySelectorAll(
			'[data-bs-toggle="tooltip"]'
		);
		tooltipTriggerList.forEach((tooltipTriggerEl) => {
			const tooltipInstance =
				bootstrap.Tooltip.getInstance(tooltipTriggerEl);
			if (tooltipInstance) {
				tooltipInstance.hide();
			}
		});
	};

	const handleCountryClick = () => {
		paths.forEach((path) => {
			const pathTitle = path.getAttribute("title");
			path.addEventListener("click", (event) => {
				if (!isDragging) {
					if (bannedList.includes(path.id)) {
						// Show modal
						const handleModal = async () => {
							try {
								const response = await fetch(
									"/static/country-data/countries.json"
								);
								const data = await response.json();
								const countryData = data.find(
									(country) => country.countryID === path.id
								);
								const modal = new bootstrap.Modal(
									document.getElementById("bannedModal")
								);
								document.getElementById(
									"bannedModalLabel"
								).innerText = pathTitle;
								document.getElementById(
									"modal-body-country-name"
								).innerText = pathTitle;
								document.getElementById(
									"modal-criminalization"
								).innerText = countryData
									? countryData.criminalization
									: "Data not available";
								document.getElementById(
									"modal-max-penalty"
								).innerText = countryData
									? countryData.maxPenalty
									: "Data not available";

								const tooltipInstance =
									bootstrap.Tooltip.getInstance(path);
								if (tooltipInstance) {
									tooltipInstance.hide();
								}

								modal.show();
							} catch (error) {
								console.error("Error fetching data:", error);
							}
						};
						handleModal();
					} else {
						const pathUrl = `https://www.google.com/search?q=${encodeURIComponent(
							pathTitle
						)}`;
						window.open(pathUrl, "_self");
					}
				}
			});
		});
	};

	handleCountryClick();
	assignRandomColors();
});
