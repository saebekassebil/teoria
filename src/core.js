/*jshint unused:false */

//    Teoria.js
//    http://saebekassebil.github.com/teoria
//    Copyright Jakob Miland (saebekassebil)
//    Teoria may be freely distributed under the MIT License.

(function teoriaClosure() {
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
    '-': 'minor',
    'A': 'augmented',
    '+': 'augmented',
    'AA': 'doubly augmented',
    'd': 'diminished',
    'dd': 'doubly diminished',

    'min': 'minor',
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

  var kSymbols = {
    'min': ['m3', 'P5'],
    'm': ['m3', 'P5'],
    '-': ['m3', 'P5'],

    'M': ['M3', 'P5'],
    '': ['M3', 'P5'],

    '+': ['M3', 'A5'],
    'aug': ['M3', 'A5'],

    'dim': ['m3', 'd5'],
    'o': ['m3', 'd5'],

    'maj': ['M3', 'P5', 'M7'],
    'dom': ['M3', 'P5', 'm7'],
    'ø': ['m3', 'd5', 'm7'],

    '5': ['P5']
  };

  var kChordShort = {
    'major': 'M',
    'minor': 'm',
    'augmented': 'aug',
    'diminished': 'dim',
    'half-diminished': '7b5',
    'power': '5',
    'dominant': '7'
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

  // teoria.note namespace - All notes should be instantiated
  // through this function.
  teoria.note = function(name, duration) {
    return new TeoriaNote(name, duration);
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

    return teoria.note(name + (octave + 1));
  };

  teoria.note.fromFrequency = function(fq, concertPitch) {
    var key, cents, originalFq;
    concertPitch = concertPitch || 440;

    key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
    key = Math.round(key);
    originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
    cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

    return {note: teoria.note.fromKey(key), cents: cents};
  };

  teoria.note.fromMIDI = function(note) {
    return teoria.note.fromKey(note - 20);
  };

  // teoria.chord namespace - All chords should be instantiated
  // through this function.
  teoria.chord = function(name, symbol) {
    if (typeof name === 'string') {
      var root, octave;
      root = name.match(/^([a-h])(x|#|bb|b?)/i);
      if (root && root[0]) {
        octave = typeof symbol === 'number' ? symbol.toString(10) : '4';
        return new TeoriaChord(teoria.note(root[0].toLowerCase() + octave),
                              name.substr(root[0].length));
      }
    } else if (name instanceof TeoriaNote) {
      return new TeoriaChord(name, symbol || '');
    }

    throw new Error('Invalid Chord. Couldn\'t find note name');
  };

  /**
   * teoria.interval
   *
   * Sugar function for #from and #between methods, with the possibility to
   * declare a interval by its string name: P8, M3, m7 etc.
   */
  teoria.interval = function(from, to, direction) {
    var quality, intervalNumber, interval, match;

    // Construct a TeoriaInterval object from string representation
    if (typeof from === 'string') {
      match = from.match(/^(AA|A|P|M|m|d|dd)(-?\d+)$/);
      if (!match) {
        throw new Error('Invalid string-interval format');
      }

      quality = kQualityLong[match[1]];
      intervalNumber = parseInt(match[2], 10);

      // Uses the second argument 'to', as direction
      direction = to === 'down' || intervalNumber < 0 ? 'down' : 'up';

      return new TeoriaInterval(Math.abs(intervalNumber), quality, direction);
    }

    if (typeof to === 'string' && from instanceof TeoriaNote) {
      interval = teoria.interval(to, direction);

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
    var note, diff, octave, index, dist, intval, dir;
    dir = (to.direction === 'down') ? -1 : 1;

    intval = to.simpleInterval - 1;
    intval = dir * intval;

    index = kNotes[from.name].index + intval;

    if (index > kNoteIndex.length - 1) {
      index = index - kNoteIndex.length;
    } else if (index < 0) {
      index = index + kNoteIndex.length;
    }

    note = kNoteIndex[index];
    dist = getDistance(from.name, note);

    if (dir > 0) {
      diff = to.simpleIntervalType.size + to.qualityValue() - dist;
    } else {
      diff = getDistance(note, from.name) -
        (to.simpleIntervalType.size + to.qualityValue());
    }
    diff += from.accidental.value;

    octave = Math.floor((from.key() - from.accidental.value + dist - 4) / 12);
    octave += 1 + dir * to.compoundOctaves;

    if (diff >= 10) {
      diff -= 12;
    } else if (diff <= -10) {
      diff += 12;
    }

    if (to.simpleInterval === 8) {
      octave += dir;
    } else if (dir < 0) {
      octave--;
    }

    note += kAccidentalSign[diff];
    return teoria.note(note + octave.toString(10));
  };

  /**
   * Returns the interval between two instances of teoria.note
   */
  teoria.interval.between = function(from, to) {
    var semitones, interval, intervalInt, quality,
        alteration, direction = 'up', dir = 1;

    semitones = to.key() - from.key();
    intervalInt = to.key(true) - from.key(true);

    if (intervalInt < 0) {
      intervalInt = -intervalInt;
      direction = 'down';
      dir = -1;
    }

    interval = kIntervals[intervalInt % 7];
    alteration = kAlterations[interval.quality];
    quality = alteration[(dir * semitones - interval.size + 2) % 12];

    return new TeoriaInterval(intervalInt + 1, quality, direction);
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
  };

  teoria.scale.scales = {};

  //=include note.js
  //=include interval.js
  //=include chord.js
  //=include scale.js
  //=include #scales#

  teoria.TeoriaNote = TeoriaNote;
  teoria.TeoriaChord = TeoriaChord;
  teoria.TeoriaScale = TeoriaScale;
  teoria.TeoriaInterval = TeoriaInterval;

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = teoria;
    }
    exports.teoria = teoria;
  } else if (typeof this !== 'undefined') {
    this.teoria = teoria;
  } else if (typeof window !== 'undefined') {
    window.teoria = teoria;
  }
})();

