/* ==========================================================================
   Carousel
   ========================================================================== */

function Carousel($, self) {

    self.elements.push(
        {
            name: 'thumbnails',
            selector: '.j-carousel__thumbnail',
            isCollection: true,
            click: openAtIndex
        },
        {
            name: 'content',
            selector: '.j-carousel__content',
            isTransient: true
        },
        {
            name: 'slides',
            selector: '.j-carousel__item',
            isCollection: true,
            isTransient: true
        },
        {
            name: 'label',
            selector: '.j-carousel__label',
            isTransient: true
        },
        {
            name: 'prevButton',
            selector: '.j-carousel__controls[rel="prev"]',
            click: prev,
            isTransient: true
        },
        {
            name: 'nextButton',
            selector: '.j-carousel__controls[rel="next"]',
            click: next,
            isTransient: true
        },
        {
            name: 'indicator',
            selector: '.j-carousel__indicator-item',
            isCollection: true,
            click: moveToIndex,
            isTransient: true
        }
    );

    var currentIndex;
    var itemsCount;

    function prev() {
        console.log('prev');
        if (currentIndex > 0) {
            moveToIndex(null, currentIndex - 1);
        } else {
            moveToIndex(null, itemsCount - 1);
        }
    }

    function next() {
        console.log('next');
        moveToIndex(null, (currentIndex + 1) % itemsCount);
    }

    function getCarousel(items) {

        var uri = $.query('base');

        uri = uri ? uri.getAttribute('data-uri') : '';

        var carouselHTML = ['<div class="c-carousel j-carousel__content" tabindex="0">'];

        carouselHTML.push('<ul class="c-carousel__list">');

        items.forEach(function(item) {
            carouselHTML.push(`<li class="c-carousel__item j-carousel__item"><img class="c-carousel__media" src="${item.getAttribute('href')}" alt=""></li>`);
        });

        carouselHTML.push('</ul>');

        carouselHTML.push('<p class="c-carousel__label j-carousel__label"></p>');

        carouselHTML.push('<ol class="c-carousel__indicator">');

        items.forEach((item, i) => carouselHTML.push('<li class="j-carousel__indicator-item">' + (++i) + '</li>'));

        carouselHTML.push('</ol>');

        carouselHTML.push(`<button class="c-carousel__controls u-alpha" rel="prev" tabindex="-1"><svg class="b-icon" role="image" aria-label="Předchozí"><use xlink:href="${uri}#arrow--simple"></use></svg></button>`);

        carouselHTML.push(`<button class="c-carousel__controls u-alpha" rel="next" tabindex="-1"><svg class="b-icon" role="image" aria-label="Další"><use xlink:href="${uri}#arrow--simple"></use></svg></button>`);

        carouselHTML.push('</div>');

        return $.createNode(carouselHTML);
    }

    function openAtIndex(ev, index = 0) {
        ev.preventDefault();

        $.loadComponent('_c-lightbox.js', function() {

            itemsCount = self.element('thumbnails').length;

            Lightbox.open(getCarousel(self.element('thumbnails')), document.body);

            self.setTransientContainer(self.element('content'));

            console.log(self.transientContainer);

            moveToIndex(null, index);

        });
    }

    function moveToIndex(ev, index = 0) {
        if (currentIndex !== undefined) {
            self.element('slides')[currentIndex].classList.remove('is-active');
            self.element('indicator')[currentIndex].classList.remove('is-active');
        }

        currentIndex = index;
        self.element('slides')[currentIndex].classList.add('is-active');
        self.element('indicator')[currentIndex].classList.add('is-active');
    }

    (function init() {

        $.loadComponent('_c-lightbox.js');

    })();

    return self;

}


// /* ==========================================================================
//    Carousel
//    ========================================================================== */

// var Carousel = (function($) {

//    var self = {

//       getPrevIndex() {
//          var index;

//          if (this.currentItemIndex === 0) {
//             index = this.items.length - 1;
//          } else {
//             index = this.currentItemIndex - 1;
//          }

//          return index;
//       },

//       getNextIndex() {
//          var index;

//          if (this.currentItemIndex === this.items.length - 1) {
//             index = 0;
//          } else {
//             index = this.currentItemIndex + 1;
//          }

//          return index;
//       },

//       getCurrentItem() {
//          return this.items[this.currentItemIndex];
//       },

//       getPrevItem() {
//          return this.items[this.getPrevIndex()];
//       },

//       getNextItem() {
//          return this.items[this.getNextIndex()];
//       },

//       prev() {
//          var currentItem = this.getCurrentItem();
//          var prevItem = this.getPrevItem();
//          var currentItemMedia = $.query('.c-carousel__media', currentItem);
//          var prevItemMedia = $.query('.c-carousel__media', prevItem);

//          currentItem.classList.remove('is-active');
//          prevItem.classList.add('is-active');

//          this.indicator[this.currentItemIndex].classList.remove('is-active');
//          this.indicator[this.getPrevIndex()].classList.add('is-active');

//          if ('play' in currentItemMedia) {
//             currentItemMedia.pause();
//          }

//          if ('play' in prevItemMedia) {
//             prevItemMedia.play();
//          }

//          this.currentItemIndex = this.getPrevIndex();

//          this.loadMedia(this.getPrevItem());
//       },

//       next() {
//          var currentItem = this.getCurrentItem();
//          var nextItem = this.getNextItem();
//          var currentItemMedia = $.query('.c-carousel__media', currentItem);
//          var nextItemMedia = $.query('.c-carousel__media', nextItem);

//          currentItem.classList.remove('is-active');
//          nextItem.classList.add('is-active');

