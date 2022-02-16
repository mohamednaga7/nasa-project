const request = require('supertest');
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planets.model');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
	beforeAll(async () => {
		await mongoConnect();
		await loadPlanetsData();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('Test Get /api/v1/launches', () => {
		test('It should respond with 200 success', async () => {
			const response = await request(app)
				.get('/api/v1/launches')
				.expect(200)
				.expect('Content-Type', /json/);
		});
	});

	describe('Test Post /launch', () => {
		const completeLaunchData = {
			mission: 'USS Enterprise',
			rocket: 'Serenity',
			launchDate: '2030-12-27',
			target: 'Kepler-1652 b',
		};

		const launchDataWithoutDate = {
			mission: 'USS Enterprise',
			rocket: 'Serenity',
			target: 'Kepler-1652 b',
		};

		const launchDataWithInvalidDate = {
			mission: 'USS Enterprise',
			rocket: 'Serenity',
			launchDate: 'wrong_date',
			target: 'Kepler-1652 b',
		};

		test('It should responsd with 200 success', async () => {
			const response = await request(app)
				.post('/api/v1/launches')
				.send(completeLaunchData)
				.expect(201)
				.expect('Content-Type', /json/);

			const requestDate = new Date(completeLaunchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();
			expect(responseDate).toBe(requestDate);
			expect(response.body).toMatchObject(launchDataWithoutDate);
		});

		test('It should catch missing required properties', async () => {
			const response = await request(app)
				.post('/api/v1/launches')
				.send(launchDataWithoutDate)
				.expect(400)
				.expect('Content-Type', /json/);

			expect(response.body).toStrictEqual({
				error: 'Missing required launch property',
			});
		});

		test('It shoudl catch invalid launch date', async () => {
			const response = await request(app)
				.post('/api/v1/launches')
				.send(launchDataWithInvalidDate)
				.expect(400)
				.expect('Content-Type', /json/);

			expect(response.body).toStrictEqual({
				error: 'Invalid launch date',
			});
		});
	});
});
