const express = require('express')
const app = express()

app.get('*/test', (req, res) => {
    res.status(200).send("Fitness Coaching App");
});

app.get('/',(req, res) => {
    res.status(200).send('Hello World');
});

exports.api = app;


