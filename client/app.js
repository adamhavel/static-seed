var App = (function(parent) {

   // inherit API
   var api = parent;

   /* Private properties
      ========================================================================== */

   var media = false;


   /* Private methods
   ========================================================================== */

   function debounce(func, delay, immediate) {
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
   }

   function getElements(selector, parent) {
      parent = parent || document;
      var elements = parent.querySelectorAll(selector),
          arr = [];
      for (var i = elements.length; i--; arr.unshift(elements[i]));
      return arr;
   }


   /* Public inteface
      ========================================================================== */

   /**
    * Returns the current state of media query as defined in stylesheet.
    * @return {String} [description]
    */
   api.mediaQuery = function() {
      if (window.getComputedStyle) {
         if (media) {
            return media;
         }
         media = window.getComputedStyle(page).getPropertyValue('animation-name');
         if (!media) {
            media = window.getComputedStyle(page).getPropertyValue('-webkit-animation-name');
         }
         return media;
      }
   };

   api.init = function() {

      Modernizr.load({
         test: Modernizr.touch,
         yep: 'assets/site/js/ondemand/app.touch.min.js',
         callback: function() {
            FastClick.attach(document.body);
         }
      });

      if (!Modernizr.svg) {
         getElements('img[src$=".svg"]').forEach(function(img) {
            img.src = img.src.replace(/\.svg$/, '.png');
         });
      }

      window.addEventListener('scroll', function() {

      });

      window.addEventListener('touchmove', function(e) {

      });

   };

   api.init();
   return api;

})(App || {});