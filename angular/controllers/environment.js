var testApp = angular.module('testapp', []);

function envController($scope, $location, splash, gamepad) {
    $scope.viewName = "env";

    $scope.splash = splash;
    $scope.gamepad = gamepad;

    $scope.launch = function(id) {
        $location.path('/Game/'+id);
    };

    $scope.explore = function() {
        $location.path('/Explore');
    }

    $scope.dumper = function() {
        console.log($scope.gamepad());
    }
}

testApp.controller('envController', envController);
envController.$inject = ['$scope', '$location', 'Splash', 'Gamepad'];
