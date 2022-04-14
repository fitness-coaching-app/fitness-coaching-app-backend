import {Router} from 'express'
import * as AchievementController from '../controllers/AchievementController'

const router = Router()

router.get('/getList', AchievementController.getList);

export default router