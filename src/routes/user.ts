import {Router} from 'express'
import * as UserController from '../controllers/UserController'

const router = Router();

router.post("/editUserInfo", UserController.editUserInfo)
router.post("/editProfilePicture/:displayName", UserController.editProfilePicture)


export default router;