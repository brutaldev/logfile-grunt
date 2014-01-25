/*
 * logfile-grunt
 * https://github.com/brutaldev/logfile-grunt
 *
 * Copyright (c) 2014 Werner van Deventer
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // Load grunt tasks from  package file.
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key.indexOf('grunt-') === 0) { grunt.loadNpmTasks(key); }
  }

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        '*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp', 'logs']
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  grunt.task.registerTask('testlog', 'Save the latest test output to file.', function() {
    require('./logfile-grunt')(grunt, { filePath: './logs/tests.log', clearLogFile: true });
  });

  grunt.task.registerTask('nowrite_test', 'Used by unit tests to ensure file is not written with --no-write option.', function() {
    require('./logfile-grunt')(grunt, { filePath: './logs/nowrite.txt' });
  });
  
  // Tasks called from unit tests
  grunt.registerTask('nowrite', ['nowrite_test']);

  // Clean and run unit tests
  grunt.registerTask('test', ['clean', 'testlog', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
