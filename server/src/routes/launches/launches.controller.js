const {
	getAllLaunches,
	existsLaunchWithId,
	abortLaunchById,
	scheduleNewLaunch,
} = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

const httpGetAllLaunches = async (req, res) => {
	const { skip, limit } = getPagination(req.query);
	return res.status(200).json(await getAllLaunches(skip, limit));
};

const httpAddNewLaunches = async (req, res) => {
	const launch = req.body;
	if (
		!launch.mission ||
		!launch.rocket ||
		!launch.launchDate ||
		!launch.target
	) {
		return res.status(400).json({ error: 'Missing required launch property' });
	}

	launch.launchDate = new Date(launch.launchDate);
	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: 'Invalid launch date',
		});
	}
	await scheduleNewLaunch(launch);
	return res.status(201).json(launch);
};

const httpAbortLaunch = async (req, res) => {
	const id = Number(req.params.id);

	const existLaunch = existsLaunchWithId(id);
	if (!existLaunch) {
		return res.status(404).json({
			error: 'Launch not found',
		});
	}

	const aborted = await abortLaunchById(id);
	if (!aborted) {
		return res.status(400).json({
			error: 'Failed to abort launch',
		});
	}
	return res.status(200).json({ ok: aborted });
};

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunches,
	httpAbortLaunch,
};
