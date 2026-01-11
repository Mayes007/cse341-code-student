const express = require('express');
const app = express();
const lesson1Controller = require('./controllers/lesson1');

app.get('/', (req, res) => {
  res.send('Sadie Mayes');
});

app.get('/angel', (req, res) => {
  res.send('Angel Mayes');
});
const port= 3000;

app.listen(process.env.PORT || port);
    console.log('Web Server is listening at' + (process.env.port || port)) ;