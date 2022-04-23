import { api } from '../../index'
import request from 'supertest'
import { mockUser } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'

var accessToken = "";

beforeAll(async () => {
	await mongoUtil.connect();
	await mockUser({ displayName: "Jamie", email: "jamie2000@email.com" });
	await mockUser({ displayName: "Jack", email: "jackie@email.com" });
	await mockUser({ displayName: "Patric", email: "ppatricc@email.com" });

	await mongoUtil.db().collection('userFollowings').createIndex({followerId: 1, followingId: 1}, {unique: true});

	const res = await request(api)
		.post(`/auth/signIn`)
		.send({
			email: "jamie2000@email.com",
			password: "test"
		})

	accessToken = res.body.results.accessToken;
}, 10000)


describe('GET /user/addFollower', () => {
	it('should add follower to the list for specific user', async () => {
		const res = await request(api)
			.get(`/user/addFollower`)
			.query({
				displayName: "Jack"
			})
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Follower added successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})

	it('should not add duplicate follower and following to the list', async () => {
		const res = await request(api)
			.get(`/user/addFollower`)
			.query({
				displayName: "Jack"
			})
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Follower already added");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})

	it('should return error when the display name is not found', async () => {
		const res = await request(api)
			.get(`/user/addFollower`)
			.query({
				displayName: "Jacasdasdak"
			})
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("User Jacasdasdak not found");
		expect(res.body.error).toEqual(true);
		expect(res.statusCode).toEqual(400);
	})
})

describe('GET /user/removeFollower', () => {
	it('should remove follower to the list for specific user', async () => {
		const res = await request(api)
			.get(`/user/removeFollower`)
			.query({
				displayName: "Jack"
			})
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Follower removed successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})

	it('should notice when trying to remove a follower that is not in the list', async () => {
		const res = await request(api)
			.get(`/user/removeFollower`)
			.query({
				displayName: "Jack"
			})
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("The follower is not in the list");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})

	it('should return error when the display name is not found', async () => {
		const res = await request(api)
			.get(`/user/removeFollower`)
			.query({
				displayName: "Jacasdasdak"
			})
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("User Jacasdasdak not found");
		expect(res.body.error).toEqual(true);
		expect(res.statusCode).toEqual(400);
	})
})


describe('GET /user/getFollowerList', () => {
	it('should get follower list', async () => {
		const res = await request(api)
			.get(`/user/getFollowerList`)
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Follower list fetch successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})
	it('should reject if the token is not provided', async () => {
		const res = await request(api)
			.get(`/user/getFollowerList`)

		expect(res.body.error).toEqual(true);
		expect(res.statusCode).toEqual(401);
	})
})

describe('GET /user/getFollowingList', () => {
	it('should get following list', async () => {
		const res = await request(api)
			.get(`/user/getFollowingList`)
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Following list fetch successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})
	it('should reject if the token is not provided', async () => {
		const res = await request(api)
			.get(`/user/getFollowingList`)

		expect(res.body.error).toEqual(true);
		expect(res.statusCode).toEqual(401);
	})
})

describe('GET /user/activity', () => {
	it(`should get user's activity`, async () => {
		const res = await request(api)
			.get(`/user/activity`)
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Get user activity successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})
	it('should reject if the token is not provided', async () => {
		const res = await request(api)
			.get(`/user/activity`)

		expect(res.body.error).toEqual(true);
		expect(res.statusCode).toEqual(401);
	})
})
