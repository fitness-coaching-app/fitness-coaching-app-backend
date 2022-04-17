import { api } from '../../index'
import request from 'supertest'
import { mockUser, mockCourse } from '../helper/mocks'
import * as mongoUtil from '../../src/utils/mongoUtil'

beforeAll(async () => {
	await mongoUtil.connect();
	await mockUser({ displayName: "Jamie", email: "jamie2000@email.com" });
	await mockUser({ displayName: "Jack", email: "jackie@email.com" });
	await mockUser({ displayName: "Patric", email: "ppatricc@email.com" });

	await mockCourse({ name: "Jumping Jacks", description: "Exercise", category: "exercise" })


}, 10000)



describe.skip('GET /search', () => {
	it('should search for user and course according to the query string', async () => {
		const res = await request(api)
			.get(`/search`)
			.query({
				q: 'Jamie'
			})
			console.log(res.body);
		const userResult: any[] = res.body.results.users;
		let userFound = [false, false, false];
		for(let i of userResult){
			if(i.displayName == 'Jamie'){
				userFound[0] = true;
			}
			if(i.displayName == 'Jack'){
				userFound[0] = true;
			}
			if(i.displayName == 'Patric'){
				userFound[0] = true;
			}
		}

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Searching has been done successfully");
		expect(res.body.error).toEqual(false);
		expect(userFound).toEqual([true, false, false])
	})
	it('should be able to perform partial search of the name and email', async () => {

	})
})