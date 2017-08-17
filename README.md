# logfile-grunt

[![Build Status](https://travis-ci.org/brutaldev/logfile-grunt.png?branch=master)](https://travis-ci.org/brutaldev/logfile-grunt)
[![Dependencies](https://david-dm.org/brutaldev/logfile-grunt.png)](https://david-dm.org/brutaldev/logfile-grunt)
[![DevDependencies](https://david-dm.org/brutaldev/logfile-grunt/dev-status.png)](https://david-dm.org/brutaldev/logfile-grunt#info=devDependencies&view=table)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)


> Simple text file logging for Grunt and task output.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install logfile-grunt --save-dev
```

Once the plugin has been installed, the simplest way to enable it inside your [Gruntfile](http://gruntjs.com/sample-gruntfile) is with this line of JavaScript at the top of your [Gruntfile](http://gruntjs.com/sample-gruntfile):

```js
require('logfile-grunt')(grunt);
```

[Grunt](http://gruntjs.com/) output and task information that is usually logged to console will also be logged file. Don't worry, all your console information will still be available, it will additionally be written to file as well.

### Options
The plugin can take an options object to enable you to override things like the path of the log file and whether to clear it each time you run [Grunt](http://gruntjs.com/).

#### options.filePath
Type: `String`
Default value: `'./logs/grunt.log'`

A file name (and path) where your log file will be created.

#### options.clearLogFile
Type: `Boolean`
Default value: `false`

Setting `clearLogFile` to `true` will ensure the log file emptied each time you run this task. Setting `clearLogFile` to `false` will continue to append to the same log file each time [Grunt](http://gruntjs.com/) is executed.

#### options.keepColors
Type: `Boolean`
Default value: `false`

Setting `keepColors` to `true` will retain the console color codes and write them to the log file. Note that the console color codes can often make the text log difficult to read.

#### options.textEncoding
Type: `String`
Default value: `utf-8`

Specify the encoding to use when writing to the text file.

#### options.excludePattern
Type: `RegExp`
Default value: null

Provide a regular expression pattern to filter out certain output from being logged to file ([Issue #9](https://github.com/brutaldev/logfile-grunt/issues/9)).

### Usage Examples

#### Default Options
In this example with no options, all the output you see in the console from both Grunt and running tasks will also be written to `./logs/grunt.log`. The log file text will have console color codes stripped out by default as well.

```js
require('logfile-grunt')(grunt);
```

#### Custom File Option
In this example, you can provide a custom file path for your log file by providing a name and path in the options object.

```js
require('logfile-grunt')(grunt, { filePath: './logs/MyCustomLogs.txt' });
```

#### Clear Log Option
In this example, the custom log file will be cleared on every time [Grunt](http://gruntjs.com/) is executed. This is useful for release build log files for example.

```js
require('logfile-grunt')(grunt, { filePath: './logs/ClearedOnEveryRun.log', clearLogFile: true });
```

#### Keep Colors Option
In this example, the log file will retain the console color codes used by [Grunt](http://gruntjs.com/).

```js
require('logfile-grunt')(grunt, { keepColors: true });
```

#### Task Specific Logs
The normal usage would be to `require` the plugin at the beginning of your [Gruntfile](http://gruntjs.com/sample-gruntfile) so that all output will be logged no matter what task you run. If you need to send output to different log files depending on the task, you will need to start the logger inside a `taskFunction` which can be provided when you [register a task](http://gruntjs.com/api/grunt.task#creating-tasks).

```js
var logfile = require('logfile-grunt');

grunt.task.registerTask('devlog', 'Keep appending everything to a log file.', function() {
  logfile(grunt, { filePath: './logs/MyDevLog.txt', clearLogFile: false });
});

grunt.task.registerTask('buildlog', 'Create a new release build log files on each run.', function() {
  logfile(grunt, { filePath: './dist/build.log', clearLogFile: true });
});

// Then include these tasks inside other tasks.
// Make sure it's the first one so that all output is written to the log file.
task.registerTask('default', ['devlog', 'jshint', 'qunit', 'concat', 'uglify']);
task.registerTask('dist', ['buildlog', 'concat:dist', 'uglify:dist']);
```

#### Using Concurrent and Parallelize
Concurrent plugins such as [grunt-concurrent](https://github.com/sindresorhus/grunt-concurrent) and [grunt-parallelize](https://github.com/teppeis/grunt-parallelize) spawn new tasks and can also alter the `stdout` and `stderr` streams. To ensure logging is reliable and all output spawned tasks is also logged, `require` logfile-grunt outside of your module export and start the logger inside the tasks that trigger concurrent tasks.

```js
// Require `logfile-grunt` before loading other Grunt tasks
var logfile = require('logfile-grunt');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('log', 'Log to the console.', function (message) {
    console.log(message);
  });

  grunt.registerTask('default', 'Log to the console.', function () {
    // Start logging before any concurrent tasks are started.
    logfile(grunt);
    grunt.task.run(['concurrent:log', 'log:done']);
  });

  grunt.initConfig({
    concurrent: {
        log: ['log:one', 'log:two']
    }
  });
};
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2014-01-25  -  v0.1.0  -  Initial release.
 * 2014-01-25  -  v0.1.1  -  Official release.
 * 2014-01-27  -  v0.1.2  -  Updated NPM keywords.
 * 2014-01-28  -  v0.1.3  -  Fix crash when presented with a Buffer in the stdout stream. Works even better now printing any arb stuff coming through the stream.
 * 2014-03-10  -  v0.1.4  -  Added option to keep console colors in the log output.
 * 2014-03-10  -  v0.1.5  -  Keep NPM version numbers happy.
 * 2015-02-20  -  v0.1.6  -  Hook stderr as well to log exceptions.
 * 2015-05-03  -  v0.2.0  -  Merged changes from [Aliaksei Sapach](https://github.com/asapach) and updated documentation on dealing with concurrent plugins.
 * 2016-06-19  -  v0.2.1  -  Grunt peer dependency fix from [Raja Usman Haider](https://github.com/rajahu).
 * 2016-06-22  -  v0.3.0  -  Text encoding option from [The Half Blood Prince](https://github.com/tHBp).
 * 2016-06-22  -  v0.4.0  -  Regular expression exclusion option.

## License
Copyright (c) 2015-2017 Werner van Deventer. Licensed under the MIT license.
