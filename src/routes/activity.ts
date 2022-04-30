import {Router} from 'express'
import * as ActivityController from '../controllers/ActivityController'
import { passportAuthenticate } from '../utils/passport'

const router = Router()


router.use(passportAuthenticate('accessTokenJwt'));
router.get('/:activityId/get', ActivityController.getActivityById);
router.get('/feed', ActivityController.feed);
router.get('/:activityId/reaction/add', ActivityController.addReaction);
router.get('/:activityId/reaction/remove', ActivityController.removeReaction);
router.post('/:activityId/comment/add', ActivityController.addComment);

export default router