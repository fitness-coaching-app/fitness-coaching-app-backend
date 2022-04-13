import {Router} from 'express'
import * as HomeController from '../controllers/HomeController'
import { passportAuthenticate } from '../utils/passport'

const router = Router()

router.use(passportAuthenticate('accessTokenJwt'))

router.get('/getSections', HomeController.getSections)


export default router;