import {Router} from 'express'
import * as HomeController from '../controllers/HomeController'

const router = Router()

router.get('/getSections', HomeController.getSections)


export default router;