import { api } from '../../index'
import request from 'supertest'
import { mockAchievement, mockUser } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'


beforeAll(async () => {
	await mongoUtil.connect();
	await mockAchievement({title: "test1"});
	await mockAchievement({title: "test2"});
	await mockAchievement({title: "test3"});
}, 10000)


describe('GET /achievement/getList',() => {
	it('should return a list of achievement', async () => {
		const res = await request(api)
			.get(`/achievement/getList`)

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Achievements fetched successfully");
		expect(res.body.error).toEqual(false);
		console.log(res.body)
		expect(res.body.results).toContainEqual({title: "test1"})
		expect(res.body.results).toContainEqual({title: "test2"})
		expect(res.body.results).toContainEqual({title: "test3"})
	})
})