var App = (function(parent) {

   // inherit API
   var api = parent;

   /* Private properties
      ========================================================================== */

   var media = false,
       offset = 0,
       header = document.querySelector('.j-page-header'),
       navigation = document.querySelector('.j-site-nav'),
       navigationOffset = navigation.offsetTop;
       page = document.querySelector('body'),
       searchButton = document.querySelector('.j-search-form__submit'),
       searchInput = document.querySelector('.j-search-form__input'),
       searchForm = document.querySelector('.j-search-form');

   console.log(navigation.offsetTop);


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
         media = window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/"/g, '');
         return media;
      }
   };

   api.equalHeight = function(selectors, mediaLimit) {
      if (!window.getComputedStyle) {
         return;
      }
      selectors = selectors || '.j-eh';
      mediaLimit = mediaLimit || 'palm';
      var media = api.mediaQuery();

      selectors.split(/,\s+/).forEach(function(selector) {
         var elements = getElements(selector),
             maxHeight = 0;

         elements.forEach(function(el) {
            el.style.height = 'auto';
            var height = el.clientHeight;
            if (height > maxHeight) {
               maxHeight = height;
            }
         });

         if (media !== mediaLimit) {
            elements.forEach(function(el) {
               el.style.height = maxHeight + 'px';
            });
         }
      });
   };

   api.init = function() {
      var equalHeightSelector = '.j-eh, .j-eh2';
      api.equalHeight(equalHeightSelector);

      window.addEventListener('resize', debounce(function() {
         media = false;
         page.classList.remove('j-dim');
         header.classList.remove('j-active');
         searchForm.classList.remove('j-active');
         api.equalHeight(equalHeightSelector);
      }, 100));

      window.addEventListener('scroll', function() {
         var newOffset = document.documentElement.scrollTop,
             scrolledDown = (newOffset - offset) > 0,
             detached = header.classList.contains('j-detached'),
             searching = searchForm.classList.contains('j-active');

         if (newOffset > navigationOffset) {
            navigation.classList.add('j-stick');
         } else {
            navigation.classList.remove('j-stick');
         }

         if (!detached && !searching && scrolledDown) {
            header.classList.add('j-detached');
         } else if (detached && !scrolledDown) {
            header.classList.remove('j-detached');
         }
         offset = newOffset;
      });

      searchButton.addEventListener('click', function(e) {
         if (api.mediaQuery() === 'palm') {
            e.preventDefault();
            header.classList.remove('j-detached');
            header.classList.remove('j-active');
            searchForm.classList.toggle('j-active');
            searchInput.focus();
            if (!page.classList.contains('j-dim') || !searchForm.classList.contains('j-active')) {
               page.classList.toggle('j-dim');
            }
         }
      });

      navigation.addEventListener('click', function(e) {
         if (api.mediaQuery() !== 'desk') {
            header.classList.toggle('j-active');
            searchForm.classList.remove('j-active');
            if (!page.classList.contains('j-dim') || !header.classList.contains('j-active')) {
               page.classList.toggle('j-dim');
            }
         }
      });

   };

   api.init();
   return api;

})(App || {});