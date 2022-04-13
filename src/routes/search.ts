import {Router} from 'express'
import * as SearchController from '../controllers/SearchController'

const router = Router()

router.get('', SearchController.search)
router.get('/getFilterParams', SearchController.getFilterParams)


export default router;