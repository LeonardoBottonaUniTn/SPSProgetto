var Express = require ("express");
var bodyParser = require ("body-parser");
var fs = require('fs');
'use strict';

var server = require('./server/app');
var port = process.env.PORT || 49146;

server.listen(port, function () {
    console.log('Server running on port %d', port);
});

var cors = require('cors');
app.use(cors());


app.get ('/proprieta', (requenst, response) => {
    const userRouter = require ('./proprieta');
    var data = fs.readFileSync ('proprieta.json');
    var myObj = JSON.parse (data);
    response.send (myObj);
})
