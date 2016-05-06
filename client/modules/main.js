/* ==========================================================================
   Main
   ========================================================================== */

import utils from 'utils.js';


// Load components.
System.import('components.js').then(function(components) {

    components.default.forEach(function(componentSpec) {
        let nodes = utils.queryAll(componentSpec.selector);

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

// Load libraries.
System.import('libraries.js').then(function(libraries) {

    libraries.default.forEach(function(library) {

        if (library.test || typeof library.test === 'undefined') {
            utils.loadScript('lib/' + library.src, function() {
                library.callback && library.callback();
            });
        }

    });

});
