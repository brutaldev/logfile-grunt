'use strict';

var grunt = require('grunt');
var logfile = require('../logfile-grunt');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.logfiletests = {
  setUp: function (done) {
    done();
  },

  'default options create a log file at ./logs/grunt.log':
  function (test) {
    test.expect(1);

    logfile(grunt);

    test.ok(grunt.file.exists('./logs/grunt.log'), 'Did not find the grunt.log file in the logs directory');

    test.done();
  },

  'passing in a custom log file should create that file including directories':
  function (test) {
    test.expect(1);

    logfile(grunt, { filePath: './logs/testing/subdirlog.txt' });

    test.ok(grunt.file.exists('./logs/testing/subdirlog.txt'), 'Did not find the subdirlog.txt file in the logs/testing directory');

    test.done();
  },

  'custom paths can safely use Windows separators':
  function (test) {
    test.expect(1);

    logfile(grunt, { filePath: '.\\logs\\windows.txt' });

    test.ok(grunt.file.exists('./logs/windows.txt'), 'Did not find the windows.txt file in the logs directory');

    test.done();
  },

  'log file should not be created or written to if the no-write option was provided to Grunt':
  function (test) {
    test.expect(2);

    exec('grunt nowrite_test --no-write', { cwd: path.join(__dirname, '..') },
      function(error, stdout) {
        test.ifError(error);
        test.ok(!grunt.file.exists('./logs/nowrite.txt'), 'Created the nowrite.txt file when no-write was true');
        test.done();
      }
    );
  },
  
  'using concurrent task plugins should still write all log text to file (Issue #3)':
  function (test) {
    test.expect(5);

    exec('grunt concurrent_test', { cwd: path.join(__dirname, '..') },
      function(error, stdout) {
        test.ifError(error);
        test.ok(grunt.file.exists('./logs/concurrent.txt'), 'Did not find the concurrent.txt file in the logs directory');
        
        var output = fs.readFileSync('./logs/concurrent.txt').toString();
        
        test.ok(output.indexOf('-one-') > -1);
        test.ok(output.indexOf('-two-') > -1);
        test.ok(output.indexOf('-three-') > -1);
        
        test.done();
      }
    );
  },
  
  'sending buffer obejcts down the stream should not cause an error':
  function (test) {
    test.expect(1);

    logfile(grunt, { filePath: '.\\logs\\objects.txt' });

    test.doesNotThrow(function () { process.stdout.write(new Buffer('\n1234567890')); });

    test.done();
  }
};
