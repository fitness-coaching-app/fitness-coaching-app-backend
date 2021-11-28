import {Router} from 'express'
import {Validator} from 'express-json-validator-middleware'
import * as CourseController from '../controllers/CourseController'
import * as validator from './validator/courseValidator'

const router = Router()
const {validate} = new Validator({})

router.get('/getCourse/:courseId', CourseController.getCourse)


export default router;