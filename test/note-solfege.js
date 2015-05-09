var vows = require('vows'),
    assert = require('assert');

var Note = require('../lib/note.js');
var Scale = require('../lib/scale.js');


vows.describe('Solfege').addBatch({
  'C in C minor': function() {
    var note = Note.build('c');
    assert.equal(note.solfege(Scale.build(note, 'minor')), 'do');
  },

  'A in d major': function() {
    var note = Note.build('a');
    var tonic = Note.build('d');
    assert.equal(note.solfege(Scale.build(tonic, 'major')), 'so');
  },

  'F# in B major': function() {
    var note = Note.build('f#');
    var tonic = Note.build('B');
    assert.equal(note.solfege(Scale.build(tonic, 'major')), 'so');
  },

  'C4 in C4 minor': function() {
    var note = Note.build('c4');
    var scale = Scale.build(note, 'minor');
    assert.equal(note.solfege(scale, true), 'do');
  },

  'A3 in D4 major': function() {
    var note = Note.build('a3');
    var scale = Scale.build('d4', 'major');
    assert.equal(note.solfege(scale, true), 'so,');
  },

  'F#6 in B5 major': function() {
    var note = Note.build('f#6');
    var scale = Scale.build('b5', 'major');
    assert.equal(note.solfege(scale, true), 'so');
  },

  'F2 in E6 phrygian': function() {
    var note = Note.build('f2');
    var scale = Scale.build('e6', 'phrygian');
    assert.equal(note.solfege(scale, true), 'ra,,,,');
  },

  'Eb10 in E8 dorian': function() {
    var note = Note.build('eb10');
    var scale = Scale.build('e8', 'dorian');
    assert.equal(note.solfege(scale, true), 'de\'\'');
  },

  'A#6 in Bb4 locrian': function() {
    var note = Note.build('A#6');
    var scale = Scale.build('Bb4', 'locrian');
    assert.equal(note.solfege(scale, true), 'tai\'');
  },

  'E2 in C3 major': function() {
    var note = Note.build('e2');
    var scale = Scale.build('c3', 'major');
    assert.equal(note.solfege(scale, true), 'mi,');
  }
}).export(module);
