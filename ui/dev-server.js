var static = require('node-static');
var file = new(static.Server)('./');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  });
}).listen(5000);

console.log('Pine dev server is now listening on port 5000.');
console.log('Press ctrl+c to kill the server.');
