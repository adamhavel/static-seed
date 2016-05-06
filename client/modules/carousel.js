/* ==========================================================================
   Carousel
   ========================================================================== */

function Carousel($, self) {

    var currentIndex;
    var itemsCount;

    function prev() {
        moveToIndex(null, currentIndex > 0 ? currentIndex - 1 : itemsCount - 1);
    }

    function next() {
        moveToIndex(null, (currentIndex + 1) % itemsCount);
    }

    function moveToIndex(ev, index = 0) {
        if (currentIndex !== undefined) {
            self.element('slides')[currentIndex].classList.remove('is-active');
            self.element('indicator')[currentIndex].classList.remove('is-active');
        }

        currentIndex = index;

        var currentImage = self.element('images')[currentIndex];
        var currentSlide = self.element('slides')[currentIndex];

        currentSlide.classList.add('is-active');
        self.element('indicator')[currentIndex].classList.add('is-active');
        self.element('label').textContent = currentImage.getAttribute('alt');

        if (!currentImage.getAttribute('src')) {
            currentImage.addEventListener('load', function imageLoaded() {
                currentSlide.classList.remove('is-loading');

                currentImage.removeEventListener('load', imageLoaded);
            });

            currentSlide.classList.add('is-loading');
            currentImage.src = currentImage.getAttribute('data-src');
        }
    }

    self.create = function(items, index) {

        var uri = $.query('base');

        uri = uri ? uri.getAttribute('data-uri') : '';

        var carouselHTML = ['<div class="c-carousel j-carousel__content" tabindex="0">'];

        carouselHTML.push('<ul class="c-carousel__list">');

        items.forEach(function(item) {
            carouselHTML.push(`<li class="c-carousel__slide j-carousel__slide"><img class="c-carousel__image j-carousel__image" data-src="${item.media}" alt="${item.label}"></li>`);
        });

        carouselHTML.push('</ul>');

        carouselHTML.push('<p class="c-carousel__label j-carousel__label">Vel sit debitis vero alias.</p>');

        carouselHTML.push('<ol class="c-carousel__indicator c-indicator">');

        items.forEach((item, i) => carouselHTML.push('<li><button class="c-indicator__item j-indicator__item">' + (++i) + '</button></li>'));

        carouselHTML.push('</ol>');

        carouselHTML.push(
            '<button class="c-carousel__controls j-carousel__controls u-alpha" rel="prev" tabindex="-1">',
                `<svg class="e-icon" role="image" aria-label="Předchozí"><use xlink:href="${uri}#arrow"></use></svg>`,
            '</button>'
        );

        carouselHTML.push(
            '<button class="c-carousel__controls j-carousel__controls u-alpha" rel="next" tabindex="-1">',
                `<svg class="e-icon" role="image" aria-label="Další"><use xlink:href="${uri}#arrow"></use></svg>`,
            '</button>'
        );

        carouselHTML.push('</div>');

        self.container = $.createNode(carouselHTML);

        self.define(
            {
                name: 'self',
                node: self.container,
                handlers: {
                    keyup: function(ev) {
                        var key = ev.which || ev.keyCode;

                        switch (key) {
                            case 37:
                                prev();
                                break;
                            case 39:
                                next();
                                break;
                        };
                    }
                }
            },
            {
                name: 'slides',
                selector: '.j-carousel__slide',
                isCollection: true
            },
            {
                name: 'images',
                selector: '.j-carousel__image',
                isCollection: true
            },
            {
                name: 'label',
                selector: '.j-carousel__label'
            },
            {
                name: 'prevButton',
                selector: '.j-carousel__controls[rel="prev"]',
                handlers: {
                    click: prev,
                    mouseover: function() {
                        var prevImage = self.element('images')[currentIndex > 0 ? currentIndex - 1 : itemsCount - 1];

                        if (!prevImage.getAttribute('src')) {
                            prevImage.src = prevImage.getAttribute('data-src');
                        }
                    }
                }
            },
            {
                name: 'nextButton',
                selector: '.j-carousel__controls[rel="next"]',
                handlers: {
                    click: next,
                    mouseover: function() {
                        var nextImage = self.element('images')[(currentIndex + 1) % itemsCount];

                        if (!nextImage.getAttribute('src')) {
                            nextImage.src = nextImage.getAttribute('data-src');
                        }
                    }
                }
            },
            {
                name: 'indicator',
                selector: '.j-indicator__item',
                isCollection: true,
                handlers: {
                    click: moveToIndex,
                    mouseover: function(ev, index) {
                        var image = self.element('images')[index];

                        if (!image.getAttribute('src')) {
                            image.src = image.getAttribute('data-src');
                        }
                    }
                }
            }
        );

        itemsCount = self.element('slides').length;

        moveToIndex(null, index);

        return self.container;
    };

    return self;

}
