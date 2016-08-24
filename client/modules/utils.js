/* ==========================================================================
   Utilities
   ========================================================================== */

const utils = {
    /**
     * Query the DOM for the first element that meets the given CSS selector.
     * @param  {string} selector CSS selector used for the query.
     * @param  {Node}   parent   Limit scope to this node.
     * @return {Node}            First node found.
     */
    query(selector, parent = document) {
        return parent.querySelector(selector);
    },
    /**
     * Query the DOM for all elements that meet the given CSS selector.
     * @param  {string} selector CSS selector used for the query.
     * @param  {Node}   parent   Limit scope to this node.
     * @return {Array}           Array of nodes found.
     */
    queryAll(selector, parent = document) {
        let elements = parent.querySelectorAll(selector);
        let arr = [];

        for (let i = elements.length; i--; i > 0) {
            arr.unshift(elements[i]);
        }

        return arr;
    },
    /**
     * Checks if an element matches a selector.
     * @param  {Node}    el
     * @param  {string}  selector
     * @return {boolean}
     */
    matches(el, selector) {
        let p = window.Element.prototype;
        let f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };

        return f.call(el, selector);
    },
    /**
     * Debounce a function so that it can be run again only after a specified delay.
     * @param {Function} func      Function to be debounced.
     * @param {number}   delay     Delay between calls.
     * @param {boolean}  immediate Whether to run the function immediately.
     */
    debounce(func, delay, immediate) {
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

            window.clearTimeout(timeout);
            timeout = window.setTimeout(later, delay);

            if (callNow) {
                func.apply(context, args);
            }
        };
    },
    /**
     * Toggle a boolean attribute of a given element.
     * @param  {Node}    el   An element.
     * @param  {string}  attr An attribute.
     * @return {boolean}      The toggled attribute value.
     */
    toggleAttribute(el, attr) {
        let value = el.getAttribute(attr);
        let negatedValue = value === 'true' ? 'false' : 'true';

        el.setAttribute(attr, negatedValue);

        return negatedValue === 'true';
    },
    /**
     * Query the current media query label as defined in the stylesheet.
     * @param  {string} query One of the predefined media query labels, e.g. '<layout'.
     * @return {boolean}      The query result.
     */
    mediaQuery(query) {
        if (typeof this.media === 'undefined') {
            window.addEventListener('resize', this.debounce(() => {
                this.media = null;
            }, 300));
        }

        this.media = this.media || window.getComputedStyle(document.documentElement, ':after').getPropertyValue('content').replace(/['"]/g, '');

        return this.media === query;
    },
    /**
     * Asynchronously loads and injects a script.
     * @param  {string}  src Path to the source file.
     * @return {Promise}
     */
    fetch(src) {
        return new Promise((resolve, reject) => {
            let resource = document.createElement('script');

            resource.addEventListener('load', resolve.bind(null, resource));
            resource.addEventListener('error', reject.bind(null, new Error('File not found.')));

            resource.src = src;
            document.head.appendChild(resource);
        });
    },
    /**
     * Creates a DOM structure for a given string HTML representation.
     * @param  {Array|String} html Array of strings or a single string representing a HTML structure.
     * @return {Node}              Resulting node.
     */
    createNode(html) {
        let container = document.createElement('div');

        container.innerHTML = [].concat(html).join('');

        return container.firstElementChild;
    },
    /**
     * Remove all children from a given node.
     * @param {Node} node The parent node.
     */
    removeChildren(node) {
        while (node.firstElementChild) {
            node.removeChild(node.firstElementChild);
        }
    },
    /**
     * Scroll an element into view.
     * @param {Node}   element The element to scroll to.
     * @param {number} nudge   Nudge the scroll target by given amount in pixels.
     */
    scrollTo(element, nudge = -54) {
        let distance = element.getBoundingClientRect().top + nudge;
        let id = element.getAttribute('id');

        window.scrollBy({
            top: distance,
            behavior: 'smooth'
        });

        if (window.history && id) {
            window.history.pushState(null, null, '#' + id);
        }
    }
};

export default utils;
