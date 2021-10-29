import {Router} from 'express'
import * as AuthController from '../controllers/AuthController';

const authentication = Router()

authentication.post('/sign-in', AuthController.signIn);
authentication.post('/register', AuthController.register);

export default authentication