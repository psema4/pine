var testApp = angular.module('testapp', []);

function startupController($scope, $location, splash) {
    $scope.splash = splash;

    splash({ deck: ['splash1.png', 'splash2.png'], prefix: 'assets/splash/', delay: 3000 });
}

testApp.controller('startupController', startupController);
startupController.$inject = ['$scope', '$location', 'Splash'];

