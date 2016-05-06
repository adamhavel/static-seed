import utils from 'utils.js';

export default function(node, selector) {

    var self = {
        // The component's parent DOM node.
        container: node,
        // The component's selector.
        selector: selector,
        // Registered component's elements.
        elements: [],
        // Define an element and register any event handler neccessary.
        define: function() {
            [].forEach.call(arguments, function(element) {
                self.elements.push(element);

                element.render = function() {
                    if (element.template) {
                        return utils.createNode(element.template());
                    } else {
                        return null;
                    }
                };

                element.get = function(index = -1) {
                    let result = self.resolveElement(element);

                    if (element.isCollection && index > -1) {
                        result = result[index];
                    }

                    return result;
                };

                if (!element.selector) {
                    // Create a default selector by using the element's name and container selector.
                    let defaultSelector = self.selector + '__' + element.name;

                    // Strip the last 's' when generating a selector for collections ('items' becomes 'container__item').
                    element.selector = element.isCollection ? defaultSelector.slice(0, -1) : defaultSelector;
                }

                if (element.handlers) {
                    Object.keys(element.handlers).forEach(function(eventType) {
                        if (self.registeredHandlers.indexOf(eventType) === -1) {
                            var isCapturing = eventType === 'blur' || eventType === 'focus';

                            self.container.addEventListener(eventType, self.handler, isCapturing);
                            self.registeredHandlers.push(eventType);

                            if (eventType === 'touchmove' && !self.touches) {
                                self.touches = {};
                                self.container.addEventListener('touchstart', function(ev) {
                                    self.touches.x = ev.touches[0].clientX;
                                    self.touches.y = ev.touches[0].clientY;
                                });
                            }
                        }
                    });
                }
            });
        },
        // Resolves a given element's selector to a single DOM node or an array thereof and returns the result.
        resolveElement: function(element) {
            if (!element.node || element.isTransient) {
                if (element.isCollection) {
                    element.node = utils.queryAll(element.selector, self.container);
                } else {
                    element.node = utils.query(element.selector, self.container);
                }
            }

            return element.node;
        },
        // Returns an element property for a given element name and property type.
        element: function(name) {
            let result = null;

            self.elements.some(function(el) {
                if (el.name === name) {
                    result = el;

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

                if (eventType === 'touchmove') {
                    var delta = {
                        x: self.touches.x - ev.touches[0].clientX,
                        y: self.touches.y - ev.touches[0].clientY
                    };

                    Object.defineProperty(ev, 'isHorizontal', {
                        value: Math.abs(delta.x) > Math.abs(delta.y),
                        writable: false
                    });

                    Object.defineProperty(ev, 'isLeftToRight', {
                        value: delta.x < 0,
                        writable: false
                    });

                    Object.defineProperty(ev, 'isBottomToTop', {
                        value: delta.y > 0,
                        writable: false
                    });
                }

                if (element.isCollection) {
                    element.handlers[eventType].call(element.node[index], ev, index);
                } else {
                    element.handlers[eventType].call(element.node, ev);
                }
            }
        }
    };

    return self;
}
