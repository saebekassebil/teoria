'use strict';

var vector = require('./vector.js');
var Interval = require('./interval.js');

  // Adjusted Shearer syllables - Chromatic solfege system
  // Some intervals are not provided for. These include:
  // dd2 - Doubly diminished second
  // dd3 - Doubly diminished third
  // AA3 - Doubly augmented third
  // dd6 - Doubly diminished sixth
  // dd7 - Doubly diminished seventh
  // AA7 - Doubly augmented seventh
  var kIntervalSolfege = {
    'dd1': 'daw',
    'd1': 'de',
    'P1': 'do',
    'A1': 'di',
    'AA1': 'dai',
    'd2': 'raw',
    'm2': 'ra',
    'M2': 're',
    'A2': 'ri',
    'AA2': 'rai',
    'd3': 'maw',
    'm3': 'me',
    'M3': 'mi',
    'A3': 'mai',
    'dd4': 'faw',
    'd4': 'fe',
    'P4': 'fa',
    'A4': 'fi',
    'AA4': 'fai',
    'dd5': 'saw',
    'd5': 'se',
    'P5': 'so',
    'A5': 'si',
    'AA5': 'sai',
    'd6': 'law',
    'm6': 'le',
    'M6': 'la',
    'A6': 'li',
    'AA6': 'lai',
    'd7': 'taw',
    'm7': 'te',
    'M7': 'ti',
    'A7': 'tai',
    'dd8': 'daw',
    'd8': 'de',
    'P8': 'do',
    'A8': 'di',
    'AA8': 'dai'
  };


// Note coordinates [octave, fifth] relative to C
var notes = {
  c: [0, 0],
  d: [-1, 2],
  e: [-2, 4],
  f: [1, -1],
  g: [0, 1],
  a: [-1, 3],
  b: [-2, 5],
  h: [-2, 5]
};
var sharp = [-4, 7];
var accidentals = ['bb', 'b', '', '#', 'x'];
var A4 = vector.add(notes.a, [4, 0]);
// linaer index to fifth = (2 * index + 1) % 7
var fifths = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];

function pad(str, ch, len) {
  for (; len > 0; len--) { str += ch; }
  return str;
}

function TeoriaNote(coord, duration) {
  duration = duration || {};

  this.duration = { value: duration.value || 4, dots: duration.dots || 0 };
  this.coord = coord;
}

TeoriaNote.build = function(name, duration) {
  if (typeof name === 'string')
    return TeoriaNote.fromString(name, duration);
  else
    return new TeoriaNote(name, duration);
};

/**
* Returns the note from a given note (from), with a given interval (to)
*/
TeoriaNote.transpose = function(from, to) {
  return new TeoriaNote(vector.add(from.coord, to.coord));
}

TeoriaNote.fromKey = function(key) {
  var octave = Math.floor((key - 4) / 12);
  var distance = key - (octave * 12) - 4;
  var name = fifths[(2 * Math.round(distance / 2) + 1) % 7];
  var note = vector.add(vector.sub(notes[name], A4), [octave + 1, 0]);
  var diff = (key - 49) - vector.sum(vector.mul(note, [12, 7]));

  return new TeoriaNote(diff ? vector.add(note, vector.mul(sharp, diff)) : note);
};

TeoriaNote.fromFrequency = function(fq, concertPitch) {
  var key, cents, originalFq;
  concertPitch = concertPitch || 440;

  key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
  key = Math.round(key);
  originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
  cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

  return { note: TeoriaNote.fromKey(key), cents: cents };
};

TeoriaNote.fromMIDI = function(note) {
  return TeoriaNote.fromKey(note - 20);
};

