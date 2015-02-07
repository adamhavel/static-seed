/* ==========================================================================
   Forms
   ========================================================================== */

(function forms($) {
   'use strict';

   // var animationEnd = {
   //    'animation': 'animationend',
   //    'OAnimation': 'oAnimationEnd',
   //    'MozAnimation': 'animationend',
   //    'WebkitAnimation': 'webkitAnimationEnd'
   // }[Modernizr.prefixed('animation')];

   (function init() {

      $.queryAll('input').forEach(function(input) {
         input.setAttribute('empty', input.value.length === 0);
      });

      $.queryAll('form').forEach(function(form) {

         form.addEventListener('input', function(e) {
            e.stopPropagation();
            var input = e.target;

            input.setAttribute('empty', input.value.length === 0);
         });

         // form.addEventListener('keydown', function(e) {
         //    e.stopPropagation();
         //    var input = e.target,
         //        isNumber = e.keyCode > 47 && e.keyCode < 58,
         //        isSubmit = e.keyCode === 13;

         //    if (input.getAttribute('type') === 'number' && !isNumber && !isSubmit) {
         //       e.preventDefault();
         //       input.addEventListener(animationEnd, function removeAnimation() {
         //          input.classList.remove('j-invalid-input');
         //          input.removeEventListener(animationEnd, removeAnimation);
         //       });
         //       input.classList.add('j-invalid-input');
         //    }
         // });

      });

   })();

})(App);