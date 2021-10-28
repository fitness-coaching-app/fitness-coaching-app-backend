import {config} from 'dotenv';

import express from 'express';

config();

const app = express()

app.get('/test', (req, res) => {
    res.status(200).send("Fitness Coaching App")
});

app.get('/google', (req, res) => {
    res.status(200).send("Google")
});

app.get('/', (req, res) => {
    res.status(200).send('Hello World')
});

export const api = app;

