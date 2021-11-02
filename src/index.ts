import express from 'express';
import router from './routes';
import * as mongoUtil from './utils/mongoUtil';
import {validationError} from './utils/responseApi'
import {Request, Response, NextFunction} from 'express'
import passport from 'passport';

mongoUtil.connect().then();

const app = express()
const requestSyntaxErrorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    if (res.headersSent) next(error);
    if (!(error instanceof SyntaxError)) next(error);

    res.status(400).json(validationError(res.statusCode, "Request Syntax Error", error));
    next();
}
require('./utils/passport');

app.use(passport.initialize());
// app.use(requestSyntaxErrorMiddleware);
app.use(router);

app.get('/', (req, res) => {
    res.status(200).send('Fitness Coaching Application API')
});

export const api = app;