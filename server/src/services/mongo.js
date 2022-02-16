const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_CONNECTION_STRING = process.env.MONGO_URL;

mongoose.connection.on('open', () => {
	console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
	console.error(err);
});

const mongoConnect = async () => {
	return await mongoose.connect(MONGO_CONNECTION_STRING);
};

const mongoDisconnect = async () => {
	return await mongoose.disconnect();
};

module.exports = {
	mongoConnect,
	mongoDisconnect,
};
