import {Router} from 'express'
import auth from './authentication'
import user from './user'
import course from './course'
import home from './home'
import exercise from './exercise'
import search from './search'
import achievement from './achievement'
import leaderboard from './leaderboard'
import news from './news'
import activity from './activity'

const router = Router()

router.use('/auth', auth);
router.use('/user', user);
router.use('/course', course);
router.use('/home', home);
router.use('/exercise', exercise);
router.use('/search', search);
router.use('/achievement', achievement);
router.use('/leaderboard', leaderboard);
router.use('/news', news);
router.use('/activity', activity);

export default router;

