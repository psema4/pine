var methods = {};

function add_methods (name) {
  var modul = require('./' + name);
  for (var x in modul) methods[name + '.' + x] = modul[x];
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