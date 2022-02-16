const express = require('express');
const planetsRouter = require('./routes/planets/planets.router');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const launchesRouter = require('./routes/launches/launches.router');
const api = require('./routes/api');

const app = express();

app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/v1', api);

app.get('/**', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
