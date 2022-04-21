import {Router} from 'express'
import * as NewsController from '../controllers/NewsController'
import { passportAuthenticate } from '../utils/passport'

const router = Router()

router.get('/fetch', NewsController.fetch)

router.use(passportAuthenticate('accessTokenJwt'))
router.get('/like/:newsId', NewsController.like)


export default router;