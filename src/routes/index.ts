import {Request, Response, NextFunction, Router} from 'express'
import auth from './authentication'
import user from './user'
import * as response from '../utils/responseApi'
import {ValidationError} from "express-json-validator-middleware";
import {MongoServerError} from "mongodb";

const router = Router()

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) next(error);
	else if (error instanceof ValidationError)
		res.status(400).json(response.validationError(res.statusCode, "Request Format Validation Error", error));
	else if (error instanceof MongoServerError)
		res.status(500).json(response.error(res.statusCode, error.toString(), [response.ErrorCode.mongoDBError]));
	else
		res.status(500).json(response.error(res.statusCode, error.toString(), [response.ErrorCode.otherError]));

	next()
}

router.use('/auth', auth)
router.use('/user', user)

router.use(errorHandler)

export default router

