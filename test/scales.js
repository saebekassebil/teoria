var vows = require('vows'),
    assert = require('assert');

var Note = require('../lib/note.js');
var Scale = require('../lib/scale.js');

vows.describe('Scales').addBatch({
  'Ab2': {
    topic: function() {
      return Note.build('Ab2');
    },

    'Ionian/Major': function(note) {
      assert.deepEqual(new Scale(note, 'ionian').simple(),
          ['ab', 'bb', 'c', 'db', 'eb', 'f', 'g']);
    },

    'Dorian': function(note) {
      assert.deepEqual(new Scale(note, 'dorian').simple(),
          ['ab', 'bb', 'cb', 'db', 'eb', 'f', 'gb']);
    },

    'Phrygian': function(note) {
      assert.deepEqual(new Scale(note, 'phrygian').simple(),
          ["ab", "bbb", "cb", "db", "eb", "fb", "gb"]);
    },

    'Lydian': function(note) {
      assert.deepEqual(new Scale(note, 'lydian').simple(),
          ["ab", "bb", "c", "d", "eb", "f", "g"]);
    },

    'Mixolydian': function(note) {
      assert.deepEqual(new Scale(note, 'mixolydian').simple(),
          ["ab", "bb", "c", "db", "eb", "f", "gb"]);
    },

    'Aeolian/Minor': function(note) {
      assert.deepEqual(new Scale(note, 'aeolian').simple(),
          ["ab", "bb", "cb", "db", "eb", "fb", "gb"]);
    },

    'Locrian': function(note) {
      assert.deepEqual(new Scale(note, 'locrian').simple(),
          ["ab", "bbb", "cb", "db", "ebb", "fb", "gb"]);
    },

    'Major Pentatonic': function(note) {
      assert.deepEqual(new Scale(note, 'majorpentatonic').simple(),
          ["ab", "bb", "c", "eb", "f"]);
    },

    'Minor Pentatonic': function(note) {
      assert.deepEqual(new Scale(note, 'minorpentatonic').simple(),
          ["ab", "cb", "db", "eb", "gb"]);
    },

    'Chromatic': function(note) {
      assert.deepEqual(new Scale(note, 'chromatic').simple(),
          ["ab", "bbb", "bb", "cb", "c", "db",
           "d", "eb", "fb", "f", "gb", "g"]);
    }
  }
}).export(module);
