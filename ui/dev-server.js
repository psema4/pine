var express = require('express');
var server = express();

server.configure(function(){
  server.use('/', express.static(__dirname + '/'));
});

server.listen(5000);

console.log('Pine dev server is now listening on port 5000.');
console.log('Press ctrl+c to kill the server.');
