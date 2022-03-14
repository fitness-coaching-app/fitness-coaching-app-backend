import {Router} from 'express'
import * as CourseController from '../controllers/CourseController'

const router = Router()

router.get('/id/:courseId', CourseController.getCourseById)


export default router;