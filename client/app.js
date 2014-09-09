var App = (function(parent) {
   var app = parent;

   app.query = document.querySelector.bind(document);
   app.media = false;

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

   (function init() {

      Modernizr.load({
         test: Modernizr.touch,
         yep: 'assets/site/js/ondemand/app.touch.min.js',
         callback: function() {
            FastClick.attach(document.body);
         }
      });

      if (!Modernizr.svg) {
         app.queryAll('img[src$=".svg"]').forEach(function(img) {
            img.src = img.src.replace(/\.svg$/, '.png');
         });
      }

      window.addEventListener('resize', app.debounce(function() {
         app.media = false;
      }, 300));

   })();

   return app;

})(App || {});