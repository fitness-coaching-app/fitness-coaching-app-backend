import {Router} from 'express'
import * as LeaderboardController from '../controllers/LeaderboardController'
import { passportAuthenticate } from '../utils/passport'

const router = Router()

router.get('/global', LeaderboardController.globalLeaderboard);
router.get('/me', LeaderboardController.me);

router.use(passportAuthenticate('accessTokenJwt'));
router.get('/followingUsers', LeaderboardController.followingUsers);

export default router;