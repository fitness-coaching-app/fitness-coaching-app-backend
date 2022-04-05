import {Router} from 'express'
import auth from './authentication'
import user from './user'
import course from './course'
import home from './home'
import exercise from './exercise'

const router = Router()

router.use('/auth', auth);
router.use('/user', user);
router.use('/course', course);
router.use('/home', home);
router.use('/exercise', exercise);

export default router;

