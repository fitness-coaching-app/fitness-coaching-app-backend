import {Router} from 'express'
import * as UserController from '../controllers/UserController'
import {passportAuthenticate} from "../utils/passport";
import * as schema from './validator/userValidator'
import {Validator} from 'express-json-validator-middleware'

const router = Router();
const {validate} = new Validator({});


router.get("/getUserInfo/:displayName", UserController.getUserInfo)

// Functions with authentication
router.use(passportAuthenticate('accessTokenJwt'))

router.post("/editUserInfo", validate({body: schema.editUserInfo}), UserController.editUserInfo)
router.post("/editProfilePicture", UserController.editProfilePicture)
router.post("/newUserSetup", validate({body: schema.newUserSetup}), UserController.newUserSetup)
router.get("/checkVerificationStatus", UserController.checkVerificationStatus)

export default router;