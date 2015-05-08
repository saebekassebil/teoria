var vows = require('vows'),
    assert = require('assert');

var Note = require('../lib/note.js');
var Interval = require('../lib/interval.js');

vows.describe('TeoriaNote class').addBatch({
  'A4 - a\'': {
    topic: function() {
      return Note.build('A4');
    },

    'Octave should be 4': function(note) {
      assert.equal(note.octave(), 4);
    },

    'Note name is lower case': function(note) {
      assert.equal(note.name(), 'a');
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
      return Note.build('c#\'\'');
    },

    'Octave should be 5': function(note) {
      assert.equal(note.octave(), 5);
    },

    'The name attribute of c# is just c': function(note) {
      assert.equal(note.name(), 'c');
    },

    'The accidental.sign attribute is #': function(note) {
      assert.equal(note.accidental(), '#');
    },

    'The accidental.value attribute is 1': function(note) {
      assert.equal(note.accidentalValue(), 1);
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
      var a4 = Note.build('A4');

      assert.deepEqual(note.interval(a4), Interval.fromString('M-3'));
    },

    'The interval between C#5 and Eb6 is diminished tenth': function(note) {
      var eb6 = Note.build('Eb6');

      assert.deepEqual(note.interval(eb6), Interval.fromString('d10'));
    },

    'An diminished fifth away from C#5 is G5': function(note) {
      var g5 = Note.build('G5');

      assert.deepEqual(note.interval('d5'), g5);
    },

    'The interval between C#4 and Db4 is a diminished second': function() {
      var cis4 = Note.build('c#4');
      var db4 = Note.build('db4');

      assert.deepEqual(cis4.interval(db4), Interval.fromString('d2'));
    }
  },

  'Instantiate with coords': {
    '[0, 0] is A4': function() {
      assert.equal(Note.build([0, 0]).scientific(), 'A4');
    },

    '[-4, 4] is C#3': function() {
      assert.equal(Note.build([-4, 4]).scientific(), 'C#3');
    },

    '[3, -4] is F5': function() {
      assert.equal(Note.build([3, -4]).scientific(), 'F5');
    },

    '[4, -7] is Ab4': function() {
      assert.equal(Note.build([4, -7]).scientific(), 'Ab4');
    }
  },

  'Instantiate from key': {
    '#49 is A4': function() {
      assert.equal(Note.fromKey(49).scientific(), 'A4');
    },

    '#20 is E2': function() {
      assert.equal(Note.fromKey(20).scientific(), 'E2');
    },

    '#57 is F5': function() {
      assert.equal(Note.fromKey(57).scientific(), 'F5');
    },

    '#72 is G#6': function() {
      assert.equal(Note.fromKey(72).scientific(), 'G#6');
    }
  },

  'Instantiate from frequency': {
    '391.995Hz is G4': function() {
      assert.equal(Note.fromFrequency(391.995).note.scientific(), 'G4');
    },

    '220.000Hz is A3': function() {
      assert.equal(Note.fromFrequency(220.000).note.scientific(), 'A3');
    },

    '155.563Hz is Eb3': function() {
      assert.equal(Note.fromFrequency(155.563).note.scientific(), 'Eb3');
    },

    '2959.96Hz is F#7': function() {
      assert.equal(Note.fromFrequency(2959.96).note.scientific(), 'F#7');
    }
  },

  'Instantiate from MIDI': {
    'MIDI#36 is C2': function() {
      assert.equal(Note.fromMIDI(36).scientific(), 'C2');
    },

    'MIDI#77 is F5': function() {
      assert.equal(Note.fromMIDI(77).scientific(), 'F5');
    },

    'MIDI#61 is Db4': function() {
      assert.equal(Note.fromMIDI(61).scientific(), 'Db4');
    },

    'MIDI#80 is G#5': function() {
      assert.equal(Note.fromMIDI(80).scientific(), 'G#5');
    }
  },

  'Return MIDI note number': {
    'MIDI#36 is C2': function() {
      assert.equal(Note.build('C2').midi(), 36);
    },

    'MIDI#77 is F5': function() {
      assert.equal(Note.build('F5').midi(), 77);
    },

    'MIDI#61 is Db4': function() {
      assert.equal(Note.build('Db4').midi(), 61);
    },

    'MIDI#80 is G#5': function() {
      assert.equal(Note.build('G#5').midi(), 80);
    }
  },

  'Chroma': {
    'C has chroma 0': function() {
      assert.equal(Note.build('c').chroma(), 0);
    },

    'C# has chroma 1': function() {
      assert.equal(Note.build('c#').chroma(), 1);
    },

    'B has chroma 11': function() {
      assert.equal(Note.build('b').chroma(), 11);
    },

    'Db has chroma 1': function() {
      assert.equal(Note.build('db').chroma(), 1);
    },

    'Dbb has chroma 0': function() {
      assert.equal(Note.build('dbb').chroma(), 0);
    },

    'E has chroma 4': function() {
      assert.equal(Note.build('e').chroma(), 4);
    },

    'F has chroma 5': function() {
      assert.equal(Note.build('f').chroma(), 5);
    },

    'Fb has chroma 4': function() {
      assert.equal(Note.build('fb').chroma(), 4);
    },

    'H# has chroma 0': function() {
      assert.equal(Note.build('h#').chroma(), 0);
    },

    'Bx has chroma 1': function() {
      assert.equal(Note.build('bx').chroma(), 1);
    },

    'Cbb has chroma 10': function() {
      assert.equal(Note.build('cbb').chroma(), 10);
    }
  },


  'Enharmonics': {
    'c is enharmonic with dbb and b#': function() {
      assert.deepEqual(Note.build('c4').enharmonics(),
        ['dbb4', 'b#3'].map(Note.build));
    },

    'fb is enharmonic with e and dx': function() {
      assert.deepEqual(Note.build('fb4').enharmonics(),
        ['e4', 'dx4'].map(Note.build));
    },

    'cb is enharmonic with ax and b': function() {
      assert.deepEqual(Note.build('cb4').enharmonics(),
        ['b3', 'ax3'].map(Note.build));
    }
  },

  'Enharmonics with only one accidental': {
    'c is enharmonic with b#': function() {
      assert.deepEqual(Note.build('c4').enharmonics(true),
        ['b#3'].map(Note.build));
    },

    'fb is enharmonic with e': function() {
      assert.deepEqual(Note.build('fb4').enharmonics(true),
        ['e4'].map(Note.build));
    },

    'cb is enharmonic with b': function() {
      assert.deepEqual(Note.build('cb4').enharmonics(true),
        ['b3'].map(Note.build));
    }
  },

  'Transpose': {
    'transpose a note': function() {
      assert.deepEqual(Note.build('b3').transpose('M2'),
        Note.build('c#4'));
    }
  }
}).export(module);
