const {
	httpGetAllLaunches,
	httpAddNewLaunches,
	httpAbortLaunch,
} = require('./launches.controller');

const launchesRouter = require('express').Router();

launchesRouter.get('/', httpGetAllLaunches);

launchesRouter.post('/', httpAddNewLaunches);

launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;
