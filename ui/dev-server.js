var fs = require('fs');
var express = require('express');
var server = express();

server.get('/', function (req, res) {
  var html = fs.readFileSync(__dirname + '/index.html', 'utf8');
  res.send(html);
});

server.use('/public', express.static(__dirname + '/public'));
server.use('/packages', express.static(__dirname + '/packages'));
server.use('/api', express.static(__dirname + '/../api'));

server.listen(5000);

console.log('Pine dev server is now listening on port 5000.');
console.log('Press ctrl+c to kill the server.');
