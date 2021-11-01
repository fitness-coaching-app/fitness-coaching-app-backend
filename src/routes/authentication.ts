import {Router} from 'express'
import {Validator} from 'express-json-validator-middleware'
import * as AuthController from '../controllers/AuthController'
import * as schema from './schema/authenticationSchema'

const authentication = Router()
const {validate} = new Validator({})

authentication.post('/sign-in', validate({body: schema.signInSchema}), AuthController.signIn);
authentication.post('/register', validate({body: schema.registerSchema}), AuthController.register);
authentication.get('/verifyEmail/:token', AuthController.verifyEmail);

export default authentication