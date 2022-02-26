import {Router} from 'express'
import * as AuthController from '../controllers/AuthController'
import {passportAuthenticate} from "../utils/passport";

const router = Router()

router.post('/signIn', passportAuthenticate('local'), AuthController.signIn);
router.post('/register', AuthController.register);
router.get('/verifyEmail/:token', AuthController.verifyEmail);
router.post('/forgetPassword', AuthController.forgetPassword);

router.get('/refreshToken', passportAuthenticate('refreshTokenJwt'), AuthController.refreshToken);

export default router