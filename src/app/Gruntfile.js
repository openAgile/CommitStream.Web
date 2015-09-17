module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var es6Locations = [
    'api/**/es6/*.js',
    'middleware/**/es6/*.js',
    'client/**/es6/*.js',
    'smoke-test/**/es6/*.js'
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

  var sourceBranch = grunt.option('source');
  
  grunt.initConfig({
    express: {
      options: {
        port: 6565
      },
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },
    babel: {
      es6: {
        files: [babelFiles]
      },
      options: {
        optional: 'runtime'
      }
    },
    less: {
      options: {
        paths: ['client/css']
      },
      // target name
      src: {
        // no need for files, the config below should work
        expand: true,
        cwd: "client/css",
        src: "*.less",
        dest: "client/css",
        ext: ".css"
      }
    },
    watch: {
      babel: {
        files: es6Locations,
        tasks: ['babel'],
        options: {
          spawn: false
        }
      },
      less: {
        files: ['client/css/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      express: {
        files: ['api/**/*.js', 'middleware/**/*.js', 'server.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded 
        }
      }
    },
    // Goal: git push origin ${current-branch}:v1-cs-demo -f
    gitpush: {
      'deploy-test': {
        options: {
          // Note: this gets replaced by the event below...
          branch: sourceBranch + ':v1-cs-test',
          force: true
        }
      },
      'deploy-demo': {
        options: {
          // Note: this gets replaced by the event below...
          branch: sourceBranch + ':v1cs-demo',
          force: true
        }
      },
      'deploy-dev': {
        options: {
          // Note: this gets replaced by the event below...
          branch: sourceBranch + ':v1cs-dev',
          force: true
        }
      }    
    }
  });

  grunt.event.on('watch', function(action, filepath) {
    babelFiles.src = [filepath];
    grunt.config('babel.es6.files', [babelFiles]);
  });

  grunt.event.on('gitpush', function(action) {
    grunt.config('gitpush.deploy-test.branch', sourceBranch + ':v1-cs-test');
    grunt.config('gitpush.deploy-demo.branch', sourceBranch + ':v1cs-demo');
    grunt.config('gitpush.deploy-dev.branch', sourceBranch + ':v1cs-dev');
  });

  grunt.registerTask('dev', ['less', 'babel', 'express', 'watch']);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-git');
};
