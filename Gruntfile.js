module.exports = function(grunt) {

    grunt.initConfig({

        babel: {
            options: {
                presets: ['es2015'],
                plugins: ['transform-es2015-modules-systemjs']
            },
            scout: {
                src: 'client/scout.js',
                dest: 'public/assets/site/js/scout.js',
                options: {
                    plugins: []
                }
            },
            modules: {
                files: [{
                    cwd: 'client',
                    expand: true,
                    src: ['modules/**/*.js'],
                    dest: 'public/assets/site/js/modules',
                    flatten: true
                }]
            }
        },

        modernizr: {
            default: {
                dest: 'public/assets/site/js/lib/modernizr.js',
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
                    dest: 'public/assets/site/js'
                }]
            },
            libraries: {
                files: [
                    { 'public/assets/site/js/lib/smoothscroll.js': 'node_modules/smoothscroll-polyfill/dist/smoothscroll.js' },
                    { 'public/assets/site/js/lib/system.js': 'node_modules/systemjs/dist/system-csp-production.src.js' },
                    { 'public/assets/site/js/lib/shim.js': 'node_modules/core-js/client/shim.js' }
                ]
            }
        },

        sass: {
            default: {
                src: 'client/app.scss',
                dest: 'public/assets/site/css/default.css'
            }
        },

        sass_globbing: {
            default: {
                src: [
                    'client/objects/**/*.scss',
                    'client/layout/**/*.scss',
                    'client/elements/**/*.scss',
                    'client/components/**/*.scss',
                    'client/utility/**/*.scss'
                ],
                dest: 'client/_partials.scss'
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
                src: 'public/assets/site/css/default.css'
            },
            noncritical: {
                src: 'public/assets/site/css/non-critical.css'
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
                src: ['public/assets/site/img/icon/*.svg'],
                dest: 'public/assets/site/img/icons.svg'
            }
        },

        clean: {
            build: {
                src: ['build']
            }
        },

        copy: {
            build: {
                files: [{
                    cwd: 'public',
                    expand: true,
                    src: [
                        '**',
                        '!**/*.map',
                        '!assets/site/img/icon/**',
                        '!assets/site/font/**'
                    ],
                    dest: 'build/public'
                }]
            }
        },

        hashres: {
            options: {
                fileNameFormat: '${name}.${hash}.${ext}'
            },
            modules: {
                src: ['build/public/assets/site/js/modules/*.js'],
                dest: [
                    'build/public/assets/site/js/scout.js',
                    'build/public/assets/site/js/modules/*.js'
                ]
            },
            default: {
                src: [
                    'build/public/assets/site/js/scout.js',
                    'build/public/assets/site/css/default.css',
                    'build/public/assets/site/css/non-critical.css',
                    'build/public/assets/site/img/icons.svg'
                ],
                dest: 'build/public/*.html'
            }
        },

        inliner: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'build/public',
                    src: '*.html',
                    dest: 'build/public'
                }]
            },
            modernizr: {
                options: {
                    js: true,
                    css: false
                },
                files: [{
                    expand: true,
                    cwd: 'build/public',
                    src: '*.html',
                    dest: 'build/public'
                }]
            }
        },

        imagemin: {
            default: {
                files: [{
                    cwd: 'build/public/assets/site/img',
                    expand: true,
                    src: ['**/*.*', '!icons.svg'],
                    dest: 'build/public/assets/site/img'
                }]
            },
            icons: {
                src: 'public/assets/site/img/icons.svg',
                dest: 'public/assets/site/img/icons.svg',
                options: {
                    svgoPlugins: [
                        {cleanupIDs: false}
                    ]
                }
            }
        },

        exec: {
            sass: {
                cmd: 'sass app.scss:../public/assets/site/css/default.css --style expanded -E UTF-8',
                cwd: 'client'
            },
            sassnoncritical: {
                cmd: 'sass -r ../data-uri.rb non-critical.scss:../public/assets/site/css/non-critical.css --style expanded -E UTF-8',
                cwd: 'client'
            },
            server: {
                cmd: 'node server.js'
            }
        },

        concurrent: {
            target: ['exec:server', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },

        watch: {
            options: {
                livereload: true,
                spawn: true
            },
            css: {
                files: ['client/**/*.scss', '!client/non-critical.scss'],
                tasks: ['build-css']
            },
            noncriticalcss: {
                files: ['client/non-critical.scss'],
                tasks: ['build-non-critical-css']
            },
            js: {
                files: ['client/**/*.js'],
                tasks: ['build-js']
            },
            images: {
                files: ['public/assets/site/img/*']
            },
            icons: {
                files: ['public/assets/site/img/icon/*'],
                tasks: ['build-icons']
            },
            html: {
                files: ['public/**/*.html']
            }
        }

    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-inliner');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-globbing');
    grunt.loadNpmTasks('grunt-svgstore');

    grunt.registerTask('build-js', ['babel', 'uglify:default']);
    grunt.registerTask('build-css', ['sass_globbing', 'sass:default', 'postcss:default']);
    grunt.registerTask('build-non-critical-css', ['exec:sassnoncritical', 'postcss:noncritical']);
    grunt.registerTask('build-icons', ['svgstore', 'imagemin:icons']);
    grunt.registerTask('init', ['build-css', 'build-non-critical-css', 'modernizr', 'uglify:libraries', 'build-js', 'build-icons']);
    grunt.registerTask('build', ['init', 'clean:build', 'copy:build', 'imagemin:default', 'inliner', 'hashres']);
    grunt.registerTask('develop', ['init', 'concurrent']);

};
