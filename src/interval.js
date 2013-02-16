function TeoriaInterval(intervalNum, quality, direction) {
  var simple = (intervalNum >= 8 && intervalNum % 7 === 1) ?
        intervalNum % 7 * 8 : ((intervalNum - 1) % 7) + 1;
  var compoundOctaves = Math.ceil((intervalNum - simple) / 8);
  var simpleIntervalType = kIntervals[simple - 1];


  if (!(quality in kValidQualities[simpleIntervalType.quality])) {
    throw new Error('Invalid interval quality');
  }

  this.interval = intervalNum;
  this.quality = quality;
  this.direction = direction === 'down' ? 'down' : 'up';
  this.simpleInterval = simple;
  this.simpleIntervalType = simpleIntervalType;
  this.compoundOctaves = compoundOctaves;
}

TeoriaInterval.prototype = {
  semitones: function() {
    return this.simpleIntervalType.size + this.qualityValue() +
            this.compoundOctaves * 12;
  },

  simple: function() {
    return kQualityTemp[this.quality] + this.simpleInterval.toString();
  },

  compound: function() {
    return kQualityTemp[this.quality] +
      (this.simpleInterval + this.compoundOctaves * 7).toString();
  },

  isCompound: function() {
    return this.compoundOctaves > 0;
  },

  invert: function() {
    var intervalNumber = this.simpleInterval;

    intervalNumber = 9 - intervalNumber;

    return new TeoriaInterval(intervalNumber,
                              kQualityInversion[this.quality]);
  },

  qualityValue: function() {
    var defQuality = this.simpleIntervalType.quality, quality = this.quality;

    return kValidQualities[defQuality][quality];
  },

  equal: function(interval) {
    return this.interval === interval.interval &&
           this.quality === interval.quality;
  },

  greater: function(interval) {
    var thisSemitones = this.semitones();
    var thatSemitones = interval.semitones();

    // If equal in absolute size, measure which interval is bigger
    // For example P4 is bigger than A3
    return (thisSemitones === thatSemitones) ?
      (this.interval > interval.interval) : (thisSemitones > thatSemitones);
  },

  smaller: function(interval) {
    return !this.equal(interval) && !this.greater(interval);
  },

  toString: function() {
    return this.compound();
  }
};

