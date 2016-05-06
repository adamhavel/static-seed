(function() {

    // Cutting the mustard.
    if (
        !document.querySelector
        || !window.addEventListener
        || !window.localStorage
        || !('classList' in document.createElement('_'))
    ) {
        var htmlNode = document.documentElement;

        htmlNode.className = htmlNode.className.replace(/\bjs\b/gi, 'no-js');

        return false;
    }

    var loadScript = function(src, callback) {
        var script = document.createElement('script');

        script.addEventListener('load', function() {
            callback.call(window);
        });

        script.src = 'assets/site/js/' + src;
        document.head.appendChild(script);
    };

    var bootstrap = function() {
        loadScript('lib/system.js', function() {

            System.config({
                baseURL: 'assets/site/js/modules',
                meta: {
                    '*.js': {
                        format: 'register'
                    }
                }
            });

            System.import('main.js');

        });
    };

    if (!Modernizr.promises) {
        loadScript('lib/bluebird.js', bootstrap);
    } else {
        bootstrap();
    }

})();
