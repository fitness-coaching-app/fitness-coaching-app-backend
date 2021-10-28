import {Router} from 'express'
import * as AuthController from '../controllers/AuthController';

const authentication = Router()

authentication.get('/sign-in', AuthController.signIn);

export default authentication