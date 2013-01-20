/*jshint node:true */
/*global desc:true task:true complete:true jake:true*/
'use strict';

// Default task - lint and build
desc('Default task both lints and tests the entire project');
task({'default': ['lint', 'test']}, function(){});

// Unit testing of the library
desc('Run unit tests');
task('test', function() {
  jake.exec('node test/teoria.js', function() {
    complete();
  }, {printStdout: true});
}, {async: true});

// Lint teoria.js according to .jshintrc
desc('Lint according to the coding standards');
task('lint', function() {

  jake.exec('jshint teoria.js', function() {
    complete();
  }, {printStdout: true});
}, {async: true});

