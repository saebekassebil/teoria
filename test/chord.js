var vows = require('vows'),
    assert = require('assert');

var Chord = require('../lib/chord.js');

// Utility function
function simpleArray(chord) {
  return chord.notes().map(function(n) { return n.toString(true); });
}

vows.describe('Chords').addBatch({
  'Chord parser': {
    'Emaj7': function() {
      var notes = simpleArray(Chord.build('Emaj7'));
      assert.deepEqual(notes, ['e', 'g#', 'b', 'd#']);
    },

    'A+': function() {
      var notes = simpleArray(Chord.build('A+'));
      assert.deepEqual(notes, ['a', 'c#', 'e#']);
    },

    'Bb+': function() {
      var notes = simpleArray(Chord.build('Bb+'));
      assert.deepEqual(notes, ['bb', 'd', 'f#']);
    },

    'F#maj7': function() {
      var notes = simpleArray(Chord.build('F#maj7'));
      assert.deepEqual(notes, ['f#', 'a#', 'c#', 'e#']);
    },

    'Hmaj7': function() {
      var notes = simpleArray(Chord.build('Hmaj7'));
      assert.deepEqual(notes, ['b', 'd#', 'f#', 'a#']);
    },

    'H#maj7': function() {
      var notes = simpleArray(Chord.build('H#maj7'));
      assert.deepEqual(notes, ['b#', 'dx', 'fx', 'ax']);
    },

    'C7b5': function() {
      var notes = simpleArray(Chord.build('C7b5'));
      assert.deepEqual(notes, ['c', 'e', 'gb', 'bb']);
    },

    'Eb7b5': function() {
      var notes = simpleArray(Chord.build('Eb7b5'));
      assert.deepEqual(notes, ['eb', 'g', 'bbb', 'db']);
    },

    'D#7b5': function() {
      var notes = simpleArray(Chord.build('D#7b5'));
      assert.deepEqual(notes, ['d#', 'fx', 'a', 'c#']);
    },

    'C9': function() {
      var notes = simpleArray(Chord.build('C9'));
      assert.deepEqual(notes, ['c', 'e', 'g', 'bb', 'd']);
    },

    'Eb9': function() {
      var notes = simpleArray(Chord.build('Eb9'));
      assert.deepEqual(notes, ['eb', 'g', 'bb', 'db', 'f']);
    },

    'G#(#9)': function() {
      var notes = simpleArray(Chord.build('G#(#9)'));
      assert.deepEqual(notes, ['g#', 'b#', 'd#', 'f#', 'ax']);
    },

    'Ab(b9)': function() {
      var notes = simpleArray(Chord.build('Ab(b9)'));
      assert.deepEqual(notes, ['ab', 'c', 'eb', 'gb', 'bbb']);
    },

    'F#(#11)': function() {
      var notes = simpleArray(Chord.build('F#(#11)'));
      assert.deepEqual(notes, ['f#', 'a#', 'c#', 'e', 'g#', 'b#']);
    },

    'Ab13': function() {
      var notes = simpleArray(Chord.build('Ab13'));
      assert.deepEqual(notes, ['ab', 'c', 'eb', 'gb', 'bb', 'db', 'f']);
    },

    'C7sus4': function() {
      var notes = simpleArray(Chord.build('C7sus4'));
      assert.deepEqual(notes, ['c', 'f', 'g', 'bb']);
    },

    'Cmaj9': function() {
      var notes = simpleArray(Chord.build('Cmaj9'));
      assert.deepEqual(notes, ['c', 'e', 'g', 'b', 'd']);
    },

    'Dmb6': function() {
      var notes = simpleArray(Chord.build('Dmb6'));
      assert.deepEqual(notes, ['d', 'f', 'a', 'bb']);
    },

    'C#(#5#9)': function() {
      var notes = simpleArray(Chord.build('C#(#5#9)'));
      assert.deepEqual(notes, ['c#', 'e#', 'gx', 'b', 'dx']);
    },

    'Cm(maj7)': function() {
      var notes = simpleArray(Chord.build('Cm(maj7)'));
      assert.deepEqual(notes, ['c', 'eb', 'g', 'b']);
    },

    'F#m(11b5b9)': function() {
      var notes = simpleArray(Chord.build('F#m(11b5b9)'));
      assert.deepEqual(notes, ['f#', 'a', 'c', 'e', 'g', 'b']);
    },

    'C/e': function() {
      var notes = simpleArray(Chord.build('C/e'));
      assert.deepEqual(notes, ['e', 'c', 'g']);
    },

    'A7/g': function() {
      var notes = simpleArray(Chord.build('A7/g'));
      assert.deepEqual(notes, ['g', 'a', 'c#', 'e']);
    },

    'G/f#': function() {
      var notes = simpleArray(Chord.build('G/f#'));
      assert.deepEqual(notes, ['f#', 'g', 'b', 'd']);
    },

    'C6': function() {
      var notes = simpleArray(Chord.build('C6'));
      assert.deepEqual(notes, ['c', 'e', 'g', 'a']);
    },

    'A#6': function() {
      var notes = simpleArray(Chord.build('A#6'));
      assert.deepEqual(notes, ['a#', 'cx', 'e#', 'fx']);
    },

    'Bb6': function() {
      var notes = simpleArray(Chord.build('Bb6'));
      assert.deepEqual(notes, ['bb', 'd', 'f', 'g']);
    },

    'Am6': function() {
      var notes = simpleArray(Chord.build('Am6'));
      assert.deepEqual(notes, ['a', 'c', 'e', 'f#']);
    },

    'D(#6)': function() {
      var notes = simpleArray(Chord.build('D(#6)'));
      assert.deepEqual(notes, ['d', 'f#', 'a', 'b#']);
    },

    'Eo': function() {
      var notes = simpleArray(Chord.build('Eo'));
      assert.deepEqual(notes, ['e', 'g', 'bb']);
    },

    'Eø': function() {
      var notes = simpleArray(Chord.build('Eø'));
      assert.deepEqual(notes, ['e', 'g', 'bb', 'd']);
    },

    'Do': function() {
      var notes = simpleArray(Chord.build('Do'));
      assert.deepEqual(notes, ['d', 'f', 'ab']);
    },

    'Dø': function() {
      var notes = simpleArray(Chord.build('Dø'));
      assert.deepEqual(notes, ['d', 'f', 'ab', 'c']);
    },

    'Fo7': function() {
      var notes = simpleArray(Chord.build('Fo7'));
      assert.deepEqual(notes, ['f', 'ab', 'cb', 'ebb']);
    },

    'G#ø7': function() {
      var notes = simpleArray(Chord.build('G#ø7'));
      assert.deepEqual(notes, ['g#', 'b', 'd', 'f#']);
    },

    'Cmin': function() {
      var notes = simpleArray(Chord.build('Cmin'));
      assert.deepEqual(notes, ['c', 'eb', 'g']);
    },

    'Bmin11': function() {
      var notes = simpleArray(Chord.build('Bmin11'));
      assert.deepEqual(notes, ['b', 'd', 'f#', 'a', 'c#', 'e']);
    },

    'C+M7': function() {
      var notes = simpleArray(Chord.build('C+M7'));
      assert.deepEqual(notes, ['c', 'e', 'g#', 'b']);
    },

    'Bbdom7b5': function() {
      var notes = simpleArray(Chord.build('Bbdom7b5'));
      assert.deepEqual(notes, ['bb', 'd', 'fb', 'ab']);
    },

    'E5': function() {
      var notes = simpleArray(Chord.build('E5'));
      assert.deepEqual(notes, ['e', 'b']);
    },

    'A5': function() {
      var notes = simpleArray(Chord.build('A5'));
      assert.deepEqual(notes, ['a', 'e']);
    },

    'C13#9b5': function() {
      var notes = simpleArray(Chord.build('C13#9b5'));
      assert.deepEqual(notes, ['c', 'e', 'gb', 'bb', 'd#', 'f', 'a']);
    },

    'D13#5b9': function() {
      var notes = simpleArray(Chord.build('D13#5b9'));
      assert.deepEqual(notes, ['d', 'f#', 'a#', 'c', 'eb', 'g', 'b']);
    },

    'C6/9': function() {
      var notes = simpleArray(Chord.build('C6/9'));
      assert.deepEqual(notes, ['c', 'e', 'g', 'a', 'd']);
    },

    'Ab6/9': function() {
      var notes = simpleArray(Chord.build('Ab6/9'));
      assert.deepEqual(notes, ['ab', 'c', 'eb', 'f', 'bb']);
    },

    'CM7': function() {
      var notes = simpleArray(Chord.build('CM7'));
      assert.deepEqual(notes, ['c', 'e', 'g', 'b']);
    },

    'CmM7': function() {
      var notes = simpleArray(Chord.build('CmM7'));
      assert.deepEqual(notes, ['c', 'eb', 'g', 'b']);
    },

    'DM': function() {
      var notes = simpleArray(Chord.build('DM'));
      assert.deepEqual(notes, ['d', 'f#', 'a']);
    },

    'EM#5': function() {
      var notes = simpleArray(Chord.build('EM#5'));
      assert.deepEqual(notes, ['e', 'g#', 'b#']);
    },

    'FM9': function() {
      var notes = simpleArray(Chord.build('FM9'));
      assert.deepEqual(notes, ['f', 'a', 'c', 'e', 'g']);
    },

    'Dmi': function() {
      var notes = simpleArray(Chord.build('Dmi'));
      assert.deepEqual(notes, ['d', 'f', 'a']);

    },

    'Emi7': function() {
      var notes = simpleArray(Chord.build('Emi7'));
      assert.deepEqual(notes, ['e', 'g', 'b', 'd']);
    },

    'Dma': function() {
      var notes = simpleArray(Chord.build('Dma'));
      assert.deepEqual(notes, ['d', 'f#', 'a']);
    },

    'Ema9': function() {
      var notes = simpleArray(Chord.build('Ema9'));
      assert.deepEqual(notes, ['e', 'g#', 'b', 'd#', 'f#']);
    }
  },

  'Case doesn\'t matter': {
    'BbDom': function() {
      assert.deepEqual(
        simpleArray(Chord.build('BbDom')),
        simpleArray(Chord.build('Bbdom'))
      );
    },

    'EbMaj9': function() {
      assert.deepEqual(
        simpleArray(Chord.build('EbMaj9')),
        simpleArray(Chord.build('Ebmaj9'))
      );
    },

    'ASus4': function() {
      assert.deepEqual(
        simpleArray(Chord.build('ASus4')),
        simpleArray(Chord.build('Asus4'))
      );
    },

    'EAdd9': function() {
      assert.deepEqual(
        simpleArray(Chord.build('EAdd9')),
        simpleArray(Chord.build('Eadd9'))
      );
    }
  },

  'Chord Methods': {
    '#quality() of Bmaj7': function() {
      assert.equal(Chord.build('Bmaj7').quality(), 'major');
    },

    '#quality() of E7': function() {
      assert.equal(Chord.build('E7').quality(), 'dominant');
    },

    '#quality() of Dbm7b5': function() {
      assert.equal(Chord.build('Dbm7b5').quality(), 'half-diminished');
    },

    '#quality() of Cmin11': function() {
      assert.equal(Chord.build('Cmin11').quality(), 'minor');
    },

    '#quality() of A+': function() {
      assert.equal(Chord.build('A+').quality(), 'augmented');
    },

    '#quality() of A#(b13)': function() {
      assert.equal(Chord.build('A#(b13)').quality(), 'dominant');
    },

    '#quality() of Gmb5': function() {
      assert.equal(Chord.build('Gmb5').quality(), 'diminished');
    },

    '#quality() of Asus4': function() {
      assert.equal(Chord.build('Asus4').quality(), undefined);
    },

    '#quality() of Fm#5': function() {
      assert.equal(Chord.build('Fm#5').quality(), 'minor');
    },
  }
}).export(module);
