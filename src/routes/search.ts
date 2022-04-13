import {Router} from 'express'
import * as SearchController from '../controllers/SearchController'
import { passportAuthenticate } from '../utils/passport'

const router = Router()

router.get('/getFilterParams', SearchController.getFilterParams)

router.use(passportAuthenticate('accessTokenJwt'))
router.get('', SearchController.search)



export default router;