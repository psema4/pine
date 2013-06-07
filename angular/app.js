var testApp = angular.module('testapp', ['testapp.services']);

testApp.config(function($routeProvider) {
    $routeProvider
    .when('/Environment', {
        controller: 'envController',
        templateUrl: 'views/environment.html'
    })
    .when('/Game/:id', {
        controller: 'gameController',
        templateUrl: 'views/game.html'
    })
    .when('/Explore', {
        controller: 'storeController',
        templateUrl: 'views/store.html'
    })
    .otherwise({redirectTo: '/Environment'});

}).run(function($rootScope, $location, $window, Splash) {
    $rootScope.$on("$routeChangeStart", function(evt, next, current) {
        $window.Game = {};
    });

    $rootScope.$on("$routeChangeSuccess", function(evt, current, previous) {
        if ((! '$$route' in current) || (current.$$route == undefined)) return;

        if (current.$$route.controller == 'gameController') {
            $window.Game = { loading: true };

            var scriptContainer = document.querySelector('#gameScriptContainer');
            if (scriptContainer) {
                scriptContainer.parentNode.removeChild(scriptContainer);
            }

            scriptContainer = document.createElement('script');
            scriptContainer.async = true;
            scriptContainer.src = 'games/' + current.params.id + '/game.js';

            scriptContainer.onload = function() {
                if (Game && 'run' in Game && typeof Game.run == 'function') {
                    if (Game.splash) {
                        Game.splash.prefix = 'games/' + current.params.id + '/' + (Game.splash.prefix || '');
                        current.locals.$scope.splash(Game.splash);

                        var totalSplashDelay = Game.splash.delay * Game.splash.deck.length;
                        setTimeout(function() {
                            Game.scope = current.locals.$scope; 
                            Game.run();
                        }, totalSplashDelay);

                    } else {
                        Game.run();
                    }

                } else {
                    current.locals.$scope.splash('error.png', 6000);

                    setTimeout(function() {
                        $rootScope.$apply(function() { $location.path('/'); });
                    }, 5500);
                }
            };

            document.querySelector('head').appendChild(scriptContainer);
        }
    });
});

