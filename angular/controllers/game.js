var testApp = angular.module('testapp', []);

function gameController($scope, $location, splash, $routeParams) {
    $scope.viewName = "game";
    $scope.gameid = $routeParams.id;
    $scope.splash = splash;

    $scope.setup = function() {
        var canvas = document.querySelector('canvas');
        canvas.style.top = parseInt(parseInt(window.innerHeight)/2) - 240 + 'px';
        canvas.style.left = parseInt(parseInt(window.innerWidth)/2) - 320 + 'px';
        canvas.style.visibility = 'visible';
        return canvas.getContext('2d');
    }

    $scope.quit = function() {
        $location.path('/Environment');
    }
}

testApp.controller('gameController', gameController);
gameController.$inject = ['$scope', '$location', 'Splash', '$routeParams'];
