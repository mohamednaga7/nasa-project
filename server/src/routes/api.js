const api = require('express').Router();
const launchesRouter = require('./launches/launches.router');
const planetsRouter = require('./planets/planets.router');

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;
