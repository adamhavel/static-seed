/* ==========================================================================
   Lightbox
   ========================================================================== */

var Lightbox = (function($) {

    var self = {};

    self.open = function(content) {
        self.lastActiveElement = document.activeElement;

        var uri = $.query('base');

        uri = uri ? uri.getAttribute('data-uri') : '';

        var lightboxHTML = [
            '<div class="c-lightbox j-lightbox" tabindex="0">',
                `<button class="c-lightbox__button j-lightbox__button u-gamma"><svg class="b-icon"><use xlink:href="${uri}#close"></use></svg></button>`,
            '</div>'
        ];

        content.classList.add('c-lightbox__content');

        self.element = $.createNode(lightboxHTML);
        self.element.appendChild(content);

        document.body.appendChild(self.element);

        self.element.addEventListener('keyup', (e) => {
            var key = e.which || e.keyCode;

            switch (key) {
                case 27:
                    e.preventDefault();
                    self.close();
                    break;
            }
        });

        content.addEventListener('click', function(ev) {
            ev.stopPropagation();
        });

        self.element.addEventListener('click', (e) => {
            e.preventDefault();
            self.close();
        });

        self.element.focus();
    };

    self.close = function() {
        document.body.removeChild(self.element);
        self.element = null;
        self.lastActiveElement.focus();
    };

    return self;

})(App);
