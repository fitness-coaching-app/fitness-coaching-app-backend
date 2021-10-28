import {config} from 'dotenv';
import express from 'express';
import router from './routes';

config();

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Fitness Coaching Application API')
});

app.use(router);

export const api = app;