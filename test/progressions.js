var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../dist/teoria.js');

// Utility function
function simpleArray(chord) {
    return chord.notes().map(function(n) { return n.toString(true); });
}

vows.describe('Progressions').addBatch({
    'Progression parser': {
        'C Major': function() {
            var scale = teoria.scale('c3', 'ionian'),
                twoFiveOne = teoria.progression(scale, [2,5,1]);

            assert.deepEqual(twoFiveOne.simple(), [['d3','f3','a3'],['g3','b3','d3'],['c3','e3','g3']]);
        },
        'A Minor': function() {
            var scale = teoria.scale('a3', 'aeolian'),
                twoFiveOne = teoria.progression(scale, [2,5,1]);

            assert.deepEqual(twoFiveOne.simple(), [['b3','d4','f4'],['e4','g4','b3'],['a3','c4','e4']]);
        },
        'Db Major': function() {
            var scale = teoria.scale('db3', 'ionian'),
                twoFiveOne = teoria.progression(scale, [2,5,1]);

            assert.deepEqual(twoFiveOne.simple(), [['eb3','gb3','bb3'],['ab3','c4','eb3'],['db3','f3','ab3']]);
        }
    }
}).export(module);
