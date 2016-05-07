export default [
    {
        src: 'smoothscroll.js',
        test: !('scrollBehavior' in document.documentElement.style)
    }
];