'use strict';

var vector = require('./vector.js');

var sharp = [-4, 7];

var intervals = {
  unison: [0, 0],
  second: [3, -5],
  third: [2, -3],
  fourth: [1, -1],
  fifth: [0, 1],
  sixth: [3, -4],
  seventh: [2, -2],
  octave: [1, 0]
};

var intervalsIndex = ['unison', 'second', 'third', 'fourth', 'fifth',
  'sixth', 'seventh', 'octave', 'ninth', 'tenth',
  'eleventh', 'twelfth', 'thirteenth', 'fourteenth',
  'fifteenth'];
var intervalFromFifth = ['second', 'sixth', 'third', 'seventh', 'fourth',
  'unison', 'fifth'];
var kAlterations = {
    perfect: ['dd', 'd', 'P', 'A', 'AA'],
    minor: ['dd', 'd', 'm', 'M', 'A', 'AA']
  };
var kStepNumber = {
  'unison': 1,
  'first': 1,
  'second': 2,
  'third': 3,
  'fourth': 4,
  'fifth': 5,
  'sixth': 6,
  'seventh': 7,
  'octave': 8,
  'ninth': 9,
  'eleventh': 11,
  'thirteenth': 13
};

function TeoriaInterval(coord) {
  this.coord = coord;
}

/**
* Returns the interval between two instances of teoria.note
*/
TeoriaInterval.between = function(from, to) {
  return new TeoriaInterval(vector.sub(to.coord, from.coord));
}

TeoriaInterval.invert = function(sInterval) {
  return TeoriaInterval.fromString(sInterval).invert().toString();
}

TeoriaInterval.fromString = function(simple) {
  var pattern = /^(AA|A|P|M|m|d|dd)(-?\d+)$/
    , parser, number, coord, quality, lower, octaves, base, type, alt, down;

  parser = simple.match(pattern);
  if (!parser)
    throw new Error('Invalid simple format interval');

  quality = parser[1];
  number = +parser[2];
  down = number < 0;
  number = down ? -number : number;

  lower = number > 8 ? ((number % 7) ? number % 7 : 7) : number;
  octaves = (number - lower) / 7;

  base = intervals[intervalsIndex[lower - 1]];
  coord = vector.add(base, [octaves, 0]);

  type = base[0] <= 1 ? 'perfect' : 'minor';
  if ((type === 'perfect' && (quality === 'M' || quality === 'm')) ||
      (type === 'minor' && quality === 'P')) {
    throw new Error('Invalid interval quality');
  }

  alt = kAlterations[type].indexOf(quality) - 2;
  coord = vector.add(coord, vector.mul(sharp, alt));
  coord = down ? vector.mul(coord, -1) : coord;

  return new TeoriaInterval(coord);
}

TeoriaInterval.prototype = {
  name: function() {
    return intervalsIndex[this.number() - 1];
  },

  semitones: function() {
    return vector.sum(vector.mul(this.coord, [12, 7]));
  },

  number: function() {
    return Math.abs(this.value());
  },

  value: function() {
    var without = vector.sub(this.coord,
      vector.mul(sharp, Math.floor((this.coord[1] - 2) / 7) + 1))

    var i = intervalFromFifth[without[1] + 5];
    var val = kStepNumber[i] + (without[0] - intervals[i][0]) * 7;

    return (val > 0) ? val : val - 2;
  },

  type: function() {
    return intervals[this.base()][0] <= 1 ? 'perfect' : 'minor';
  },

  base: function() {
    var fifth = vector.sub(this.coord, vector.mul(sharp, this.qualityValue()))[1], name;
    fifth = this.value() > 0 ? fifth + 5 : -(fifth - 5) % 7;
    fifth = fifth < 0 ? intervalFromFifth.length + fifth : fifth;

    name = intervalFromFifth[fifth];
    if (name === 'unison' && this.number() >= 8)
      name = 'octave';

    return name;
  },

  direction: function(dir) {
    if (dir) {
      var is = this.value() >= 1 ? 'up' : 'down';
      if (is !== dir)
        this.coord = vector.mul(this.coord, -1);

      return this;
    }
    else
      return this.value() >= 1 ? 'up' : 'down';
  },

  simple: function(ignore) {
    // Get the (upwards) base interval (with quality)
    var simple = intervals[this.base()];
    simple = vector.add(simple, vector.mul(sharp, this.qualityValue()));

    // Turn it around if necessary
    if (!ignore)
      simple = this.direction() === 'down' ? vector.mul(simple, -1) : simple;

    return new TeoriaInterval(simple);
  },

  isCompound: function() {
    return this.number() > 8;
  },

  octaves: function() {
    var without, octaves;

    if (this.direction() === 'up') {
      without = vector.sub(this.coord, vector.mul(sharp, this.qualityValue()));
      octaves = without[0] - intervals[this.base()][0];
    } else {
      without = vector.sub(this.coord, vector.mul(sharp, -this.qualityValue()));
      octaves = -(without[0] + intervals[this.base()][0]);
    }

    return octaves;
  },

  invert: function() {
    var i = this.base();
    var qual = this.qualityValue();
    var acc = this.type() === 'minor' ? -(qual - 1) : -qual;
    var coord = intervals[intervalsIndex[9 - kStepNumber[i] - 1]];
    coord = vector.add(coord, vector.mul(sharp, acc));

    return new TeoriaInterval(coord);
  },

  quality: function(lng) {
    var quality = kAlterations[this.type()][this.qualityValue() + 2];

    return lng ? kQualityLong[quality] : quality;
  },

  qualityValue: function() {
    if (this.direction() === 'down')
      return Math.floor((-this.coord[1] - 2) / 7) + 1;
    else
      return Math.floor((this.coord[1] - 2) / 7) + 1;
  },

  equal: function(interval) {
      return this.coord[0] === interval.coord[0] &&
          this.coord[1] === interval.coord[1];
  },

  greater: function(interval) {
    var semi = this.semitones();
    var isemi = interval.semitones();

    // If equal in absolute size, measure which interval is bigger
    // For example P4 is bigger than A3
    return (semi === isemi) ?
      (this.number() > interval.number()) : (semi > isemi);
  },

  smaller: function(interval) {
    return !this.equal(interval) && !this.greater(interval);
  },

  add: function(interval) {
    return new TeoriaInterval(vector.add(this.coord, interval.coord));
  },

  toString: function(ignore) {
    // If given true, return the positive value
    var number = ignore ? this.number() : this.value();

    return this.quality() + number;
  }
};

module.exports = TeoriaInterval;
