import {Router} from 'express'
import {Validator, ValidateFunction} from 'express-json-validator-middleware'
import * as AuthController from '../controllers/AuthController'
import * as schema from './schema/authenticationSchema'

const authentication = Router()
const {validate} = new Validator({})

authentication.post('/sign-in', AuthController.signIn);
authentication.post('/register', validate({body: schema.registerSchema as ValidateFunction}), AuthController.register);

export default authentication