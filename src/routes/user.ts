import {Router} from 'express'
import * as UserController from '../controllers/UserController'
import {passportAuthenticate} from "../utils/passport"

const router = Router();


router.get("/getUserInfo/id/:userId", UserController.getUserInfoById)
router.get("/getUserInfo/:displayName", UserController.getUserInfo)
router.get("/activity/:displayName", UserController.activityDisplayName)

// Functions with authentication
router.use(passportAuthenticate('accessTokenJwt'))
router.get("/getUserInfo", UserController.getUserInfoWithToken)
router.post("/editUserInfo", UserController.editUserInfo)
router.post("/editProfilePicture", UserController.editProfilePicture)
router.post("/newUserSetup", UserController.newUserSetup)
router.get("/checkVerificationStatus", UserController.checkVerificationStatus)
router.post("/setNewPassword", UserController.setNewPassword)
router.get("/addFollower", UserController.addFollower);
router.get("/removeFollower", UserController.removeFollower);
router.get("/getFollowerList", UserController.getFollowerList);
router.get("/getFollowingList", UserController.getFollowingList);
router.get("/activity", UserController.activity);

export default router;