angular.module('testapp.services')
.factory('Gamepad', [function() {
    return function() {
        var pollData = {
            supported: !!navigator.webkitGetGamepads || !!navigator.webkitGamepads
          , connected: false
        };

        return pollData;
    }
}]);
