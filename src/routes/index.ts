import {Request, Response, NextFunction, Router} from 'express'
import auth from './authentication'
import * as response from '../utils/responseApi'
import {ValidationError} from "express-json-validator-middleware";
import {MongoServerError} from "mongodb";

const router = Router()

const validationErrorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) next(error);
	else if (!(error instanceof ValidationError)) next(error);
	else res.status(400).json(response.validationError(res.statusCode, "Request Format Validation Error", error));
	next();
}

const mongoServerErrorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) next(error);
	else if (!(error instanceof MongoServerError)) next(error);
	else res.status(500).json(response.error(res.statusCode, error.toString()));
	next();
}

const otherError = (error: any, req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) next(error);
	else res.status(500).json(response.error(res.statusCode, error.toString()));
	next();
}

router.use('/auth', auth)

router.use(validationErrorMiddleware)
router.use(mongoServerErrorMiddleware)
router.use(otherError)

export default router

