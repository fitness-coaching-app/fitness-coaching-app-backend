import { api } from '../../index'
import request from 'supertest'
import { mockCourse, mockManyUsers, mockUser } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'
import models from '../../src/models'

beforeAll(async () => {
	await mongoUtil.connect();

	let users = []
	for (var i = 0; i < 300; ++i) {
		users.push({ displayName: (Math.random() * 10000000).toString(), xp: (Math.random() * 50000) });
	}
	await mockManyUsers(users);
}, 60000)

afterAll(async () => {
	await mongoUtil.client().close();
})

const generateArray = async (limit: number, skip: number) => {
	return await (await models.users.aggregate([{
		$match: {
			status: "ACTIVE"
		}
	},
	{
		$sort: {
			xp: -1,
			displayName: 1
		}
	},
	{
		$skip: skip
	},
	{
		$limit: limit
	},
	{
		$project: {
			_id: {
				$toString: "$_id"
			},
			displayName: true,
			profilePicture: true,
			xp: true
		}
	}
	])).toArray();
}

describe('GET /leaderboard/global', () => {
	it('should calculate and fetch the global leaderboard', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 50,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateArray(50, 0);
		expect(res.body.results).toEqual(data);
	})
	it('should limit the number of leaderboard entries', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 25,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateArray(25, 0);
		expect(res.body.results).toEqual(data);
	})
	it('should limit the number of leaderboard entries [250]', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 250,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateArray(250, 0);
		expect(res.body.results).toEqual(data);
	})
	it('should be able to start the entry at a specified position', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 50,
				start: 25
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateArray(50, 24);
		expect(res.body.results).toEqual(data);
	})
	it('should reject a request with invalid parameters', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				start: 1
			})


		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
	it('should reject a request with invalid parameters', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 50
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
})