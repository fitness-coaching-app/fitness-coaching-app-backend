import { api } from '../../index'
import request from 'supertest'
import { mockUser } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'

beforeAll(async () => {
	await mongoUtil.connect();
	await mockUser({displayName: "Jamie", email: "jamie2000@email.com"});
	await mockUser({displayName: "Jack", email: "jackie@email.com"});
	await mockUser({displayName: "Patric", email: "ppatricc@email.com"});
}, 10000)


describe('GET /search', () => {
	it('should search for user and course according to the query string', async () => {

	})
})