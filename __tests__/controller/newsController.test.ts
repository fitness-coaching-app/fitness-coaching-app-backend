import { api } from '../../index'
import request from 'supertest'
import { mockNews } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'

beforeAll(async () => {
	await mongoUtil.connect();
	await mockNews({ });


}, 10000)
afterAll(async () => {
	await mongoUtil.client().close();
})

describe('GET /news', () => {
	it('Should fetch news', async () => {
		const res = await request(api)
			.get(`/news`)

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Achievements fetched successfully");
		expect(res.body.error).toEqual(false);
		expect(res.body.results.length).toEqual(1);
	})
})