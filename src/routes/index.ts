import {Router} from 'express'
import auth from './authentication'
import user from './user'
import course from './course'
import home from './home'
import exercise from './exercise'
import search from './search'
import achievement from './achievement'

const router = Router()

router.use('/auth', auth);
router.use('/user', user);
router.use('/course', course);
router.use('/home', home);
router.use('/exercise', exercise);
router.use('/search', search);
router.use('/achievement', achievement);

export default router;

