var fs = require('fs');
var express = require('express');
var mustache = require('mustache');
var packageMeta = require(__dirname + '/lib/package-meta.js');


var server = express();

server.get('/', function (req, res) {
  var template = fs.readFileSync(__dirname + '/index.html', 'utf8');
  var packageData = {
    'packageList': packageMeta.getPackageList()
  };
  var html = mustache.to_html(template, packageData);
  res.send(html);
});

server.use('/public', express.static(__dirname + '/public'));
server.use('/packages', express.static(__dirname + '/packages'));
server.use('/api', express.static(__dirname + '/../api'));

server.listen(5000);

console.log('Pine dev server is now listening on port 5000.');
console.log('Press ctrl+c to kill the server.');
