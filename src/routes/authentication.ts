import {Router} from 'express'
import {Validator} from 'express-json-validator-middleware'
import * as AuthController from '../controllers/AuthController'
import * as schema from './validator/authenticationValidator'
import {passportAuthenticate} from "../utils/passport";

const router = Router()
const {validate} = new Validator({})

router.post('/signIn', passportAuthenticate('local'), validate({body: schema.signInSchema}), AuthController.signIn);
router.post('/register', validate({body: schema.registerSchema}), AuthController.register);
router.get('/verifyEmail/:token', AuthController.verifyEmail);

router.get('/refreshToken', passportAuthenticate('refreshTokenJwt'), AuthController.refreshToken);

export default router