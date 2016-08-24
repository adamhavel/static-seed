(function() {

    // Don't load the application for legacy browsers.
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

    /**
     * Asynchronously load a script;
     * @param {string}   src
     * @param {Function} callback
     */
    let loadScript = function(src, callback) {
        let script = document.createElement('script');

        script.addEventListener('load', function() {
            callback.call(window);
        });

        script.src = 'assets/site/js/' + src;
        document.head.appendChild(script);
    };

    /**
     * Load the main module.
     */
    let bootstrap = function() {
        if (!('System' in window)) {

            loadScript('lib/system.js', function() {

                System.config({
                    baseURL: 'assets/site/js/modules'
                });

                System.import('app.js');

            });

        } else {
            System.import('app.js');
        }
    };

    let tests = [
        'Promise' in window,
        'Symbol' in window,
        'Map' in window
    ];

    // Check feature support and load shims if needed.
    if (tests.every(test => test)) {
        bootstrap();
    } else {
        loadScript('lib/shim.js', bootstrap);
    }

})();
