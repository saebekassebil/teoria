var vows = require('vows'),
    assert = require('assert');

var interval = require('../lib/interval.js');

var simples = [
  "d1", "P1", "A1",
  "d2", "m2", "M2", "A2",
  "d3", "m3", "M3", "A3",
  "d4", "P4", "A4",
  "d5", "P5", "A5",
  "d6", "m6", "M6", "A6",
  "d7", "m7", "M7", "A7"
];

/* Create a list of intervals from a interval name */
function intervalFromNames(names) {
  return names.map(function(name) {
    return interval.fromString(name);
  });
}

// Apply the 'trans' function to a list of intervals.
// If 'trans' is string, call the trans interval's method
function props(names, trans) {
  return intervalFromNames(names).map(function(i) {
    return typeof(trans) == 'string' ? i[trans].apply(i) : trans(i);
  });
}

vows.describe('Intervals').addBatch({
  "fromString": function() {
    c = interval.fromString("M2");
    assert.deepEqual(c.coord, [-1, 2]);
  },
  "name": function() {
    names = props(simples, 'name');

    expected = [ 'unison', 'unison', 'unison', 'second', 'second', 'second', 'second', 'third', 'third', 'third', 'third', 'fourth', 'fourth', 'fourth', 'fifth', 'fifth', 'fifth', 'sixth', 'sixth', 'sixth', 'sixth', 'seventh', 'seventh', 'seventh', 'seventh' ];
    assert.deepEqual(names, expected);
  },
  "semitones": function() {
    semitones = props(simples, 'semitones');
    expected = [-1, 0, 1, 0, 1, 2, 3, 2, 3, 4, 5, 4, 5, 6, 6, 7, 8, 7, 8, 9, 10, 9, 10, 11, 12 ];
    assert.deepEqual(semitones, expected);
  },
  "value": function() {
    values = props(simples, 'value');
    expected = [ 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7 ];
    assert.deepEqual(values, expected);
  },
  "type": function() {
    types = props(simples, 'type');
    expected = [ 'perfect', 'perfect', 'perfect', 'minor', 'minor', 'minor', 'minor', 'minor', 'minor', 'minor', 'minor', 'perfect', 'perfect', 'perfect', 'perfect', 'perfect', 'perfect', 'minor', 'minor', 'minor', 'minor', 'minor', 'minor', 'minor', 'minor' ];
    assert.deepEqual(types, expected);
  },
  "base": function() {
    bases = props(simples, 'base');
    expected = ['unison', 'unison', 'unison', 'second', 'second', 'second', 'second', 'third', 'third', 'third', 'third', 'fourth', 'fourth', 'fourth', 'fifth', 'fifth', 'fifth', 'sixth', 'sixth', 'sixth', 'sixth', 'seventh', 'seventh', 'seventh', 'seventh'];
    assert.deepEqual(bases, expected);
  },
  "direction": function() {
    props(simples, 'direction').forEach(function(dir) {
      assert.equal(dir, 'up');
    });
  },
  "simple": function() {
    simples = props(simples, function(i) { return i.simple().toString(); });
    expected = simples;
    assert.deepEqual(simples, expected);
  },
  "isCompound": function() {
    props(simples, 'isCompound').forEach(function(c) {
      assert.equal(c, false);
    });
  },
  "octaves": function() {
    props(simples, 'octaves').forEach(function(octaves) {
      assert.equal(octaves, 0);
    });
  },
  "invert": function() {
    inversions = props(simples, function(i) {
      return i.invert().toString();
    });
    expected = ['A8', 'P8', 'd8', 'A7', 'M7', 'm7', 'd7', 'A6', 'M6', 'm6', 'd6', 'A5', 'P5', 'd5', 'A4', 'P4', 'd4', 'A3', 'M3', 'm3', 'd3', 'A2', 'M2', 'm2', 'd2'];
    assert.deepEqual(inversions,  expected);
  }
}).export(module);
