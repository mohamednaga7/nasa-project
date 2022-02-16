const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const populateLaunches = async () => {
	const { data, status } = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			select: 'name flight_number name date_local upcoming success',
			populate: [
				{
					path: 'rocket',
					select: 'name',
				},
				{
					path: 'payloads',
					select: 'customers',
				},
			],
		},
	});

	if (status !== 200) {
		console.log('Problem downloading launch data ');
		throw new Error('Launch data download failed');
	}

	const launchDocs = data.docs;
	for (const launchDoc of launchDocs) {
		const customers = launchDoc['payloads'].flatMap(
			(payload) => payload['customers']
		);
		const launch = {
			flightNumber: launchDoc['flight_number'],
			mission: launchDoc['name'],
			rocket: launchDoc['rocket']['name'],
			launchDate: launchDoc['date_local'],
			upcoming: launchDoc['upcoming'],
			success: launchDoc['success'],
			customers,
		};

		await saveLaunch(launch);
	}
};

const loadLaunchData = async () => {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: 'Falcon 1',
		mission: 'FalconSat',
	});
	if (firstLaunch) {
		console.log('Launch data already loaded');
	} else {
		await populateLaunches();
	}
};

const saveLaunch = async (launch) => {
	await launches.findOneAndUpdate(
		{ flightNumber: launch.flightNumber },
		launch,
		{
			upsert: true,
		}
	);
};

const getLatestFlightNumber = async () => {
	const latestLaunch = await launches.findOne().sort('-flightNumber');
	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}
	return latestLaunch.flightNumber;
};

const findLaunch = async (filter) => {
	return await launches.findOne(filter);
};

const existsLaunchWithId = async (launchId) => {
	return await launches.findOne({ flightNumber: launchId });
};

const getAllLaunches = async (skip, limit) => {
	return await launches
		.find({}, '-__v -_id')
		.sort({ flightNumber: 1 })
		.skip(skip)
		.limit(limit);
};

const scheduleNewLaunch = async (launch) => {
	const planet = await planets.findOne({ keplerName: launch.target });
	if (!planet) {
		throw new Error('No planet found');
	}
	const newFlightNumber = (await getLatestFlightNumber()) + 1;
	const newLaunch = Object.assign(launch, {
		flightNumber: newFlightNumber,
		success: true,
		upcoming: true,
		customers: ['ZTM', 'NASA'],
	});

	await saveLaunch(newLaunch);
};

const abortLaunchById = async (launchId) => {
	const aborted = await launches.findOneAndUpdate(
		{ flightNumber: launchId },
		{ upcoming: false, success: false }
	);
	return aborted.modifiedCount > 0;
};

module.exports = {
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
	loadLaunchData,
};
