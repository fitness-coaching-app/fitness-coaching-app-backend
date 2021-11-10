import express from 'express';
import router from './routes';
import * as mongoUtil from './utils/mongoUtil';
import {Request, Response, NextFunction} from 'express'
import passport from 'passport';

mongoUtil.connect().then();


const app = express()

require('./utils/passport');

app.use(passport.initialize());
app.use(router);

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Fitness Coaching Application API')
});

export const api = app;