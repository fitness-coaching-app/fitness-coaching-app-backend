import {Router} from 'express'
import * as ActivityController from '../controllers/ActivityController'
import { passportAuthenticate } from '../utils/passport'

const router = Router()


router.get('/:activityId/get', ActivityController.getActivityById);

router.use(passportAuthenticate('accessTokenJwt'));
router.get('/feed', ActivityController.feed);
router.get('/:activityId/reaction/add', ActivityController.addReaction);

export default router