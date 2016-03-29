module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shopify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');

  var is_production = (grunt.option('env') == 'production');

  grunt.initConfig({
    credentials: is_production ? '' : grunt.file.readJSON('credentials.json'),
    url: '',
    shopify: {
      options: {
        api_key: '<%= credentials.api_key %>',
        password: '<%= credentials.password %>',
        url: '<%= url %>',
        theme: '<%= credentials.theme_id %>',
        base: 'shop/'
      }
    },

    clean: {
      reset: [
        'shop/**/*.*'
      ]
    },

    sass: {
      options: {
        loadPath: ['bower_components/foundation/scss']
      },
      development: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'src/scss',
          src: ['*.scss'],
          dest: 'shop/assets',
          ext: '.css'
        }]
      },
      production: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'src/scss',
          src: ['*.scss'],
          dest: 'shop/assets',
          ext: '.css'
        }]
      }
    },

    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        report: 'min',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - */\n'
      },
      development: {
        options: {
          mangle: false,
          beautify: true,
          compress: false,
          preserveComments: 'all'
        },
        files: {
          'shop/assets/app.min.js': [
            'src/js/third_party/**/*.js',
            'src/js/app/**/*.js'
          ]
        }
      },
      production: {
        options: {
          mangle: true,
          compress: {
            drop_console: true
          }
        },
        files: {
          'shop/assets/app.min.js': [
            'src/js/third_party/**/*.js',
            'src/js/app/**/*.js'
          ]
        }
      }
    },

    jshint: {
      options: {
        jshintrc: './.jshintrc'
      },
      work: [
        'src/js/app/**/*.js',
        'Gruntfile.js'
      ]
    },

    watch: {
      shopify: {
        files: ['shop/**'],
        tasks: ['shopify'],
        options: {
          livereload: true
        }
      },

      js: {
        files: ['src/js/**'],
        tasks: ['jshint', 'uglify:development']
      },
      sass: {
        files: ['src/scss/**'],
        tasks: ['sass:development']
      }
    }
  });

  grunt.registerTask('default', ['shopify']);
  grunt.registerTask('compile:development', ['jshint', 'uglify:development', 'sass:development']);
  grunt.registerTask('compile:production', ['jshint', 'uglify:production', 'sass:production']);
};