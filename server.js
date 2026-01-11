const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port= 3000;

app.listen(process.env.PORT || port);
    console.log('Web Server is listening at' + (process.env.port || port)) ;