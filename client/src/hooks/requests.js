const API_URL = 'api/v1';

async function httpGetPlanets() {
	// Load planets and return as JSON.
	const response = await fetch(`${API_URL}/planets`);
	return await response.json();
}

async function httpGetLaunches() {
	// Load launches, sort by flight number, and return as JSON.
	const response = await fetch(`${API_URL}/launches`);
	const fetchedResponse = await response.json();
	return fetchedResponse.sort((a, b) => a.flight_number - b.flight_number);
}

async function httpSubmitLaunch(launch) {
	// Submit given launch data to launch system.
	try {
		return await fetch(`${API_URL}/launches`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(launch),
		});
	} catch (e) {
		return {
			ok: false,
		};
	}
}

async function httpAbortLaunch(id) {
	// Delete launch with given ID.
	try {
		return await fetch(`${API_URL}/launches/${id}`, {
			method: 'DELETE',
		});
	} catch (e) {
		console.log(e);
		return {
			ok: false,
		};
	}
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };

// 3250012476153040
