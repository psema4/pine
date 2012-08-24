// Note: Ports, directories (like the location of the UI files), and such can be
///      configured through environment variables if that makes it easier.

// Todo: Listen to MongoDB (not sure how it will be set up, once that's figured out we can listen for it here)
// require('mongoose')

var express = require('express');
var http = require('http');
var app = exports.app = express();
var server = http.createServer(app);
var io = exports.io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/../ui'));

server.listen(4444);

require('./api').init(io);
