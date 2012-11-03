var express = require('express');
var server = express();

server.use(express.static(__dirname + '/'));
server.use('/public', express.static(__dirname + '/public'));

//TODO(jeremyckahn): Serving the api/ directory like this is a little silly.  I
//tried to symlink it in the public/ directory, but it wasn't working for
//whatever reason.  This might be a limitation of Express.  Try to straighten
//this out.
server.use('/api', express.static(__dirname + '/../api'));

server.listen(5000);

console.log('Pine dev server is now listening on port 5000.');
console.log('Press ctrl+c to kill the server.');
