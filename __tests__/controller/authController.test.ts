import { api } from '../../index'
import request from 'supertest'
import { mockCourse, mockUser } from '../../mock_functions/mocks.mock'
import * as mongoUtil from '../../src/utils/mongoUtil'
import { ObjectId } from 'mongodb'

let user: any = null
let accessToken: string = ""
let refreshToken: string = ""
let courseId: string = "";

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

describe('GET /auth/resendVerificationEmail', () => {
	it('should send the email successfully', async () => {
		const res = await request(api)
			.post(`/auth/resendVerification`)
			.send({
				email: "test@jest.com"
			})

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Exercise data is received successfully");
		expect(res.body.error).toEqual(false);
	})

	it('should not accept any request without an email specified', async () => {
		const res = await request(api)
			.post(`/auth/resendVerification`)
			.send({
				emmmaaiilll: "test@jest.com"
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})

	it('should not accept a non existence email address', async () => {
		const res = await request(api)
			.post(`/auth/resendVerification`)
			.send({
				email: "test123123@jest.com"
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})

	it('should reject a verified email', async () => {
		const res = await request(api)
			.post(`/auth/resendVerification`)
			.send({
				email: "test@jest.com"
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})
})
