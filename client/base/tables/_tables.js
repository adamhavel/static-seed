/* ==========================================================================
   Tables
   ========================================================================== */

(function tables($) {
   'use strict';

   var longCells = $.queryAll('table p');

   function expand(item) {
      $.toggleAttribute(item, 'aria-expanded');
   }

   function checkLongCells() {
      longCells.forEach(function(p) {

         if ($.mediaQuery() !== 'char') {
            p.setAttribute('aria-expanded', 'false');
            p.setAttribute('tabindex', 0);

            if (p.scrollWidth === p.clientWidth) {
               p.removeAttribute('aria-expanded');
               p.removeAttribute('tabindex');
            }

         } else {
            p.removeAttribute('aria-expanded');
            p.removeAttribute('tabindex');
         }

      });
   }

   (function init() {

      $.queryAll('table').forEach(function(table) {

         var headings = $.queryAll('thead th', table).map(function(cell) {
            return cell.textContent;
         });

         $.queryAll('tbody tr > *', table).forEach(function(cell, i) {
            cell.setAttribute('data-heading', headings[i % headings.length]);
         });

      });

      $.queryAll('table').forEach(function(table) {

         if ($.queryAll('p', table).length) {

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
         }

      });

      if (longCells.length) {
         checkLongCells();
         window.addEventListener('resize', $.debounce(checkLongCells, 300));
      }

   })();

})(App);