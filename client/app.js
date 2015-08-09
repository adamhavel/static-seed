'use strict';

var App = (function($) {

   var media = false;
   var assetsDir = '';

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

   $.roundTo = function(number, decimalPoint) {
      decimalPoint = decimalPoint || 1;
      var scaleFactor = Math.pow(10, decimalPoint);

      return Math.round(Number(number) * scaleFactor) / scaleFactor;
   };

   $.getStyleProperty = function(el, property, pseudoEl = null) {
      return document.defaultView.getComputedStyle(el, pseudoEl).getPropertyValue(property);
   };

   $.mediaQuery = function() {
      if (!media && window.getComputedStyle) {
         media = window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/['"]/g, '');
      }
      return media;
   };

   $.loadScript = function(src, callback) {
      callback = callback || null;
      var ref = document.getElementsByTagName('script')[0];
      var script = document.createElement('script');

      if (callback) {
         script.onload = script.onreadystatechange = function() {
            var state = script.readyState;
            if (!state || state === 'loaded') {
               script.onload = script.onreadystatechange = null;
               callback.call(window);
            }
         };
      }

      script.src = assetsDir + 'js/' + src;
      ref.parentNode.insertBefore(script, ref);

      return script;
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

   $.createNodes = function(html) {
      var container = document.createElement('div');

      container.id = 'dummy-node';

      if (Array.isArray(html)) {
         html = html.join('');
      }

      container.innerHTML = html;
      var nodes = $.queryAll('#dummy-node > *', container);

      if (nodes.length === 1) {
         return nodes[0];
      } else {
         return nodes;
      }
   };

   (function init() {

      if (!Modernizr.svg) {
         $.queryAll('img[src$=".svg"]').forEach(function(img) {
            img.src = img.src.replace(/\.svg$/, '.png');
         });
         $.queryAll('svg.icon').forEach(function(icon) {
            var fallbackIcon = document.createElement('img');
            var placeholder = document.createElement('div');
            var parent = icon.parentNode;
            var type = parent.innerHTML.match(/xlink:href=["']#([^"']+)["']/i)[1];

            fallbackIcon.classList.add('icon');
            placeholder.classList.add('j-icon-placeholder');
            fallbackIcon.src = assetsDir + 'img/icon/' + type + '.png';

            parent.insertBefore(placeholder, icon.nextSibling);
            parent.replaceChild(fallbackIcon, icon);
         });
      }

      if (Modernizr.touch) {
         $.loadScript('fastclick.min.js', function() {
            FastClick.attach(document.body);
         });
      }

      window.addEventListener('resize', $.debounce(function() {
         media = false;
      }, 300));

   })();

   return $;

})(App || {});
