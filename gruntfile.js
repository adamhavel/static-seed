module.exports = function(grunt) { grunt.initConfig({
pkg: grunt.file.readJSON('package.json'),

/* ==========================================================================
   Variables
   ========================================================================== */



/* ==========================================================================
   Configuration
   ========================================================================== */

/* JavaScript
   ========================================================================== */

jshint: {
   options: {
      jshintrc: 'grunt/.jshintrc',
      force: true
   },
   client: [
      'client/**/*.js'
   ]
},

concat: {
   options: {
      separator: '\n\n'
   },
   bundle: {
      src: [
         'public/assets/site/lib/modernizr/modernizr.custom.js',
         'client/**/*.js'
      ],
      dest: 'public/assets/site/js/app.js',
   }
},

modernizr: {
   default: {
      'devFile': 'public/assets/site/lib/modernizr/modernizr.js',
      'outputFile': 'public/assets/site/lib/modernizr/modernizr.custom.js',
      'extra': {
         'shiv': false,
         'load' : false
      },
      'uglify': false,
      'files': {
         'src': [
            'client/**/*.js',
            'public/assets/site/css/default.css'
         ]
      },
   }
},

uglify: {
   app: {
      options: {
         report: 'min'
      },
      src: 'public/assets/site/js/app.js',
      dest: 'public/assets/site/js/app.js'
   },
   fastclick: {
      src: [
         'public/assets/site/lib/fastclick/lib/fastclick.js'
      ],
      dest: 'public/assets/site/js/fastclick.min.js'
   },
   hammer: {
      src: [
         'public/assets/site/lib/hammer.js/hammer.js'
      ],
      dest: 'public/assets/site/js/hammer.min.js'
   }
},


/* Stylesheet
   ========================================================================== */

/*sass: {
   default: {
      src: 'public/assets/site/css/default.scss',
      dest: 'public/assets/site/css/default.css'
   }
},*/

autoprefixer: {
   default: {
      options: {
         browsers: ['> 1%', 'last 2 versions', 'firefox 24', 'opera 12.1']
      },
      src: 'public/assets/site/css/default.css'
   }
},

cmq: {
   default: {
      files: {
         'build/assets/site/css/default.css': ['build/assets/site/css/default.css']
      }
   }
},

remfallback: {
   default: {
      files: {
         'public/assets/site/css/default.css': ['public/assets/site/css/default.css']
      }
   }
},

csslint: {
   options: {
      csslintrc: 'grunt/.csslintrc'
   },
   default: {
      src: 'public/assets/site/css/default.css'
   }
},

cssmin: {
   options: {
      report: 'min',
      keepSpecialComments: 0,
      noAdvanced: true
   },
   default: {
      files: [{
         expand: true,
         src: ['build/assets/site/css/*.css']
      }]
   }
},

uncss: {
   options: {
      ignore: [/\.j-/, /\.no-/, /\.error/, /\.active/],
      stylesheets: ['assets/site/css/default.css']
   },
   default: {
      files: {
         'build/assets/site/css/default.css': ['build/*.html']
      }
   }
},


/* Build
   ========================================================================== */

clean: {
   build: ['build'],
   temp: ['temp']
},

copy: {
   build: {
      files: [
         {
            cwd: 'public',
            expand: true,
            src: [
               '*.html',
               'assets/**',
               '!**/*.map',
               '!assets/site/lib/**',
               '!assets/site/img/icon/**'
            ],
            dest: 'build/'
         },
      ]
   },
   icons: {
      files: [
         {
            expand: true,
            cwd: 'temp',
            src: '*.png',
            dest: 'public/assets/site/img',
            rename: function (dest, src) {
               return dest + '/icon-' + src;
            }
         }
      ]
   }
},

hashres: {
   options: {
      fileNameFormat: '${name}.min.${hash}.${ext}',
   },
   build: {
      src: [
         'build/assets/site/js/app.js',
         'build/assets/site/css/default.css',
         'build/assets/site/css/non-critical.css',
         'build/assets/site/img/icons.svg'
      ],
      dest: 'build/*.html'
   }
},

inliner: {
   default: {
      files: [{
         expand: true,
         cwd: 'build',
         src: '*.html',
         dest: 'build'
      }]
   }
},

/* Images
   ========================================================================== */

svgmin: {
   options: {
      plugins: [
         { removeXMLProcInst: true },
         { cleanupIDs: false },
         { removeViewBox: true },
         { removeTitle: true }
      ]
   },
   build: {
      files: [{
         expand: true,
         src: 'build/assets/site/img/*.svg'
      }]
   }
},

imagemin: {
   png: {
      options: {
         optimizationLevel: 7
      },
      files: [{
         expand: true,
         src: 'build/assets/site/img/*.png'
      }]
   },
   jpg: {
      options: {
         progressive: true
      },
      files: [{
         expand: true,
         src: 'build/assets/site/img/*.jpg'
      }]
   }
},

svgstore: {
   options: {
      cleanup: ['id', 'enable-background']
   },
   icons: {
      files: {
         'public/assets/site/img/icons.svg': ['public/assets/site/img/icon/*.svg']
      }
   }
},

grunticon: {
   icons: {
      files: [{
         expand: true,
         cwd: 'public/assets/site/img/icon',
         src: ['*.svg'],
         dest: 'temp'
      }],
      options: {
         pngfolder: '.',
         defaultWidth: 128,
         defaultHeight: 128
      }
   }
},


/* Runtime
   ========================================================================== */

watch: {
   options: {
      spawn: true
   },
   js: {
      files: ['client/**/*.js'],
      tasks: ['makejs'],
      options: {
         livereload: true,
         spawn: false
      }
   },
   css: {
      files: ['client/**/*.scss'],
      tasks: ['makecss'],
      options: {
         livereload: true,
         spawn: false
      }
   },
   html: {
      files: ['public/*.html'],
      options: {
         livereload: true,
         spawn: false
      }
   },
   images: {
      files: ['public/assets/site/img/*.(png|jpg|gif|svg)'],
      options: {
         livereload: true,
         spawn: false
      }
   },
   icons: {
      files: ['public/assets/site/img/icon/*.svg'],
      tasks: ['makeicons']
   }
},

exec: {
   sass: {
      cmd: 'sass -r sass-globbing app.scss:../public/assets/site/css/default.css --style expanded -E UTF-8',
      cwd: 'client'
   },
   sass_non_critical: {
      cmd: 'sass non-critical.scss:../public/assets/site/css/non-critical.css --style expanded -E UTF-8',
      cwd: 'client'
   },
   server: {
      cmd: 'node server.js'
   },
   server_dist: {
      cmd: 'node server.js dist'
   },
   finch: {
      cmd: 'finch forward http://localhost'
   }
},

concurrent: {
   dev: ['exec:server', 'watch'],
   dist: ['exec:server_dist'],
   options: {
      logConcurrentOutput: true
   }
},


/* Performance
   ========================================================================== */

pagespeed: {
   options: {
      nokey: true,
      locale: 'en_GB',
      threshold: 80,
      url: 'https://spotted-point.usefinch.com'
   },
   desktop: {
      options: {
         strategy: 'desktop',
      }
   }
},

perfbudget: {
   default: {
      options: {
         url: 'https://spotted-point.usefinch.com',
         key: '194bb57265774755b8dd82b8b2df09e5'
      }
   }
}

});


/* ==========================================================================
   Tasks
   ========================================================================== */

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-csslint');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-remfallback');
grunt.loadNpmTasks('grunt-combine-media-queries');
grunt.loadNpmTasks('grunt-modernizr');
grunt.loadNpmTasks('grunt-uncss');
grunt.loadNpmTasks('grunt-hashres');
grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-svgmin');
grunt.loadNpmTasks('grunt-inliner');
grunt.loadNpmTasks('grunt-grunticon');
grunt.loadNpmTasks('grunt-svgstore');

/* Helper tasks
   ========================================================================== */

grunt.registerTask('makecss', [
   'exec:sass', 'remfallback', 'autoprefixer', 'csslint', 'exec:sass_non_critical'
]);

grunt.registerTask('makejs', [
   'concat:bundle', 'jshint:client'
]);

grunt.registerTask('makeicons', function() {
   if (grunt.file.expand('public/assets/site/img/icon/*.svg').length > 0) {
      grunt.task.run([
         'svgstore', 'grunticon', 'copy:icons', 'clean:temp'
      ]);
   } else {
      grunt.log.writeln('No icons found.');
   }
});

grunt.registerTask('init', [
   'makecss', 'modernizr', 'uglify:fastclick', 'uglify:hammer', 'makeicons', 'makejs'
]);


/* Main tasks
   ========================================================================== */

grunt.registerTask('default', function() {
   grunt.option('force', true);
   grunt.task.run([
      'init', 'concurrent:dev'
   ]);
});

grunt.option('force', true);
grunt.registerTask('build', [
   'init', 'uglify:app', 'clean:build', 'copy:build', 'uncss', 'cmq', 'cssmin', 'hashres:build', 'svgmin:build', 'imagemin', 'concurrent:dist'
]);

};