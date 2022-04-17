import { api } from '../../index'
import request from 'supertest'
import { mockCourse, mockManyUsers, mockUser } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'
import models from '../../src/models'
import { ObjectId } from 'mongodb'
import { db } from '../../src/utils/mongoUtil'

let user: any = null
let accessToken: string = ""
let refreshToken: string = ""
let userFollowingList: ObjectId[] = []

beforeAll(async () => {
	await mongoUtil.connect();

	let users: any[] = []
	for (var i = 0; i < 300; ++i) {
		const displayName = (Math.random() * 10000000).toString();
		const xp = (Math.random() * 50000);
		users.push({ email: `${displayName}@jest.com`, displayName, xp, userPreference: {publishScoreToLeaderboard: Math.random() > 0.5? true: false} });
	}

	await mockManyUsers(users);

	const res = await request(api)
		.post(`/auth/signIn`)
		.send({
			email: users[0].email,
			password: "test"
		})
	user = res.body.results.user
	accessToken = res.body.results.accessToken
	refreshToken = res.body.results.refreshToken

	const userToFollow: any = await db().collection('users').find({}).limit(15).toArray();

	for (var i = 1; i <= 10; ++i) {
		await db().collection('userFollowings').insertOne({
			followerId: new ObjectId(user._id),
			followingId: userToFollow[i]._id,
			timestamp: new Date(Date.now())
		})
	}

	const followings = await (db().collection('userFollowings').aggregate([
		{
			$match: {
				followerId: new ObjectId(user._id)
			}
		},
	])).toArray();

	for (let i of followings) {
		userFollowingList.push(i.followingId);
	}
}, 60000)

afterAll(async () => {
	await mongoUtil.client().close();
})

const generateGlobalLeaderboardArray = async (limit: number, skip: number) => {
	return await (await models.users.aggregate([{
		$match: {
			status: "ACTIVE",
			userPreference:{
				publishScoreToLeaderboard: true
			}
		}
	},
	{
		$sort: {
			xp: -1,
			displayName: 1
		}
	},
	{
		$skip: skip
	},
	{
		$limit: limit
	},
	{
		$project: {
			_id: {
				$toString: "$_id"
			},
			displayName: true,
			profilePicture: true,
			xp: true
		}
	}
	])).toArray();
}


const generateFollowingsLeaderboardArray = async (limit: number, skip: number, listOfFollowings: ObjectId[]) => {
	return await (await models.users.aggregate([{
		$match: {
			_id: {
				$in: listOfFollowings
			},
			status: "ACTIVE",
			userPreference:{
				publishScoreToLeaderboard: true
			}
		}
	},
	{
		$sort: {
			xp: -1,
			displayName: 1
		}
	},
	{
		$skip: skip
	},
	{
		$limit: limit
	},
	{
		$project: {
			_id: {
				$toString: "$_id"
			},
			displayName: true,
			profilePicture: true,
			xp: true
		}
	}
	])).toArray();
}

describe('GET /leaderboard/global', () => {
	it('should calculate and fetch the global leaderboard', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 50,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateGlobalLeaderboardArray(50, 0);
		expect(res.body.results).toEqual(data);
	})
	it('should limit the number of leaderboard entries', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 25,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateGlobalLeaderboardArray(25, 0);
		expect(res.body.results).toEqual(data);
	})
	it('should limit the number of leaderboard entries [250]', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 250,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateGlobalLeaderboardArray(250, 0);
		expect(res.body.results).toEqual(data);
	})
	it('should be able to start the entry at a specified position', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 50,
				start: 25
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Global leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateGlobalLeaderboardArray(50, 24);
		expect(res.body.results).toEqual(data);
	})
	it('should reject a request with invalid parameters', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				start: 1
			})


		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
	it('should reject a request with invalid parameters', async () => {
		const res = await request(api)
			.get(`/leaderboard/global`)
			.query({
				limit: 50
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
})



describe('GET /leaderboard/followingUsers', () => {
	it('should calculate and fetch the following leaderboard', async () => {
		const res = await request(api)
			.get(`/leaderboard/followingUsers`)
			.set('Authorization', 'Bearer ' + accessToken)
			.query({
				limit: 50,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Following user leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateFollowingsLeaderboardArray(50, 0, userFollowingList);
		expect(res.body.results).toEqual(data);
	})
	it('should limit the number of leaderboard entries', async () => {
		const res = await request(api)
			.get(`/leaderboard/followingUsers`)
			.set('Authorization', 'Bearer ' + accessToken)
			.query({
				limit: 25,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Following user leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateFollowingsLeaderboardArray(25, 0, userFollowingList);
		expect(res.body.results).toEqual(data);
	})
	it('should limit the number of leaderboard entries [250]', async () => {
		const res = await request(api)
			.get(`/leaderboard/followingUsers`)
			.set('Authorization', 'Bearer ' + accessToken)
			.query({
				limit: 250,
				start: 1
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Following user leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateFollowingsLeaderboardArray(250, 0, userFollowingList);
		expect(res.body.results).toEqual(data);
	})
	it('should be able to start the entry at a specified position', async () => {
		const res = await request(api)
			.get(`/leaderboard/followingUsers`)
			.set('Authorization', 'Bearer ' + accessToken)
			.query({
				limit: 50,
				start: 5
			})


		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Following user leaderboard fetched successfully");
		expect(res.body.error).toEqual(false);
		const data = await generateFollowingsLeaderboardArray(50, 4, userFollowingList);
		expect(res.body.results).toEqual(data);
	})
	it('should reject a request with invalid parameters', async () => {
		const res = await request(api)
			.get(`/leaderboard/followingUsers`)
			.set('Authorization', 'Bearer ' + accessToken)
			.query({
				start: 1
			})


		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
	it('should reject a request with invalid parameters', async () => {
		const res = await request(api)
			.get(`/leaderboard/followingUsers`)
			.set('Authorization', 'Bearer ' + accessToken)
			.query({
				limit: 50
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
	it('should require access token', async () => {
		const res = await request(api)
			.get(`/leaderboard/followingUsers`)
			.query({
				limit: 50,
				start: 1
			})

		expect(res.statusCode).toEqual(401);
		expect(res.body.error).toEqual(true);
	})
})