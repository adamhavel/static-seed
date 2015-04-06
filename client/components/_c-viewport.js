/* ==========================================================================
   Viewport
   ========================================================================== */

(function viewport($) {

   var vw = $.viewport = {
      items: []
   };

   vw.checkItems = $.debounce(function() {
      var offset = vw.getOffset();

      vw.items = vw.items.filter(function(item) {
         if (offset >= item.offset) {
            item.node.classList.add('j-visible');
            return false;
         }
         return true;
      });

      if (!vw.items.length) {
         window.removeEventListener('scroll', vw.checkItems);
      }

   }, 100);

   vw.getOffset = function() {
      return document.documentElement.scrollTop || document.body.scrollTop;
   };

   vw.watchElements = function(...elems) {

      if (!elems.length) {
         return;
      }

      if (!vw.items.length) {
         window.addEventListener('scroll', vw.checkItems);
      }

      var offset = vw.getOffset(),
          threshold = window.innerHeight * 0.75;

      elems.forEach(function(el) {
         vw.items.push({
            node: el,
            offset: el.getBoundingClientRect().top + offset - threshold
         });
      });

      vw.checkItems();
   };

})(App);