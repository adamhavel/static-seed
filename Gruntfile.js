module.exports = function(grunt) {

    grunt.initConfig({

        babel: {
            options: {
                presets: ['es2015']
            },
            app: {
                src: 'client/app.js',
                dest: 'public/assets/site/js/Heureka.js'
            },
            components: {
                files: [{
                    cwd: 'client',
                    expand: true,
                    src: ['**/*.js', '!app.js'],
                    dest: 'public/assets/site/js/component',
                    flatten: true
                }]
            }
        },

        modernizr: {
            default: {
                dest: 'public/assets/site/js/lib/modernizr.min.js',
                options: ['prefixed', 'setClasses'],
                files: {
                    src: ['client/**/*.js', 'public/assets/site/css/*.css']
                }
            }

        },

        uglify: {
            options: {
                screwIE8: true
            },
            default: {
                files: [{
                    cwd: 'public/assets/site/js',
                    expand: true,
                    src: ['**/*.js', '!lib/*'],
                    dest: 'public/assets/site/js',
                    ext: '.min.js'
                }]
            },
            fastclick: {
                src: 'node_modules/fastclick/lib/fastclick.js',
                dest: 'public/assets/site/js/lib/fastclick.min.js'
            },
            smoothscroll: {
                src: 'node_modules/smoothscroll-polyfill/smoothscroll.js',
                dest: 'public/assets/site/js/lib/smoothscroll.min.js'
            }
        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: '> 2%'}),
                    require('cssnano')({discardUnused: false})
                ]
            },
            default: {
                src: 'public/assets/site/css/default.css',
                dest: 'public/assets/site/css/default.min.css'
            },
            noncritical: {
                src: 'public/assets/site/css/non-critical.css',
                dest: 'public/assets/site/css/non-critical.min.css'
            }
        },

        hashres: {
            options: {
                fileNameFormat: '${name}.${hash}.${ext}',
                hashSize: 10
            },
            components: {
                src: ['public/assets/site/js/component/*.min.js'],
                dest: [
                    'public/assets/site/js/app.min.js',
                    'public/assets/site/js/component/*.min.js'
                ]
            },
            app: {
                src: 'public/assets/site/js/Heureka.min.js'
            },
            css: {
                src: 'public/assets/site/css/default.min.css'
            },
            noncriticalcss: {
                src: 'public/assets/site/css/non-critical.min.css'
            },
            icons: {
                src: 'public/assets/site/img/icons.min.svg'
            }
        },

        svgstore: {
            options: {
                cleanupdefs: true,
                includeTitleElement: false,
                svg: {
                    'xmlns': 'http://public/assets/site.w3.org/2000/svg',
                    'xmlns:xlink': 'http://public/assets/site.w3.org/1999/xlink'
                }
            },
            default: {
                src: ['assets/img/icon/*.svg'],
                dest: 'public/assets/site/img/icons.svg'
            }
        },

        imagemin: {
            default: {
                files: [{
                    cwd: 'assets/img',
                    expand: true,
                    src: '**/*.*',
                    dest: 'public/assets/site/img'
                }]
            },
            icons: {
                src: 'public/assets/site/img/icons.svg',
                dest: 'public/assets/site/img/icons.min.svg',
                options: {
                    svgoPlugins: [
                        {cleanupIDs: false}
                    ]
                }
            }
        },

        clean: {
            css: {
                src: 'public/assets/site/css/**/*'
            },
            js: {
                src: [
                    'public/assets/site/js/*.js',
                    'public/assets/site/js/component/*.js'
                ]
            },
            images: {
                src: ['public/assets/site/img/*', '!public/assets/site/img/icons.*']
            },
            icons: {
                src: ['public/assets/site/img/icons.*']
            },
            cache: {
                src: 'temp/**/*'
            }
        },

        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            css: {
                files: ['client/**/*.less'],
                tasks: ['clean:cache', 'build-css']
            },
            js: {
                files: ['client/**/*.js'],
                tasks: ['clean:cache', 'build-js']
            },
            images: {
                files: ['assets/img/**/*'],
                tasks: ['clean:cache', 'build-images']
            },
            icons: {
                files: ['assets/img/icons/*'],
                tasks: ['clean:cache', 'build-icons']
            },
            templates: {
                files: ['app/**/*.latte']
            },
            nette: {
                files: ['app/**/*.php']
            }
        }

    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concurrent');
    grunt.loadNpmTasks('grunt-hashres2');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-svgstore');
    grunt.loadNpmTasks('grunt-inliner');

    grunt.registerTask('build-js', ['clean:js', 'babel', 'uglify:default', 'hashres:components', 'hashres:app']);
    grunt.registerTask('build-css', ['clean:css', 'less:default', 'postcss:default', 'hashres:css', 'less:noncritical', 'postcss:noncritical', 'hashres:noncriticalcss']);
    grunt.registerTask('build-icons', ['clean:icons', 'svgstore', 'imagemin:icons', 'hashres:icons']);
    grunt.registerTask('build-images', ['clean:images', 'imagemin:default']);
    grunt.registerTask('build', ['clean:cache', 'build-js', 'build-css', 'build-icons', 'build-images', 'modernizr', 'uglify:smoothscroll', 'uglify:fastclick', 'uglify:nette', 'uglify:injector']);
    grunt.registerTask('develop', ['build', 'watch']);

};