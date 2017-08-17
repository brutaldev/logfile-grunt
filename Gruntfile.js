/*
 * logfile-grunt
 * https://github.com/brutaldev/logfile-grunt
 *
 * Copyright (c) 2014 Werner van Deventer
 * Licensed under the MIT license.
 */

'use strict';

var logfile = require('./logfile-grunt');

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
    },

    concurrent: {
      log: ['log_test:-one-', 'log_test:-two-']
    }
  });

  grunt.task.registerTask('testlog', 'Save the latest test output to file.', function() {
    logfile(grunt, { filePath: './logs/tests.log', clearLogFile: true });
  });

  grunt.registerTask('log_test', 'Log to the console.', function (message) {
    console.log(message);
  });

  grunt.registerTask('concurrent_test', 'Used by unit tests to ensure concurrent logs are captured correctly.', function () {
    logfile(grunt, { filePath: './logs/concurrent.txt' });
    grunt.task.run(['concurrent:log', 'log_test:-three-']);
  });

  grunt.task.registerTask('exclude_test', 'Used by unit tests to ensure exclusions are not written to file.', function() {
    logfile(grunt, { filePath: './logs/exclude.txt', excludePattern: new RegExp('-four-|-TWO-|-test\\d+-', 'i') });
    grunt.task.run(['log_test:-one-', 'log_test:-two-', 'log_test:-three-', 'log_test:-four-', 'log_test:-test12345-']);
  });

  grunt.task.registerTask('nowrite_test', 'Used by unit tests to ensure file is not written with --no-write option.', function() {
    logfile(grunt, { filePath: './logs/nowrite.txt' });
  });

  // Clean and run unit tests
  grunt.registerTask('test', ['clean', 'testlog', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
