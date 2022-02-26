import {Router} from 'express'
import * as UserController from '../controllers/UserController'
import {passportAuthenticate} from "../utils/passport"

const router = Router();


router.get("/getUserInfo/:displayName", UserController.getUserInfo)

// Functions with authentication
router.use(passportAuthenticate('accessTokenJwt'))

router.post("/editUserInfo", UserController.editUserInfo)
router.post("/editProfilePicture", UserController.editProfilePicture)
router.post("/newUserSetup", UserController.newUserSetup)
router.get("/checkVerificationStatus", UserController.checkVerificationStatus)

export default router;