var App = (function(parent, $) {

   /* Private properties
      ========================================================================== */

   var api = parent,
       media = false,
       navigation = $('.j-site-nav');


   /* Public inteface
      ========================================================================== */

   /**
    * Returns the current state of media query as defined in stylesheet.
    * @return {String} [description]
    */
   api.mediaQuery = function() {
      if (media) {
         return media;
      }
      media = window.getComputedStyle(document.body, ':after').getPropertyValue('content');
      return media;
   };

   api.equalHeight = function() {
      if (api.mediaQuery() === "palm") {
         $('[class*="j-eh-"]').each(function() {
            $(this).css('height', 'auto');
         });
         return;
      }
      var groups = [];
      $('[class*="j-eh-"]').each(function() {
         var classes = $(this).attr('class').split(/\s+/);
         $.each(classes, function(i, item) {
            if (item.match(/^j-eh-/) && $.inArray(item, groups) === -1) {
               groups.push('.' + item);
            }
         });
      });
      $.each(groups, function(i, group) {
         var maxHeight = 0;
         $(group).each(function() {
            $(this).css('height', 'auto');
            if ($(this).height() > maxHeight) {
               maxHeight = $(this).height();
            }
         });
         $(group).each(function() {
            $(this).height(maxHeight);
         });
      });
   };

   api.init = function() {
      api.equalHeight();

      $(window).on('resize', function(e) {
         media = false;
         api.equalHeight();
      });

      navigation.on('click', function(e) {
         $(this).toggleClass('active');
      });

   };

   api.init();
   return api;

})(App || {}, jQuery);