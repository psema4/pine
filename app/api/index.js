var methods = {};

function add_methods (name) {
  var module = require('./' + name);
  for (var x in module) methods[name + '.' + x] = module[x];
}

// Add methods for each api call
add_methods('achievements');

exports.init = function (io) {
  
  // Listen for API calls on each socket as they connect (ex: achievements.incr)
  io.sockets.on('connection', function (sock) {
    sock.on('api_call', function (name, args) {
      methods[name].apply(null, args);
    });
  });
};