TeoriaNote.fromString = function(name, dur) {
  var scientific = /^([a-h])(x|#|bb|b?)(-?\d*)/i
    , helmholtz = /^([a-h])(x|#|bb|b?)([,\']*)$/i
    , parser, noteName, octave, accidental, note, lower;

  // Try scientific notation first
  parser = name.match(scientific);
  if (parser && name === parser[0] && parser[3].length) {
    noteName = parser[1];
    octave = +parser[3];
  } else {
    name = name.replace(/\u2032/g, "'").replace(/\u0375/g, ',');

    parser = name.match(helmholtz);
    if (!parser || name !== parser[0])
      throw new Error('Invalid note format');

    noteName = parser[1];
    octave = parser[3];
    lower = noteName === noteName.toLowerCase();

    if (!octave.length)
      octave = lower ? 3 : 2;
    else if (octave.match(/^'+$/) && lower)
      octave = 3 + octave.length;
    else if (octave.match(/^,+$/) && !lower)
      octave = 2 - octave.length;
    else
      throw new Error('Format must respect the Helmholtz format');
  }

  accidental = parser[2].length ? parser[2].toLowerCase() : '';
  noteName = noteName.toLowerCase();

  note = [notes[noteName][0], notes[noteName][1]];
  note = vector.add(note, [octave, 0]);
  note = vector.add(note, vector.mul(sharp, accidentals.indexOf(accidental) - 2));

  return new TeoriaNote(vector.sub(note, A4), dur);
};

TeoriaNote.prototype = {
  octave: function() {
    return this.coord[0] + A4[0] - notes[this.name()][0] +
      this.accidentalValue() * 4;
  },

  name: function() {
    return fifths[this.coord[1] + A4[1] - this.accidentalValue() * 7 + 1];
  },

  accidentalValue: function() {
    return Math.round((this.coord[1] + A4[1] - 2) / 7);
  },

  accidental: function() {
    return accidentals[this.accidentalValue() + 2];
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
    concertPitch = concertPitch || 440;

    return concertPitch *
      Math.pow(2, (this.coord[0] * 12 + this.coord[1] * 7) / 12);
  },

  /**
   * Returns the pitch class index (chroma) of the note
   */
  chroma: function() {
    var value = (vector.sum(vector.mul(this.coord, [12, 7])) - 3) % 12;

    return (value < 0) ? value + 12 : value;
  },

  /**
   * Sugar function for teoria.interval(note, interval)
   */
  interval: function(to) {
    if(to instanceof TeoriaNote) return this.between(to);

    if(!(to instanceof Interval)) {
      to = Interval.fromString(to);
    }
    return new TeoriaNote(vector.add(this.coord, to.coord));
  },

  between: function(to) {
    return new Interval(vector.sub(to.coord, this.coord));
  },

  /**
   * Transposes the note, returned by TeoriaNote#interval
   */
  transpose: function(interval) {
    var note = this.interval(interval);
    this.coord = note.coord;
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
        note.coord = vector.add(note.coord, vector.mul(sharp, diff - acc));
        return true;
      }
    });
  },

  solfege: function(scale, showOctaves) {
    if (typeof(scale.tonic) == 'undefined') {
      throw new Error('Invalid Scale');
    }

    var interval = scale.tonic.interval(this), solfege, stroke, count;
    if (interval.direction() === 'down')
      interval = interval.invert();

    if (showOctaves) {
      count = (this.key(true) - scale.tonic.key(true)) / 7;
      count = (count >= 0) ? Math.floor(count) : -(Math.ceil(-count));
      stroke = (count >= 0) ? '\'' : ',';
    }

    solfege = kIntervalSolfege[interval.simple(true).toString()];
    return (showOctaves) ? pad(solfege, stroke, Math.abs(count)) : solfege;
  },

  /**
   * Returns the name of the duration value,
   * such as 'whole', 'quarter', 'sixteenth' etc.
   */
  durationName: function() {
    return kDurations[this.duration.value];
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
   * Returns the degree of this note in a given scale
   * If the scale doesn't contain this note, the scale degree
   * will be returned as 0 allowing for expressions such as:
   * if (teoria.note('a').scaleDegree(teoria.scale('a', 'major'))) {
   *   ...
   * }
   *
   * as 0 evaluates to false in boolean context
   **/
  scaleDegree: function(scale) {
    var inter = scale.tonic.interval(this);

    // If the direction is down, or we're dealing with an octave - invert it
    if (inter.direction() === 'down' ||
       (inter.coord[1] === 0 && inter.coord[0] !== 0)) {
      inter = inter.invert();
    }

    inter = inter.simple(true).coord;

    return scale.scale.reduce(function(index, current, i) {
      var coord = Interval.fromString(current).coord;
      return coord[0] === inter[0] && coord[1] === inter[1] ? i + 1 : index;
    }, 0);
  },

  /**
   * Returns the name of the note, with an optional display of octave number
   */
  toString: function(dont) {
    return this.name() + this.accidental() + (dont ? '' : this.octave());
  }
};

module.exports = TeoriaNote;
