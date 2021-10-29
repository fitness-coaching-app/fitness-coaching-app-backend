import {Request, Response, NextFunction, Router} from 'express'
import auth from './authentication'
import {validationError} from '../utils/responseApi'
import {ValidationError} from "express-json-validator-middleware";

const router = Router()

const validationErrorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
	if (!(error instanceof ValidationError)) next(error);

	res.status(400).json(validationError(res.statusCode, "Request Format Validation Error", error));
	next();
}

router.use('/auth', auth)

router.use(validationErrorMiddleware)

export default router

