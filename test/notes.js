var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../');

vows.describe('TeoriaNote class').addBatch({
  'A4 - a\'': {
    topic: function() {
      return teoria.note('A4');
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
      return teoria.note('c#\'\'');
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
      var a4 = teoria.note('A4');

      assert.deepEqual(note.interval(a4), teoria.interval('M-3'));
    },

    'The interval between C#5 and Eb6 is diminished tenth': function(note) {
      var eb6 = teoria.note('Eb6');

      assert.deepEqual(note.interval(eb6), teoria.interval('d10'));
    },

    'An diminished fifth away from C#5 is G5': function(note) {
      var g5 = teoria.note('G5');

      assert.deepEqual(note.interval('d5'), g5);
    },

    'The interval between C#4 and Db4 is a diminished second': function() {
      var cis4 = teoria.note('c#4');
      var db4 = teoria.note('db4');

      assert.deepEqual(cis4.interval(db4), teoria.interval('d2'));
    }
  },

  'Instantiate with coords': {
    '[0, 0] is A4': function() {
      assert.equal(teoria.note([0, 0]).scientific(), 'A4');
    },

    '[-4, 4] is C#3': function() {
      assert.equal(teoria.note([-4, 4]).scientific(), 'C#3');
    },

    '[3, -4] is F5': function() {
      assert.equal(teoria.note([3, -4]).scientific(), 'F5');
    },

    '[4, -7] is Ab4': function() {
      assert.equal(teoria.note([4, -7]).scientific(), 'Ab4');
    }
  },

  'Instantiate from key': {
    '#49 is A4': function() {
      assert.equal(teoria.note.fromKey(49).scientific(), 'A4');
    },

    '#20 is E2': function() {
      assert.equal(teoria.note.fromKey(20).scientific(), 'E2');
    },

    '#57 is F5': function() {
      assert.equal(teoria.note.fromKey(57).scientific(), 'F5');
    },

    '#72 is G#6': function() {
      assert.equal(teoria.note.fromKey(72).scientific(), 'G#6');
    }
  },

  'Instantiate from frequency': {
    '391.995Hz is G4': function() {
      assert.equal(teoria.note.fromFrequency(391.995).note.scientific(), 'G4');
    },

    '220.000Hz is A3': function() {
      assert.equal(teoria.note.fromFrequency(220.000).note.scientific(), 'A3');
    },

    '155.563Hz is Eb3': function() {
      assert.equal(teoria.note.fromFrequency(155.563).note.scientific(), 'Eb3');
    },

    '2959.96Hz is F#7': function() {
      assert.equal(teoria.note.fromFrequency(2959.96).note.scientific(), 'F#7');
    }
  },

  'Instantiate from MIDI': {
    'MIDI#36 is C2': function() {
      assert.equal(teoria.note.fromMIDI(36).scientific(), 'C2');
    },

    'MIDI#77 is F5': function() {
      assert.equal(teoria.note.fromMIDI(77).scientific(), 'F5');
    },

    'MIDI#61 is Db4': function() {
      assert.equal(teoria.note.fromMIDI(61).scientific(), 'Db4');
    },

    'MIDI#80 is G#5': function() {
      assert.equal(teoria.note.fromMIDI(80).scientific(), 'G#5');
    }
  },

  'Return MIDI note number': {
    'MIDI#36 is C2': function() {
      assert.equal(teoria.note('C2').midi(), 36);
    },

    'MIDI#77 is F5': function() {
      assert.equal(teoria.note('F5').midi(), 77);
    },

    'MIDI#61 is Db4': function() {
      assert.equal(teoria.note('Db4').midi(), 61);
    },

    'MIDI#80 is G#5': function() {
      assert.equal(teoria.note('G#5').midi(), 80);
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
  },

  'Enharmonics': {
    'c is enharmonic with dbb and b#': function() {
      assert.deepEqual(teoria.note('c4').enharmonics(),
        ['dbb4', 'b#3'].map(teoria.note));
    },

    'fb is enharmonic with e and dx': function() {
      assert.deepEqual(teoria.note('fb4').enharmonics(),
        ['e4', 'dx4'].map(teoria.note));
    },

    'cb is enharmonic with ax and b': function() {
      assert.deepEqual(teoria.note('cb4').enharmonics(),
        ['b3', 'ax3'].map(teoria.note));
    }
  },

  'Enharmonics with only one accidental': {
    'c is enharmonic with b#': function() {
      assert.deepEqual(teoria.note('c4').enharmonics(true),
        ['b#3'].map(teoria.note));
    },

    'fb is enharmonic with e': function() {
      assert.deepEqual(teoria.note('fb4').enharmonics(true),
        ['e4'].map(teoria.note));
    },

    'cb is enharmonic with b': function() {
      assert.deepEqual(teoria.note('cb4').enharmonics(true),
        ['b3'].map(teoria.note));
    }
  },

  'copy duration on interval': {
    'stay whole note on call interval': function() {
      var note = teoria.note('a#', { duration: 1 });
      assert.equal(note.duration.value, note.interval('P5').duration.value);
    }
  }
}).export(module);
