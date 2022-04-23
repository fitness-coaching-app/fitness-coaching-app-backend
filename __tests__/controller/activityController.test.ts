import { api } from '../../index'
import request from 'supertest'
import { mockUser, mockActivity } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'
import { ObjectId } from 'mongodb';


var accessToken = "";

beforeAll(async () => {
	await mongoUtil.connect();
	await mockUser({ displayName: "Jamie", email: "jamie2000@email.com" });
	const jackId = (await mockUser({ displayName: "Jack", email: "jackie@email.com" })).insertedId;
	const patricId = (await mockUser({ displayName: "Patric", email: "ppatricc@email.com", userPreference:{publishActivityToFollowers: false} })).insertedId;
	const res = await request(api)
		.post(`/auth/signIn`)
		.send({
			email: "jamie2000@email.com",
			password: "test"
		})

	await mongoUtil.db().collection('userFollowings').insertMany([
		{followerId: new ObjectId(res.body.results.user._id), followingId: jackId},
		{followerId: new ObjectId(res.body.results.user._id), followingId: patricId},
		])

	accessToken = res.body.results.accessToken;

	await mockActivity({userId: jackId})
	await mockActivity({userId: patricId})
}, 10000)


describe('GET /activity/feed', () => {
	it('should return activity feed of the followers', async () => {
		const res = await request(api)
		.get(`/activity/feed`)
		.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Get activity feed successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results.length).toEqual(1);
	})
})


