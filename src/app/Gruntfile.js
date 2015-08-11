module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var es6Locations = [
    'api/**/es6/*.js',
    'middleware/**/es6/*.js'
  ];

  var babelFiles = {
    expand: true,
    src: es6Locations,
    dest: '',
    ext: '.js',
    rename: function(dest, src) {
      return src.replace('/es6/', '/');
    }
  };

  grunt.initConfig({
    babel: {
      es6: {
        files: [babelFiles]
      },
      options: {
        optional: 'runtime'
      }
    },
    watch: {
      babel: {
        files: es6Locations,
        tasks: ['babel'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.event.on('watch', function(action, filepath) {
    babelFiles.src = [filepath];
    grunt.config('babel.es6.files', [babelFiles]);
  });

  grunt.registerTask('default', ['babel']);
  grunt.loadNpmTasks('grunt-contrib-watch');
};
