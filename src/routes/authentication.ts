import {Router} from 'express'
import AuthController from '../controllers/AuthController';

const authentication = Router()

authentication.get('/sign-in', AuthController.signIn);

export default authentication