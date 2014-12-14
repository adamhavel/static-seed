'use strict';

var App = (function(parent) {
   var app = parent;

   app.media = false;
   app.assetsDir = 'assets/site';

   app.query = function(selector, parent) {
      parent = parent || document;
      return parent.querySelector(selector);
   };

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

   app.loadScript = function(src, callback) {
      callback = callback || null;
      var ref = window.document.getElementsByTagName('script')[0],
          script = window.document.createElement('script');

      if (callback) {
         script.onload = script.onreadystatechange = function() {
            var state = script.readyState;
            if (!state || state === 'loaded') {
               script.onload = script.onreadystatechange = null;
               callback.call(window);
            }
         };
      }

      script.src = src;
      ref.parentNode.insertBefore(script, ref);

      return script;
   };

   // Uncomment if supporting IE8 is not needed.
   // app.loadScript = function(src, callback) {
   //    callback = callback || null;
   //    var ref = document.getElementsByTagName('script')[0],
   //        script = document.createElement('script');

   //    if (callback) {
   //       script.addEventListener('load', function handler() {
   //          callback.call(window);
   //          script.removeEventListener('load', handler);
   //       });
   //    }

   //    script.src = src;
   //    ref.parentNode.insertBefore(script, ref);

   //    return script;
   // };

   app.loadStyle = function(src) {
      var ref = document.getElementsByTagName('script')[0],
          style = document.createElement('link');

      style.rel = 'stylesheet';
      style.href = src;
      style.media = 'only x';
      ref.parentNode.insertBefore(style, ref);

      setTimeout(function() {
         style.media = 'all';
      });

      return style;
   };

   (function init() {

      if (!Modernizr.svg) {
         app.queryAll('img[src$=".svg"]').forEach(function(img) {
            img.src = img.src.replace(/\.svg$/, '.png');
         });
         app.queryAll('.icon').forEach(function(icon) {
            var fallbackIcon = document.createElement('img'),
                placeholder = document.createElement('div'),
                parent = icon.parentNode,
                type = parent.innerHTML.match(/xlink:href=["']#([^"']+)["']/i)[1];

            fallbackIcon.classList.add('icon');
            placeholder.classList.add('j-icon-placeholder');
            fallbackIcon.src = app.assetsDir + '/img/icon-' + type + '.png';

            parent.insertBefore(placeholder, icon.nextSibling);
            parent.replaceChild(fallbackIcon, icon);
         });
      }

      window.addEventListener('resize', app.debounce(function() {
         app.media = false;
      }, 300));

      window.addEventListener('load', function() {
         if (Modernizr.touch) {
            app.loadScript(app.assetsDir + '/js/app.touch.min.js', function() {
               FastClick.attach(document.body);
            });
         }
      });

      app.queryAll('button[aria-pressed]').forEach(function(button) {
         button.addEventListener('click', function() {
            var state = this.getAttribute('aria-pressed') == 'true' ? true : false;
            this.setAttribute('aria-pressed', !state);
         });
      });

      // var s = Snap('.test');

      // document.body.addEventListener('click', function() {

      //    Snap.load('assets/site/img/flask.svg', function(f) {

      //       outline = f.select('#outline');
      //       drawing = f.select('#drawing');
      //       flask = f.select('#flask');
      //       outline.attr({'opacity': 0});
      //       flask.attr({'opacity': 0});

      //       s.append(outline);
      //       s.append(drawing);
      //       s.append(flask);

      //       drawing.selectAll('path').forEach(function(line, i) {
      //          var length = line.getTotalLength();
      //          line.attr({'stroke-dasharray': length});
      //          line.attr({'stroke-dashoffset': length});

      //          setTimeout(function() {
      //             line.animate({'stroke-dashoffset': 0}, 200, mina.easeout);
      //          }, i * 250);
      //       });

      //       setTimeout(function() {
      //          outline.animate({'opacity': 1}, 1000, mina.easein);
      //          drawing.animate({'opacity': 0}, 700, mina.easein);
      //       }, 700);

      //       setTimeout(function() {
      //          outline.animate({'opacity': 0}, 300, mina.easein);
      //          flask.animate({'opacity': 1}, 300, mina.easein);
      //       }, 1700);

      //    });

      // });

      // var elem = app.query('.test');

      // var regex = /\[(max-width|min-width)=['"]([0-9]+[a-z]+)['"]\]/gi;

      // for (var i = document.styleSheets.length - 1; i >= 0; i--) {
      //    var rules = document.styleSheets[i].cssRules;
      //    for (var j = rules.length - 1; j >= 0; j--) {
      //       var selector = rules[j].selectorText;
      //       if (selector && regex.test(selector)) {
      //          console.log(selector.match(regex));
      //       }
      //    }
      // };

      // window.addEventListener('resize', app.debounce(function() {
      //    if (elem.offsetWidth < 500) {
      //       elem.setAttribute('max-width', '500px');
      //    } else {
      //       elem.removeAttribute('max-width');
      //    }
      //    console.log(elem.offsetWidth);
      // }, 100));

      // console.log(elem);

   })();

   return app;

})(App || {});