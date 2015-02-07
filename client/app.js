var App = (function($) {
   'use strict';

   var media = false,
       assetsDir = 'assets/site';

   $.query = function(selector, parent) {
      parent = parent || document;
      return parent.querySelector(selector);
   };

   $.queryAll = function(selector, parent) {
      parent = parent || document;
      var elements = parent.querySelectorAll(selector),
          arr = [];
      for (var i = elements.length; i--; arr.unshift(elements[i]));
      return arr;
   };

   $.debounce = function(func, delay, immediate) {
      var timeout;
      return function() {
         var context = this,
             args = arguments;
         var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
         };
         var callNow = immediate && !timeout;
         clearTimeout(timeout);
         timeout = setTimeout(later, delay);
         if (callNow) func.apply(context, args);
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

   $.loadScript = function(src, callback) {
      callback = callback || null;
      var ref = document.getElementsByTagName('script')[0],
          script = document.createElement('script');

      if (callback) {
         script.onload = script.onreadystatechange = function() {
            var state = script.readyState;
            if (!state || state === 'loaded') {
               script.onload = script.onreadystatechange = null;
               callback.call(window);
            }
         };
      }

      script.src = assetsDir + '/js/' + src;
      ref.parentNode.insertBefore(script, ref);

      return script;
   };

   // Uncomment if supporting IE8 is not needed.
   // $.loadScript = function(src, callback) {
   //    callback = callback || null;
   //    var ref = document.getElementsByTagName('script')[0],
   //        script = document.createElement('script');

   //    if (callback) {
   //       script.addEventListener('load', function handler() {
   //          callback.call(window);
   //          script.removeEventListener('load', handler);
   //       });
   //    }

   //    script.src = src;
   //    ref.parentNode.insertBefore(script, ref);

   //    return script;
   // };

   $.loadStyle = function(src) {
      var ref = document.getElementsByTagName('script')[0],
          style = document.createElement('link');

      style.rel = 'stylesheet';
      style.href = assetsDir + '/css/' + src;
      style.media = 'only x';
      ref.parentNode.insertBefore(style, ref);

      setTimeout(function() {
         style.media = 'all';
      });

      return style;
   };

   (function init() {

      if (!Modernizr.svg) {
         $.queryAll('img[src$=".svg"]').forEach(function(img) {
            img.src = img.src.replace(/\.svg$/, '.png');
         });
         $.queryAll('.icon').forEach(function(icon) {
            var fallbackIcon = document.createElement('img'),
                placeholder = document.createElement('div'),
                parent = icon.parentNode,
                type = parent.innerHTML.match(/xlink:href=["']#([^"']+)["']/i)[1];

            fallbackIcon.classList.add('icon');
            placeholder.classList.add('j-icon-placeholder');
            fallbackIcon.src = assetsDir + '/img/icon-' + type + '.png';

            parent.insertBefore(placeholder, icon.nextSibling);
            parent.replaceChild(fallbackIcon, icon);
         });
      }

      if (Modernizr.touch) {
         $.loadScript('fastclick.min.js', function() {
            FastClick.attach(document.body);
         });
      }

      if ($.queryAll('table').length) {
         // load tables script
      }

      window.addEventListener('resize', $.debounce(function() {
         media = false;
      }, 300));

      // $.queryAll('button[aria-pressed]').forEach(function(button) {
      //    button.matches('button');
      //    button.addEventListener('click', function() {
      //       $.toggleAttribute(this, 'aria-pressed');
      //    });
      // });

   })();

   return $;

})(App || {});