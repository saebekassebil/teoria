/* jshint node:true */
/* global desc, task, complete */
'use strict';

var path        = require('path'),
    fs          = require('fs'),
    mingler     = require('mingler'),
    colors      = require('colors'),
    ugly        = require('uglify-js'),
    jshint      = require('jshint'),
    spawn       = require('child_process').spawn,
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
var kDistDir = 'dist';
var kSrcDir = 'src';
var kMainFile = 'core.js';
var kDistFilename = 'teoria.js';
var kDistMinFilename = 'teoria.min.js';

var includeScales = {
  'ionian': true,
  'dorian': true,
  'phrygian': true,
  'lydian': true,
  'mixolydian': true,
  'aeolian': true,
  'locrian': true,

  'majorpentatonic': true,
  'minorpentatonic': true,
  'chromatic': true
};

// Default task - lint and build
desc('Default task both lints and build the entire project');
task({'default': ['lint', 'build']}, function() {});

function doBuild() {
  var params, filename;

  // Parse build configurations
  params = Array.prototype.slice.call(arguments);
  params.forEach(function(el) {
    if (el in settings) {
      settings[el] = !settings[el];
    } else {
      log('Ignoring invalid settings: ' + el, 'warn');
    }
  });

  // Check if any scales should be added or removed
  var scales = process.env.scales;
  if (scales) {
    scales.split(',').forEach(function(scale) {
      includeScales[scale.substr(1)] = scale[0] === '+';
    });
  }

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
    fs.writeFileSync(kDistDir + '/' + filename, concatenation, 'utf8');
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
    if (feedback.filename === '#scales#') {
      var files = [];
      for (var scale in includeScales) {
        if (includeScales.hasOwnProperty(scale)) {
          if (includeScales[scale] === false) {
            log('Exluding scale ' + scale, 'info', 'grey');
            continue;
          }

          if (existsSync('scales/' + scale + '.js')) {
            log('Including scale ' + scale, 'info', 'grey');
            files.push(fs.readFileSync('scales/' + scale + '.js', 'utf8'));
          } else {
            log('Scale named "' + scale + '" couldn\'t be found', 'warn');
          }
        }
      }

      feedback.content(files.join(''));
    } else {
      log('Concatenating: ' + feedback.filename, 'info', 'grey');
    }
  });

  mingler.mingle(kMainFile, function() {
    process.chdir('..');
  });
}

// Concatenates the files
desc('Concatenates all files into dist/teoria[.min].js');
task('build', doBuild, { async: true });

// Concatenates and minifies the files
desc('Concatenates and minifies all files into dist/teoria.min.js');
task('minify', function() { doBuild('minify'); }, { async: true });

// Unit test the project
desc('Unit tests against current build');
task('test', function() {
  var vows = spawn('vows', ['--dot-matrix', 'test/*'], { customFds: [0,1,2] });
  vows.on('exit', complete);
}, { async: true });

// Lints the files according to .jshintrc
desc('Lint all files according to coding standards');
task('lint', function() {
  var config, errors = [], errorfilecount = 0, filecount = 0;

  function lintFile(file) {
    // Read the contents of the file
    var content = fs.readFileSync(file, 'utf8');
    content = content.replace(/^\uFEFF/, ''); // Remove Unicode BOM

    filecount++;

    // Lint it according to .jshintrc
    if (!jshint.JSHINT(content, config)) {
      errorfilecount++;
      errors = jshint.JSHINT.errors.map(function(error) {
        return { file: file, error: error };
      });
    }
  }

  function lintDirectory(dir) {
    return fs.readdirSync(dir).map(function(file) {
      var stat = fs.statSync(dir + '/' + file);

      if (stat.isDirectory()) {
        return lintDirectory(dir + '/' + file);
      } else if (stat.isFile()) {
        return lintFile(dir + '/' + file);
      }
    });
  }

  // Load configuration
  config = JSON.parse(fs.readFileSync('.jshintrc', 'utf8'));

  // Lint source files
  lintFile('Jakefile');
  lintDirectory(kSrcDir);

  // Tell us how we did
  log(filecount + ' files linted, ' + (filecount - errorfilecount) +
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
