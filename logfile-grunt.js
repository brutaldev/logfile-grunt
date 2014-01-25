/*
 * logfile-grunt
 * https://github.com/brutaldev/logfile-grunt
 *
 * Copyright (c) 2014 Werner van Deventer
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt, options) {
  var fs = require('fs');
  var hooker = require('hooker');

  // Help to correct Windows paths.
  var unixifyPath = function (filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };

  // Honor the no-write option.
  var nowrite = grunt.option('no-write');

  // Validate parameters and set to defaults.
  options = options || {};
  options.filePath = unixifyPath(options.filePath || './logs/grunt.log');
  options.clearLogFile = !!options.clearLogFile || false;

  if (!nowrite)
  {
    grunt.log.writeln('Grunt and task output will also be logged to "' + options.filePath + '"');

    // Create the file if it does not exist, Grunt creates the directories and everything for us.
    if (!grunt.file.exists(options.filePath)) {
      grunt.file.write(options.filePath, '');
    }

    // Clear the log file if requested.
    if (options.clearLogFile) {
      grunt.file.write(options.filePath, '');
    }
  }

  // Hook the stdout.write function.
  hooker.hook(process.stdout, 'write', {
    pre: function (result) {
      if (result && !nowrite) {
        fs.appendFileSync(options.filePath, grunt.util.normalizelf(grunt.log.uncolor(result)));
      }
      return result;
    }
  });

  process.on('exit', function () {
    hooker.unhook(process.stdout, 'write');
  });
};
