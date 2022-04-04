import {api} from '../src/index'
import request from 'supertest'

describe('POST /auth/signIn', () => {
  it('should test that signing in is successful', async () => {
    const res = await request(api)
      .post(`/auth/signIn`)
      .send({
        "email": "poramee.chansuksett@gmail.com",
        "password": "poramee"
      })
    console.log(res);
    expect(res.statusCode).toEqual(200);
  })
})
