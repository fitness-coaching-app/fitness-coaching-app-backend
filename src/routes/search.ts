import {Router} from 'express'
import * as SearchController from '../controllers/SearchController'

const router = Router()

router.get('', SearchController.search)


export default router;