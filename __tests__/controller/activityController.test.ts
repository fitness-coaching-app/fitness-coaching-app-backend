import { api } from '../../index'
import request from 'supertest'
import { mockUser, mockActivity } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'
import { ObjectId } from 'mongodb';


var accessToken = "";
var activityId: ObjectId;
var activityIdPrivateAct: ObjectId;
var activityIdPrivateUser: ObjectId;
var jamieId: ObjectId;
var jackId: ObjectId;
var patricId: ObjectId;

beforeAll(async () => {
	await mongoUtil.connect();
	jamieId = (await mockUser({ displayName: "Jamie", email: "jamie2000@email.com" })).insertedId;
	jackId = (await mockUser({ displayName: "Jack", email: "jackie@email.com" })).insertedId;
	patricId = (await mockUser({ displayName: "Patric", email: "ppatricc@email.com", userPreference:{publishActivityToFollowers: false} })).insertedId;
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
	activityIdPrivateAct = (await mockActivity({userId: res.body.results.user._id, isPublic: false})).insertedId;
	activityIdPrivateUser = (await mockActivity({userId: patricId})).insertedId;
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

describe('GET /activity/{activityId}/get', () => {
	it('should fetch activity feed according to the id', async () => {
		const res = await request(api)
		.get(`/activity/${activityId.toString()}/get`)
		.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Activity fetched successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
	})
	it('should reject if the activity is private', async () => {
		const res = await request(api)
		.get(`/activity/${activityIdPrivateAct.toString()}/get`)
		.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Activity not found");
		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
	it('should reject if the owner of the activity is private', async () => {
		const res = await request(api)
		.get(`/activity/${activityIdPrivateUser.toString()}/get`)
		.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Activity not found");
		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
})

describe('GET /activity/{activityId}/reaction/add', () => {
	it('should add reaction to activity', async () => {
		const res = await request(api)
		.get(`/activity/${activityId.toString()}/reaction/add`)
		.set('Authorization', 'Bearer ' + accessToken)
		.query({
			reaction: "SMILE"
		})

		expect(res.body.message).toEqual("Reaction added successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
		expect(res.body.results.reactions[0].userId).toEqual(jamieId.toString());
		expect(res.body.results.reactions[0].reaction).toEqual("SMILE");
	})
	it('should update the reaction from the same person', async () => {
		const res = await request(api)
		.get(`/activity/${activityId.toString()}/reaction/add`)
		.set('Authorization', 'Bearer ' + accessToken)
		.query({
			reaction: "SAD"
		})

		expect(res.body.message).toEqual("Reaction added successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results.reactions[0].userId).toEqual(jamieId.toString());
		expect(res.body.results.reactions[0].reaction).toEqual("SAD");
	})
})

describe('GET /activity/{activityId}/reaction/remove', () => {
	it('should remove reaction from activity', async () => {
		const res = await request(api)
		.get(`/activity/${activityId.toString()}/reaction/remove`)
		.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Reaction removed successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
		expect(res.body.results.reactions.length).toEqual(0);
	})
})

describe('POST /activity/{activityId}/comment/add', () => {
	it('should add comment to activity', async () => {
		const res = await request(api)
		.post(`/activity/${activityId.toString()}/comment/add`)
		.set('Authorization', 'Bearer ' + accessToken)
		.send({
			comment: "test0"
		})

		expect(res.body.message).toEqual("Comment added successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
		expect(res.body.results.comments.length).toEqual(1);
		expect(res.body.results.comments[0].comment).toEqual("test0");
	})
	it('should add more comment to activity from the same person', async () => {
		const res = await request(api)
		.post(`/activity/${activityId.toString()}/comment/add`)
		.set('Authorization', 'Bearer ' + accessToken)
		.send({
			comment: "test1"
		})

		expect(res.body.message).toEqual("Comment added successfully");
		expect(res.statusCode).toEqual(200);
		expect(res.body.error).toEqual(false);
		expect(res.body.results._id).toEqual(activityId.toString());
		expect(res.body.results.comments.length).toEqual(2);
		expect(res.body.results.comments[0].comment).toEqual("test0");
		expect(res.body.results.comments[1].comment).toEqual("test1");
	})
})


