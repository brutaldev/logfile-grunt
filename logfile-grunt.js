/*
 * logfile-grunt
 * https://github.com/brutaldev/logfile-grunt
 *
 * Copyright (c) 2015-2017 Werner van Deventer
 * Licensed under the MIT license.
 */

'use strict';

var hooker = require('hooker');
var hook = new (require('events').EventEmitter)();

// Hook the stdout.write function.
hooker.hook(process.stdout, 'write', {
  pre: hook.emit.bind(hook, 'write')
});

// Hook the stderr.write function.
hooker.hook(process.stderr, 'write', {
  pre: hook.emit.bind(hook, 'write')
});

process.on('exit', function () {
  hook.removeAllListeners();
  hooker.unhook(process.stdout, 'write');
  hooker.unhook(process.stderr, 'write');
});

module.exports = function (grunt, options) {
  var fs = require('fs');

  // Honor the no-write option.
  var nowrite = grunt.option('no-write');

  // Validate parameters and set to defaults.
  options = options || {};
  options.filePath = (options.filePath || './logs/grunt.log').replace(/\\/g, '/');
  options.clearLogFile = !!options.clearLogFile || false;
  options.keepColors = !!options.keepColors || false;
  options.textEncoding = options.textEncoding || 'utf-8';
  options.excludePattern = options.excludePattern || null;

  if (!nowrite)
  {
    grunt.log.writeln('Grunt and task output will also be logged to "' + options.filePath + '"');

    // Create the file if it does not exist, Grunt creates the directories and everything for us.
    if (!grunt.file.exists(options.filePath)) {
      grunt.file.write(options.filePath, '', {
        encoding: options.textEncoding
      });
    }

    // Clear the log file if requested.
    if (options.clearLogFile) {
      grunt.file.write(options.filePath, '', {
        encoding: options.textEncoding
      });
    }
  }

  hook.on('write', function (result) {
    if (result && !nowrite) {
      var output = result.toString();
      if (options.excludePattern === null || !options.excludePattern.test(output)) {
        fs.appendFileSync(options.filePath, grunt.util.normalizelf(options.keepColors ? output : grunt.log.uncolor(output)), {
          encoding: options.textEncoding
        });
      }
    }
  });
};
