'use strict';

var server = require('./server/app');
var port = process.env.PORT || 49146;

server.listen(port, function () {
    console.log('Server running on port %d', port);
});
