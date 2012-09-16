/*jshint node:true */
/*global desc:true task:true complete:true*/
'use strict';

var path    = require('path'),
    fs      = require('fs'),
    mingler = require('mingler'),
    existsSync = 'existsSync' in fs ? fs.existsSync : path.existsSync,
    colors;

try {
  colors = require('colors');
} catch (e) {}

// Default settings
var settings = {
  minify: false,
  silent: false,
  colors: true
};

// Log colors if the npm module colors is available
var logcolors = {
  info: 'cyan',
  warn: 'yellow',
  error: 'red'
};

// Utility function which respects the 'silent' setting
function log(text, type, acolor, nolabel) {
  type = (typeof console[type] === 'function') ? type : 'info';

  if(!settings.silent) {
    if(!nolabel) {
      text = ' ['+type.toUpperCase()+'] ' + text;
    } else {
      text = ' ' + text;
    }

    if(settings.colors && colors) {
      acolor = logcolors[acolor || type] || 'grey';
      console[type](text[acolor]);
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
task({'default': ['lint', 'build']}, function(){});

// Concatenates the files
desc('Concatenates all files into dist/teoria[.min].js');
task('build', function() {
  var params, filename;

  params = Array.prototype.slice.call(arguments);
  params.forEach(function(el) {
    if(el in settings) {
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
    if(settings.minify) {
      var ugly, ast, ratio, compressed;
      try {
        ugly = require('uglify-js');
      } catch(e) {
        return log('uglify-js module doesn\'t appear to be installed. Use:' +
          '`npm install uglify-js`', 'error');
      }

      log('Minifying');

      ast = ugly.parser.parse(concatenation);
      ast = ugly.uglify.ast_mangle(ast);
      ast = ugly.uglify.ast_squeeze(ast);

      compressed = ugly.uglify.gen_code(ast);
      ratio = 100 - (compressed.length/concatenation.length) * 100;
      ratio = ratio.toString().substr(0, 4);

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
    log("Concatenating: " + feedback.filename, 'info', 'grey');
  });

  mingler.mingle(kMainFile, function() {
    process.chdir('../');
  });
}, {async: true});

// Lints the files according to .jshintrc
desc('Lint all files according to coding standards');
task('lint', function() {
  var jshint, config, errors, errorfilecount, content;
  try {
    jshint = require('jshint');
  } catch(e) {
    console.log(e);
    log('jshint doesn\'t appear to be installed. Do a `npm install -g jshint`',
      'error');
    return false;
  }

  // Load configuration
  config = fs.readFileSync('./.jshintrc', 'utf8');
  config = JSON.parse(config);

  // List all files in src/
  errors = [], errorfilecount = 0;
  kFileList.forEach(function(file) {
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch(e) {
      log('Unable to open file ' + file, 'error');
    }

    content = content.replace(/^\uFEFF/, ''); // Remove Unicode BOM
    if(!jshint.JSHINT(content, config)) {
      errorfilecount++;
      jshint.JSHINT.errors.forEach(function(error) {
        if(error) {
          errors.push({file: file, error: error});
        }
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
  if(errors.length === 0) {
    log('Lint passed', 'info');
  } else {
    log('Lint failed!', 'error');
  }
});

