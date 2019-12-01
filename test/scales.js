var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../');

vows.describe('Scales').addBatch({
  'Ab2': {
    topic: function() {
      return teoria.note('Ab2');
    },

    'Blues': function(note) {
      assert.deepEqual(teoria.note('g#').scale('blues').simple(),
          ['g#', 'b', 'c#', 'd', 'd#', 'f#']);
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
    },

    'Whole Tone': function(note) {
      assert.deepEqual(teoria.note('c').scale('wholetone').simple(),
        ["c", "d", "e", "f#", "g#", "a#"]);
    }
  },

  'Is the #get() method octave-relative (pentatonic)?': {
    topic: function(){
      return teoria.note('Bb3').scale('majorpentatonic');
    },
    
    'Gets notes w/in octave': function(topic){
      assert.deepEqual(topic.get(3), teoria.note('D4'));
    },

    'Gets notes above octave': function(topic){
      assert.deepEqual(topic.get(12), teoria.note('C6'));
    },

    'Gets notes below octave': function(topic){
      assert.deepEqual(topic.get(-12), teoria.note('D1'));
    },
  },

  'Is the #get() method octave-relative (diatonic)': {
    topic: function() {
      return teoria.note('A4').scale('major');
    },

    '0 is one note down': function(topic) {
      assert.deepEqual(topic.get(0), teoria.note('G#4'));
    },

    '7 is one seventh up': function(topic) {
      assert.deepEqual(topic.get(7), teoria.note('G#5'));
    },

    '8 is one octave up': function(topic) {
      assert.deepEqual(topic.get(8), teoria.note('A5'));
    },

    '9 is one ninth up': function(topic) {
      assert.deepEqual(topic.get(9), teoria.note('B5'));
    },

    '-5 is one seventh down': function(topic) {
      assert.deepEqual(topic.get(-5), teoria.note('B3'));
    },

    '-6 is one octave down': function(topic) {
      assert.deepEqual(topic.get(-6), teoria.note('A3'));
    },

    '-13 is two octaves down': function(topic) {
      assert.deepEqual(topic.get(-13), teoria.note('A2'));
    }
  },

  'Chord Degrees': {
    'D major': function() {
      var scale = teoria.note('D').scale('major');
      var expected = ['DM', 'Em', 'F#m', 'GM', 'AM', 'Bm', 'C#dim'];
      var actual = scale.notes().map((n, i) => scale.getTriadChord(i+1).name);
      assert.deepEqual(actual, expected);
    },

    'Bb minor': function() {
      var scale = teoria.note('Bb').scale('minor');
      var expected = ['Bbm', 'Cdim', 'DbM', 'Ebm', 'Fm', 'GbM', 'AbM'];
      var actual = scale.notes().map((n, i) => scale.getTriadChord(i + 1).name);
      assert.deepEqual(actual, expected);
    },

    'G mixolydian': function () {
      var scale = teoria.note('G').scale('mixolydian');
      var expected = ['GM', 'Am', 'Bdim', 'CM', 'Dm', 'Em', 'FM'];
      var actual = scale.notes().map((n, i) => scale.getTriadChord(i + 1).name);
      assert.deepEqual(actual, expected);
    },

    'only supports diatonic scales': function() {
      var scale = teoria.note('C').scale('minorpentatonic');
      assert.throws(() => scale.getTriadChord(1), Error);
    }
  }
}).export(module);
