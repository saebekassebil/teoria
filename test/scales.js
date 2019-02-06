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
    },

    'Get First Mode' : function(note) {
      assert.deepEqual(teoria.note('c4').scale('ionian').mode(1).simple(), 
        ['c', 'd', 'e', 'f', 'g', 'a', 'b']);
    },

    'Get Third Mode' : function(note) {
      assert.deepEqual(teoria.note('c4').scale('ionian').mode(3).simple(), 
        ['e', 'f', 'g', 'a', 'b', 'c', 'd']);
    }
  }
}).export(module);
