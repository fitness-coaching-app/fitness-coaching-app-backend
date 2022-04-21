import { api } from '../../index'
import request from 'supertest'
import { mockUser, mockNews } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'
import { ObjectId } from 'mongodb'


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

describe('GET /news/like/:newsId', () => {
	it('should register like', async () => {
		const res = await request(api)
			.get(`/news/like/${newsId}`)
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("The news is liked");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
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

describe('GET /news/unlike/:newsId', () => {
	it('should unlike the news', async () => {
		const res = await request(api)
			.get(`/news/unlike/${newsId}`)
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("The news is unliked");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})
	it('should not error when request unlike for the unliked user id', async () => {
		const res = await request(api)
			.get(`/news/unlike/${newsId}`)
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("User hasn't been liked");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})
})

describe('GET /news/fetch', () => {
	it('should fetch news (with userId)', async () => {
		// Like the news
		await request(api)
			.get(`/news/like/${newsId}`)
			.set('Authorization', 'Bearer ' + accessToken)

		const res = await request(api)
			.get(`/news/fetch`)
			.query({
				userId: userId
			})

		expect(res.body.message).toEqual("News fetch successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
		expect(res.body.results.length).toEqual(1);
		expect(res.body.results[0].userIdLike).toEqual(true);
	})

	it('should check for userId likes', async () => {
		const res = await request(api)
			.get(`/news/fetch`)
			.query({
				userId: '626047595799c972f145f890' // mock up
			})

		expect(res.body.message).toEqual("News fetch successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
		expect(res.body.results.length).toEqual(1);
		expect(res.body.results[0].userIdLike).toEqual(false);
	})
})
