var	debug = false,
	http = require('http'),
	fs = require('fs'),
	util = require('util'),
	server = {
		host: '127.0.0.1',
		port: 4444
	},
	defaultMimeType = 'txt',
	mimeTypes = {
		html: 'text/html',
		txt: 'text/plain',
		js: 'text/javascript',
		css: 'text/css',
		jpg: 'image/jpeg',
		gif: 'image/gif',
		png: 'image/png'
	}
;

http.createServer(function (req, res) {
	if (debug) {
		console.log('dumping request:');
		console.log(util.inspect(req));
	}

	var resource = req.url;
	if (resource == '/') resource = '/index.html';

	var extension = resource.split('.').pop();

	if (! mimeTypes[extension]) extension = defaultMimeType;

	fs.readFile('./htdocs' + resource, function (err, data) {
  		if (err) {
  			res.writeHead(500, {'Content-Type': mimeTypes.txt});
		  	res.end('Error\n');
			console.log(err);
		} else {
		  	res.writeHead(200, {'Content-Type': mimeTypes[extension]});
		  	res.end(data);
		}
	});
}).listen(server.port, server.host);

console.log('Server running at http://' + server.host + ':' + server.port + '/');
