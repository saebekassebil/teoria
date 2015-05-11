var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../');

vows.describe('Solfege').addBatch({
  'C in C minor': function() {
    var note = teoria.note('c');
    assert.equal(note.solfege(teoria.scale(note, 'minor')), 'do');
  },

  'A in d major': function() {
    var note = teoria.note('a');
    var tonic = teoria.note('d');
    assert.equal(note.solfege(teoria.scale(tonic, 'major')), 'so');
  },

  'F# in B major': function() {
    var note = teoria.note('f#');
    var tonic = teoria.note('B');
    assert.equal(note.solfege(teoria.scale(tonic, 'major')), 'so');
  },

  'C4 in C4 minor': function() {
    var note = teoria.note('c4');
    var scale = teoria.scale(note, 'minor');
    assert.equal(note.solfege(scale, true), 'do');
  },

  'A3 in D4 major': function() {
    var note = teoria.note('a3');
    var scale = teoria.scale('d4', 'major');
    assert.equal(note.solfege(scale, true), 'so,');
  },

  'F#6 in B5 major': function() {
    var note = teoria.note('f#6');
    var scale = teoria.scale('b5', 'major');
    assert.equal(note.solfege(scale, true), 'so');
  },

  'F2 in E6 phrygian': function() {
    var note = teoria.note('f2');
    var scale = teoria.scale('e6', 'phrygian');
    assert.equal(note.solfege(scale, true), 'ra,,,,');
  },

  'Eb10 in E8 dorian': function() {
    var note = teoria.note('eb10');
    var scale = teoria.scale('e8', 'dorian');
    assert.equal(note.solfege(scale, true), 'de\'\'');
  },

  'A#6 in Bb4 locrian': function() {
    var note = teoria.note('A#6');
    var scale = teoria.scale('Bb4', 'locrian');
    assert.equal(note.solfege(scale, true), 'tai\'');
  },

  'E2 in C3 major': function() {
    var note = teoria.note('e2');
    var scale = teoria.scale('c3', 'major');
    assert.equal(note.solfege(scale, true), 'mi,');
  }
}).export(module);
