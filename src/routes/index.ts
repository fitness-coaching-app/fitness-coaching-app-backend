import {Router} from 'express'
import auth from './authentication'
import user from './user'
import course from './course'

const router = Router()

router.use('/auth', auth);
router.use('/user', user);
router.use('/course', course);

export default router;

