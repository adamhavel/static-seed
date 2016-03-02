/* ==========================================================================
   Lightbox
   ========================================================================== */

function Lightbox($, self) {

    var lastActiveElement;

    function close() {
        self.container.parentNode.removeChild(self.container);

        lastActiveElement.focus();
    }

    self.create = function(content) {

        var uri = $.query('base');

        uri = uri ? uri.getAttribute('data-uri') : '';

        var lightboxHTML = [
            '<div class="c-lightbox j-lightbox" tabindex="0">',
                `<button class="c-lightbox__button j-lightbox__button u-beta"><svg class="e-icon"><use xlink:href="${uri}#close"></use></svg></button>`,
            '</div>'
        ];

        self.container = $.createNode(lightboxHTML);

        content.classList.add('c-lightbox__content', 'j-carousel__content');
        self.container.appendChild(content);

        self.define(
            {
                name: 'self',
                node: self.container,
                handlers: {
                    keyup: function(ev) {
                        var key = ev.which || ev.keyCode;

                        switch (key) {
                            case 27:
                                close();
                                break;
                        }
                    }
                }
            },
            {
                name: 'closeButton',
                selector: '.j-lightbox__button',
                handlers: {
                    click: close
                }
            },
            {
                name: 'content',
                selector: '.j-carousel__content',
                handlers: {
                    click: function(ev) {
                        ev.stopPropagation();
                    }
                }
            }
        );

        return self.container;
    };

    (function init() {

        lastActiveElement = document.activeElement;

    })();

    return self;

}

