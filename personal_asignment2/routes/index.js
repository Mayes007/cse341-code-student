const express = require('express');
const router = express.Router();

router.use('/contacts', require('./contacts'))

module.exports = router;
const port= 3000;

app.listen(process.env.PORT || port);
    console.log('Web Server is listening at' + (process.env.port || port)) ;
