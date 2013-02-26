/*jshint node:true */
/*global desc:true task:true complete:true jake:true*/
'use strict';

var path        = require('path'),
    fs          = require('fs'),
    mingler     = require('mingler'),
    colors      = require('colors'),
    ugly        = require('uglify-js'),
    jshint      = require('jshint'),
    existsSync  = 'existsSync' in fs ? fs.existsSync : path.existsSync;

// Default settings
var settings = {
  minify: false,
  silent: false,
  colors: true
};

// Log colors if the npm module colors is available
colors.setTheme({
  info: 'cyan',
  warn: 'yellow',
  error: 'red',
  extra: 'grey'
});

// Utility function which respects the 'silent' setting
function log(text, type, acolor, nolabel) {
  type = (typeof console[type] === 'function') ? type : 'info';

  if (!settings.silent) {
    if (!nolabel) {
      text = ' [' + type.toUpperCase() + '] ' + text;
    } else {
      text = ' ' + text;
    }

    if (settings.colors) {
      console[type](text[acolor || type]);
    } else {
      console[type](text);
    }
  }
}

// Constants
var kDistDir = 'dist/';
var kSrcDir = 'src/';
var kMainFile = 'core.js';
var kDistFilename = 'teoria.js';
var kDistMinFilename = 'teoria.min.js';
var kFileList = [
  kSrcDir + 'core.js',
  kSrcDir + 'note.js',
  kSrcDir + 'interval.js',
  kSrcDir + 'chord.js',
  kSrcDir + 'scale.js',

  'Jakefile'
];

// Default task - lint and build
desc('Default task both lints and build the entire project');
task({'default': ['lint', 'build']}, function() {});

function doBuild() {
  var params, filename;

  params = Array.prototype.slice.call(arguments);
  params.forEach(function(el) {
    if (el in settings) {
      settings[el] = !settings[el];
    } else {
      log('Ignoring invalid settings: ' + el, 'warn');
    }
  });

  if (!existsSync(kDistDir)) {
    log('Creating ' + kDistDir + ' directory');
    fs.mkdirSync(kDistDir, 0x01FF); // With 0777 mode
  }

  // Change to /src dir
  process.chdir(kSrcDir);

  mingler.on('complete', function(concatenation) {
    // Should the source be minified?
    if (settings.minify) {
      var ratio, compressed, result;

      log('Minifying');

      result = ugly.minify(concatenation, { fromString: true });
      compressed = result.code;

      ratio = 100 - (compressed.length / concatenation.length) * 100;
      ratio = ratio.toPrecision(4);

      log('Saved ' + ratio + '% of the original size');
      concatenation = compressed;
      filename = kDistMinFilename;
    } else {
      filename = kDistFilename;
    }

    // Write to file and close!
    log('Writing to output file \'' + filename + '\'');
    fs.writeFileSync(kDistDir + filename, concatenation, 'utf8');
    log('Concatenation completed - Goodbye!');

    complete();
  });

  mingler.on('error', function(error) {
    log(error, 'error');
    process.exit(1);
  });

  mingler.on('warning', function(warning) {
    log(warning, 'warn');
  });

  mingler.on('concatenate', function(feedback) {
    log('Concatenating: ' + feedback.filename, 'info', 'grey');
  });

  mingler.mingle(kMainFile, function() {
    process.chdir('../');
  });
}

// Concatenates the files
desc('Concatenates all files into dist/teoria[.min].js');
task('build', doBuild, {async: true});

// Concatenates and minifies the files
desc('Concatenates and minifies all files into dist/teoria.min.js');
task('minify', function() { doBuild('minify'); }, { async: true });

// Unit test the project
desc('Builds the project and unit tests it');
task('test', ['build'], function() {
  jake.exec('node test/teoria.js', complete, { printStdout: true });
}, {async: true});

// Lints the files according to .jshintrc
desc('Lint all files according to coding standards');
task('lint', function() {
  var config, errors, errorfilecount, content;

  // Load configuration
  config = JSON.parse(fs.readFileSync('./.jshintrc', 'utf8'));

  // List all files in src/
  errors = [], errorfilecount = 0;
  kFileList.forEach(function(file) {
    // Read the contents of the file
    content = fs.readFileSync(file, 'utf8');
    content = content.replace(/^\uFEFF/, ''); // Remove Unicode BOM

    // Lint it according to .jshintrc
    if (!jshint.JSHINT(content, config)) {
      errorfilecount++;
      errors = jshint.JSHINT.errors.map(function(error) {
        return { file: file, error: error };
      });
    }
  });

  log(kFileList.length.toString(10) + ' files linted, ' +
      (kFileList.length - errorfilecount) +
      ' successfully, ' + errorfilecount + ' with errors!', 'info');

  // Show errors
  errors.forEach(function(error) {
    log(error.file + ': line ' + error.error.line +
        ', col ' + error.error.character + ', ' + error.error.reason,
        'error', 'grey', true);
  });

  // Show lint status
  if (errors.length === 0) {
    log('Lint passed', 'info');
  } else {
    log('Lint failed!', 'error');
  }
});
