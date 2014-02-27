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
      separator: ';'
   },
   bundle: {
      src: [
         'public/assets/site/lib/libs.min.js',
         'public/assets/site/js/app.min.js'
      ],
      dest: 'public/assets/site/js/app.min.js',
   }
},

uglify: {
   app: {
      options: {
         report: 'min'
      },
      src: [
         'client/**/*.js',
      ],
      dest: 'public/assets/site/js/app.min.js'
   },
   libs: {
      src: [
         'public/assets/site/lib/*/**/*.js',
         '!public/assets/site/lib/html5shiv/**/*',
         '!public/assets/site/lib/polyfills/**/*'
      ],
      dest: 'public/assets/site/lib/libs.min.js'
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

sass: {
   default: {
      src: 'public/assets/site/css/default.scss',
      dest: 'public/assets/site/css/default.css'
   }
},

autoprefixer: {
   default: {
      options: {
         browsers: ['> 1%', 'last 2 versions', 'firefox 24', 'opera 12.1']
      },
      src: 'public/assets/site/css/default.css'
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
      keepSpecialComments: 0
   },
   default: {
      src: 'public/assets/site/css/default.css',
      dest: 'public/assets/site/css/default.min.css'
   }
},

uncss: {
   options: {
      ignore: [/\.j-/, /:checked/, /:not/, /\.error/],
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
               '!assets/site/img/icon-*.svg',
               '!assets/site/css/*.scss',
               '!assets/site/css/default.css'
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
            dest: 'public/assets/site/css'
         }
      ]
   }
},

hashres: {
   options: {
      fileNameFormat: '${name}.${hash}.${ext}',
   },
   build: {
      src: [
         'build/assets/site/js/app.min.js',
         'build/assets/site/css/default.min.css'
      ],
      dest: 'build/*.html'
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
         cwd: 'public/assets/site/img',
         src: 'icon-*.svg',
         dest: 'temp',
         rename: function (dest, src) {
            return dest + '/' + src.replace(/^icon-/, '');
         }
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
         defaultWidth: 20,
         defaultHeight: 20,
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
      files: ['public/assets/site/css/**/*.scss'],
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
      files: ['public/assets/site/img/icon-*.svg'],
      tasks: ['makeicons']
   }
},

exec: {
   sass: {
      cmd: 'sass default.scss:default.css --style expanded',
      cwd: 'public/assets/site/css'
   },
   server: {
      cmd: 'node server.js'
   }
},

concurrent: {
   dev: ['exec:server', 'watch'],
   options: {
      logConcurrentOutput: true
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
grunt.loadNpmTasks('grunt-uncss');
grunt.loadNpmTasks('grunt-hashres');
grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-svgmin');
grunt.loadNpmTasks('grunt-grunticon');

/* Helper tasks
   ========================================================================== */

grunt.registerTask('makecss', function(option) {
   grunt.task.run('exec:sass');
   if (option === 'build') {
      grunt.task.run('uncss');
   }
   grunt.task.run([
      /*'remfallback',*/ 'autoprefixer', 'cssmin', 'csslint'
   ]);
});

grunt.registerTask('makejs', [
   'uglify:app', 'concat:bundle', 'jshint:client'
]);

grunt.registerTask('makeicons', function() {
   if (grunt.file.expand('public/assets/site/img/icon-*.svg').length > 0) {
      grunt.task.run([
         'svgmin:icons', 'grunticon:icons', 'copy:icons', 'clean:temp'
      ]);
   } else {
      grunt.log.writeln('No icons found.');
   }
});

grunt.registerTask('init', function(option) {
   if (option === 'build') {
      grunt.task.run('makecss:build');
   } else {
      grunt.task.run('makecss');
   }
   grunt.task.run([
      'uglify:libs', 'uglify:shims', 'makejs', 'makeicons'
   ]);
});


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
   'init:build', 'clean:build', 'copy:build', 'hashres:build', 'svgmin:build', 'imagemin'
]);

};