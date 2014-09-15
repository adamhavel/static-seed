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
   ondemand: {
      src: [
         'public/assets/site/lib/fastclick/lib/fastclick.js'
      ],
      dest: 'public/assets/site/js/app.touch.min.js'
   },
   shims: {
      src: [
         'public/assets/site/lib/html5shiv/dist/html5shiv.js',
         'public/assets/site/lib/polyfills/polyfill.js'
      ],
      dest: 'public/assets/site/js/shims.min.js'
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
         'public/assets/site/css/default.css': ['public/assets/site/css/default.css']
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
         src: ['public/assets/site/css/*.css']
      }]
   }
},

uncss: {
   options: {
      ignore: [/\.j-/, /\.error/, /\.active/],
      stylesheets: ['assets/site/css/default.css']
   },
   default: {
      files: {
         'public/assets/site/css/default.css': ['public/*.html']
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
            cwd: 'temp/bmp',
            src: '*.png',
            dest: 'public/assets/site/img',
            rename: function (dest, src) {
               return dest + '/icon-' + src;
            }
         },
         {
            expand: true,
            cwd: 'temp',
            src: '*.scss',
            dest: 'client'
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
         'build/assets/site/css/default.css'
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
         { removeXMLProcInst: false }
      ]
   },
   build: {
      files: [{
         expand: true,
         src: 'build/assets/site/img/*.svg'
      }]
   },
   icons: {
      files: [{
         expand: true,
         cwd: 'public/assets/site/img/icon',
         src: '*.svg',
         dest: 'temp'
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

grunticon: {
   icons: {
      files: [{
         expand: true,
         cwd: 'temp',
         src: ['*.svg'],
         dest: 'temp'
      }],
      options: {
         datasvgcss: '_icons-data.scss',
         cssprefix: 'icon--',
         pngfolder: 'bmp',
         defaultWidth: 24,
         defaultHeight: 24,
         template: 'grunt/icon.hbs'
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
      cmd: 'node server-dist.js'
   },
   finch: {
      cmd: 'finch forward http://localhost'
   }
},

concurrent: {
   dev: ['exec:server', 'watch'],
   dist: ['exec:server_dist', 'exec:finch'],
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
grunt.loadNpmTasks('grunt-grunticon');

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
         'svgmin:icons', 'grunticon:icons', 'copy:icons', 'clean:temp'
      ]);
   } else {
      grunt.log.writeln('No icons found.');
   }
});

grunt.registerTask('init', [
   'makecss', 'modernizr', 'uglify:ondemand', 'uglify:shims', 'makeicons', 'makejs'
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
   'init', 'uncss', 'cmq', 'cssmin', 'uglify:app', 'clean:build', 'copy:build', 'hashres:build', 'svgmin:build', 'imagemin', 'concurrent:dist'
]);

};