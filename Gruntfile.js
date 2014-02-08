/*global module*/

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cov');

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: ['index.js', 'lib/**/*.js', 'test/**/*.js'],
      tasks: ['default', 'timestamp']
    },
    jshint: {
      files: ['Gruntfile.js', 'index.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        globals: {
          describe: false,
          it: false,
          before: false,
          after: false
        }
      }
    },
    jsbeautifier: {
      'default': {
        src: '<%= jshint.files %>',
        options: {
          html: {
            indentSize: 2,
            maxPreserveNewlines: 1
          },
          css: {
            indentSize: 2
          },
          js: {
            indentSize: 2
          }
        }
      },
      release: {
        src: '<%= jsbeautifier.default.src %>',
        options: {
          mode: 'VERIFY_ONLY',
          html: {
            indentSize: 2,
            maxPreserveNewlines: 1
          },
          css: {
            indentSize: 2
          },
          js: {
            indentSize: 2
          }
        }
      }
    },
    mochacov: {
      test: {
        options: {
          reporter: 'spec'
        }
      },
      travis: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      options: {
        files: ['test/**/*.js']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint',
    'jsbeautifier:default',
    'mochacov:test'
  ]);
  grunt.registerTask('release', ['jshint',
    'jsbeautifier:release',
    'mochacov:test',
    'mochacov:travis'
  ]);

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });
};
