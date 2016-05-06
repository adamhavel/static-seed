/* ==========================================================================
   Utilities
   ========================================================================== */

var utils = {};

const loadedScripts = [];
const loadingScripts = [];

utils.query = function(selector, parent = document) {
    return parent.querySelector(selector);
};

utils.queryAll = function(selector, parent = document) {
    var elements = parent.querySelectorAll(selector);
    var arr = [];

    for (var i = elements.length; i--; i > 0) {
        arr.unshift(elements[i]);
    }

    return arr;
};

utils.debounce = function(func, delay, immediate) {
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

utils.toggleAttribute = function(item, attr) {
    item.setAttribute(attr, item.getAttribute(attr) === 'true' ? 'false' : 'true');
};

utils.mediaQuery = function() {
    if (!media && window.getComputedStyle) {
        media = window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/['"]/g, '');
    }
    return media;
};

utils.loadScript = function(src, callback = null) {
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

            script.src = 'assets/site/js/' + src;
            document.head.appendChild(script);

            return script;
        } else {
            setTimeout(function() {
                utils.loadScript(src, callback);
            }, 100);
        }
    } else if (callback) {
        callback.call(window);
    }
};

utils.loadStyle = function(src) {
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

utils.createNode = function(html) {
    var container = document.createElement('div');

    container.innerHTML = [].concat(html).join('');

    return container.firstElementChild;
};

utils.removeChildren = function(node) {
    while (node.firstElementChild) {
        node.removeChild(node.firstElementChild);
    }
};

utils.scrollTo = function(element, nudge = 0) {
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

export default utils;
