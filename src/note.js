/**
 * TeoriaNote - teoria.note - the note object
 *
 * This object is the representation of a note.
 * The constructor must be called with a name,
 * and optionally a duration argument.
 * The first parameter (name) can be specified in either
 * scientific notation (name+accidentals+octave). Fx:
 *    A4 - Cb3 - D#8 - Hbb - etc.
 * Or in the Helmholtz notation:
 *    C,, - f#'' - d - Eb - etc.
 * The second argument must be an object literal, with a
 * 'value' property and/or a 'dots' property. By default,
 * the duration value is 4 (quarter note) and dots is 0.
 */
function TeoriaNote(name, duration) {
  if (typeof name !== 'string') {
    return null;
  }

  duration = duration || {};

  this.name = name;
  this.duration = {value: duration.value || 4, dots: duration.dots || 0};
  this.accidental = {value: 0, sign: ''};
  var scientific = /^([a-h])(x|#|bb|b?)(-?\d*)/i;
  var helmholtz = /^([a-h])(x|#|bb|b?)([,\']*)$/i;
  var accidentalSign, accidentalValue, noteName, octave;

  // Start trying to parse scientific notation
  var parser = name.match(scientific);
  if (parser && name === parser[0] && parser[3].length !== 0) { // Scientific
    noteName = parser[1].toLowerCase();
    octave = parseInt(parser[3], 10);

    if (parser[2].length > 0) {
      accidentalSign = parser[2].toLowerCase();
      accidentalValue = kAccidentalValue[parser[2]];
    }
  } else { // Helmholtz Notation
    name = name.replace(/\u2032/g, "'").replace(/\u0375/g, ',');

    parser = name.match(helmholtz);
    if (!parser || name !== parser[0]) {
      throw new Error('Invalid note format');
    }

    noteName = parser[1];
    octave = parser[3];
    if (parser[2].length > 0) {
      accidentalSign = parser[2].toLowerCase();
      accidentalValue = kAccidentalValue[parser[2]];
    }

    if (octave.length === 0) { // no octave symbols
      octave = (noteName === noteName.toLowerCase()) ? 3 : 2;
    } else {
      if (octave.match(/^'+$/)) {
        if (noteName === noteName.toUpperCase()) { // If upper-case
          throw new Error('Format must respect the Helmholtz notation');
        }

        octave = 3 + octave.length;
      } else if (octave.match(/^,+$/)) {
        if (noteName === noteName.toLowerCase()) { // If lower-case
          throw new Error('Format must respect the Helmholtz notation');
        }

        octave = 2 - octave.length;
      } else {
        throw new Error('Invalid characters after note name.');
      }
    }
  }

  this.name = noteName.toLowerCase();
  this.octave = octave;

  if (accidentalSign) {
    this.accidental.value = accidentalValue;
    this.accidental.sign = accidentalSign;
  }
}

TeoriaNote.prototype = {
  /**
   * Returns the key number of the note
   */
  key: function(whitenotes) {
    var noteValue;
    if (whitenotes) {
      noteValue = Math.ceil(kNotes[this.name].distance / 2);
      return (this.octave - 1) * 7 + 3 + noteValue;
    } else {
      noteValue = kNotes[this.name].distance + this.accidental.value;
      return (this.octave - 1) * 12 + 4 + noteValue;
    }
  },

  /**
   * Calculates and returns the frequency of the note.
   * Optional concert pitch (def. 440)
   */
  fq: function(concertPitch) {
    concertPitch = concertPitch || 440;

    return concertPitch * Math.pow(2, (this.key() - 49) / 12);
  },
  
  /**
   * Returns tone quality of the note. 
   * An integer between 0 and 11 (C-B)
   */
  tone: function() {
    return kNotes[this.name].distance + this.accidental.value;
  },    

  /**
   * Returns the pitch class index (chroma) of the note
   */
  chroma: function() {
    var value = (kNotes[this.name].distance + this.accidental.value) % 12;
    return (value < 0) ? value + 12 : value;
  },

  /**
   * Sugar function for teoria.scale(note, scale)
   */
  scale: function(scale) {
    return teoria.scale(this, scale);
  },

  /**
   * Sugar function for teoria.interval(note, interval[, direction])
   */
  interval: function(interval, direction) {
    return teoria.interval(this, interval, direction);
  },

  /**
   * Transposes the note, returned by TeoriaNote#interval
   */
  transpose: function(interval, direction) {
    var note = teoria.interval(this, interval, direction);
    this.name = note.name;
    this.octave = note.octave;
    this.accidental = note.accidental;

    return this;
  },

  /**
   * Returns a TeoriaChord object with this note as root
   */
  chord: function(chord) {
    chord = chord || 'major';
    if (chord in kChordShort) {
      chord = kChordShort[chord];
    }

    return new TeoriaChord(this, chord);
  },

  /**
   * Returns the Helmholtz notation form of the note (fx C,, d' F# g#'')
   */
  helmholtz: function() {
    var name = (this.octave < 3) ? this.name.toUpperCase() :
                                   this.name.toLowerCase();
    var paddingChar = (this.octave < 3) ? ',' : '\'';
    var paddingCount = (this.octave < 2) ? 2 - this.octave : this.octave - 3;

    return pad(name + this.accidental.sign, paddingChar, paddingCount);
  },

  /**
   * Returns the scientific notation form of the note (fx E4, Bb3, C#7 etc.)
   */
  scientific: function() {
    return this.name.toUpperCase() + this.accidental.sign + this.octave;
  },

  /**
   * Returns notes that are enharmonic with this note.
   */
  enharmonics: function() {
    var enharmonics = [], key = this.key(),
    upper = this.interval('m2', 'up'), lower = this.interval('m2', 'down');
    var upperKey = upper.key() - upper.accidental.value;
    var lowerKey = lower.key() - lower.accidental.value;
    var diff = key - upperKey;
    if (diff < 3 && diff > -3) {
      upper.accidental = {value: diff, sign: kAccidentalSign[diff]};
      enharmonics.push(upper);
    }

    diff = key - lowerKey;
    if (diff < 3 && diff > -3) {
      lower.accidental = {value: diff, sign: kAccidentalSign[diff]};
      enharmonics.push(lower);
    }

    return enharmonics;
  },

  solfege: function(scale, showOctaves) {
    if (!(scale instanceof TeoriaScale)) {
      throw new Error('Invalid Scale');
    }

    var interval = scale.tonic.interval(this), solfege, stroke, count;
    if (interval.direction === 'down') {
      interval = interval.invert();
    }

    if (showOctaves) {
      count = (this.key(true) - scale.tonic.key(true)) / 7;
      count = (count >= 0) ? Math.floor(count) : -(Math.ceil(-count));
      stroke = (count >= 0) ? '\'' : ',';
    }

    solfege = kIntervalSolfege[interval.simple()];
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
    var interval = scale.tonic.interval(this);
    interval = (interval.direction === 'down' ||
                interval.simpleInterval === 8) ? interval.invert() : interval;

    return scale.scale.indexOf(interval.simple()) + 1;
  },

  /**
   * Returns the name of the note, with an optional display of octave number
   */
  toString: function(dontShow) {
    var octave = dontShow ? '' : this.octave;
    return this.name.toLowerCase() + this.accidental.sign + octave;
  }
};

