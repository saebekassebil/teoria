function TeoriaInterval(coord) {
  this.coord = coord;
}

TeoriaInterval.prototype = {
  name: function() {
    return intervalsIndex[this.number() - 1];
  },

  semitones: function() {
    return sum(mul(this.coord, [12, 7]));
  },

  number: function() {
    return Math.abs(this.value());
  },

  value: function() {
    var without = sub(this.coord,
      mul(sharp, Math.floor((this.coord[1] - 2) / 7) + 1))
      , i, val;

    i = intervalFromFifth[without[1] + 5];
    val = kStepNumber[i] + (without[0] - intervals[i][0]) * 7;

    return (val > 0) ? val : val - 2;
  },

  type: function() {
    return intervals[this.base()][0] <= 1 ? 'perfect' : 'minor';
  },

  base: function() {
    var fifth = sub(this.coord, mul(sharp, this.qualityValue()))[1], name;
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
        this.coord = mul(this.coord, -1);

      return this;
    }
    else
      return this.value() >= 1 ? 'up' : 'down';
  },

  simple: function(ignore) {
    // Get the (upwards) base interval (with quality)
    var simple = intervals[this.base()];
    simple = add(simple, mul(sharp, this.qualityValue()));

    // Turn it around if necessary
    if (!ignore)
      simple = this.direction() === 'down' ? mul(simple, -1) : simple;

    return new TeoriaInterval(simple);
  },

  isCompound: function() {
    return this.number() > 8;
  },

  octaves: function() {
    var without, octaves;

    if (this.direction() === 'up') {
      without = sub(this.coord, mul(sharp, this.qualityValue()));
      octaves = without[0] - intervals[this.base()][0];
    } else {
      without = sub(this.coord, mul(sharp, -this.qualityValue()));
      octaves = -(without[0] + intervals[this.base()][0]);
    }

    return octaves;
  },

  invert: function() {
    var i = this.base();
    var qual = this.qualityValue();
    var acc = this.type() === 'minor' ? -(qual - 1) : -qual;
    var coord = intervals[intervalsIndex[9 - kStepNumber[i] - 1]];
    coord = add(coord, mul(sharp, acc));

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
    return new TeoriaInterval(add(this.coord, interval.coord));
  },

  toString: function(ignore) {
    // If given true, return the positive value
    var number = ignore ? this.number() : this.value();

    return this.quality() + number;
  }
};

