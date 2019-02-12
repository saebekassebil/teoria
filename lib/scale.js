var knowledge = require('./knowledge');
var Interval = require('./interval');
var Note = require('./note');

var scales = {
  [knowledge.modes.aeolian]: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  blues: ['P1', 'm3', 'P4', 'd5', 'P5', 'm7'],
  chromatic: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4',
    'A4', 'P5', 'm6', 'M6', 'm7', 'M7'],
  [knowledge.modes.dorian]: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
  doubleharmonic: ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'M7'],
  harmonicminor: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
  [knowledge.modes.ionian]: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  [knowledge.modes.locrian]: ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],
  [knowledge.modes.lydian]: ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
  majorpentatonic: ['P1', 'M2', 'M3', 'P5', 'M6'],
  melodicminor: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
  minorpentatonic: ['P1', 'm3', 'P4', 'P5', 'm7'],
  [knowledge.modes.mixolydian]: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
  [knowledge.modes.phrygian]: ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  wholetone: ['P1', 'M2', 'M3', 'A4', 'A5', 'A6']
};
 
var orderedModes = {
  1: knowledge.modes.ionian,
  2: knowledge.modes.dorian,
  3: knowledge.modes.phrygian,
  4: knowledge.modes.lydian,
  5: knowledge.modes.mixolydian,
  6: knowledge.modes.aeolian,
  7: knowledge.modes.locrian
};

// synonyms
scales.harmonicchromatic = scales.chromatic;
scales.minor = scales.aeolian;
scales.major = scales.ionian;
scales.flamenco = scales.doubleharmonic;

function Scale(tonic, scale) {
  if (!(this instanceof Scale)) return new Scale(tonic, scale);
  var scaleName, i;
  if (!('coord' in tonic)) {
    throw new Error('Invalid Tonic');
  }

  if (typeof scale === 'string') {
    scaleName = scale;
    scale = scales[scale];
    if (!scale)
      throw new Error('Invalid Scale');
  } else {
    for (i in scales) {
      if (scales.hasOwnProperty(i)) {
        if (scales[i].toString() === scale.toString()) {
          scaleName = i;
          break;
        }
      }
    }
  }

  this.name = scaleName;
  this.tonic = tonic;
  this.scale = scale;

  var modeDegree = Object.keys(orderedModes).filter(function(m) {
    return orderedModes[m] === this.name;
  }.bind(this));
 
  this.modeDegree = modeDegree && modeDegree.length ? parseInt(modeDegree[0]) : '';
  this.modeName = this.modeDegree ? orderedModes[this.modeDegree] : '';
}

Scale.prototype = {
  notes: function() {
    var notes = [];

    for (var i = 0, length = this.scale.length; i < length; i++) {
      notes.push(this.tonic.interval(this.scale[i]));
    }

    return notes;
  },

  // returns a new Scale object for the mode at the degree relative to the current scale
  mode: function(degree) {
    if (this.modeDegree) {
      if (degree % 8 > 0) {
        let shift = degree -= 1;
        shift = shift % 8;

        let newModeDegree = this.modeDegree + shift;
        
        return new Note.fromString(this.simple()[shift]).scale(orderedModes[newModeDegree]);
      }

      // treat a degree < 0 as a subtraction, i.e. ionian -1 = locrian
       else if (degree < 0) {
        let negativeShift = degree % -8;
        let newDegree = negativeShift !== 0 ? 8 + negativeShift : 1;

        let newModeDegree = this.modeDegree + negativeShift;
        newModeDegree = newModeDegree === 0 ? 7 : newModeDegree;

        return new Note.fromString(this.simple()[newDegree - 1]).scale(orderedModes[newModeDegree]);
      }

      else {
        // return new instance of this same scale/mode
        return new Note.fromString(this.simple()[0]).scale(orderedModes[this.modeDegree]);
      }
    }
 
    return 'Scale does not support Modes';
  },

  simple: function() {
    return this.notes().map(function(n) { return n.toString(true); });
  },

  type: function() {
    var length = this.scale.length - 2;
    if (length < 8) {
      return ['di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa'][length] +
        'tonic';
    }
  },

  get: function(i) {
    var isStepStr = typeof i === 'string' && i in knowledge.stepNumber;
    i = isStepStr ? knowledge.stepNumber[i] : i;
    var len = this.scale.length;
    var interval, octaves;

    if (i < 0) {
      interval = this.scale[i % len + len - 1];
      octaves = Math.floor((i - 1) / len);
    } else if (i % len === 0) {
      interval = this.scale[len - 1];
      octaves = (i / len) - 1;
    } else {
      interval = this.scale[i % len - 1];
      octaves = Math.floor(i / len);
    }

    return this.tonic.interval(interval).interval(new Interval([octaves, 0]));
  },

  solfege: function(index, showOctaves) {
    if (index)
      return this.get(index).solfege(this, showOctaves);

    return this.notes().map(function(n) {
      return n.solfege(this, showOctaves);
    });
  },

  interval: function(interval) {
    interval = (typeof interval === 'string') ?
      Interval.toCoord(interval) : interval;
    return new Scale(this.tonic.interval(interval), this.scale);
  },

  transpose: function(interval) {
    var scale = this.interval(interval);
    this.scale = scale.scale;
    this.tonic = scale.tonic;

    return this;
  }
};
Scale.KNOWN_SCALES = Object.keys(scales);

module.exports = Scale;
