import {Router} from 'express'
import * as UserController from '../controllers/UserController'
import {passportAuthenticate} from "../utils/passport";
import * as schema from './schema/userSchema'
import {Validator} from 'express-json-validator-middleware'

const router = Router();
const {validate} = new Validator({});

router.use(passportAuthenticate('accessTokenJwt'))

router.post("/editUserInfo", validate({body: schema.editUserInfo}), UserController.editUserInfo)
router.post("/editProfilePicture", UserController.editProfilePicture)


export default router;