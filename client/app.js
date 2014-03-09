var App = (function(parent) {

   // inherit API
   var api = parent;

   /* Private properties
      ========================================================================== */

   var media = false,
       offset = 0,
       touchStart = 0,
       header = document.querySelector('.j-page-header'),
       navigation = document.querySelector('.j-site-nav'),
       navigationOffset = navigation.offsetTop,
       slideshows = getElements('.j-slideshow'),
       page = document.body,
       searchButton = document.querySelector('.j-search-form__submit'),
       searchInput = document.querySelector('.j-search-form__input'),
       searchForm = document.querySelector('.j-search-form');


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

   api.slide = function(item) {
      var nextItem = item.nextElementSibling || item.parentElement.firstElementChild;
      item.classList.add('j-active');
      setTimeout(function() {
         item.classList.remove('j-active');
         api.slide(nextItem);
      }, 3000);
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

      window.addEventListener('touchmove', function(e) {
         var touchMoved = e.touches[0].screenY,
             movedDown = (touchMoved - touchStart) > 0,
             targetElement = e.touches[0].target,
             isActive = header.classList.contains('j-active');

         if (targetElement === header || header.contains(targetElement)) {
            e.preventDefault();

            if (movedDown && !isActive) {
               header.classList.add('j-active');
               page.classList.add('j-dim');
            } else if (!movedDown && isActive) {
               header.classList.remove('j-active');
               page.classList.remove('j-dim');
            }
         }
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

      header.addEventListener('click', function(e) {
         if (api.mediaQuery() !== 'desk') {
            page.classList.toggle('j-moved');
            this.classList.toggle('j-active');
            if (!page.classList.contains('j-dim') || !header.classList.contains('j-active')) {
               page.classList.toggle('j-dim');
            }
         }
      });

   };

   api.init();
   return api;

})(App || {});