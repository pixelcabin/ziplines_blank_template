module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shopify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-pageres');
  grunt.loadNpmTasks('grunt-contrib-sass');

  var pageres_sizes = ['1024x768', '320x480', '320x568', '375x667', '360x640', '960x600', '1200x800', '800x600', '1440x900', '1080x1600', '2560x1440'];
  var pagres_crop = true;

  grunt.initConfig({
    credentials: grunt.file.readJSON('credentials.json'),
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

    pageres: {
      shopify_home: {
        options: {
          url: '<%= url %>',
          sizes: pageres_sizes,
          dest: 'screens/',
          crop: pagres_crop
        }
      },
      shopify_collections: {
        options: {
          url: '<%= url %>/collections/',
          sizes: pageres_sizes,
          dest: 'screens/',
          crop: pagres_crop
        }
      },
      shopify_product: {
        options: {
          url: '<%= url %>/collections/',
          sizes: pageres_sizes,
          dest: 'screens/',
          crop: pagres_crop
        }
      },
      shopify_blog: {
        options: {
          url: '<%= url %>/blog/news',
          sizes: pageres_sizes,
          dest: 'screens/',
          crop: pagres_crop
        }
      }
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
          beautify: false,
          compress: false
        },
        files: {
          'shop/assets/app.min.js': ['src/js/app/**/*.js']
        }
      },
      production: {
        options: {
          mangle: true,
          compress: true
        },
        files: {
          'shop/assets/app.min.js': ['src/js/app/**/*.js']
        }
      },
      third: {
        options: {
          mangle: false,
          compress: false
        },
        files: {
          'shop/assets/third_lib.min.js': ['src/js/third_party/**/*.js']
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

    environment: 'development',// Set to 'development' or 'production', then restart grunt:watch
    watch: {
      shopify: {
        files: ['shop/**'],
        tasks: ['shopify'],
        options: {
          livereload: true
        }
      },
      js3rd: {
        files: ['src/js/third_party/**'],
        tasks: ['uglify:third']
      },
      js: {
        files: ['src/js/app/**'],
        tasks: ['jshint', 'uglify:<%= environment %>']
      },
      sass: {
        files: ['src/scss/**'],
        tasks: ['sass:<%= environment %>']
      }
    }
  });

  grunt.registerTask('default', ['shopify']);
};