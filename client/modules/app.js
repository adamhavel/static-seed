import utils from 'utils.js';

// Load components.
System.import('components.js').then(function(components) {

    components.default.forEach(function(componentSpec) {
        let nodes = utils.queryAll(componentSpec.selector);

        if (nodes.length) {
            System.import(componentSpec.src).then(function(constructor) {
                nodes.forEach(function(node) {
                    constructor.default(node, componentSpec.selector);
                });
            });
        }
    });

});

// Load libraries.
System.import('libraries.js').then(function(libraries) {

    libraries.default.forEach(function(library) {

        if (library.test || typeof library.test === 'undefined') {
            utils.fetch('/assets/site/js/lib/' + library.src).then(() => {
                library.callback && library.callback();
            });
        }

    });

});
