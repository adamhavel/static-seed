'use strict';

var App = (function($) {

    if (
        !document.querySelector
        || !window.addEventListener
        || !window.localStorage
        || !('classList' in document.createElement('_'))
    ) {
        return false;
    }

    const ASSETS_DIR = 'assets/site/';
    const COMPONENTS_DIR = 'components/';

    var media = false;
    var loadedScripts = [];
    var loadingScripts = [];


    /* Components
       ========================================================================== */

    var components = [
        {
            name: 'PromoCarousel',
            selector:  '.j-promo-carousel',
            src: '_c-promo-carousel.js'
        }
    ];

    $.Component = function (container) {

        var self = {
            // The component's parent DOM node.
            container: container,
            // Registered component's elements.
            elements: [],
            // Define an element and register any event handler neccessary.
            define: function() {
                [].forEach.call(arguments, function (element) {
                    self.elements.push(element);

                    if (element.handlers) {
                        Object.keys(element.handlers).forEach(function(eventType) {
                            if (self.registeredHandlers.indexOf(eventType) === -1) {
                                var isCapturing = eventType === 'blur' || eventType === 'focus';

                                self.container.addEventListener(eventType, self.handler, isCapturing);
                                self.registeredHandlers.push(eventType);
                            }
                        });
                    }
                });
            },
            // Resolves a given element's selector to a single DOM node or an array thereof and returns the result.
            resolveElement: function(element) {
                if (!element.node || element.isTransient) {
                    if (element.isCollection) {
                        element.node = $.queryAll(element.selector, self.container);
                    } else {
                        element.node = $.query(element.selector, self.container);
                    }
                }

                return element.node;
            },
            // Returns an element property for a given element name and property type.
            element: function(name, property) {
                property = property || 'node';
                var result = null;

                self.elements.some(function(el) {
                    if (el.name === name) {
                        if (property === 'node') {
                            result = self.resolveElement(el);
                        } else {
                            result = el[property];
                        }

                        return true;
                    }

                    return false;
                });

                return result;
            },
            // String representation of the types of events handled.
            registeredHandlers: [],
            // Generic event handler.
            handler: function(ev) {
                var target = ev.target;
                var eventType = ev.type;
                var element = null;
                var index;

                var isMatch = function(el) {
                    if (!el.handlers || !el.handlers[eventType]) {
                        return false;
                    }

                    if (el.isCollection) {

                        return self.resolveElement(el).some(function(item, i) {
                            if (item === target) {
                                element = el;
                                index = i;
                                return true;
                            }

                            return false;
                        });

                    } else if (self.resolveElement(el) === target) {
                        element = el;

                        return true;
                    }

                    return false;
                };

                while (!self.elements.some(isMatch) && target !== this) {
                    target = target.parentNode;
                }

                if (element) {
                    if (element.isCollection) {
                        element.handlers[eventType].call(element.node[index], ev, index);
                    } else {
                        element.handlers[eventType].call(element.node, ev);
                    }
                }
            }
        };

        return self;
    };


    /* Libraries
       ========================================================================== */

    var libraries = [
        {
            src: 'fastclick.min.js',
            callback: function() {
                FastClick.attach(document.body);
            }
        },
        {
            src: 'pep.min.js',
            test: !Modernizr.pointerevents
        },
        {
            src: 'smoothscroll.min.js',
            test: !('scrollBehavior' in document.documentElement.style)
        }
    ];


    /* Public API
       ========================================================================== */

    $.query = function(selector, parent) {
        parent = parent || document;
        return parent.querySelector(selector);
    };

    $.queryAll = function(selector, parent) {
        parent = parent || document;
        var elements = parent.querySelectorAll(selector);
        var arr = [];
        for (var i = elements.length; i--; i > 0) {
            arr.unshift(elements[i]);
        }
        return arr;
    };

    $.debounce = function(func, delay, immediate) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, delay);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };

    $.toggleAttribute = function(item, attr) {
        item.setAttribute(attr, item.getAttribute(attr) === 'true' ? 'false' : 'true');
    };

    $.mediaQuery = function() {
        if (!media && window.getComputedStyle) {
            media = window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/['"]/g, '');
        }
        return media;
    };

    $.loadScript = function(src, callback = null) {
        if (loadedScripts.indexOf(src) === -1) {
            if (loadingScripts.indexOf(src) === -1) {
                var script = document.createElement('script');

                loadingScripts.push(src);

                script.addEventListener('load', function() {
                    loadedScripts.push(src);
                    loadingScripts.splice(loadingScripts.indexOf(src), 1);

                    if (callback) {
                        callback.call(window);
                    }
                });

                script.src = ASSETS_DIR + 'js/' + src;
                document.head.appendChild(script);

                return script;
            } else {
                setTimeout(function() {
                    $.loadScript(src, callback);
                }, 100);
            }
        } else if (callback) {
            callback.call(window);
        }
    };

    $.requireComponent = function(src, callback) {
        return $.loadScript(COMPONENTS_DIR + src, callback);
    };

    $.loadStyle = function(src) {
        var ref = document.getElementsByTagName('script')[0];
        var style = document.createElement('link');

        style.rel = 'stylesheet';
        style.href = ASSETS_DIR + 'css/' + src;
        style.media = 'only x';
        ref.parentNode.insertBefore(style, ref);

        setTimeout(function() {
            style.media = 'all';
        });

        return style;
    };

    $.createNode = function(html) {
        var container = document.createElement('div');

        container.innerHTML = [].concat(html).join('');

        return container.firstElementChild;
    };

    $.removeChildren = function(node) {
        while (node.firstElementChild) {
            node.removeChild(node.firstElementChild);
        }
    };

    $.scrollTo = function(element, nudge = 0) {
        var distance = element.getBoundingClientRect().top + nudge;
        var id = element.getAttribute('id');

        window.scrollBy({
            top: distance,
            behavior: 'smooth'
        });

        if (window.history && id) {
            window.history.pushState(null, null, '#' + id);
        }
    };

    (function init() {

        components.forEach(function(component) {
            var elements = $.queryAll(component.selector);

            if (elements.length) {
                $.requireComponent(component.src, function() {
                    elements.forEach(function(container) {
                        var setup = window[component.name];

                        setup($, $.Component(container), component.selector);
                    });
                });
            }
        });

        libraries.forEach(function(library) {
            if (library.test || typeof library.test === 'undefined') {
                $.loadScript(library.src, function() {
                    library.callback && library.callback();
                });
            }
        });

        window.addEventListener('resize', $.debounce(function() {
            media = false;
        }, 300));

    })();

    return $;

})(App || {});
