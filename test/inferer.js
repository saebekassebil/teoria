var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../dist/teoria.js');

// Utility function
function notes(notes) {
  return 
}

function inferTriad() {
  var notes = [].slice.call(arguments).map(function(n) { return teoria.note(n); });

  return teoria.inferTriad(notes);
}

vows.describe('Chord inferer').addBatch({
  'Triads': {
    'a, c, e is an Am': function() {
      assert.equal(inferTriad('a', 'c', 'e').name, 'Am');
    },

    'c, e, g is an C': function() {
      assert.equal(inferTriad('c', 'e', 'g').name, 'CM');
    },

    'bb, eb, f is an Bbsus4': function() {
      assert.equal(inferTriad('bb', 'eb', 'f').name, 'Bbsus4');
    },

    'd, f, ab is an Ddim': function() {
      assert.equal(inferTriad('d', 'f', 'ab').name, 'Ddim');
    },

    'bb, eb, f is an Bbsus4': function() {
      assert.equal(inferTriad('bb', 'eb', 'f').name, 'Bbsus4');
    },

    'e, f#, b is an Esus2': function() {
      assert.equal(inferTriad('e', 'f#', 'b').name, 'Esus2');
    },

    'f, bb, c# is an Fsus4#5': function() {
      assert.equal(inferTriad('f', 'bb', 'c#').name, 'Fsus4#5');
    },

    'c, f, gb is an Csus4b5': function() {
      assert.equal(inferTriad('c', 'f', 'gb').name, 'Csus4b5');
    },

    'ab, bb, e is an Absus2#5': function() {
      assert.equal(inferTriad('ab', 'bb', 'e').name, 'Absus2#5');
    },

    'gb, ab, dbb is an Gsus2b5': function() {
      assert.equal(inferTriad('gb', 'ab', 'dbb').name, 'Gbsus2b5');
    },

    'c, e, gb is an Cb5': function() {
      assert.equal(inferTriad('c', 'e', 'gb').name, 'CMb5');
    }
  }
}).export(module);
