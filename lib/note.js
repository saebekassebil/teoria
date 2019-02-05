var scientific = require('scientific-notation');
var helmholtz = require('helmholtz');
var pitchFq = require('pitch-fq');
var knowledge = require('./knowledge');
var vector = require('./vector');
var Interval = require('./interval');

function pad(str, ch, len) {
  for (; len > 0; len--) {
    str += ch;
  }

  return str;
}


function Note(coord, duration) {
  if (!(this instanceof Note)) return new Note(coord, duration);
  duration = duration || {};

  this.duration = { value: duration.value || 4, dots: duration.dots || 0 };
  this.coord = coord;
}

Note.prototype = {
  octave: function() {
    return this.coord[0] + knowledge.A4[0] - knowledge.notes[this.name()][0] +
      this.accidentalValue() * 4;
  },

  name: function() {
    var value = this.accidentalValue();
    var idx = this.coord[1] + knowledge.A4[1] - value * 7 + 1;
    return knowledge.fifths[idx];
  },

  accidentalValue: function() {
    return Math.round((this.coord[1] + knowledge.A4[1] - 2) / 7);
  },

  accidental: function() {
    return knowledge.accidentals[this.accidentalValue() + 2];
  },

  /**
   * Returns the key number of the note
   */
  key: function(white) {
    if (white)
      return this.coord[0] * 7 + this.coord[1] * 4 + 29;
    else
      return this.coord[0] * 12 + this.coord[1] * 7 + 49;
  },

  /**
  * Returns a number ranging from 0-127 representing a MIDI note value
  */
  midi: function() {
    return this.key() + 20;
  },

  /**
   * Calculates and returns the frequency of the note.
   * Optional concert pitch (def. 440)
   */
  fq: function(concertPitch) {
    return pitchFq(this.coord, concertPitch);
  },

  /**
   * Returns the pitch class index (chroma) of the note
   */
  chroma: function() {
    var value = (vector.sum(vector.mul(this.coord, [12, 7])) - 3) % 12;

    return (value < 0) ? value + 12 : value;
  },

  interval: function(interval) {
    if (typeof interval === 'string') interval = Interval.toCoord(interval);

    if (interval instanceof Interval)
      return new Note(vector.add(this.coord, interval.coord), this.duration);
    else if (interval instanceof Note)
      return new Interval(vector.sub(interval.coord, this.coord));
  },

  transpose: function(interval) {
    this.coord = vector.add(this.coord, interval.coord);
    return this;
  },

  /**
   * Returns the Helmholtz notation form of the note (fx C,, d' F# g#'')
   */
  helmholtz: function() {
    var octave = this.octave();
    var name = this.name();
    name = octave < 3 ? name.toUpperCase() : name.toLowerCase();
    var padchar = octave < 3 ? ',' : '\'';
    var padcount = octave < 2 ? 2 - octave : octave - 3;

    return pad(name + this.accidental(), padchar, padcount);
  },

  /**
   * Returns the scientific notation form of the note (fx E4, Bb3, C#7 etc.)
   */
  scientific: function() {
    return this.name().toUpperCase() + this.accidental() + this.octave();
  },

  /**
   * Returns notes that are enharmonic with this note.
   */
  enharmonics: function(oneaccidental) {
    var key = this.key(), limit = oneaccidental ? 2 : 3;

    return ['m3', 'm2', 'm-2', 'm-3']
      .map(this.interval.bind(this))
      .filter(function(note) {
      var acc = note.accidentalValue();
      var diff = key - (note.key() - acc);

      if (diff < limit && diff > -limit) {
        var product = vector.mul(knowledge.sharp, diff - acc);
        note.coord = vector.add(note.coord, product);
        return true;
      }
    });
  },

  solfege: function(scale, showOctaves) {
    var interval = scale.tonic.interval(this), solfege, stroke, count;
    if (interval.direction() === 'down')
      interval = interval.invert();

    if (showOctaves) {
      count = (this.key(true) - scale.tonic.key(true)) / 7;
      count = (count >= 0) ? Math.floor(count) : -(Math.ceil(-count));
      stroke = (count >= 0) ? '\'' : ',';
    }

    solfege = knowledge.intervalSolfege[interval.simple(true).toString()];
    return (showOctaves) ? pad(solfege, stroke, Math.abs(count)) : solfege;
  },

  scaleDegree: function(scale) {
    var inter = scale.tonic.interval(this);

    // If the direction is down, or we're dealing with an octave - invert it
    if (inter.direction() === 'down' ||
       (inter.coord[1] === 0 && inter.coord[0] !== 0)) {
      inter = inter.invert();
    }

    inter = inter.simple(true).coord;

    return scale.scale.reduce(function(index, current, i) {
      var coord = Interval.toCoord(current).coord;
      return coord[0] === inter[0] && coord[1] === inter[1] ? i + 1 : index;
    }, 0);
  },

  /**
   * Returns the name of the duration value,
   * such as 'whole', 'quarter', 'sixteenth' etc.
   */
  durationName: function() {
    return knowledge.durations[this.duration.value];
  },

  /**
   * Returns the duration of the note (including dots)
   * in seconds. The first argument is the tempo in beats
   * per minute, the second is the beat unit (i.e. the
   * lower numeral in a time signature).
   */
  durationInSeconds: function(bpm, beatUnit) {
    var secs = (60 / bpm) / (this.duration.value / 4) / (beatUnit / 4);
    return secs * 2 - secs / Math.pow(2, this.duration.dots);
  },

  /**
   * Returns the name of the note, with an optional display of octave number
   */
  toString: function(dont) {
    return this.name() + this.accidental() + (dont ? '' : this.octave());
  }
};

Note.fromString = function(name, dur) {
  var coord = scientific(name);
  if (!coord) coord = helmholtz(name);
  return new Note(coord, dur);
};

Note.fromKey = function(key) {
  var octave = Math.floor((key - 4) / 12);
  var distance = key - (octave * 12) - 4;
  var name = knowledge.fifths[(2 * Math.round(distance / 2) + 1) % 7];
  var subDiff = vector.sub(knowledge.notes[name], knowledge.A4);
  var note = vector.add(subDiff, [octave + 1, 0]);
  var diff = (key - 49) - vector.sum(vector.mul(note, [12, 7]));

  var arg = diff ? vector.add(note, vector.mul(knowledge.sharp, diff)) : note;
  return new Note(arg);
};

Note.fromFrequency = function(fq, concertPitch) {
  var key, cents, originalFq;
  concertPitch = concertPitch || 440;

  key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
  key = Math.round(key);
  originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
  cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

  return { note: Note.fromKey(key), cents: cents };
};

Note.fromMIDI = function(note) {
  return Note.fromKey(note - 20);
};

module.exports = Note;
