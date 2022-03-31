import {Router} from 'express'
import auth from './authentication'
import user from './user'
import course from './course'
import home from './home'

const router = Router()

router.use('/auth', auth);
router.use('/user', user);
router.use('/course', course);
router.use('/home', home);

export default router;

