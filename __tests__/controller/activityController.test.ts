import { api } from '../../index'
import request from 'supertest'
import { mockUser, mockActivity } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'
import { ObjectId } from 'mongodb';


var accessToken = "";
var activityId;

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

	activityId = (await mockActivity({userId: jackId})).insertedId;
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


describe('GET /activity/{activityId}/get', () => {
	it('should fetch activity feed according to the id', async () => {
		const res = await request(api)
		.get(`/activity/${activityId}/feed`)

		expect(res.body.message).toEqual("Activity fetched successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
	})
	it('should reject if the owner of the activity is private', async () => {
		const res = await request(api)
		.get(`/activity/${activityId}/feed`)

		expect(res.body.message).toEqual("Activity fetched successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
	})
})

describe('GET /activity/{activityId}/reaction/add', () => {
	it('should add reaction to activity', async () => {
		const res = await request(api)
		.get(`/activity/${activityId}/reaction/add`)

		expect(res.body.message).toEqual("Reaction added successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
	})
	it('should not duplicate the reaction from the same person', async () => {
		const res = await request(api)
		.get(`/activity/${activityId}/reaction/add`)

		expect(res.body.message).toEqual("Reaction already added");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
	})
})

describe('GET /activity/{activityId}/reaction/remove', () => {
	it('should remove reaction from activity', async () => {
		const res = await request(api)
		.get(`/activity/${activityId}/reaction/add`)

		expect(res.body.message).toEqual("Reaction removed successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
	})
	it('should reject if the reaction is not found for the user', async () => {
		const res = await request(api)
		.get(`/activity/${activityId}/reaction/add`)

		expect(res.body.message).toEqual("Reaction not found");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
	})
})

describe('GET /activity/{activityId}/comment/add', () => {
	it('should add comment to activity', async () => {
		const res = await request(api)
		.get(`/activity/${activityId}/reaction/add`)

		expect(res.body.message).toEqual("Comment added successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
	})
})


