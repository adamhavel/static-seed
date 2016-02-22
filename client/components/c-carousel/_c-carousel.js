/* ==========================================================================
   Carousel
   ========================================================================== */

var Carousel = (function($) {

   var self = {

      getPrevIndex() {
         var index;

         if (this.currentItemIndex === 0) {
            index = this.items.length - 1;
         } else {
            index = this.currentItemIndex - 1;
         }

         return index;
      },

      getNextIndex() {
         var index;

         if (this.currentItemIndex === this.items.length - 1) {
            index = 0;
         } else {
            index = this.currentItemIndex + 1;
         }

         return index;
      },

      getCurrentItem() {
         return this.items[this.currentItemIndex];
      },

      getPrevItem() {
         return this.items[this.getPrevIndex()];
      },

      getNextItem() {
         return this.items[this.getNextIndex()];
      },

      prev() {
         var currentItem = this.getCurrentItem();
         var prevItem = this.getPrevItem();
         var currentItemMedia = $.query('.c-carousel__media', currentItem);
         var prevItemMedia = $.query('.c-carousel__media', prevItem);

         currentItem.classList.remove('is-active');
         prevItem.classList.add('is-active');

         this.indicator[this.currentItemIndex].classList.remove('is-active');
         this.indicator[this.getPrevIndex()].classList.add('is-active');

         if ('play' in currentItemMedia) {
            currentItemMedia.pause();
         }

         if ('play' in prevItemMedia) {
            prevItemMedia.play();
         }

         this.currentItemIndex = this.getPrevIndex();

         this.loadMedia(this.getPrevItem());
      },

      next() {
         var currentItem = this.getCurrentItem();
         var nextItem = this.getNextItem();
         var currentItemMedia = $.query('.c-carousel__media', currentItem);
         var nextItemMedia = $.query('.c-carousel__media', nextItem);

         currentItem.classList.remove('is-active');
         nextItem.classList.add('is-active');

         this.indicator[this.currentItemIndex].classList.remove('is-active');
         this.indicator[this.getNextIndex()].classList.add('is-active');

         if ('play' in currentItemMedia) {
            currentItemMedia.pause();
         }

         if ('play' in nextItemMedia) {
            nextItemMedia.play();
         }

         this.currentItemIndex = this.getNextIndex();

         this.loadMedia(this.getNextItem());
      },

      moveToIndex(index) {
         this.items[this.currentItemIndex].classList.remove('is-active');
         this.items[index].classList.add('is-active');

         this.indicator[this.currentItemIndex].classList.remove('is-active');
         this.indicator[index].classList.add('is-active');

         this.currentItemIndex = index;

         this.loadMedia(this.items[index]);
      },

      create(items) {
         var carouselHTML = ['<div class="c-carousel j-carousel" tabindex="0">'];
         items.forEach(item => {
            var isVideo = /\.mp4$/.test(item.src);
            var itemHTML = ['<div class="c-carousel__item">'];

            if (isVideo) {
               itemHTML.push('<video class="c-carousel__media" data-src="' + item.src + '"></video>');
            } else {
               itemHTML.push('<img class="c-carousel__media" data-src="' + item.src + '">');
            }

            if (item.desc) {
               itemHTML.push('<span class="c-carousel__label">' + item.desc + '</span>');
            }

            itemHTML.push('</div>');
            carouselHTML.push(itemHTML.join(''));
         });
         carouselHTML.push('</div>');

         this.element = $.createNode(carouselHTML);

         return this.element;
      },

      loadMedia(item) {
         var media = $.query('.c-carousel__media', item);
         if (!media.src) {
            if (!('play' in media)) {
               item.classList.add('is-loading');
               media.addEventListener('load', function imageLoaded() {
                  item.classList.remove('is-loading');
                  media.removeEventListener('load', imageLoaded);
               });
            }
            media.src = media.getAttribute('data-src');
         }
      },

      init(index = 0) {

         this.element = this.element || $.query('.j-carousel');

         if (!this.element) {
            return false;
         }

         this.items = $.queryAll('.c-carousel__item', this.element);

         this.currentItemIndex = index;

         var currentItem = this.getCurrentItem();
         var currentItemMedia = $.query('.c-carousel__media', currentItem);
         var nextItem = this.getNextItem();
         var prevItem = this.getPrevItem();

         currentItem.classList.add('is-active');

         this.loadMedia(currentItem);
         if ('play' in currentItemMedia) {
            currentItemMedia.play();
         }

         if (nextItem) {
            this.loadMedia(nextItem);
         }

         if (prevItem) {
            this.loadMedia(prevItem);
         }

         if (this.items.length > 1) {

            var indicatorHTML = ['<ul class="c-carousel__indicator">'];
            this.items.forEach((item, i) => indicatorHTML.push('<li><button class="c-carousel__indicator-item">' + (++i) + '</button></li>'));
            indicatorHTML.push('</ul>');
            this.element.appendChild($.createNode(indicatorHTML));
            this.indicator = $.queryAll('.c-carousel__indicator-item', this.element);
            this.indicator[this.currentItemIndex].classList.add('is-active');

            if (this.element.getAttribute('data-controls') !== 'false') {

                var uri = $.query('base');

                uri = uri ? uri.getAttribute('data-uri') : '';

               var controlsHTML = [
                  '<div>',
                    `<button class="c-carousel__controls u-alpha" rel="prev" tabindex="-1"><svg class="b-icon" role="image" aria-label="Předchozí"><use xlink:href="${uri}#arrow--simple"></use></svg></button>`,
                    `<button class="c-carousel__controls u-alpha" rel="next" tabindex="-1"><svg class="b-icon" role="image" aria-label="Další"><use xlink:href="${uri}#arrow--simple"></use></svg></button>`,
                  '</div>'
               ];

               this.element.appendChild($.createNode(controlsHTML));

               this.element.addEventListener('click', (e) => {
                  e.stopPropagation();
                  var target = e.target;

                  if (target === this.element) {
                     return false;
                  }

                  while (!target.matches('.c-carousel__controls') && !target.matches('.c-carousel__indicator-item')) {
                     target = target.parentNode;

                     if (target === this.element) {
                        return false;
                     }
                  }

                  if (target.matches('.c-carousel__controls')) {
                    target.getAttribute('rel') === 'next' ? this.next() : this.prev();
                  } else if (target.matches('.c-carousel__indicator-item')) {
                    this.moveToIndex(this.indicator.indexOf(target));
                  }

               });

            }

            this.element.addEventListener('keyup', (e) => {
               var key = e.which || e.keyCode;

               switch (key) {
                  case 37:
                     this.prev();
                     break;
                  case 39:
                     this.next();
                     break;
               }
            });

            this.element.addEventListener('touchstart', (e) => {
               this.touchX = e.touches[0].clientX;
               this.touchY = e.touches[0].clientY;
            });

            this.element.addEventListener('touchmove', (e) => {
               if (!this.touchX || !this.touchY) {
                  return;
               }

               var deltaX = this.touchX - e.touches[0].clientX;
               var deltaY = this.touchY - e.touches[0].clientY;

               if (Math.abs(deltaX) > Math.abs(deltaY)) {
                  if (deltaX > 0) {
                     this.next();
                  } else {
                     this.prev();
                  }
               }

               this.touchX = this.touchY = null;
            });

         }

         if (this.element.getAttribute('data-auto') === 'true') {
            var defaultDelay = this.element.getAttribute('data-delay') || 3000;
            var timer = function() {
               this.next();
               setTimeout(timer.bind(this), this.getCurrentItem().getAttribute('data-delay') || defaultDelay);
            };
            setTimeout(timer.bind(this), this.getCurrentItem().getAttribute('data-delay') || defaultDelay);
         }

      }

   };

   return self;

})(App);
