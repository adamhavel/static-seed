module.exports = (grunt) ->

   # Define the configuration for all the tasks
   grunt.initConfig

      # JavaScript

      babel:
         options:
            presets: ['es2015']
         app:
            src: 'client/app.js'
            dest: 'public/assets/site/js/app.js'
         components:
            files: [{
               cwd: 'client/components'
               expand: true
               src: ['**/*.js']
               dest: 'public/assets/site/js/components'
               flatten: true
            }]

      modernizr:
         default:
            dest: 'public/assets/site/js/modernizr.min.js'
            options: ['prefixed', 'setClasses']
            files:
               src: ['client/**/*.js',' public/assets/site/css/default.css']

      uglify:
         app:
            options:
               report: 'min'
            src: 'build/public/assets/site/js/app.js'
            dest: 'build/public/assets/site/js/app.js'
         components:
            options:
               report: 'min'
            files: [{
               cwd: 'build/public/assets/site/js/components'
               expand: true
               src: ['*.js']
               dest: 'build/public/assets/site/js/components'
            }]
         fastclick:
            src: 'node_modules/fastclick/lib/fastclick.js'
            dest: 'public/assets/site/js/fastclick.min.js'
         pep:
            src: 'node_modules/pepjs/dist/pep.js'
            dest: 'public/assets/site/js/pep.min.js'
         smoothscroll:
            src: 'node_modules/smoothscroll-polyfill/smoothscroll.js'
            dest: 'public/assets/site/js/smoothscroll.min.js'

      # CSS

      sass:
         default:
            src: 'client/app.scss'
            dest: 'public/assets/site/css/default.css'

      sass_globbing:
         default:
            src: [
               'client/objects/**/*.scss',
               'client/layout/**/*.scss',
               'client/elements/**/*.scss',
               'client/components/**/*.scss',
               'client/utility/**/*.scss'
            ]
            dest: 'client/_partials.scss'

      exec:
         sass:
            cmd: 'sass app.scss:../public/assets/site/css/default.css --style expanded -E UTF-8'
            cwd: 'client'
         sass_non_critical:
            cmd: 'sass -r ../data-uri.rb non-critical.scss:../public/assets/site/css/non-critical.css --style expanded -E UTF-8'
            cwd: 'client'
         server:
            cmd: 'node server.js'

      cssmin:
         options:
            report: 'min'
            keepSpecialComments: 0
         default:
            files: [{
               expand: true
               src: ['build/public/assets/site/css/*.css']
            }]

      autoprefixer:
         options:
            browsers: ['> 1%', 'last 2 versions']
         default:
            src: 'public/assets/site/css/default.css'
            dest: 'public/assets/site/css/default.css'
         non_critical:
            src: 'public/assets/site/css/non-critical.css'
            dest: 'public/assets/site/css/non-critical.css'

      # Build

      clean:
         build:
            src: ['build']

      copy:
         build:
            files: [{
               cwd: 'public'
               expand: true
               src: [
                  '**',
                  '!**/*.map',
                  '!assets/site/img/icon/**',
                  '!assets/site/font/**',
                  '!assets/site/img/icons-style.svg'
               ]
               dest: 'build/public'
            }]

      hashres:
         options:
            fileNameFormat: '${name}.min.${hash}.${ext}'
         components:
            src: [
               'build/public/assets/site/js/components/*.js'
            ]
            dest: [
              'build/public/assets/site/js/app.js',
              'build/public/assets/site/js/components/*.js'
            ]
         default:
            src: [
               'build/public/assets/site/js/app.js',
               'build/public/assets/site/css/default.css',
               'build/public/assets/site/css/non-critical.css',
               'build/public/assets/site/img/icons.svg'
            ]
            dest: 'build/public/*.html'

      inliner:
         default:
            files: [{
               expand: true
               cwd: 'build/public'
               src: '*.html'
               dest: 'build/public'
            }]
         modernizr:
            options:
               js: true
               css: false
            files: [{
               expand: true
               cwd: 'build/public'
               src: '*.html'
               dest: 'build/public'
            }]

      # Images

      svgmin:
         options:
            plugins: [
               {removeXMLProcInst: true},
               {cleanupIDs: false},
               {removeViewBox: true},
               {convertStyleToAttrs: false}
            ]
         default:
            files: [{
               expand: true
               src: 'build/public/assets/site/img/*.svg'
            }]

      imagemin:
         png:
            options:
               optimizationLevel: 7
            files: [{
               expand: true
               src: 'build/public/assets/site/img/*.png'
            }]
         jpg:
            options:
               progressive: true
            files: [{
               expand: true
               src: 'build/public/assets/site/img/*.jpg'
            }]

      svgstore:
         options:
            cleanupdefs: true
         icons:
            src: ['public/assets/site/img/icon/*.svg']
            dest: 'public/assets/site/img/icons.svg'

      # Runtime

      concurrent:
         target: ['exec:server', 'watch']
         options:
            logConcurrentOutput: true

      watch:
         options:
            livereload: true
            spawn: false
         gruntfile:
            files: ['Gruntfile.coffee']
         sass:
            files: ['client/**/*.scss']
            tasks: ['make_css']
         sass_non_critical:
            files: ['client/non-critical.scss']
            tasks: ['make_non_critical_css']
         js:
            files: ['client/**/*.js']
            tasks: ['make_js']
         html:
            files: ['public/*.html']
         images:
            files: ['public/assets/site/img/*.(png|jpg|gif|svg)']
         icons:
            files: ['public/assets/site/img/icon/*.svg']
            tasks: ['svgstore']
         fonts:
            files: ['public/assets/site/assets/site/font/*.woff']
            tasks: ['exec:sass_non_critical']

   grunt.loadNpmTasks 'grunt-autoprefixer'
   grunt.loadNpmTasks 'grunt-babel'
   grunt.loadNpmTasks 'grunt-concurrent'
   grunt.loadNpmTasks 'grunt-contrib-clean'
   grunt.loadNpmTasks 'grunt-contrib-concat'
   grunt.loadNpmTasks 'grunt-contrib-copy'
   grunt.loadNpmTasks 'grunt-contrib-cssmin'
   grunt.loadNpmTasks 'grunt-contrib-imagemin'
   grunt.loadNpmTasks 'grunt-contrib-uglify'
   grunt.loadNpmTasks 'grunt-contrib-watch'
   grunt.loadNpmTasks 'grunt-exec'
   grunt.loadNpmTasks 'grunt-hashres'
   grunt.loadNpmTasks 'grunt-inliner'
   grunt.loadNpmTasks 'grunt-modernizr'
   grunt.loadNpmTasks 'grunt-sass'
   grunt.loadNpmTasks 'grunt-sass-globbing'
   grunt.loadNpmTasks 'grunt-svgmin'
   grunt.loadNpmTasks 'grunt-svgstore'

   grunt.registerTask 'default', ['develop']

   grunt.registerTask 'make_css',
      'Builds the critical stylesheet.',
      ['sass_globbing', 'sass', 'autoprefixer:default']

   grunt.registerTask 'make_js',
      'Bundles and transpiles scripts.',
      ['babel']

   grunt.registerTask 'make_icons', () ->
      if grunt.file.expand('public/assets/site/img/icon/*.svg').length > 0
         grunt.task.run ['svgstore']
      else
         grunt.log.writeln 'No icons found.'

   grunt.registerTask 'make_non_critical_css',
      'Builds the non-critical stylesheet.',
      ['exec:sass_non_critical', 'autoprefixer:non_critical']

   grunt.registerTask 'init',
      'Builds the non-critical stylesheet.',
      ['make_css', 'make_non_critical_css', 'modernizr', 'uglify:fastclick', 'uglify:pep', 'uglify:smoothscroll', 'make_js', 'svgstore']

   grunt.registerTask 'develop',
      'Watches the project for changes and automatically builds them.',
      ['init', 'concurrent']

   grunt.registerTask 'build',
      'Compiles all of the assets and copies the files to the build directory.',
      ['init', 'clean:build', 'copy:build', 'cssmin', 'uglify:app', 'uglify:components', 'inliner:modernizr', 'hashres', 'svgmin', 'imagemin']

