var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../dist/teoria.js');

vows.describe('Progressions').addBatch({
  'Progression parser': {
    'C Major': function() {
      var scale = teoria.scale('c3', 'ionian'),
          twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.deepEqual(twoFiveOne.simple(), [['d3', 'f3', 'a3'], ['g3', 'b3', 'd4'], ['c3', 'e3', 'g3']]);
    },
    'A Minor': function() {
      var scale = teoria.scale('a3', 'aeolian'),
          twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.deepEqual(twoFiveOne.simple(), [['b3', 'd4', 'f4'], ['e4', 'g4', 'b4'], ['a3', 'c4', 'e4']]);
    },
    'Db Major': function() {
      var scale = teoria.scale('db3', 'ionian'),
          twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.deepEqual(twoFiveOne.simple(), [['eb3', 'gb3', 'bb3'], ['ab3', 'c4', 'eb4'], ['db3', 'f3', 'ab3']]);
    }
  },
  'Creates chords with correct root': {
    'First chord': function() {
      var scale = teoria.scale('c4', 'major'),
          twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.equal(twoFiveOne.getChord(0).root.toString(), 'd4');
    },
    'Second chord': function() {
      var scale = teoria.scale('c4', 'major'),
          twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.equal(twoFiveOne.getChord(1).root.toString(), 'g4');
    },
    'Third chord': function() {
      var scale = teoria.scale('c4', 'major'),
          twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.equal(twoFiveOne.getChord(2).root.toString(), 'c4');
    }
  },
  'Creates chords with correct symbol': {
    'First chord': function() {
      var scale = teoria.scale('c4', 'major'),
        twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.equal(twoFiveOne.getChord(0).toString(), 'Dmin');
    },
    'Second chord': function() {
      var scale = teoria.scale('c4', 'major'),
        twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.equal(twoFiveOne.getChord(1).toString(), 'GM');
    },
    'Third chord': function() {
      var scale = teoria.scale('c4', 'major'),
        twoFiveOne = teoria.progression(scale, [2, 5, 1]);

      assert.equal(twoFiveOne.getChord(2).toString(), 'CM');
    }
  }
}).export(module);
