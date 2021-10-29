import express from 'express';
import router from './routes';
import * as mongoUtil from './utils/mongoUtil';
import {validationError} from './utils/responseApi'
import {ValidationError} from "express-json-validator-middleware"
import {Request, Response, NextFunction} from 'express'

mongoUtil.connect().then();

const app = express()
const requestSyntaxErrorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    if (res.headersSent) next(error);
    if (!(error instanceof SyntaxError)) next(error);

    res.status(400).json(validationError(res.statusCode, "Request Syntax Error", error));
    next();
}

app.get('/', (req, res) => {
    res.status(200).send('Fitness Coaching Application API')
});

app.use(router);


export const api = app;