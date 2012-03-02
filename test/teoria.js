var vows = require('vows'),
    spec = require("vows/lib/vows/reporters/spec"),
    assert = require('assert'),
    teoria = require('../teoria.js').teoria;

// Utility function(s)
function simpleArray(chord) {
  var notes = [];
  for(var i = 0, length = chord.notes.length; i < length; i++) {
    notes.push(chord.notes[i].name + chord.notes[i].accidental.sign);
  }

  return notes;
}

var suite = vows.describe('Teoria Framework').addBatch({
  'TeoriaNote': {
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

        assert.deepEqual(note.interval(a4), {
          name: 'third',
          quality: 'major',
          direction: 'down',
          simple: 'M3'
        });
      },

      'The interval between C#5 and Eb6 is diminished eleventh': function(note) {
        var eb6 = new teoria.TeoriaNote('Eb6');

        assert.deepEqual(note.interval(eb6), {
          name: 'tenth',
          quality: 'diminished',
          direction: 'up',
          simple: 'd10'
        });
      },

      'An diminished fifth away from C#5 is G5': function(note) {
        var g5 = new teoria.TeoriaNote('G5');

        assert.deepEqual(note.interval('d5'), g5);
      }
    }
  },

  'Teoria Solfege': {
    'C in C minor': function() {
      var note = new teoria.TeoriaNote('c');
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
    }
  },

  'Teoria Scales': {
    'Ab2': {
      topic: function() {
        return new teoria.TeoriaNote('Ab2');
      },

      'Ionian/Major': function(note) {
        assert.deepEqual(note.scale('ionian').simple(),
            ['ab', 'bb', 'c', 'db', 'eb', 'f', 'g']);
      },

      'Dorian': function(note) {
        assert.deepEqual(note.scale('dorian').simple(),
            ['ab', 'bb', 'cb', 'db', 'eb', 'f', 'gb']);
      },

      'Phrygian': function(note) {
        assert.deepEqual(note.scale('phrygian').simple(),
            ["ab", "bbb", "cb", "db", "eb", "fb", "gb"]);
      },

      'Lydian': function(note) {
        assert.deepEqual(note.scale('lydian').simple(),
            ["ab", "bb", "c", "d", "eb", "f", "g"]);
      },

      'Mixolydian': function(note) {
        assert.deepEqual(note.scale('mixolydian').simple(),
            ["ab", "bb", "c", "db", "eb", "f", "gb"]);
      },

      'Aeolian/Minor': function(note) {
        assert.deepEqual(note.scale('aeolian').simple(),
            ["ab", "bb", "cb", "db", "eb", "fb", "gb"]);
      },

      'Locrian': function(note) {
        assert.deepEqual(note.scale('locrian').simple(),
            ["ab", "bbb", "cb", "db", "ebb", "fb", "gb"]);
      },

      'Major Pentatonic': function(note) {
        assert.deepEqual(note.scale('majorpentatonic').simple(),
            ["ab", "bb", "c", "eb", "f"]);
      },

      'Minor Pentatonic': function(note) {
        assert.deepEqual(note.scale('minorpentatonic').simple(),
            ["ab", "cb", "db", "eb", "gb"]);
      },

      'Chromatic': function(note) {
        assert.deepEqual(note.scale('chromatic').simple(),
            ["ab", "bbb", "bb", "cb", "c", "db",
             "d", "eb", "fb", "f", "gb", "g"]);
      }
    }
  },

  'Teoria Intervals': {
    topic: function() {
      return new teoria.TeoriaNote(',F#');
    },

    'Relative Intervals': {
      'Minor second': function(note) {
        assert.deepEqual(note.interval('m2'), teoria.note(',G'));
      },

      'Major second': function(note) {
        assert.deepEqual(note.interval('M2'), teoria.note(',G#'));
      },

      'Minor third': function(note) {
        assert.deepEqual(note.interval('m3'), teoria.note(',A'));
      },

      'Major third': function(note) {
        assert.deepEqual(note.interval('M3'), teoria.note(',A#'));
      },

      'Perfect fourth': function(note) {
        assert.deepEqual(note.interval('P4'), teoria.note(',B'));
      },

      'Augmented fourth': function(note) {
        assert.deepEqual(note.interval('A4'), teoria.note(',B#'));
      },

      'Perfect fifth': function(note) {
        assert.deepEqual(note.interval('P5'), teoria.note('C#'));
      },

      'Minor sixth': function(note) {
        assert.deepEqual(note.interval('m6'), teoria.note('D'));
      },

      'Major sixth': function(note) {
        assert.deepEqual(note.interval('M6'), teoria.note('D#'));
      },

      'Minor seventh': function(note) {
        assert.deepEqual(note.interval('m7'), teoria.note('E'));
      },

      'Major seventh': function(note) {
        assert.deepEqual(note.interval('M7'), teoria.note('E#'));
      },

      'Perfect octave': function(note) {
        assert.deepEqual(note.interval('P8'), teoria.note('F#'));
      },

      'Minor ninth': function(note) {
        assert.deepEqual(note.interval('m9'), teoria.note('G'));
      },

      'Major ninth': function(note) {
        assert.deepEqual(note.interval('M9'), teoria.note('G#'));
      },

      'Minor tenth': function(note) {
        assert.deepEqual(note.interval('m10'), teoria.note('A'));
      },

      'Major tenth': function(note) {
        assert.deepEqual(note.interval('M10'), teoria.note('A#'));
      },

      'Perfect eleventh': function(note) {
        assert.deepEqual(note.interval('P11'), teoria.note('B'));
      },

      'Diminished twelfth': function(note) {
        assert.deepEqual(note.interval('d12'), teoria.note('c'));
      },

      'Perfect twelfth': function(note) {
        assert.deepEqual(note.interval('P12'), teoria.note('c#'));
      },

      'Minor thirteenth': function(note) {
        assert.deepEqual(note.interval('m13'), teoria.note('d'));
      },

      'Major thirteenth': function(note) {
        assert.deepEqual(note.interval('M13'), teoria.note('d#'));
      },

      'Minor fourteenth': function(note) {
        assert.deepEqual(note.interval('m14'), teoria.note('e'));
      },

      'Major fourteenth': function(note) {
        assert.deepEqual(note.interval('M14'), teoria.note('e#'));
      }
    },

    'Interval inversions': {
      'Invert m2 is M7': function() {
        assert.equal(teoria.interval.invert('m2'), 'M7');
      },

      'Invert M2 is m7': function() {
        assert.equal(teoria.interval.invert('M2'), 'm7');
      },

      'Invert m3 is M6': function() {
        assert.equal(teoria.interval.invert('m3'), 'M6');
      },

      'Invert M3 is m6': function() {
        assert.equal(teoria.interval.invert('M3'), 'm6');
      },

      'Invert P4 is P5': function() {
        assert.equal(teoria.interval.invert('P4'), 'P5');
      },

      'Invert A5 is d4': function() {
        assert.equal(teoria.interval.invert('A5'), 'd4');
      }
    }
  },

  'TeoriaChord': {
    'Chord parser': {
      'Emaj7': function() {
        var notes = simpleArray(teoria.chord('Emaj7'));
        assert.deepEqual(notes, ['e', 'g#', 'b', 'd#']);
      },

      'F#maj7': function() {
        var notes = simpleArray(teoria.chord('F#maj7'));
        assert.deepEqual(notes, ['f#', 'a#', 'c#', 'e#']);
      },

      'Hmaj7': function() {
        var notes = simpleArray(teoria.chord('Hmaj7'));
        assert.deepEqual(notes, ['h', 'd#', 'f#', 'a#']);
      },

      'H#maj7': function() {
        var notes = simpleArray(teoria.chord('H#maj7'));
        assert.deepEqual(notes, ['h#', 'dx', 'fx', 'ax']);
      },

      'C7b5': function() {
        var notes = simpleArray(teoria.chord('C7b5'));
        assert.deepEqual(notes, ['c', 'e', 'gb', 'bb']);
      },

      'Eb7b5': function() {
        var notes = simpleArray(teoria.chord('Eb7b5'));
        assert.deepEqual(notes, ['eb', 'g', 'bbb', 'db']);
      },

      'D#7b5': function() {
        var notes = simpleArray(teoria.chord('D#7b5'));
        assert.deepEqual(notes, ['d#', 'fx', 'a', 'c#']);
      },

      'C9': function() {
        var notes = simpleArray(teoria.chord('C9'));
        assert.deepEqual(notes, ['c', 'e', 'g', 'bb', 'd']);
      },

      'Eb9': function() {
        var notes = simpleArray(teoria.chord('Eb9'));
        assert.deepEqual(notes, ['eb', 'g', 'bb', 'db', 'f']);
      },

      'G#(#9)': function() {
        var notes = simpleArray(teoria.chord('G#(#9)'));
        assert.deepEqual(notes, ['g#', 'b#', 'd#', 'f#', 'ax']);
      },

      'Ab(b9)': function() {
        var notes = simpleArray(teoria.chord('Ab(b9)'));
        assert.deepEqual(notes, ['ab', 'c', 'eb', 'gb', 'bbb']);
      },

      'F#(#11)': function() {
        var notes = simpleArray(teoria.chord('F#(#11)'));
        assert.deepEqual(notes, ['f#', 'a#', 'c#', 'e', 'g#', 'b#']);
      },

      'Ab13': function() {
        var notes = simpleArray(teoria.chord('Ab13'));
        assert.deepEqual(notes, ['ab', 'c', 'eb', 'gb', 'bb', 'db', 'f']);
      },

      'C7sus4': function() {
        var notes = simpleArray(teoria.chord('C7sus4'));
        assert.deepEqual(notes, ['c', 'f', 'g', 'bb']);
      },

      'Cmaj9': function() {
        var notes = simpleArray(teoria.chord('Cmaj9'));
        assert.deepEqual(notes, ['c', 'e', 'g', 'b', 'd']);
      },

      'Dmb6': function() {
        var notes = simpleArray(teoria.chord('Dmb6'));
        assert.deepEqual(notes, ['d', 'f', 'a', 'bb']);
      },

      'C#(#5#9)': function() {
        var notes = simpleArray(teoria.chord('C#(#5#9)'));
        assert.deepEqual(notes, ['c#', 'e#', 'gx', 'b', 'dx']);
      },

      'Cm(maj7)': function() {
        var notes = simpleArray(teoria.chord('Cm(maj7)'));
        assert.deepEqual(notes, ['c', 'eb', 'g', 'b']);
      },

      'F#m(11b5b9)': function() {
        var notes = simpleArray(teoria.chord('F#m(11b5b9)'));
        assert.deepEqual(notes, ['f#', 'a', 'c', 'e', 'g', 'b']);
      }
    }
  }
});
var isVows = false;

process.argv.forEach(function(argument) {
  if(argument.indexOf('vows') != -1) {
    isVows = true;
  }
});

if(isVows) {
  suite.export(module);
} else {
  suite.run({reporter: spec});
}

