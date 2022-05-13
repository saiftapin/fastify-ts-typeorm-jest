import typeorm = require('typeorm');

const user = [
	{
		_id: '5f2678dff22e1f4a3c0782ee',
		name: 'John'
	}
];

const dbMock = {
	User: {
		find: jest.fn().mockReturnValue(user),
		findOne: jest.fn().mockReturnValue(user[0]),
		save: jest.fn().mockReturnValue(user[0]),
		remove: jest.fn(),
	},
};

typeorm.createConnection = jest.fn().mockReturnValue({
	getRepository: (model) => dbMock[model.name],
});

typeorm.getConnectionOptions = jest.fn().mockReturnValue({});

describe('Server', () => {
	let server;

	beforeEach(async () => {
		server = await require('../src/index');
		await server.ready();
	});

	afterAll(() => server.close());

	test('/health returns ok', (done) => {
		server.inject(
			{
				method: 'GET',
				url: '/health',
			},
			(err, res) => {
				expect(res.statusCode).toBe(200);
				expect(JSON.parse(res.payload)).toEqual({ status: 'ok' });
				done(err);
			}
		);
	});

	test('GET /user/:_id returns one of user by _id', (done) => {
		server.inject(
			{
				method: 'GET',
				url: `/user/${user[0]._id}`,
			},
			(err, res) => {
				expect(res.statusCode).toBe(200);
				expect(dbMock.User.findOne).toHaveBeenCalledWith(user[0]._id);
				expect(JSON.parse(res.payload)).toEqual(user[0]);
				done(err);
			}
		);
	});

	test('GET /user returns list of users', (done) => {
		server.inject(
			{
				method: 'GET',
				url: '/user',
			},
			(err, res) => {
				expect(res.statusCode).toBe(200);
				expect(dbMock.User.find).toHaveBeenCalledWith();
				expect(JSON.parse(res.payload)[0]).toEqual(user[0]);
				done(err);
			}
		);
	});

	test('Add user POST /user', async (done) => {
		const res = await server.inject({
			method: 'POST',
			url: '/user',
			payload: {
				_id: '5f2678dff22e1f4a3c9992ee',
				name: 'Apple Headphone',
				category: 'Electronic appliances',
				unit: 2
			}
		});
		expect(res.statusCode).toBe(201);
		done();
	});

	test('Update User POST /user/:id', async (done) => {
		const res = await server.inject({
			method: 'PUT',
			url: '/user/5f2678dff22e1f4a3c0782ee',
			payload: {
				unit: 2
			}
		});
		expect(res.statusCode).toBe(200);
		done();
	});

	test('DELETE /user/:id deletes a user', (done) => {
		const { _id } = user[0];
		server.inject(
			{
				method: 'DELETE',
				url: `/user/${_id}`,
			},
			(err, res) => {
				expect(res.statusCode).toBe(200);
				expect(dbMock.User.findOne).toHaveBeenCalledWith(_id);
				expect(dbMock.User.remove).toHaveBeenCalledWith(user[0]);
				done(err);
			}
		);
	});
});
