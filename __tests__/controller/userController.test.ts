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

	const res = await request(api)
		.post(`/auth/signIn`)
		.send({
			email: "jamie2000@email.com",
			password: "test"
		})

	accessToken = res.body.results.accessToken;
}, 10000)


describe('GET /user/addFollower', async () => {
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
})

describe('GET /user/removeFollower', async () => {
	it('should remove follower to the list for specific user', async () => {
		const res = await request(api)
			.get(`/user/removeFollower`)
			.query({
				displayName: "Jack"
			})
			.set('Authorization', 'Bearer ' + accessToken)

		expect(res.body.message).toEqual("Follower removeed successfully");
		expect(res.body.error).toEqual(false);
		expect(res.statusCode).toEqual(200);
	})
})