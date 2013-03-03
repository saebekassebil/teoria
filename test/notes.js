var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../dist/teoria.js');

vows.describe('TeoriaNote class').addBatch({
  'A4 - a\'': {
    topic: function() {
      return new teoria.TeoriaNote('A4');
    },

    'Octave should be 4': function(note) {
      assert.equal(note.octave, 4);
    },

    'Note name is lower case': function(note) {
      assert.equal(note.name, 'a');
    },

    'A4 is the 49th piano key': function(note) {
      assert.equal(note.key(), 49);
    },

    'A4 is expressed a\' in Helmholtz notation': function(note) {
      assert.equal(note.helmholtz(), 'a\'');
    },

    'A4 is expressed A4 in scientific notation': function(note) {
      assert.equal(note.scientific(), 'A4');
    },

    'The frequency of A4 is 440hz': function(note) {
      assert.equal(note.fq(), 440);
    }
  },

  'C#5 - c#\'\'': {
    topic: function() {
      return new teoria.TeoriaNote('c#\'\'');
    },

    'Octave should be 5': function(note) {
      assert.equal(note.octave, 5);
    },

    'The name attribute of c# is just c': function(note) {
      assert.equal(note.name, 'c');
    },

    'The accidental.sign attribute is #': function(note) {
      assert.equal(note.accidental.sign, '#');
    },

    'The accidental.value attribute is 1': function(note) {
      assert.equal(note.accidental.value, 1);
    },

    'C#5 is the 53rd piano key': function(note) {
      assert.equal(note.key(), 53);
    },

    'C#5 is c#\'\' in Helmholtz notation': function(note) {
      assert.equal(note.helmholtz(), 'c#\'\'');
    },

    'c#\'\' is C#5 in scientific notation': function(note) {
      assert.equal(note.scientific(), 'C#5');
    },

    'The frequency of C#5 is approximately 554.365': function(note) {
      assert.equal(note.fq(), 554.3652619537442);
    },

    'The interval between C#5 and A4 is a major third': function(note) {
      var a4 = new teoria.TeoriaNote('A4');

      assert.deepEqual(note.interval(a4),
          new teoria.TeoriaInterval(3, 'major', 'down'));
    },

    'The interval between C#5 and Eb6 is diminished tenth': function(note) {
      var eb6 = new teoria.TeoriaNote('Eb6');

      assert.deepEqual(note.interval(eb6),
          new teoria.TeoriaInterval(10, 'diminished'));
    },

    'An diminished fifth away from C#5 is G5': function(note) {
      var g5 = new teoria.TeoriaNote('G5');

      assert.deepEqual(note.interval('d5'), g5);
    },

    'The interval between C#4 and Db4 is a diminished second': function() {
      var cis4 = teoria.note('c#4');
      var db4 = teoria.note('db4');

      assert.deepEqual(cis4.interval(db4),
          new teoria.TeoriaInterval(2, 'diminished'));
    }
  },

  'Chroma': {
    'C has chroma 0': function() {
      assert.equal(teoria.note('c').chroma(), 0);
    },

    'C# has chroma 1': function() {
      assert.equal(teoria.note('c#').chroma(), 1);
    },

    'B has chroma 11': function() {
      assert.equal(teoria.note('b').chroma(), 11);
    },

    'Db has chroma 1': function() {
      assert.equal(teoria.note('db').chroma(), 1);
    },

    'Dbb has chroma 0': function() {
      assert.equal(teoria.note('dbb').chroma(), 0);
    },

    'E has chroma 4': function() {
      assert.equal(teoria.note('e').chroma(), 4);
    },

    'F has chroma 5': function() {
      assert.equal(teoria.note('f').chroma(), 5);
    },

    'Fb has chroma 4': function() {
      assert.equal(teoria.note('fb').chroma(), 4);
    },

    'H# has chroma 0': function() {
      assert.equal(teoria.note('h#').chroma(), 0);
    },

    'Bx has chroma 1': function() {
      assert.equal(teoria.note('bx').chroma(), 1);
    },

    'Cbb has chroma 10': function() {
      assert.equal(teoria.note('cbb').chroma(), 10);
    }
  },

  'Scale Degrees': {
    'Eb is scale degree 1 (tonic) in an Eb minor scale': function() {
      var note = teoria.note('eb');
      assert.equal(note.scaleDegree(teoria.scale('eb', 'major')), 1);
    },

    'E is scale degree 3 in a C# dorian': function() {
      var note = teoria.note('e');
      assert.equal(note.scaleDegree(teoria.scale('c#', 'dorian')), 3);
    },

    'C is scale degree 0 in a D major scale (not in scale)': function() {
      var note = teoria.note('c');
      assert.equal(note.scaleDegree(teoria.scale('d', 'major')), 0);
    },

    'Bb is scale degree 7 in a C minor': function() {
      var note = teoria.note('bb');
      assert.equal(note.scaleDegree(teoria.scale('c', 'minor')), 7);
    },
    
    'Db is scale degree 4 in an Ab major scale': function() {
      var note = teoria.note('db');
      assert.equal(note.scaleDegree(teoria.scale('ab', 'major')), 4);
    },

    'A# is scale degree 0 in a G minor scale': function() {
      var note = teoria.note('a#');
      assert.equal(note.scaleDegree(teoria.scale('g', 'minor')), 0);
    }
  }
}).export(module);
