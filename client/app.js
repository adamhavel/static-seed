'use strict';

var App = (function($) {

    const ASSETS_DIR = 'assets/site/';
    const COMPONENTS_DIR = 'components/';

    var media = false;
    var loadedScripts = [];
    var loadingScripts = [];


    /* Components
       ========================================================================== */

    var components = [
        {
            name: 'GalleryCarousel',
            selector:  '.j-gallery-carousel',
            src: '_c-gallery-carousel.js'
        },
        {
            name: 'PromoCarousel',
            selector:  '.j-promo-carousel',
            src: '_c-promo-carousel.js'
        },
        {
            name: 'Datepicker',
            selector:  '.j-datepicker',
            src: '_c-datepicker.js'
        }
    ];

    var Component = function(container) {

        var self = {
            container: container,
            elements: [],
            resolveElement: function(element) {
                if (!element.node) {
                    if (element.isCollection) {
                        element.node = $.queryAll(element.selector, self.container);
                    } else {
                        element.node = $.query(element.selector, self.container);
                    }
                }

                return element.node;
            },
            element: function(name) {
                var element = null;

                self.elements.some(function(el) {
                    if (el.name === name) {
                        element = self.resolveElement(el);

                        return true;
                    }

                    return false;
                });

                return element;
            },
            clickHandler: function(ev) {
                var target = ev.target;
                var element = null;
                var index;
                var isMatch = function(el) {
                    if (!el.click) {
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
                        element.click.call(element.node[index], ev, index);
                    } else {
                        element.click.call(element.node, ev);
                    }
                }
            }
        };

        container.addEventListener('click', self.clickHandler);

        return self;
    };


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
                var ref = document.getElementsByTagName('script')[0];
                var script = document.createElement('script');

                loadingScripts.push(src);

                script.onload = script.onreadystatechange = function() {
                    var state = script.readyState;
                    if (!state || state === 'loaded') {
                        script.onload = script.onreadystatechange = null;
                        loadedScripts.push(src);
                        loadingScripts.splice(loadingScripts.indexOf(src), 1);

                        if (callback) {
                            callback.call(window);
                        }
                    }
                };

                script.src = ASSETS_DIR + 'js/' + src;
                ref.parentNode.insertBefore(script, ref);

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

    $.loadComponent = function(src, callback) {
        return $.loadScript(COMPONENTS_DIR + src, callback);
    };

    $.loadStyle = function(src) {
        var ref = document.getElementsByTagName('script')[0];
        var style = document.createElement('link');

        style.rel = 'stylesheet';
        style.href = assetsDir + 'css/' + src;
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

    $.scrollTo = function(element, nudge) {
        nudge = nudge || 0;

        var marginTop = parseInt(window.getComputedStyle(element).marginTop) || 24;
        var distance = element.getBoundingClientRect().top - marginTop + nudge;

        window.scrollBy({
            top: distance,
            behavior: 'smooth'
        });
    };

    (function init() {

        components.forEach(function(component) {
            var elements = $.queryAll(component.selector);

            if (elements.length) {
                $.loadComponent(component.src, function() {
                    elements.forEach(function(container) {
                        var setup = window[component.name];

                        setup($, Component(container), component.selector);
                    });
                });
            }
        });

        if (!Modernizr.svg) {
            $.queryAll('img[src$=".svg"]').forEach(function(img) {
                img.src = img.src.replace(/\.svg$/, '.png');
            });
        }

        $.loadScript('fastclick.min.js', function() {
            FastClick.attach(document.body);
        });

        if (!Modernizr.pointerevents) {
            $.loadScript('pep.min.js');
        }

        if (!('scrollBehavior' in document.documentElement.style)) {
            $.loadScript('smoothscroll.min.js');
        }

        window.addEventListener('resize', $.debounce(function() {
            media = false;
        }, 300));

    })();

    return $;

})(App || {});
