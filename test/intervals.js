var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../dist/teoria.js');

vows.describe('Intervals').addBatch({
  'Relative Intervals': {
    topic: function() {
      return teoria.note('F#,');
    },

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
    },

    'Doubly diminished second up': function() {
      assert.deepEqual(teoria.note('e').interval(teoria.note('fbb')),
          teoria.interval('dd2'));
    },

    'Doubly diminished second down': function() {
      assert.deepEqual(teoria.note('f').interval(teoria.note('ex')),
          teoria.interval('dd-2'));
    }
  },

  'Interval descending': {
    'A major third down from E4': function() {
      assert.deepEqual(teoria.note('E4').interval('M-3'), teoria.note('C4'));
    },

    'Minor second down from C2': function() {
      assert.deepEqual(teoria.note('C2').interval('m-2'), teoria.note('B1'));
    },

    'A diminished fifth down from Eb5': function() {
      assert.deepEqual(teoria.note('Eb5').interval('d-5'), teoria.note('A4'));
    },

    'A major ninth down from G#4': function() {
      assert.deepEqual(teoria.note('G#4').interval('M-9'), teoria.note('F#3'));
    },

    'An augmented sixth down from Bb4': function() {
      assert.deepEqual(teoria.note('Bb4').interval('A-6'), teoria.note('Dbb4'));
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

  'Interval base': {
    'Base of d5 is a fifth': function() {
      assert.equal(teoria.interval('d5').base(), 'fifth');
    },

    'Base of A7 is a seventh': function() {
      assert.equal(teoria.interval('A7').base(), 'seventh');
    },

    'Base of m2 is a second': function() {
      assert.equal(teoria.interval('m2').base(), 'second');
    },

    'Base of M6 is a sixth': function() {
      assert.equal(teoria.interval('M6').base(), 'sixth');
    },

    'Base of dd8 is an octave': function() {
      assert.equal(teoria.interval('dd8').base(), 'octave');
    },

    'Base of AA4 is a fourth': function() {
      assert.equal(teoria.interval('AA4').base(), 'fourth');
    },

    'Base of d-5 is a fifth': function() {
      assert.equal(teoria.interval('d-5').base(), 'fifth');
    },

    'Base of m-9 is a second': function() {
      assert.equal(teoria.interval('m-2').base(), 'second');
    },

    'Base of M-13 is a sixth': function() {
      assert.equal(teoria.interval('M-13').base(), 'sixth');
    },

    'Base of P-11 is a fourth': function() {
      assert.equal(teoria.interval('P-11').base(), 'fourth');
    },

    'Base of AA-7 is a seventh': function() {
      assert.equal(teoria.interval('AA-7').base(), 'seventh');
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
      assert.equal(teoria.interval('P22').octaves(), 2);
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
  },

  'Interval direction': {
    'A3 to C4 is up': function() {
      assert.equal(teoria.note('A3').interval(teoria.note('C4')).direction(), 'up');
    },

    'Bb5 to Bb5 is up (default direction is up)': function() {
      assert.equal(teoria.note('Bb5').interval(teoria.note('Bb5')).direction(), 'up');
    },

    'G#4 to D4 is down': function() {
      assert.equal(teoria.note('G#4').interval(teoria.note('D4')).direction(), 'down');
    },

    'F6 to E6 is down': function() {
      assert.equal(teoria.note('F6').interval(teoria.note('E6')).direction(), 'down');
    },

    'C4 to A3 is up, w. direction set to up': function() {
      assert.equal(teoria.note('C4').interval(teoria.note('A3')).direction('up').direction(), 'up');
    },

    'A3 to C4 remains up w. direction set to up': function() {
      assert.equal(teoria.note('A3').interval(teoria.note('C4')).direction('up').direction(), 'up');
    }
  }
}).export(module);
