var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../');

vows.describe('Chords').addBatch({
  'Chord parser': {
    'Emaj7': function() {
      assert.deepEqual(teoria.chord('Emaj7').simple(), ['e', 'g#', 'b', 'd#']);
    },

    'A+': function() {
      assert.deepEqual(teoria.chord('A+').simple(), ['a', 'c#', 'e#']);
    },

    'Bb+': function() {
      assert.deepEqual(teoria.chord('Bb+').simple(), ['bb', 'd', 'f#']);
    },

    'F#maj7': function() {
      assert.deepEqual(teoria.chord('F#maj7').simple(), ['f#', 'a#', 'c#', 'e#']);
    },

    'Hmaj7': function() {
      assert.deepEqual(teoria.chord('Hmaj7').simple(), ['b', 'd#', 'f#', 'a#']);
    },

    'H#maj7': function() {
      assert.deepEqual(teoria.chord('H#maj7').simple(), ['b#', 'dx', 'fx', 'ax']);
    },

    'C7b5': function() {
      assert.deepEqual(teoria.chord('C7b5').simple(), ['c', 'e', 'gb', 'bb']);
    },

    'Eb7b5': function() {
      assert.deepEqual(teoria.chord('Eb7b5').simple(), ['eb', 'g', 'bbb', 'db']);
    },

    'D#7b5': function() {
      assert.deepEqual(teoria.chord('D#7b5').simple(), ['d#', 'fx', 'a', 'c#']);
    },

    'C9': function() {
      assert.deepEqual(teoria.chord('C9').simple(), ['c', 'e', 'g', 'bb', 'd']);
    },

    'Eb9': function() {
      assert.deepEqual(teoria.chord('Eb9').simple(), ['eb', 'g', 'bb', 'db', 'f']);
    },

    'G#(#9)': function() {
      assert.deepEqual(teoria.chord('G#(#9)').simple(), ['g#', 'b#', 'd#', 'f#', 'ax']);
    },

    'Ab(b9)': function() {
      assert.deepEqual(teoria.chord('Ab(b9)').simple(), ['ab', 'c', 'eb', 'gb', 'bbb']);
    },

    'F#(#11)': function() {
      assert.deepEqual(teoria.chord('F#(#11)').simple(), ['f#', 'a#', 'c#', 'e', 'g#', 'b#']);
    },

    'Ab13': function() {
      assert.deepEqual(teoria.chord('Ab13').simple(), ['ab', 'c', 'eb', 'gb', 'bb', 'db', 'f']);
    },

    'C7sus4': function() {
      assert.deepEqual(teoria.chord('C7sus4').simple(), ['c', 'f', 'g', 'bb']);
    },

    'Cmaj9': function() {
      assert.deepEqual(teoria.chord('Cmaj9').simple(), ['c', 'e', 'g', 'b', 'd']);
    },

    'Dmb6': function() {
      assert.deepEqual(teoria.chord('Dmb6').simple(), ['d', 'f', 'a', 'bb']);
    },

    'C#(#5#9)': function() {
      assert.deepEqual(teoria.chord('C#(#5#9)').simple(), ['c#', 'e#', 'gx', 'b', 'dx']);
    },

    'Cm(maj7)': function() {
      assert.deepEqual(teoria.chord('Cm(maj7)').simple(), ['c', 'eb', 'g', 'b']);
    },

    'F#m(11b5b9)': function() {
      assert.deepEqual(teoria.chord('F#m(11b5b9)').simple(), ['f#', 'a', 'c', 'e', 'g', 'b']);
    },

    'C/e': function() {
      assert.deepEqual(teoria.chord('C/e').simple(), ['e', 'c', 'g']);
    },

    'A7/g': function() {
      assert.deepEqual(teoria.chord('A7/g').simple(), ['g', 'a', 'c#', 'e']);
    },

    'G/f#': function() {
      assert.deepEqual(teoria.chord('G/f#').simple(), ['f#', 'g', 'b', 'd']);
    },

    'C6': function() {
      assert.deepEqual(teoria.chord('C6').simple(), ['c', 'e', 'g', 'a']);
    },

    'A#6': function() {
      assert.deepEqual(teoria.chord('A#6').simple(), ['a#', 'cx', 'e#', 'fx']);
    },

    'Bb6': function() {
      assert.deepEqual(teoria.chord('Bb6').simple(), ['bb', 'd', 'f', 'g']);
    },

    'Am6': function() {
      assert.deepEqual(teoria.chord('Am6').simple(), ['a', 'c', 'e', 'f#']);
    },

    'D(#6)': function() {
      assert.deepEqual(teoria.chord('D(#6)').simple(), ['d', 'f#', 'a', 'b#']);
    },

    'Eo': function() {
      assert.deepEqual(teoria.chord('Eo').simple(), ['e', 'g', 'bb']);
    },

    'Eø': function() {
      assert.deepEqual(teoria.chord('Eø').simple(), ['e', 'g', 'bb', 'd']);
    },

    'Do': function() {
      assert.deepEqual(teoria.chord('Do').simple(), ['d', 'f', 'ab']);
    },

    'Dø': function() {
      assert.deepEqual(teoria.chord('Dø').simple(), ['d', 'f', 'ab', 'c']);
    },

    'Fo7': function() {
      assert.deepEqual(teoria.chord('Fo7').simple(), ['f', 'ab', 'cb', 'ebb']);
    },

    'G#ø7': function() {
      assert.deepEqual(teoria.chord('G#ø7').simple(), ['g#', 'b', 'd', 'f#']);
    },

    'Cmin': function() {
      assert.deepEqual(teoria.chord('Cmin').simple(), ['c', 'eb', 'g']);
    },

    'Bmin11': function() {
      assert.deepEqual(teoria.chord('Bmin11').simple(), ['b', 'd', 'f#', 'a', 'c#', 'e']);
    },

    'C+M7': function() {
      assert.deepEqual(teoria.chord('C+M7').simple(), ['c', 'e', 'g#', 'b']);
    },

    'Bbdom7b5': function() {
      assert.deepEqual(teoria.chord('Bbdom7b5').simple(), ['bb', 'd', 'fb', 'ab']);
    },

    'E5': function() {
      assert.deepEqual(teoria.chord('E5').simple(), ['e', 'b']);
    },

    'A5': function() {
      assert.deepEqual(teoria.chord('A5').simple(), ['a', 'e']);
    },

    'C13#9b5': function() {
      assert.deepEqual(teoria.chord('C13#9b5').simple(), ['c', 'e', 'gb', 'bb', 'd#', 'f', 'a']);
    },

    'D13#5b9': function() {
      assert.deepEqual(teoria.chord('D13#5b9').simple(), ['d', 'f#', 'a#', 'c', 'eb', 'g', 'b']);
    },

    'C6/9': function() {
      assert.deepEqual(teoria.chord('C6/9').simple(), ['c', 'e', 'g', 'a', 'd']);
    },

    'Ab6/9': function() {
      assert.deepEqual(teoria.chord('Ab6/9').simple(), ['ab', 'c', 'eb', 'f', 'bb']);
    },

    'CM7': function() {
      assert.deepEqual(teoria.chord('CM7').simple(), ['c', 'e', 'g', 'b']);
    },

    'CmM7': function() {
      assert.deepEqual(teoria.chord('CmM7').simple(), ['c', 'eb', 'g', 'b']);
    },

    'DM': function() {
      assert.deepEqual(teoria.chord('DM').simple(), ['d', 'f#', 'a']);
    },

    'EM#5': function() {
      assert.deepEqual(teoria.chord('EM#5').simple(), ['e', 'g#', 'b#']);
    },

    'FM9': function() {
      assert.deepEqual(teoria.chord('FM9').simple(), ['f', 'a', 'c', 'e', 'g']);
    },

    'Dmi': function() {
      assert.deepEqual(teoria.chord('Dmi').simple(), ['d', 'f', 'a']);

    },

    'Emi7': function() {
      assert.deepEqual(teoria.chord('Emi7').simple(), ['e', 'g', 'b', 'd']);
    },

    'Dma': function() {
      assert.deepEqual(teoria.chord('Dma').simple(), ['d', 'f#', 'a']);
    },

    'Ema9': function() {
      assert.deepEqual(teoria.chord('Ema9').simple(), ['e', 'g#', 'b', 'd#', 'f#']);
    }
  },

  'Case doesn\'t matter': {
    'BbDom': function() {
      assert.deepEqual(teoria.chord('BbDom').simple(), teoria.chord('Bbdom').simple());
    },

    'EbMaj9': function() {
      assert.deepEqual(teoria.chord('EbMaj9').simple(), teoria.chord('Ebmaj9').simple());
    },

    'ASus4': function() {
      assert.deepEqual(teoria.chord('ASus4').simple(), teoria.chord('Asus4').simple());
    },

    'EAdd9': function() {
      assert.deepEqual(teoria.chord('EAdd9').simple(), teoria.chord('Eadd9').simple());
    }
  },

  'Chord Methods': {
    '#bass of Cmaj7': function() {
      assert.equal(teoria.chord('Cmaj7').bass().toString(true), 'c');
    },

    '#bass of A/C#': function() {
      assert.equal(teoria.chord('A/C#').bass().toString(true), 'c#');
    },

    '#bass of D6/9': function() {
      assert.equal(teoria.chord('D6/9').bass().toString(true), 'd');
    },

    '#quality() of Bmaj7': function() {
      assert.equal(teoria.chord('Bmaj7').quality(), 'major');
    },

    '#quality() of E7': function() {
      assert.equal(teoria.chord('E7').quality(), 'dominant');
    },

    '#quality() of Dbm7b5': function() {
      assert.equal(teoria.chord('Dbm7b5').quality(), 'half-diminished');
    },

    '#quality() of Cmin11': function() {
      assert.equal(teoria.chord('Cmin11').quality(), 'minor');
    },

    '#quality() of A+': function() {
      assert.equal(teoria.chord('A+').quality(), 'augmented');
    },

    '#quality() of A#(b13)': function() {
      assert.equal(teoria.chord('A#(b13)').quality(), 'dominant');
    },

    '#quality() of Gmb5': function() {
      assert.equal(teoria.chord('Gmb5').quality(), 'diminished');
    },

    '#quality() of Asus4': function() {
      assert.equal(teoria.chord('Asus4').quality(), undefined);
    },

    '#quality() of Fm#5': function() {
      assert.equal(teoria.chord('Fm#5').quality(), 'minor');
    },

    '#chordType() of C': function() {
      assert.equal(teoria.chord('C').chordType(), 'triad');
    },

    '#chordType() of Dm': function() {
      assert.equal(teoria.chord('Dm').chordType(), 'triad');
    },

    '#chordType() of A7': function() {
      assert.equal(teoria.chord('A7').chordType(), 'tetrad');
    },

    '#chordType() of Bsus4': function() {
      assert.equal(teoria.chord('Bsus4').chordType(), 'trichord');
    },

    '#chordType() of E5': function() {
      assert.equal(teoria.chord('E5').chordType(), 'dyad');
    },
  }
}).export(module);
