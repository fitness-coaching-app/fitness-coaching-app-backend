import {Router} from 'express'
import auth from './authentication'

const router = Router()

router.use('/auth', auth)

export default router

