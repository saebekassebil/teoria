function TeoriaNote(coord, duration) {
  duration = duration || {};

  this.duration = { value: duration.value || 4, dots: duration.dots || 0 };
  this.coord = coord;
}

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
    var value = (sum(mul(this.coord, [12, 7])) - 3) % 12;

    return (value < 0) ? value + 12 : value;
  },

  /**
   * Sugar function for teoria.scale(note, scale)
   */
  scale: function(scale) {
    return teoria.scale(this, scale);
  },

  /**
   * Sugar function for teoria.interval(note, interval)
   */
  interval: function(interval) {
    return teoria.interval(this, interval);
  },

  /**
   * Transposes the note, returned by TeoriaNote#interval
   */
  transpose: function(interval) {
    var note = teoria.interval(this, interval);
    this.coord = note.coord;

    return this;
  },

  /**
   * Returns a TeoriaChord object with this note as root
   */
  chord: function(chord) {
    chord = (chord in kChordShort) ? kChordShort[chord] : chord;

    return new TeoriaChord(this, chord);
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
        note.coord = add(note.coord, mul(sharp, diff - acc));
        return true;
      }
    });
  },

  solfege: function(scale, showOctaves) {
    if (!(scale instanceof TeoriaScale)) {
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
      var coord = teoria.interval(current).coord;
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

