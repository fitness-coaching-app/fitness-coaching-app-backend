import {Request, Response, NextFunction} from 'express'
import * as response from '../utils/responseApi'
import {MongoServerError} from "mongodb";
import {
    BadRequest,
    MethodNotAllowed,
    NotFound,
    Unauthorized
} from "express-openapi-validator/dist/framework/types";


const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) next(error);
    else if (error.status == 500) {
        if (error instanceof MongoServerError)
            res.status(500).json(response.error(res.statusCode, error.toString(), [response.ErrorCode.mongoDBError]));
        else res.status(500).json(response.error(res.statusCode, error.toString(), [response.ErrorCode.otherError]));
    } else if (error instanceof BadRequest || MethodNotAllowed || NotFound || Unauthorized) {
        res.status(error.status || 500).json(response.error(res.statusCode, error.message, [response.ErrorCode.requestError]));
    } else {
        res.status(error.status || 500).json(response.error(res.statusCode, error.toString(), [response.ErrorCode.otherError]));
    }

    next()
}

export default errorHandler;