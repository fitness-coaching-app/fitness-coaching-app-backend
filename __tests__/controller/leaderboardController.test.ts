import { api } from '../../index'
import request from 'supertest'
import { mockCourse, mockUser } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'

beforeAll(async () => {
	await mongoUtil.connect();

	await mockUser({displayName: "Jamie", xp: 120});
	await mockUser({displayName: "James", xp: 60});
	await mockUser({displayName: "Potter", xp: 250});
})


describe('GET /leaderboard/global', async () => {
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
	})
	it('should limit the number of leaderboard entries', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 1,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
	})
	it('should be able to start the entry at a specified position', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 50,
				start: 3
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
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