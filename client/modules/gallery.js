/* ==========================================================================
   Gallery
   ========================================================================== */

function Gallery($, self) {

    self.define(
        {
            name: 'self',
            node: self.container,
            handlers: {
                mouseenter: function() {
                    $.requireComponent('_c-lightbox.js');
                    $.requireComponent('_c-carousel.js');
                }
            }
        },
        {
            name: 'items',
            selector: '.j-gallery__item',
            isCollection: true,
            handlers: {
                click: function(ev, index) {
                    ev.preventDefault();

                    $.requireComponent('_c-lightbox.js', function() {
                        $.requireComponent('_c-carousel.js', function() {

                            var lightbox = Lightbox($, $.Component(null));
                            var carousel = Carousel($, $.Component(null));
                            var items = self.element('items').map(function(item) {
                                return {
                                    media: item.getAttribute('href'),
                                    label: item.firstElementChild.getAttribute('alt')
                                };
                            });

                            var carouselElement = carousel.create(items, index);
                            var lightboxElement = lightbox.create(carouselElement);

                            document.body.appendChild(lightboxElement);

                            carouselElement.focus();
                        });
                    });
                }
            }
        }
    );

    (function init() {



    })();

    return self;

}
