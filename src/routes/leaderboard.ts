import {Router} from 'express'
import * as LeaderboardController from '../controllers/LeaderboardController'

const router = Router()

router.get('/global', LeaderboardController.globalLeaderboard);

export default router;