//          this.indicator[this.currentItemIndex].classList.remove('is-active');
//          this.indicator[this.getNextIndex()].classList.add('is-active');

//          if ('play' in currentItemMedia) {
//             currentItemMedia.pause();
//          }

//          if ('play' in nextItemMedia) {
//             nextItemMedia.play();
//          }

//          this.currentItemIndex = this.getNextIndex();

//          this.loadMedia(this.getNextItem());
//       },

//       create(items) {
//          var carouselHTML = ['<div class="c-carousel j-carousel" tabindex="0">'];
//          items.forEach(item => {
//             var isVideo = /\.mp4$/.test(item.src);
//             var itemHTML = ['<div class="c-carousel__item">'];

//             if (isVideo) {
//                itemHTML.push('<video class="c-carousel__media" data-src="' + item.src + '"></video>');
//             } else {
//                itemHTML.push('<img class="c-carousel__media" data-src="' + item.src + '">');
//             }

//             if (item.desc) {
//                itemHTML.push('<span class="c-carousel__label">' + item.desc + '</span>');
//             }

//             itemHTML.push('</div>');
//             carouselHTML.push(itemHTML.join(''));
//          });
//          carouselHTML.push('</div>');

//          this.element = $.createNode(carouselHTML);

//          return this.element;
//       },

//       loadMedia(item) {
//          var media = $.query('.c-carousel__media', item);
//          if (!media.src) {
//             if (!('play' in media)) {
//                item.classList.add('is-loading');
//                media.addEventListener('load', function imageLoaded() {
//                   item.classList.remove('is-loading');
//                   media.removeEventListener('load', imageLoaded);
//                });
//             }
//             media.src = media.getAttribute('data-src');
//          }
//       },

//       init(index = 0) {

//          this.element = this.element || $.query('.j-carousel');

//          if (!this.element) {
//             return false;
//          }

//          this.items = $.queryAll('.c-carousel__item', this.element);

//          this.currentItemIndex = index;

//          var currentItem = this.getCurrentItem();
//          var currentItemMedia = $.query('.c-carousel__media', currentItem);
//          var nextItem = this.getNextItem();
//          var prevItem = this.getPrevItem();

//          currentItem.classList.add('is-active');

//          this.loadMedia(currentItem);
//          if ('play' in currentItemMedia) {
//             currentItemMedia.play();
//          }

//          if (nextItem) {
//             this.loadMedia(nextItem);
//          }

//          if (prevItem) {
//             this.loadMedia(prevItem);
//          }

//          if (this.items.length > 1) {

//             var indicatorHTML = ['<ul class="c-carousel__indicator">'];
//             this.items.forEach((item, i) => indicatorHTML.push('<li>' + (++i) + '</li>'));
//             indicatorHTML.push('</ul>');
//             this.element.appendChild($.createNode(indicatorHTML));
//             this.indicator = $.queryAll('.c-carousel__indicator > li', this.element);
//             this.indicator[this.currentItemIndex].classList.add('is-active');

//             if (this.element.getAttribute('data-controls') !== 'false') {

//                 var uri = $.query('base');

//                 uri = uri ? uri.getAttribute('data-uri') : '';

//                var controlsHTML = [
//                   '<div>',
//                     `<button class="c-carousel__controls u-alpha" rel="prev" tabindex="-1"><svg class="b-icon" role="image" aria-label="Předchozí"><use xlink:href="${uri}#arrow--simple"></use></svg></button>`,
//                     `<button class="c-carousel__controls u-alpha" rel="next" tabindex="-1"><svg class="b-icon" role="image" aria-label="Další"><use xlink:href="${uri}#arrow--simple"></use></svg></button>`,
//                   '</div>'
//                ];

//                this.element.appendChild($.createNode(controlsHTML));

//                this.element.addEventListener('click', (e) => {
//                   e.stopPropagation();
//                   var target = e.target;

//                   if (target === this.element) {
//                      return false;
//                   }

//                   while (!target.matches('.c-carousel__controls')) {
//                      target = target.parentNode;

//                      if (target === this.element) {
//                         return false;
//                      }
//                   }

//                   target.getAttribute('rel') === 'next' ? this.next() : this.prev();
//                });

//             }

//             this.element.addEventListener('keyup', (e) => {
//                var key = e.which || e.keyCode;

//                switch (key) {
//                   case 37:
//                      this.prev();
//                      break;
//                   case 39:
//                      this.next();
//                      break;
//                }
//             });

//             this.element.addEventListener('touchstart', (e) => {
//                this.touchX = e.touches[0].clientX;
//                this.touchY = e.touches[0].clientY;
//             });

//             this.element.addEventListener('touchmove', (e) => {
//                if (!this.touchX || !this.touchY) {
//                   return;
//                }

//                var deltaX = this.touchX - e.touches[0].clientX;
//                var deltaY = this.touchY - e.touches[0].clientY;

//                if (Math.abs(deltaX) > Math.abs(deltaY)) {
//                   if (deltaX > 0) {
//                      this.next();
//                   } else {
//                      this.prev();
//                   }
//                }

//                this.touchX = this.touchY = null;
//             });

//          }

//          if (this.element.getAttribute('data-auto') === 'true') {
//             var defaultDelay = this.element.getAttribute('data-delay') || 3000;
//             var timer = function() {
//                this.next();
//                setTimeout(timer.bind(this), this.getCurrentItem().getAttribute('data-delay') || defaultDelay);
//             };
//             setTimeout(timer.bind(this), this.getCurrentItem().getAttribute('data-delay') || defaultDelay);
//          }

//       }

//    };

//    return self;

// })(App);
