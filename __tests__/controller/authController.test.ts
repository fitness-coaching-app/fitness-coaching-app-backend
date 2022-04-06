import { api } from '../../index'
import request from 'supertest'
import { mockUser } from '../../mock_functions/mocks.mock'
import * as mongoUtil from '../../src/utils/mongoUtil'

beforeAll(async () => {
	await mongoUtil.connect();
	await mockUser({status: "VERIFICATION"});
	await mockUser({email: "test@active.com",status: "ACTIVE"});
}, 10000)

describe('POST /auth/resendVerificationEmailEmail', () => {
	it('should send the email successfully', async () => {
		const res = await request(api)
			.post(`/auth/resendVerificationEmail`)
			.send({
				email: "test@jest.com"
			})

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Verification email sent");
		expect(res.body.error).toEqual(false);
	})

	it('should not accept any request without an email specified', async () => {
		const res = await request(api)
			.post(`/auth/resendVerificationEmail`)
			.send({
				emmmaaiilll: "test@jest.com"
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.error).toEqual(true);
	})

	it('should not accept a non existence email address', async () => {
		const res = await request(api)
			.post(`/auth/resendVerificationEmail`)
			.send({
				email: "test123123@jest.com"
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toEqual("User email not found"); 
		expect(res.body.error).toEqual(true);
	})

	it('should reject a verified email', async () => {
		const res = await request(api)
			.post(`/auth/resendVerificationEmail`)
			.send({
				email: "test@active.com"
			})

		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toEqual("Account Already Verified"); 
		expect(res.body.error).toEqual(true);
	})
})
