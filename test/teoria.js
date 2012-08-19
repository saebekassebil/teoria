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

      'The interval between C#4 and Db4 is a diminished second': function(note) {
        var cis4 = teoria.note('c#4');
        var db4 = teoria.note('db4');

        assert.deepEqual(cis4.interval(db4),
            new teoria.TeoriaInterval(2, 'diminished'));
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

  'Teoria Solfege with octave markings': {
    'C4 in C4 minor': function() {
      var note = new teoria.TeoriaNote('c4');
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
      return new teoria.TeoriaNote('F#,');
    },

    'Relative Intervals': {
      'Doubly diminished second': function(note) {
        assert.deepEqual(note.interval('dd2'), teoria.note('Gbb,'));
      },

      'Diminished second': function(note) {
        assert.deepEqual(note.interval('d2'), teoria.note('Gb,'));
      },

      'Minor second': function(note) {
        assert.deepEqual(note.interval('m2'), teoria.note('G,'));
      },

      'Major second': function(note) {
        assert.deepEqual(note.interval('M2'), teoria.note('G#,'));
      },

      'Augmented second': function(note) {
        assert.deepEqual(note.interval('A2'), teoria.note('Gx,'));
      },

      'Doubly diminished third': function(note) {
        assert.deepEqual(note.interval('dd3'), teoria.note('Abb,'));
      },

      'Diminished third': function(note) {
        assert.deepEqual(note.interval('d3'), teoria.note('Ab,'));
      },

      'Minor third': function(note) {
        assert.deepEqual(note.interval('m3'), teoria.note('A,'));
      },

      'Major third': function(note) {
        assert.deepEqual(note.interval('M3'), teoria.note('A#,'));
      },

      'Augmented third': function(note) {
        assert.deepEqual(note.interval('A3'), teoria.note('Ax,'));
      },

      'Doubly diminished fourth': function(note) {
        assert.deepEqual(note.interval('dd4'), teoria.note('Bbb,'));
      },

      'Diminished fourth': function(note) {
        assert.deepEqual(note.interval('d4'), teoria.note('Bb,'));
      },

      'Perfect fourth': function(note) {
        assert.deepEqual(note.interval('P4'), teoria.note('B,'));
      },

      'Augmented fourth': function(note) {
        assert.deepEqual(note.interval('A4'), teoria.note('B#,'));
      },

      'Doubly augmented fourth': function(note) {
        assert.deepEqual(note.interval('AA4'), teoria.note('Bx,'));
      },

      'Doubly diminished fifth': function(note) {
        assert.deepEqual(note.interval('dd5'), teoria.note('Cb'));
      },

      'Diminished fifth': function(note) {
        assert.deepEqual(note.interval('d5'), teoria.note('C'));
      },

      'Perfect fifth': function(note) {
        assert.deepEqual(note.interval('P5'), teoria.note('C#'));
      },

      'Augmented fifth': function(note) {
        assert.deepEqual(note.interval('A5'), teoria.note('Cx'));
      },

      'Doubly diminished sixth': function(note) {
        assert.deepEqual(note.interval('dd6'), teoria.note('Dbb'));
      },

      'Diminished sixth': function(note) {
        assert.deepEqual(note.interval('d6'), teoria.note('Db'));
      },

      'Minor sixth': function(note) {
        assert.deepEqual(note.interval('m6'), teoria.note('D'));
      },

      'Major sixth': function(note) {
        assert.deepEqual(note.interval('M6'), teoria.note('D#'));
      },

      'Augmented sixth': function(note) {
        assert.deepEqual(note.interval('A6'), teoria.note('Dx'));
      },

      'Doubly diminished seventh': function(note) {
        assert.deepEqual(note.interval('dd7'), teoria.note('Ebb'));
      },

      'Diminished seventh': function(note) {
        assert.deepEqual(note.interval('d7'), teoria.note('Eb'));
      },

      'Minor seventh': function(note) {
        assert.deepEqual(note.interval('m7'), teoria.note('E'));
      },

      'Major seventh': function(note) {
        assert.deepEqual(note.interval('M7'), teoria.note('E#'));
      },

      'Augmented seventh': function(note) {
        assert.deepEqual(note.interval('A7'), teoria.note('Ex'));
      },

      'Doubly diminished octave': function(note) {
        assert.deepEqual(note.interval('dd8'), teoria.note('Fb'));
      },

      'Diminished octave': function(note) {
        assert.deepEqual(note.interval('d8'), teoria.note('F'));
      },

      'Perfect octave': function(note) {
        assert.deepEqual(note.interval('P8'), teoria.note('F#'));
      },

      'Augmented octave': function(note) {
        assert.deepEqual(note.interval('A8'), teoria.note('Fx'));
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

    'Compound Intervals': {
      'A major seventeenth is a compound interval': function() {
        assert.equal(teoria.interval('M17').isCompound(), true);
      },

      'A major seventeenth\'s simple part is a major third': function() {
        assert.equal(teoria.interval('M17').simple(), 'M3');
      },

      'A 22nd has two compound octaves': function() {
        assert.equal(teoria.interval('P22').compoundOctaves, 2);
      },

      'A major seventh is greater than a minor seventh': function() {
        assert.equal(teoria.interval('M7').greater(teoria.interval('m7')), true);
      },

      'An augmented octave is smaller than a major ninth': function() {
        assert.equal(teoria.interval('A8').smaller(teoria.interval('M9')), true);
      },

      'A major third is equal to another major third': function() {
        assert.equal(teoria.interval('M3').equal(teoria.interval('M3')), true);
      },

      'An augmented fifth is not equal to a minor sixth': function() {
        assert.equal(teoria.interval('P5').equal(teoria.interval('m6')), false);
      },

      'The simple part of a major 23th is a major second': function() {
        assert.equal(teoria.interval('M23').simple(), 'M2');
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
      },

      'C/e': function() {
        var notes = simpleArray(teoria.chord('C/e'));
        assert.deepEqual(notes, ['e', 'c', 'g']);
      },

      'A7/g': function() {
        var notes = simpleArray(teoria.chord('A7/g'));
        assert.deepEqual(notes, ['g', 'a', 'c#', 'e']);
      },

      'G/f#': function() {
        var notes = simpleArray(teoria.chord('G/f#'));
        assert.deepEqual(notes, ['f#', 'g', 'b', 'd']);
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

