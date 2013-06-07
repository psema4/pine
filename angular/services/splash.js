angular.module('testapp.services', [])
.factory('Splash', [function() {
    return function() {
        var delay = arguments[1] || 6000
          , start = false
          , images = []
          , prefix = ''
          , ptr = 0
          , handler = function(images, delay, prefix) {
                var el = document.querySelector('#splash');

                if (ptr == 0) {
                    el.style.display = 'block';
                }

                if (++ptr == images.length+1) {
                    el.style.display = 'none';

                } else {
                    el.innerHTML = '<img id="splash-' + (ptr-1) + '" class="splash-img" src="' + prefix + images[ptr-1] + '" style="visibility: hidden;" />';

                    setTimeout(function() {
                        var el = document.querySelector('img.splash-img')
                            screenW = window.innerWidth
                          , screenH = window.innerHeight
                          , imgW = parseInt(window.getComputedStyle(el).width)
                          , imgH = parseInt(window.getComputedStyle(el).height)
                        ;

                        console.log('set image, center. screen w/h: ', screenW, screenH, ', img w/h:', imgW, imgH);

                        var halfScreenW = parseInt(screenW/2)
                          , halfScreenH = parseInt(screenH/2)
                          , halfImageW = parseInt(imgW/2)
                          , halfImageH = parseInt(imgH/2)
                        ;

                        el.style.position = 'absolute';
                        el.style.top = halfScreenH - halfImageH + 'px';
                        el.style.left = halfScreenW - halfImageW + 'px';
                        el.style.visibility = 'visible';
                    }, 0);

                    setTimeout(function() { handler(images, delay, prefix); }, delay);
                }
            }
        ;

        if (typeof arguments[0] == 'string') {
            start = true;
            images.push(arguments[0]);

        } else if (arguments[0] && 'deck' in arguments[0]) {
            if ('delay' in arguments[0]) {
                delay = arguments[0].delay;
            }

            start = true;
            images = arguments[0].deck;
        }

        if (arguments[0] && 'prefix' in arguments[0]) {
            prefix = arguments[0].prefix;
        }

        if (start) {
            handler(images, delay, prefix);
        }
    }
}]);
