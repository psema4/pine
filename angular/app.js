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

}).run(function($rootScope, $location, $templateCache, $window, Splash) {
    $rootScope.$on("$routeChangeStart", function(evt, next, current) {
        // try to remove as many dom-refs as possible - particularly the reference to canvas, stored within Game.ctx [created in gameController.$scope.setup()]
        for (var key in $window.Game) {
            delete $window.Game[key];
        };
        $window.Game = {};

        // try to clear ng's template cache
        //console.log('$templaceCach.info():', $templateCache.info());
        $templateCache.removeAll();

        // force garbage collection if available
        //
        //   note: chrome requires --js-flags=--expose-gc
        //         eg. bash$ /usr/bin/google-chrome --js-flags=--expose-gc
        //
        if ('gc' in $window && typeof $window.gc == 'function') {
            $window.gc();
        }
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
                    var startGame = function() {
                        Game.scope = current.locals.$scope; 
                        Game.run();
                    };

                    if (Game.splash) {
                        Game.splash.prefix = 'games/' + current.params.id + '/' + (Game.splash.prefix || '');
                        current.locals.$scope.splash(Game.splash);

                        var totalSplashDelay = Game.splash.delay * Game.splash.deck.length;
                        setTimeout(startGame, totalSplashDelay);

                    } else {
                        startGame();
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

