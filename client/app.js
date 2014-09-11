'use strict';

var App = (function(parent) {
   var app = parent;

   app.media = false;

   app.query = function(selector, parent) {
      parent = parent || document;
      return parent.querySelector(selector);
   };

   app.queryAll = function(selector, parent) {
      parent = parent || document;
      var elements = parent.querySelectorAll(selector),
          arr = [];
      for (var i = elements.length; i--; arr.unshift(elements[i]));
      return arr;
   };

   app.debounce = function(func, delay, immediate) {
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

   app.mediaQuery = function() {
      if (!app.media && window.getComputedStyle) {
         app.media = window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/['"]/g, '');
      }
      return app.media;
   };

   app.loadScript = function(src, callback) {
      callback = callback || null;
      var ref = window.document.getElementsByTagName('script')[0],
          script = window.document.createElement('script');

      if (callback) {
         script.onload = script.onreadystatechange = function() {
            var state = script.readyState;
            if (!state || state === 'loaded') {
               script.onload = script.onreadystatechange = null;
               callback.call(window);
            }
         };
      }

      script.src = src;
      ref.parentNode.insertBefore(script, ref);

      return script;
   };

   // Uncomment if supporting IE8 is not needed.
   // app.loadScript = function(src, callback) {
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

   app.loadStyle = function(src) {
      var ref = document.getElementsByTagName('script')[0],
          style = document.createElement('link');

      style.rel = 'stylesheet';
      style.href = src;
      style.media = 'only x';
      ref.parentNode.insertBefore(style, ref);

      setTimeout(function() {
         style.media = 'all';
      });

      return style;
   };

   (function init() {

      if (!Modernizr.svg) {
         app.queryAll('img[src$=".svg"]').forEach(function(img) {
            img.src = img.src.replace(/\.svg$/, '.png');
         });
      }

      window.addEventListener('resize', app.debounce(function() {
         app.media = false;
      }, 300));

      window.addEventListener('load', function() {
         if (Modernizr.touch) {
            app.loadScript('assets/site/js/app.touch.min.js', function() {
               FastClick.attach(document.body);
            });
         }
      });

   })();

   return app;

})(App || {});