var knowledge = require('./knowledge');
var vector = require('./vector');

function pad(str, ch, len) {
  for (; len > 0; len--) {
    str += ch;
  }

  return str;
}


function TeoriaNote(coord, duration) {
  duration = duration || {};

  this.duration = { value: duration.value || 4, dots: duration.dots || 0 };
  this.coord = coord;
}

TeoriaNote.prototype = {
  octave: function() {
    return this.coord[0] + knowledge.A4[0] - knowledge.notes[this.name()][0] +
      this.accidentalValue() * 4;
  },

  name: function() {
    return knowledge.fifths[this.coord[1] + knowledge.A4[1] - this.accidentalValue() * 7 + 1];
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

  interval: function(interval) {
    return new TeoriaNote(vector.add(this.coord, interval.coord));
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
        note.coord = vector.add(note.coord, vector.mul(knowledge.sharp, diff - acc));
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

    solfege = knowledge.kIntervalSolfege[interval.simple(true).toString()];
    return (showOctaves) ? pad(solfege, stroke, Math.abs(count)) : solfege;
  },

  /**
   * Returns the name of the duration value,
   * such as 'whole', 'quarter', 'sixteenth' etc.
   */
  durationName: function() {
    return knowledge.kDurations[this.duration.value];
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

  note = [knowledge.notes[noteName][0], knowledge.notes[noteName][1]];
  note = vector.add(note, [octave, 0]);
  note = vector.add(note, vector.mul(knowledge.sharp, knowledge.accidentals.indexOf(accidental) - 2));

  return new TeoriaNote(vector.sub(note, knowledge.A4), dur);
}

TeoriaNote.fromKey = function(key) {
  var octave = Math.floor((key - 4) / 12);
  var distance = key - (octave * 12) - 4;
  var name = knowledge.fifths[(2 * Math.round(distance / 2) + 1) % 7];
  var note = vector.add(vector.sub(knowledge.notes[name], knowledge.A4), [octave + 1, 0]);
  var diff = (key - 49) - vector.sum(vector.mul(note, [12, 7]));

  return new TeoriaNote(diff ? vector.add(note, vector.mul(knowledge.sharp, diff)) : note);
}

TeoriaNote.fromFrequency = function(fq, concertPitch) {
  var key, cents, originalFq;
  concertPitch = concertPitch || 440;

  key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
  key = Math.round(key);
  originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
  cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

  return { note: TeoriaNote.fromKey(key), cents: cents };
}

TeoriaNote.fromMIDI = function(note) {
  return TeoriaNote.fromKey(note - 20);
}

module.exports = TeoriaNote;
