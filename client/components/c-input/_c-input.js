/* ==========================================================================
   Input
   ========================================================================== */

(function input($) {

   (function init() {

      $.queryAll('.j-input').forEach(input => input.setAttribute('pristine', input.value.length === 0 || !input.checked));

      $.queryAll('form').forEach(function(form) {

         form.addEventListener('focus', function(e) {
            e.stopPropagation();
            var t = e.target;

            if (t.matches('.j-input')) {
               t.setAttribute('pristine', false);
            }

         }, true);

      });

   })();

})(App);