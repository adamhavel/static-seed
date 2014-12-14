/* ==========================================================================
   Tables
   ========================================================================== */

(function tables() {

   function expand(item) {
      item.setAttribute('aria-expanded', item.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
   }

   function checkForExpand() {
      App.queryAll('table p').forEach(function(p) {

         p.removeAttribute('aria-expanded');

         if (App.mediaQuery() !== 'palm') {
            p.setAttribute('aria-expanded', 'false');
            if (p.scrollWidth > p.clientWidth) {
               p.setAttribute('tabindex', 0);
            } else {
               p.removeAttribute('aria-expanded');
            }
         }

      });
   }

   (function init() {

      App.queryAll('table').forEach(function(table) {

         var headings = App.queryAll('thead th', table).map(function(cell) {
            return cell.textContent;
         });

         App.queryAll('tbody tr > *', table).forEach(function(cell, i) {
            cell.setAttribute('data-heading', headings[i % headings.length]);
         });

         table.addEventListener('click', function(e) {
            var el = e.target;
            if (el.hasAttribute('aria-expanded')) {
               expand(el);
            }
         });

         table.addEventListener('keydown', function(e) {
            var el = e.target;
            if (el.hasAttribute('aria-expanded') && (e.keyCode === 13 || e.keyCode === 32)) {
               expand(el);
            }
         });

      });

      checkForExpand();

      window.addEventListener('resize', App.debounce(checkForExpand, 300));

   })();

})();