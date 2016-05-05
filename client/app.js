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

    System.config({
        baseURL: 'assets/site/js/modules'
    });

    System.import('utils.js').then(function(utils) {
        const _ = utils.default;

        System.import('components.js').then(function(components) {

            components.default.forEach(function(componentSpec) {
                let nodes = _.queryAll(componentSpec.selector);

                if (nodes.length) {
                    System.import(componentSpec.src).then(function(component) {
                        let constructor = component.default;

                        nodes.forEach(function(node) {
                            constructor(node, componentSpec.selector);
                        });
                    });
                }
            });

        });
    });

})();
