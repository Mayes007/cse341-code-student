const express = require('express');
const app = express();
const lesson1Controller = require('./controllers/lesson1');

app.get('/', lesson1Controller.sadieRoute);
app.get('/angel', lesson1Controller.angelRoute);

const port= 3000;

app.listen(process.env.PORT || port);
    console.log('Web Server is listening at' + (process.env.port || port)) ;