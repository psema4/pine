var testApp = angular.module('testapp', []);

function storeController($scope, $location) {
    $scope.viewName = "store";
    $scope.quit = function() {
        $location.path('/Environment');
    }
}

testApp.controller('storeController', storeController);
storeController.$inject = ['$scope', '$location'];

