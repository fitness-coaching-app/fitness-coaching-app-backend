import { api } from '../../index'
import request from 'supertest'
import { mockCourse, mockUser } from '../../mock_functions/mocks.mock'
import * as mongoUtil from '../../src/utils/mongoUtil'
import { ObjectId } from 'mongodb'

let user: any = null
let accessToken: string = ""
let refreshToken: string = ""
let courseId: string = "";

let activityId: string = ""

beforeAll(async () => {
	await mongoUtil.connect();

	await mockUser();
	courseId = (await mockCourse()).insertedId.toString();
	
	const res = await request(api)
		.post(`/auth/signIn`)
		.send({
			email: "test@jest.com",
			password: "test"
		})
	user = res.body.results.user
	accessToken = res.body.results.accessToken
	refreshToken = res.body.results.refreshToken
}, 10000)

describe('POST /exercise/complete', () => {
	it('should insert the exercise activity into database', async () => {
		const res = await request(api)
			.post(`/exercise/complete`)
			.set('Authorization', 'Bearer ' + accessToken)
			.send({
				"isPublic": true,
				"courseId": courseId,
				"duration": 100,
				"calories": 250,
				"score": 100,
				"poseData": {
					"test": 1234
				}
			})
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Exercise data is received successfully");
		expect(res.body.error).toEqual(false);

		activityId = res.body.results.activityId;
	})

	it('should require token', async () => {
		const res = await request(api)
			.post(`/exercise/complete`)
			.send({
				"isPublic": true,
				"courseId": courseId,
				"duration": 100,
				"calories": 250,
				"score": 100,
				"poseData": {
					"test": 1234
				}
			})

		expect(res.statusCode).toEqual(401);
		expect(res.body.error).toEqual(true);
	})
})

describe('POST /exercise/postExercise', () => {
	it('should update exercise data and course rating', async () => {
		const res = await request(api)
			.post(`/exercise/postExercise`)
			.set('Authorization', 'Bearer ' + accessToken)
			.send({
				"courseId": courseId,
				"activityId": activityId,
				"isPublic": false,
				"courseRating": 3
			})
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Exercise data is received successfully");
		expect(res.body.error).toEqual(false);
	})
})
