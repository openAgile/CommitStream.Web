module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var babelFiles = {
    expand: true,
    src: ['api/**/es6/*.js'],
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
      }
    },
    watch: {
      babel: {
        files: ['api/**/es6/*.js'],
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
