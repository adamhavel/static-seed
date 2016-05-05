/* ==========================================================================
   Promo carousel
   ========================================================================== */

import component from 'component.js';

export default function PromoCarousel(node, selector) {

    const self = component(node, selector);
    var currentIndex;
    var interval;
    var autoSlider;

    self.define(
        {
            name: 'items',
            isCollection: true
        },
        {
            name: 'indicator',
            template: function() {
                let items = '';

                self.element('items').get().forEach(function(item, index) {
                    items += self.element('links').template(index + 1);
                });

                return `<ol class="c-promo-carousel__indicator j-promo-carousel__indicator c-indicator">${items}</ol>`;
            }
        },
        {
            name: 'links',
            isCollection: true,
            click: slideAtIndex,
            template: function(index) {
                return `<li><button class="j-promo-carousel__link c-indicator__item">${index}</button></li>`;
            }
        }
    );

    function slideAtIndex(ev, index = 0) {
        clearTimeout(autoSlider);

        self.element('items').get(currentIndex).classList.remove('is-active');
        self.element('links').get(currentIndex).classList.remove('is-active');

        currentIndex = index;
        self.element('items').get(currentIndex).classList.add('is-active');
        self.element('links').get(currentIndex).classList.add('is-active');

        autoSlider = setTimeout(function() {
            slideAtIndex(null, (currentIndex + 1) % self.element('items').get().length);
        }, interval);
    }

    (function init() {

        interval = self.container.getAttribute('data-interval') || 5000;
        currentIndex = 0;

        self.container.appendChild(self.element('indicator').render());

        slideAtIndex(null, currentIndex);

    })();

    return self;

}
