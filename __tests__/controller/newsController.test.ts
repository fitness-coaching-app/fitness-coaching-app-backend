import { api } from '../../index'
import request from 'supertest'
import { mockUser, mockNews } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'

var userId = "";

beforeAll(async () => {
	await mongoUtil.connect();
	await mockNews({});
	await mockUser({});

	const res = await request(api)
		.post(`/auth/signIn`)
		.send({
			email: "test@jest.com",
			password: "test"
		})
	userId = res.body.results.user._id;

}, 10000)
afterAll(async () => {
	await mongoUtil.client().close();
})

describe('GET /news/fetch', () => {
	it('should fetch news (with userId)', async () => {
		const res = await request(api)
			.get(`/news/fetch`)
			.query({
				userId: userId
			})

		expect(res.body.message).toEqual("News fetch successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
		expect(res.body.results.length).toEqual(1);
	})
})