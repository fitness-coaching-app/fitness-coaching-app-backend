import {Router} from 'express'
import * as ActivityController from '../controllers/ActivityController'
import { passportAuthenticate } from '../utils/passport'

const router = Router()

router.use(passportAuthenticate('accessTokenJwt'));
router.get('/feed', ActivityController.feed);

export default router