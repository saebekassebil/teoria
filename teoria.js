/**
 * Teoria.js - Music Theory for JavaScript
 *
 * Jakob Miland - Copyleft 2011
 **/

(function() {
  var teoria = {};

  var NOTES = {
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

  var NOTES_INDEX = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

  var DURATIONS = {
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

  var INTERVALS = [{
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
  }, {
    name: 'ninth',
    quality: 'minor',
    size: 13
  }, {
    name: 'tenth',
    quality: 'minor',
    size: 15
  }, {
    name: 'eleventh',
    quality: 'perfect',
    size: 17
  }, {
    name: 'twelfth',
    quality: 'perfect',
    size: 19
  }, {
    name: 'thirteenth',
    quality: 'minor',
    size: 20
  }, {
    name: 'fourteenth',
    quality: 'minor',
    size: 22
  }, {
    name: 'fifteenth',
    quality: 'perfect',
    size: 24
  }];

  var INTERVAL_INDEX = {
    'first': 0, 'second': 1, 'third': 2, 'fourth': 3,
    'fifth': 4, 'sixth': 5, 'seventh': 6, 'octave': 7,
    'ninth': 8, 'tenth': 9, 'eleventh': 10, 'twelfth': 11,
    'thirteenth': 12, 'fourteenth': 13, 'fifteenth': 14
  };

  var QUALITY_STRING = {
      'P': 'perfect',
      'M': 'major',
      'm': 'minor',
      'A': 'augmented',
      'd': 'diminished',

      'aug': 'augmented',
      'dim': 'diminished'
  };

  var QUALITY_TO_SIMPLE = {
      'perfect': 'P',
      'major': 'M',
      'minor': 'm',
      'augmented': 'A',
      'diminished': 'd'
  };

  var INTERVAL_INVERSION = {
      'P': 'P',
      'M': 'm',
      'm': 'M',
      'A': 'd',
      'd': 'A'
  };

  var ALTERATIONS = {
      perfect: ['diminished', 'perfect', 'augmented'],
      minor: ['diminished', 'minor', 'major', 'augmented']
  };

  var CHORDS = {
      'major': ['M3', 'P5'],
      'minor': ['m3', 'P5'],
      'augmented': ['M3', 'A5'],
      'diminished': ['m3', 'd5'],
      'sus2': ['M2', 'P5'],
      'sus4': ['P4', 'P5'],
      'power': ['P5']
  };

  var CHORDLOOKUP = {
      'major': 'M',
      'minor': 'm',
      'augmented': 'aug',
      'diminished': 'dim',
      'power': '5'
  };

  var ACCIDENTALTOSIGN = {
    '-2': 'bb',
    '-1': 'b',
    '0': '',
    '1': '#',
    '2': 'x'
  };

  var SIGNTOACCIDENTAL = {
    'bb': -2,
    'b': -1,
    '#': 1,
    'x': 2
  };

  /**
   * getDistance, returns the distance in semitones between two notes
   */
  function getDistance(from, to) {
    from = NOTES[from];
    to = NOTES[to];
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
   * and optionally a value argument.
   * The first parameter (name) can be specified in either
   * scientific notation (name+accidentals+octave). Fx:
   *    A4 - Cb3 - D#8 - Hbb - etc.
   * Or in the Helmholtz notation:
   *    ,,C - F#'' - d - Eb - etc.
   */
  function TeoriaNote(name, duration) {
    if (typeof name !== 'string') {
      return null;
    }

    this.name = name;
    this.duration = duration || 4;
    this.accidental = {value: 0, sign: ''};
    var parser = name.match(/^([abcdefgh])(x|#|bb|b?)(-?\d*)/i);

    if (parser && name === parser[0] && parser[3].length !== 0) { // Scientific
      this.name = parser[1].toLowerCase();
      this.octave = parseFloat(parser[3]);

      if (parser[2].length !== 0) {
        this.accidental.sign = parser[2].toLowerCase();
        this.accidental.value = SIGNTOACCIDENTAL[parser[2]];
      }
    } else { // Helmholtz Notation
      name = name.replace(/\u2032/g, "'").replace(/\u0375/g, ',');
      var info = name.match(/^(,*)([abcdefgh])(x|#|bb|b?)([,\']*)$/i);
      if (!info || info.length !== 5 || name !== info[0]) {
        throw Error('Invalid note format');
      } else if (info[1] === '' && info[4] === '') { // Only note name
        this.octave = (info[2] === info[2].toLowerCase()) ? 3 : 2;
      } else if (info[1] !== '' && info[4] === '') { // Pre
        if (info[2] === info[2].toLowerCase()) { // If lower-case
          throw Error('Format must respect the Helmholtz notation.');
        }

        this.octave = 2 - info[1].length;
      } else if (info[1] == '' && info[4] != '') { // Pro
        if (info[4].match(/^'+$/)) { // Up
          if (info[2] === info[2].toUpperCase()) { // If upper-case
            throw Error('Format must respect the Helmholtz notation');
          }

          this.octave = 3 + info[4].length;
        } else if (info[4].match(/^,+$/)) {
          if (info[2] === info[2].toLowerCase()) { // If lower-case
            throw Error('Format must respect the Helmholtz notation');
          }

          this.octave = 2 - info[4].length;
        } else {
          throw Error('Invalid characters after note name.');
        }
      } else {
        throw Error('Invalid note format');
      }

      this.name = info[2].toLowerCase();
      if (info[3].length !== 0) {
        this.accidental.sign = info[3].toLowerCase();
        this.accidental.value = SIGNTOACCIDENTAL[info[3]];
      }
    }
  }

  TeoriaNote.prototype = {
      /**
       * Returns the key number of the note
       */
      key: function(whitenotes) {
        if (whitenotes) {
          var noteValue = Math.ceil(NOTES[this.name].distance / 2);
          return (this.octave - 1) * 7 + 3 + noteValue;
        } else {
          var noteValue = NOTES[this.name].distance + this.accidental.value;
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
       * Sugar function for teoria.scale.list(note, scale[, simple])
       */
      scale: function(scale, simple) {
        return teoria.scale.list(this, scale, simple);
      },

      /**
       * Sugar function for teoria.interval(note, interval[, direction])
       */
      interval: function(interval, direction) {
        return teoria.interval(this, interval, direction);
      },

      /**
       * Returns a TeoriaChord object with this note as root
       */
      chord: function(chord) {
        chord = chord || 'major';
        if (chord in CHORDLOOKUP) {
          chord = CHORDLOOKUP[chord];
        }

        return new TeoriaChord(this, chord);
      },

      /**
       * Returns the Helmholtz notation form of the note (fx ,,C d' F# g#'')
       */
      helmholtz: function() {
        var name = (this.octave < 3) ? this.name.toUpperCase() :
                                      this.name.toLowerCase();
        var padding;
        if (this.octave <= 2) {
          padding = pad('', ',', 2 - this.octave);
          return padding + name + this.accidental.sign;
        } else {
          padding = pad('', '\'', this.octave - 3);
          return name + this.accidental.sign + padding;
        }
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
          upper.accidental = {value: diff, sign: ACCIDENTALTOSIGN[diff]};
          enharmonics.push(upper);
        }

        diff = key - lowerKey;
        if (diff < 3 && diff > -3) {
          lower.accidental = {value: diff, sign: ACCIDENTALTOSIGN[diff]};
          enharmonics.push(lower);
        }

        return enharmonics;
      },

      /**
       * Returns the name of the value,
       * such as 'whole', 'quarter', 'sixteenth' etc.
       */
      valueName: function() {
        return DURATIONS[this.duration];
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
    this.root = root;
    this.notes = [root];
    this.quality = 'major';

    // TODO implement these...
    // Half-diminished 'ø': code === 216 || code === 248
    // Diminished 'o':      code === 111 || code === 176

    var c, code, strQuality, parsing = 'quality',
        notes = ['M3', 'P5', 'm7', 'M9', 'P11', 'M13'],
        chordLength = 2, additionals = [];

    name = name.replace(/[,\s\(\)]/g, '');
    for (i = 0, length = name.length; i < length; i++) {
      c = name[i];

      if (!c) {
        break;
      }

      code = c.charCodeAt(i);
      strQuality = ((i + 3) <= length) ? name.substr(i, 3) : null;

      switch (parsing) {
      case 'quality': {
        var triad;
        if (strQuality && QUALITY_STRING[strQuality]) {
          triad = CHORDS[QUALITY_STRING[strQuality]];
          this.quality = QUALITY_STRING[strQuality];
          i += strQuality.length - 1;
        } else if (QUALITY_STRING[c] && strQuality !== 'maj') {
          triad = CHORDS[QUALITY_STRING[c]];
          this.quality = QUALITY_STRING[c];
        } else {
          triad = CHORDS['major'];
          i -= 1;
        }

        notes[0] = triad[0];
        notes[1] = triad[1];
        parsing = 'extension';
      } break;

      case 'extension': {
        c = (c === '1' && name[i + 1]) ? parseFloat(name.substr(i, 2)) :
                                          parseFloat(c);
        if (!isNaN(c)) {
          chordLength = (c - 1) / 2;
          i += String(c).length - 1;
        } else {
          i -= 1;
        }

        parsing = 'alterations';
      } break;

      case 'alterations': {
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
          case 'maj': {
            if (chordLength < 3) {
              chordLength = 3;
            }

            notes[2] = 'M7';
          } break;

          case 'sus': {
            var type = 'P4';
            if (next === '2' || next === '4') {
              if (next === '2') {
                type = 'M2';
              }
              a++;
            }
            notes[0] = type; // Replace third with M2 or P4
          } break;

          case 'add': {
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
          } break;

          case 'b': {
            flat = true;
          } break;

          case '#': {
            sharp = true;
          } break;

          default: {
            var token = parseFloat(alterations[a]), quality,
                interval = parseFloat(alterations[a]), intPos;
            if (isNaN(token) || String(token).length != alterations[a].length) {
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
          } break;
          }
        }

        parsing = 'ended';
      }
      }

      if (parsing === 'ended') {
        break;
      }
    }

    notes = notes.slice(0, chordLength).concat(additionals);
    for (i = 0; i < notes.length; i++) {
      this.notes.push(this.root.interval(notes[i]));
    }
  }

  TeoriaChord.prototype.dominant = function(additional) {
    additional = additional || '';
    return new TeoriaChord(this.root.interval('P5'), additional);
  };

  TeoriaChord.prototype.subdominant = function(additional) {
    additional = additional || '';
    return new TeoriaChord(this.root.interval('P4'), additional);
  };

  TeoriaChord.prototype.parallel = function(additional) {
    additional = additional || '';
    if (this.chordType() != 'triad' || this.quality == 'diminished' ||
        this.quality == 'augmented') {
      throw Error('Only major/minor triads have parallel chords');
    }

    if (this.quality === 'major') {
      return new TeoriaChord(this.root.interval('m3', 'down'), 'm');
    } else {
      return new TeoriaChord(this.root.interval('m3', 'up'));
    }
  };

  TeoriaChord.prototype.chordType = function() { // In need of better name
    var is = true, interval, has, invert, num;
    if (this.notes.length === 2) {
      return 'dyad';
    } else if (this.notes.length === 3) {
      has = {first: false, third: false, fifth: false};
      for (var i = 0, length = this.notes.length; i < length; i++) {
        interval = this.root.interval(this.notes[i]);
        num = parseFloat(teoria.interval.invert(interval.simple)[1]) - 1;
        invert = INTERVALS[num];
        if (interval.name in has) {
          has[interval.name] = true;
        } else if (invert.name in has) {
          has[invert.name] = true;
        }
      }

      return (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
    } else if (this.notes.length === 4) {
      has = {first: false, third: false, fifth: false, seventh: false};
      for (var i = 0, length = this.notes.length; i < length; i++) {
        interval = this.root.interval(this.notes[i]);
        num = parseFloat(teoria.interval.invert(interval.simple)[1]) - 1;
        invert = INTERVALS[num];
        if (interval.name in has) {
          has[interval.name] = true;
        } else if (invert.name in has) {
          has[invert.name] = true;
        }
      }

      if (has.first && has.third && has.fifth && has.seventh) {
        return 'tetrad';
      }
    }

    return 'unknown';
  };

  TeoriaChord.prototype.get = function(interval) {
    var lookup = {
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

    if (interval in lookup) {
      var quality = INTERVALS[INTERVAL_INDEX[interval]].quality;
      quality = (quality === 'perfect') ? 'P' : 'M';
      interval = this.root.interval(quality + lookup[interval]);
      for (var i = 0, length = this.notes.length; i < length; i++) {
        if (this.notes[i].name == interval.name) {
          return this.notes[i];
        }
      }

      return null;
    } else {
      throw new Error('Invalid interval name');
    }
  };

  TeoriaChord.prototype.toString = function() {
    return this.name;
  };

  teoria.note = function(name, value) {
    return (new TeoriaNote(name, value));
  };

  teoria.note.fromKey = function(key) {
    var fq = 440 * Math.pow(2, (key - 49) / 12);
    return teoria.frequency.note(fq).note;
  };

  /**
   * teoria.chord contains Chord functionality
   */
  teoria.chord = function(name) {
    var root;
    root = name.match(/^([abcdefgh])(x|#|bb|b?)/i);
    if (root && root[0]) {
      return new TeoriaChord(new TeoriaNote(root[0].toLowerCase()),
                            name.substr(root[0].length));
    } else {
      throw Error("Invalid Chord. Couldn't find note name");
    }
  };

  /**
   * teoria.frequency
   *
   * Frequence functionalty
   */
  teoria.frequency = {
      note: function(fq, concertPitch) {
        concertPitch = concertPitch || 440;

        var key, octave, distance, note, name, cents, originalFq;
        key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
        key = Math.round(key);
        originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
        cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));
        octave = Math.floor((key - 4) / 12); // Actually this is octave-1
        distance = key - (octave * 12) - 4;

        note = NOTES[NOTES_INDEX[Math.round(distance / 2)]];
        name = note.name;
        if (note.distance < distance) {
          name += '#';
        } else if (note.distance > distance) {
          name += 'b';
        }

        return {note: new TeoriaNote(name + (octave + 1)), cents: cents};
      }
  };

  /**
   * teoria.interval
   *
   * Sugar function for #from and #between methods, with the possibility to
   * declare a interval by its string name: P8, M3, m7 etc.
   */
  teoria.interval = function(from, to, direction) {
    if (typeof to === 'string') {
      if (direction === 'down') {
        to = teoria.interval.invert(to);
      }
      var quality = QUALITY_STRING[to[0]];
      var interval = parseFloat(to.substr(1));
      if (!quality || isNaN(interval) || interval < 1) {
        throw Error('Invalid string-interval format');
      }

      return teoria.interval.from(from, {
        quality: quality,
        interval: INTERVALS[interval - 1].name
      }, direction);
    } else if (to instanceof TeoriaNote && from instanceof TeoriaNote) {
      return teoria.interval.between(from, to);
    } else {
      throw Error('Invalid parameters');
    }
  },

  /**
   * Returns the note from a given note (from), with a given interval (to)
   */
  teoria.interval.from = function(from, to, direction) {
    to.direction = direction || to.direction || 'up';
    var note, accDiff, diff, octave, index, interval, alterations, dist;
    index = INTERVAL_INDEX[to.interval];
    interval = INTERVALS[index];
    if (index > 7) index -= 7;

    index = NOTES[from.name].index + index;
    if (index > NOTES_INDEX.length - 1) {
      index = index - NOTES_INDEX.length;
    }

    note = NOTES_INDEX[index];
    alterations = ALTERATIONS[interval.quality];
    if (alterations.indexOf(to.quality) == -1 ||
        alterations.indexOf(interval.quality) == -1) {
      throw Error('Invalid interval quality');
    }
    accDiff = alterations.indexOf(to.quality) -
              alterations.indexOf(interval.quality);
    diff = (interval.size + accDiff) - getDistance(from.name, note);

    if (from.octave) {
      dist = getDistance(from.name, note);
      octave = Math.floor((from.key() - from.accidental.value + dist - 4) / 12);
      octave += 1 + Math.floor(INTERVAL_INDEX[to.interval] / 7);
    }

    diff += from.accidental.value;
    if (diff >= 10) {
      diff -= 12;
    }

    if (diff > -3 && diff < 3) {
      note += ACCIDENTALTOSIGN[diff];
    }

    if (direction === 'down') {
      octave--;
    }

    return new TeoriaNote(note + (octave || ''));
  };

  /**
   * Returns the interval between two instances of teoria.note
   */
  teoria.interval.between = function(from, to) {
    var fromKey = from.key(), toKey = to.key(), semitones, interval,
        intervalInt, tmp, simpleName, quality, alteration;

    semitones = toKey - fromKey;
    if (semitones > 24 || semitones < -25) {
      throw Error('Interval is bigger than an augmented fifteenth');
    } else if (semitones < 0) {
      tmp = from;
      from = to;
      to = tmp;
    }

    intervalInt = NOTES[to.name].index - NOTES[from.name].index +
                  (7 * (to.octave - from.octave));
    interval = INTERVALS[intervalInt];
    alteration = ALTERATIONS[interval.quality];
    quality = alteration[Math.abs(semitones) - interval.size + 1];
    simpleName = QUALITY_TO_SIMPLE[quality] + (intervalInt + 1);
    return {
      name: interval.name,
      quality: quality,
      direction: (semitones > 0 ? 'up' : 'down'),
      simple: simpleName
    };
  };

  teoria.interval.invert = function(sInterval) {
    if (sInterval.length !== 2 && sInterval.length !== 3) {
      return false;
    }

    var quality = INTERVAL_INVERSION[sInterval[0]];
    var inverse = (sInterval.length === 2) ? parseFloat(sInterval[1]) :
                                            parseFloat(sInterval.substr(1));
    if (inverse > 8) {
      inverse = inverse - 7;
    }
    if (inverse !== 8 && inverse !== 1) {
      inverse = 9 - inverse;
    }

    return quality + inverse.toString();
  };

  /**
   * teoria.scale namespace.
   * This object contains functionality with scales.
   */
  teoria.scale = {
    /**
     * List a given scale in either teoria.note's or plain strings
     */
    list: function(root, scale, simple) {
      var notes = [], sNotes = [], i, length;

      if (!(root instanceof TeoriaNote)) {
        return false;
      }

      if (typeof scale === 'string') {
        scale = teoria.scale.scales[scale];
        if (!scale) {
          return false;
        }
      }

      notes.push(root);
      if (simple) {
        sNotes.push(root.name + (root.accidental.sign || ''));
      }

      for (i = 0, length = scale.length; i < length; i++) {
        notes.push(teoria.interval(notes[i], scale[i]));
        if (simple && notes.length > i + 1) {
          sNotes.push(notes[i + 1].name + (notes[i + 1].accidental.sign || ''));
        }
      }

      return (simple) ? sNotes : notes;
    },

    /**
     * A list of scales, used internally in the #list function.
     * Scales are written in interval format.
     * (M2 = Major second, m2 = Minor second, etc.)
     * Note that the root note is not listed.
     */
    scales: {
        // Modal Scales
        major: ['M2', 'M2', 'm2', 'M2', 'M2', 'M2'],
        ionian: ['M2', 'M2', 'm2', 'M2', 'M2', 'M2'],
        dorian: ['M2', 'm2', 'M2', 'M2', 'M2', 'm2'],
        phrygian: ['m2', 'M2', 'M2', 'M2', 'm2', 'M2'],
        lydian: ['M2', 'M2', 'M2', 'm2', 'M2', 'M2'],
        mixolydian: ['M2', 'M2', 'm2', 'M2', 'M2', 'm2'],
        minor: ['M2', 'm2', 'M2', 'M2', 'm2', 'M2'],
        aeolian: ['M2', 'm2', 'M2', 'M2', 'm2', 'M2'],
        locrian: ['m2', 'M2', 'M2', 'm2', 'M2', 'M2'],

        // Pentatonic
        majorpentatonic: ['M2', 'M2', 'm3', 'M2'],
        minorpentatonic: ['m3', 'M2', 'M2', 'm3']
    }
  };

  teoria.TeoriaNote = TeoriaNote;
  teoria.TeoriaChord = TeoriaChord;
  window.teoria = teoria;
}());
