import {config} from 'dotenv';

import express from 'express';

config();

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Fitness Coaching Application API')
});

export const api = app;

