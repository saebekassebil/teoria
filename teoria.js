/**
 * Teoria.js - Music Theory for JavaScript
 *
 * Jakob Miland - Copyleft 2011
 **/
var scope = (typeof exports === 'object') ? exports : window;
(function teoriaClosure(globalScope) {
  'use strict';

  var teoria = {};

  var kNotes = {
    'c': {
      name: 'c',
      distance: 0,
      index: 0
    },
    'd': {
      name: 'd',
      distance: 2,
      index: 1
    },
    'e': {
      name: 'e',
      distance: 4,
      index: 2
    },
    'f': {
      name: 'f',
      distance: 5,
      index: 3
    },
    'g': {
      name: 'g',
      distance: 7,
      index: 4
    },
    'a': {
      name: 'a',
      distance: 9,
      index: 5
    },
    'b': {
      name: 'b',
      distance: 11,
      index: 6
    },
    'h': {
      name: 'h',
      distance: 11,
      index: 6
    }
  };

  var kNoteIndex = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

  var kDurations = {
    '0.25': 'longa',
    '0.5': 'breve',
    '1': 'whole',
    '2': 'half',
    '4': 'quarter',
    '8': 'eighth',
    '16': 'sixteenth',
    '32': 'thirty-second',
    '64': 'sixty-fourth',
    '128': 'hundred-twenty-eighth'
  };

  var kIntervals = [{
    name: 'first',
    quality: 'perfect',
    size: 0
  }, {
    name: 'second',
    quality: 'minor',
    size: 1
  }, {
    name: 'third',
    quality: 'minor',
    size: 3
  }, {
    name: 'fourth',
    quality: 'perfect',
    size: 5
  }, {
    name: 'fifth',
    quality: 'perfect',
    size: 7
  }, {
    name: 'sixth',
    quality: 'minor',
    size: 8
  }, {
    name: 'seventh',
    quality: 'minor',
    size: 10
  }, {
    name: 'octave',
    quality: 'perfect',
    size: 12
  }];

  var kIntervalIndex = {
    'first': 0, 'second': 1, 'third': 2, 'fourth': 3,
    'fifth': 4, 'sixth': 5, 'seventh': 6, 'octave': 7,
    'ninth': 8, 'tenth': 9, 'eleventh': 10, 'twelfth': 11,
    'thirteenth': 12, 'fourteenth': 13, 'fifteenth': 14
  };

  var kQualityLong = {
    'P': 'perfect',
    'M': 'major',
    'm': 'minor',
    'A': 'augmented',
    'AA': 'doubly augmented',
    'd': 'diminished',
    'dd': 'doubly diminished',

    'aug': 'augmented',
    'dim': 'diminished'
  };

  var kQualityTemp = {
    'perfect': 'P',
    'major': 'M',
    'minor': 'm',
    'augmented': 'A',
    'doubly augmented': 'AA',
    'diminished': 'd',
    'doubly diminished': 'dd'
  };

  var kValidQualities = {
    perfect: {
      'doubly diminished': -2,
      diminished: -1,
      perfect: 0,
      augmented: 1,
      'doubly augmented': 2
    },

    minor: {
      'doubly diminished': -2,
      diminished: -1,
      minor: 0,
      major: 1,
      augmented: 2,
      'doubly augmented': 3
    }
  };

  var kQualityInversion = {
    'perfect': 'perfect',
    'major': 'minor',
    'minor': 'major',
    'augmented': 'diminished',
    'doubly augmented': 'doubly diminished',
    'diminished': 'augmented',
    'doubly diminished': 'doubly augmented'
  };

  var kAlterations = {
    perfect: ['doubly diminished', 'diminished', 'perfect',
              'augmented', 'doubly augmented'],

    minor: ['doubly diminished', 'diminished', 'minor',
            'major', 'augmented', 'doubly augmented']
  };

  var kChords = {
    'major': ['M3', 'P5'],
    'minor': ['m3', 'P5'],
    'augmented': ['M3', 'A5'],
    'diminished': ['m3', 'd5'],
    'sus2': ['M2', 'P5'],
    'sus4': ['P4', 'P5'],
    'power': ['P5']
  };

  var kChordShort = {
    'major': 'M',
    'minor': 'm',
    'augmented': 'aug',
    'diminished': 'dim',
    'power': '5'
  };

  var kAccidentalSign = {
    '-2': 'bb',
    '-1': 'b',
    '0': '',
    '1': '#',
    '2': 'x'
  };

  var kAccidentalValue = {
    'bb': -2,
    'b': -1,
    '#': 1,
    'x': 2
  };

  var kStepNumber = {
    'first': '1',
    'tonic': '1',
    'second': '2',
    'third': '3',
    'fourth': '4',
    'fifth': '5',
    'sixth': '6',
    'seventh': '7',
    'ninth': '9',
    'eleventh': '11',
    'thirteenth': '13'
  };

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
  /**
   * getDistance, returns the distance in semitones between two notes
   */
  function getDistance(from, to) {
    from = kNotes[from];
    to = kNotes[to];
    if (from.distance > to.distance) {
      return (to.distance + 12) - from.distance;
    } else {
      return to.distance - from.distance;
    }
  }

  function pad(str, ch, len) {
    for (; len > 0; len--) {
      str += ch;
    }

    return str;
  }


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
      } else { // Pro
        if (octave.match(/^'+$/)) { // Up
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

      pad(name + this.accidental.sign, paddingChar, paddingCount);
      return pad(name + this.accidental.sign, paddingChar, paddingCount);
    },

    /**
     * Returns the scientific notation form of the note (fx E4, Bb3, C#7 etc.)
     */
    scientific: function() {
      var octave = (typeof this.octave == 'number') ? this.octave : '';
      return this.name.toUpperCase() + this.accidental.sign + octave;
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
     * Returns the name of the note, with an optional display of octave number
     */
    toString: function(dontShow) {
      var octave = dontShow ? '' : this.octave;
      return this.name.toLowerCase() + this.accidental.sign + octave;
    }
  };

  function TeoriaChord(root, name) {
    if (!(root instanceof TeoriaNote)) {
      return null;
    }

    name = name || '';
    this.name = root.name.toUpperCase() + root.accidental.sign + name;
    this.symbol = name;
    this.root = root;
    this.notes = [root];
    this.quality = 'major';

    // TODO implement these...
    // Half-diminished code === 216 || code === 248
    // Diminished code === 111 || code === 176
    var i, length, c, code, strQuality, parsing = 'quality',
        notes = ['M3', 'P5', 'm7', 'M9', 'P11', 'M13'],
        chordLength = 2, additionals = [], bass, note;

    // Remove whitespace, commas and parentheses
    name = name.replace(/[,\s\(\)]/g, '');
    bass = name.split('/');
    if (bass.length === 2) {
      name = bass[0];
      bass = bass[1];
    } else {
      bass = null;
    }

    for (i = 0, length = name.length; i < length; i++) {
      c = name[i];
      if (!c) break;

      code = c.charCodeAt(i);
      strQuality = ((i + 3) <= length) ? name.substr(i, 3) : null;

      switch (parsing) {
        case 'quality':
          var triad;
          if (strQuality && kQualityLong[strQuality]) {
            triad = kChords[kQualityLong[strQuality]];
            this.quality = kQualityLong[strQuality];
            i += strQuality.length - 1;
          } else if (kQualityLong[c] && strQuality !== 'maj') {
            triad = kChords[kQualityLong[c]];
            this.quality = kQualityLong[c];
          } else {
            triad = kChords.major;
            i -= 1;
          }

          notes[0] = triad[0];
          notes[1] = triad[1];
          parsing = 'extension';

          break;

        case 'extension':
          c = (c === '1' && name[i + 1]) ? parseFloat(name.substr(i, 2)) :
                                            parseFloat(c);
          if (!isNaN(c)) {
            chordLength = (c - 1) / 2;
            i += String(c).length - 1;
          } else {
            i -= 1;
          }

          parsing = 'alterations';
          break;

        case 'alterations':
          var alterations = name.substr(i).split(/(#|b|add|maj|sus)/),
              next, flat = false, sharp = false;
          if (alterations.length === 1) {
            throw new Error('Invalid alterations');
          } else if (alterations[0].length !== 0) {
            throw new Error('Invalid token: \'' + alterations[0] + '\'');
          }
          for (var a = 1, aLength = alterations.length; a < aLength; a++) {
            next = (aLength > a + 1) ? alterations[a + 1] : null;
            switch (alterations[a]) {
            case 'maj':
              if (chordLength < 3) {
                chordLength = 3;
              }

              notes[2] = 'M7';
              break;

            case 'sus':
              var type = 'P4';
              if (next === '2' || next === '4') {
                if (next === '2') {
                  type = 'M2';
                }
                a++;
              }

              notes[0] = type; // Replace third with M2 or P4
              break;

            case 'add':
              if (next && !isNaN(parseFloat(next))) {
                if (next === '9') {
                  additionals.push('M9');
                } else if (next === '11') {
                  additionals.push('P11');
                } else if (next === '13') {
                  additionals.push('M13');
                }

                a += next.length;
              }
              break;

            case 'b':
              flat = true;
              break;

            case '#':
              sharp = true;
              break;

            default:
              var token = parseFloat(alterations[a]), quality,
                  interval = parseFloat(alterations[a]), intPos;
              if (isNaN(token) ||
                  String(token).length != alterations[a].length) {
                throw new Error('Invalid token: \'' + alterations[a] + '\'');
              }

              if (token === 6) {
                if (sharp) {
                  notes[2] = 'A6';
                } else if (flat) {
                  notes[2] = 'm6';
                } else {
                  notes[2] = 'M6';
                }

                if (chordLength < 3) {
                  chordLength = 3;
                }
                continue;
              }

              intPos = (interval - 1) / 2 - 1;
              if (chordLength < intPos + 1) {
                chordLength = intPos + 1;
              }

              quality = notes[intPos][0];
              if (sharp) {
                if (quality == 'd') {
                  quality = 'm';
                } else if (quality == 'm') {
                  quality = 'M';
                } else if (quality == 'M' || quality == 'P') {
                  quality = 'A';
                }
              } else if (flat) {
                if (quality == 'A') {
                  quality = 'M';
                } else if (quality == 'M') {
                  quality = 'm';
                } else if (quality == 'm' || quality == 'P') {
                  quality = 'd';
                }
              }
              notes[intPos] = quality + notes[intPos].substr(1);
              break;
            }
          }

          parsing = 'ended';
          break;
      }

      if (parsing === 'ended') {
        break;
      }
    }

    notes = notes.slice(0, chordLength).concat(additionals);
    if (bass) {
      bass = teoria.note(bass);
      var interval = teoria.interval.between(root, bass);
      bass.octave -= (interval.direction === 'up') ? 1 : 0;

      this.notes.splice(0, 0, bass);
    }

    for (i = 0; i < notes.length; i++) {
      note = this.root.interval(notes[i]);
      if (bass && note.toString(true) === bass.toString(true)) {
        continue;
      }

      this.notes.push(note);
    }
  }

  TeoriaChord.prototype = {
    dominant: function(additional) {
      additional = additional || '';
      return new TeoriaChord(this.root.interval('P5'), additional);
    },

    subdominant: function(additional) {
      additional = additional || '';
      return new TeoriaChord(this.root.interval('P4'), additional);
    },

    parallel: function(additional) {
      additional = additional || '';
      if (this.chordType() != 'triad' || this.quality == 'diminished' ||
          this.quality == 'augmented') {
        throw new Error('Only major/minor triads have parallel chords');
      }

      if (this.quality === 'major') {
        return new TeoriaChord(this.root.interval('m3', 'down'), 'm');
      } else {
        return new TeoriaChord(this.root.interval('m3', 'up'));
      }
    },

    chordType: function() { // In need of better name
      var is = true, interval, has, invert, num, i, length;
      if (this.notes.length === 2) {
        return 'dyad';
      } else if (this.notes.length === 3) {
        has = {first: false, third: false, fifth: false};
        for (i = 0, length = this.notes.length; i < length; i++) {
          interval = this.root.interval(this.notes[i]);
          invert = interval.invert();
          if (interval.interval in has) {
            has[interval.interval] = true;
          } else if (invert.interval in has) {
            has[invert.interval] = true;
          }
        }

        return (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
      } else if (this.notes.length === 4) {
        has = {first: false, third: false, fifth: false, seventh: false};
        for (i = 0, length = this.notes.length; i < length; i++) {
          interval = this.root.interval(this.notes[i]);
          invert = interval.invert();
          if (interval.interval in has) {
            has[interval.interval] = true;
          } else if (invert.interval in has) {
            has[invert.interval] = true;
          }
        }

        if (has.first && has.third && has.fifth && has.seventh) {
          return 'tetrad';
        }
      }

      return 'unknown';
    },

    get: function(interval) {
      if (typeof interval == 'string' && interval in kStepNumber) {
        var quality = kIntervals[kIntervalIndex[interval]].quality;
        quality = (quality === 'perfect') ? 'P' : 'M';
        interval = this.root.interval(quality + kStepNumber[interval]);
        for (var i = 0, length = this.notes.length; i < length; i++) {
          if (this.notes[i].name == interval.name) {
            return this.notes[i];
          }
        }

        return null;
      } else {
        throw new Error('Invalid interval name');
      }
    },

    interval: function(interval, direction) {
      return new TeoriaChord(this.root.interval(interval, direction),
                             this.symbol);
    },

    transpose: function(interval, direction) {
      var chord = new TeoriaChord(this.root.interval(interval, direction),
                                  this.symbol);
      this.name = chord.name;
      this.symbol = chord.symbol;
      this.root = chord.root;
      this.notes = chord.notes;
      this.quality = chord.quality;

      return this;
    },

    toString: function() {
      return this.name;
    }
  };

  function TeoriaScale(tonic, scale) {
    var scaleName, i;

    if (!(tonic instanceof TeoriaNote)) {
      throw new Error('Invalid Tonic');
    }

    if (typeof scale == 'string') {
      scaleName = scale;
      scale = teoria.scale.scales[scale];
      if (!scale) {
        throw new Error('Invalid Scale');
      }
    } else {
      for (i in teoria.scale.scales) {
        if (teoria.scale.scales.hasOwnProperty(i)) {
          if (teoria.scale.scales[i].toString() === scale.toString()) {
            scaleName = i;
            break;
          }
        }
      }
    }

    this.name = scaleName;
    this.notes = [tonic];
    this.tonic = tonic;
    this.scale = scale;

    for (var i = 0, length = scale.length; i < length; i++) {
      this.notes.push(teoria.interval(tonic, scale[i]));
    }
  }

  TeoriaScale.prototype = {
    simple: function() {
      var sNotes = [];

      for (var i = 0, length = this.notes.length; i < length; i++) {
        sNotes.push(this.notes[i].toString(true));
      }

      return sNotes;
    },

    type: function() {
      var name = null, length = this.notes.length;
      if (length == 2) {
        name = 'ditonic';
      } else if (length == 3) {
        name = 'tritonic';
      } else if (length == 4) {
        name = 'tetratonic';
      } else if (length == 5) {
        name = 'pentatonic';
      } else if (length == 6) {
        name = 'hexatonic';
      } else if (length == 7) {
        name = 'heptatonic';
      } else if (length == 8) {
        name = 'octatonic';
      }

      return name;
    },

    get: function(i) {
      if (typeof i == 'number') {
        return (i > 0 && i <= this.notes.length) ? this.notes[i - 1] : null;
      } else if (typeof i == 'string' && i in kStepNumber) {
        i = parseFloat(kStepNumber[i]);
        return (i > 0 && i <= this.notes.length) ? this.notes[i - 1] : null;
      }
    },

    solfege: function(index, showOctaves) {
      var interval, i, length, solfegeArray = [];

      // Return specific index in scale
      if (index) {
        return this.get(index).solfege(this, showOctaves);
      }

      // Return an array of solfege syllables
      for (i = 0, length = this.notes.length; i < length; i++) {
        solfegeArray.push(this.notes[i].solfege(this, showOctaves));
      }

      return solfegeArray;
    },

    interval: function(interval, direction) {
      return new TeoriaScale(this.tonic.interval(interval, direction),
                             this.scale);
    },

    transpose: function(interval, direction) {
      var scale = new TeoriaScale(this.tonic.interval(interval, direction),
                                  this.scale);
      this.notes = scale.notes;
      this.scale = scale.scale;
      this.tonic = scale.tonic;

      return this;
    }
  };

  function TeoriaInterval(intervalNum, quality, direction) {
    var simple = (intervalNum >= 8 && intervalNum % 7 == 1) ?
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

      if (intervalNumber !== 8 && intervalNumber !== 1) {
        intervalNumber = 9 - intervalNumber;
      }

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
      return (this.compoundOctaves > 0) ? this.compound() : this.simple();
    }
  };

  // teoria.note namespace - All notes should be instantiated
  // through this function.
  teoria.note = function(name, duration) {
    return new TeoriaNote(name, duration || {});
  };

  teoria.note.fromKey = function(key) {
    var octave = Math.floor((key - 4) / 12);
    var distance = key - (octave * 12) - 4;
    var note = kNotes[kNoteIndex[Math.round(distance / 2)]];
    var name = note.name;
    if (note.distance < distance) {
      name += '#';
    } else if (note.distance > distance) {
      name += 'b';
    }

    return teoria.note(name + (octave + 1).toString(10));
  };

  teoria.note.fromFrequency = function(fq, concertPitch) {
    var key, octave, distance, note, name, cents, originalFq;
    concertPitch = concertPitch || 440;

    key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
    key = Math.round(key);
    originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
    cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));
    octave = Math.floor((key - 4) / 12);  // This is octave - 1
    distance = key - (octave * 12) - 4;

    note = kNotes[kNoteIndex[Math.round(distance / 2)]];
    name = note.name;
    if (note.distance < distance) {
      name += '#';
    } else if (note.distance > distance) {
      name += 'b';
    }

    return {note: teoria.note(name + (octave + 1).toString(10)), cents: cents};
  };

  // teoria.chord namespace - All chords should be instantiated
  // through this function.
  teoria.chord = function(name, oSymbol) {
    if (typeof name == 'string') {
      var root;
      root = name.match(/^([a-h])(x|#|bb|b?)/i);
      if (root && root[0]) {
        return new TeoriaChord(teoria.note(root[0].toLowerCase()),
                              name.substr(root[0].length));
      }
    } else if (name instanceof TeoriaNote) {
      return new TeoriaChord(name, oSymbol || '');
    } else {
      throw new Error('Invalid Chord. Couldn\'t find note name');
    }
  };

  /**
   * teoria.interval
   *
   * Sugar function for #from and #between methods, with the possibility to
   * declare a interval by its string name: P8, M3, m7 etc.
   */
  teoria.interval = function(from, to, direction) {
    var quality, intervalNumber, interval, intervalName,
        pattern = /^(AA|A|P|M|m|d|dd)(\d+)$/;

    // Construct a TeoriaInterval object from string representation
    if (typeof from === 'string') {
      pattern = from.match(pattern);
      if (!pattern) {
        throw new Error('Invalid string-interval format');
      }

      quality = kQualityLong[pattern[1]];
      intervalNumber = parseInt(pattern[2]);

      return new TeoriaInterval(intervalNumber, quality, direction);
    }

    if (typeof to === 'string' && from instanceof TeoriaNote) {
      if (direction === 'down') {
        to = teoria.interval.invert(to);
      }

      pattern = to.match(pattern);
      if (!pattern) {
        throw new Error('Invalid string-interval format');
      }

      quality = kQualityLong[pattern[1]];
      intervalNumber = parseInt(pattern[2]);

      interval = new TeoriaInterval(intervalNumber, quality, direction);

      return teoria.interval.from(from, interval);
    } else if (to instanceof TeoriaNote && from instanceof TeoriaNote) {
      return teoria.interval.between(from, to);
    } else {
      throw new Error('Invalid parameters');
    }
  };

  /**
   * Returns the note from a given note (from), with a given interval (to)
   */
  teoria.interval.from = function(from, to) {
    var note, diff, octave, index, alterations, dist;

    index = to.simpleInterval - 1;
    index = kNotes[from.name].index + index;

    if (index > kNoteIndex.length - 1) {
      index = index - kNoteIndex.length;
    }

    note = kNoteIndex[index];
    dist = getDistance(from.name, note);
    diff = to.simpleIntervalType.size + to.qualityValue() - dist;

    octave = Math.floor((from.key() - from.accidental.value + dist - 4) / 12);
    octave += 1 + Math.floor((to.simpleInterval - 1) / 7);
    octave += to.compoundOctaves;

    diff += from.accidental.value;
    if (diff >= 10) {
      diff -= 12;
    }

    note += kAccidentalSign[diff];

    if (to.direction === 'down') {
      octave--;
    }

    return teoria.note(note + octave.toString(10));
  };

  /**
   * Returns the interval between two instances of teoria.note
   */
  teoria.interval.between = function(from, to) {
    var fromKey = from.key(), toKey = to.key(), semitones, interval,
        intervalInt, tmp, quality, alteration, direction = 'up',
        simpleInterval;

    semitones = toKey - fromKey;
    intervalInt = kNotes[to.name].index - kNotes[from.name].index +
                  (7 * (to.octave - from.octave));

    if (semitones < 0 || intervalInt < 0) {
      intervalInt = -intervalInt;
      direction = 'down';
      tmp = from;
      from = to;
      to = tmp;
    }

    intervalInt += 1;
    simpleInterval = (intervalInt >= 8 && intervalInt % 7 == 1) ?
          intervalInt % 7 * 8 : ((intervalInt - 1) % 7) + 1;

    interval = kIntervals[simpleInterval - 1];
    alteration = kAlterations[interval.quality];
    quality = alteration[(Math.abs(semitones) - interval.size + 2) % 12];

    return new TeoriaInterval(intervalInt, quality, direction);
  };

  teoria.interval.invert = function(sInterval) {
    return teoria.interval(sInterval).invert().toString();
  };

  // teoria.scale namespace - Scales are constructed through this function.
  teoria.scale = function(tonic, scale) {
    if (!(tonic instanceof TeoriaNote)) {
      tonic = teoria.note(tonic);
    }

    return new TeoriaScale(tonic, scale);
  }

  /**
   * A list of scales, used internally by the TeoriaScale object.
   * Scales are written in absolute interval format.
   * Notice that the root note (tonic) is not listed.
   */
  teoria.scale.scales = {
    // Modal Scales
    major: ['M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
    ionian: ['M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
    dorian: ['M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
    phrygian: ['m2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    lydian: ['M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
    mixolydian: ['M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
    minor: ['M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    aeolian: ['M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    locrian: ['m2', 'm3', 'P4', 'd5', 'm6', 'm7'],

    // Pentatonic
    majorpentatonic: ['M2', 'M3', 'P5', 'M6'],
    minorpentatonic: ['m3', 'P4', 'P5', 'm7'],

    // Chromatic
    chromatic: ['m2', 'M2', 'm3', 'M3', 'P4', 'A4',
                'P5', 'm6', 'M6', 'm7', 'M7'],
    harmonicchromatic: ['m2', 'M2', 'm3', 'M3', 'P4', 'A4',
                'P5', 'm6', 'M6', 'm7', 'M7']
  };

  teoria.TeoriaNote = TeoriaNote;
  teoria.TeoriaChord = TeoriaChord;
  teoria.TeoriaScale = TeoriaScale;
  teoria.TeoriaInterval = TeoriaInterval;

  globalScope.teoria = teoria;
})(scope);
