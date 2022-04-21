import { api } from '../../index'
import request from 'supertest'
import { mockUser, mockNews } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'
27082708
var userId = "";
var accessToken = "";
var newsId = "";

beforeAll(async () => {
	await mongoUtil.connect();
	newsId = (await mockNews({})).insertedId.toString();
	await mockUser({});

	const res = await request(api)
		.post(`/auth/signIn`)
		.send({
			email: "test@jest.com",
			password: "test"
		})
	userId = res.body.results.user._id;
	accessToken = res.body.results.accessToken;

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

describe('GET /news/like/:newsId', () => {
	it('should register like', async () => {
		const res = await request(api)
			.get(`/news/like/${newsId}`)
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("The news is liked");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
		expect(res.body.results.length).toEqual(1);
	})
	it('should not register duplicate like', async () => {
		const res = await request(api)
			.get(`/news/like/${newsId}`)
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("User already liked");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})
})
