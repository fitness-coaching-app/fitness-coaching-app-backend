import {Router} from 'express'
import * as NewsController from '../controllers/NewsController'

const router = Router()

router.get('/fetch', NewsController.fetch)


export default router;