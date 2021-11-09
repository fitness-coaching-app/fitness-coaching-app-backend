import {Router} from 'express'
import * as UserController from '../controllers/UserController'
import {passportAuthenticate} from "../utils/passport";

const router = Router();

router.use(passportAuthenticate('accessTokenJwt'))

router.post("/editUserInfo", UserController.editUserInfo)
router.post("/editProfilePicture/:displayName", UserController.editProfilePicture)


export default router;