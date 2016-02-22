/* ==========================================================================
   Promo carousel
   ========================================================================== */

function PromoCarousel($, self) {

    self.elements.push(
        {
            name: 'items',
            selector: '.j-promo-carousel__item',
            isCollection: true
        },
        {
            name: 'indicators',
            selector: '.j-promo-carousel__indicator',
            isCollection: true,
            click: slideAtIndex
        }
    );

    var currentIndex;
    var interval;
    var autoSlider;

    function slideAtIndex(ev, index = 0) {
        clearTimeout(autoSlider);

        self.element('items')[currentIndex].classList.remove('is-active');
        self.element('indicators')[currentIndex].classList.remove('is-active');

        currentIndex = index;
        self.element('items')[currentIndex].classList.add('is-active');
        self.element('indicators')[currentIndex].classList.add('is-active');

        autoSlider = setTimeout(function() {
            slideAtIndex((currentIndex + 1) % self.element('items').length);
        }, interval);
    }

    (function init() {

        interval = self.container.getAttribute('data-interval') || 5000;
        currentIndex = 0;

        var indicatorHTML = ['<ol class="c-promo-carousel__indicator c-indicator>'];

        self.element('items').forEach((item, i) => indicatorHTML.push('<li><button class="c-indicator__item j-promo-carousel__indicator">' + (++i) + '</button></li>'));
        indicatorHTML.push('</ol>');

        self.container.appendChild($.createNode(indicatorHTML));

        slideAtIndex(currentIndex);

    })();

    return self;

}
