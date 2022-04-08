import {Router} from 'express'
import * as ExerciseController from '../controllers/ExerciseController'
import { passportAuthenticate } from '../utils/passport'

const router = Router()

router.use(passportAuthenticate('accessTokenJwt'))

router.post('/complete', ExerciseController.complete)
router.post('/postExercise', ExerciseController.postExercise)


export default router;