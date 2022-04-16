import { api } from '../../index'
import request from 'supertest'
import { mockAchievement, mockUser } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'


let expectedResult: any[] = [];
beforeAll(async () => {
	await mongoUtil.connect();
	expectedResult = [
	{
		_id: (await mockAchievement({title: "test1"})).insertedId.toString(),
		title: "test1",
		description: "test",
		picture: "",
	},
	{
		_id: (await mockAchievement({title: "test2"})).insertedId.toString(),
		title: "test2",
		description: "test",
		picture: "",
	},
	{
		_id: (await mockAchievement({title: "test3"})).insertedId.toString(),
		title: "test3",
		description: "test",
		picture: "",
	},
	]
}, 10000)

afterAll(async () => {
	await mongoUtil.client().close();
})


describe('GET /achievement/getList',() => {
	it('should return a list of achievement', async () => {
		const res = await request(api)
			.get(`/achievement/getList`)

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Achievements fetched successfully");
		expect(res.body.error).toEqual(false);
		expect(res.body.results).toEqual(expectedResult);
	})
})