import {Router} from 'express'
import * as CourseController from '../controllers/CourseController'

const router = Router()

router.get('/getCourse/:courseId', CourseController.getCourse)


export default router;