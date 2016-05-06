/* ==========================================================================
   Libraries
   ========================================================================== */

export default [
    {
        src: 'fastclick.js',
        callback: function() {
            FastClick.attach(document.body);
        }
    },
    {
        src: 'smoothscroll.js',
        test: !('scrollBehavior' in document.documentElement.style)
    }
];