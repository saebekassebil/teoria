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

  //=include note.js
  //=include interval.js
  //=include chord.js
  //=include scale.js

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

    return teoria.note(name + (octave + 1).toString(10));
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
  teoria.chord = function(name, oSymbol) {
    if (typeof name === 'string') {
      var root, octave;
      root = name.match(/^([a-h])(x|#|bb|b?)/i);
      if (root && root[0]) {
        octave = typeof oSymbol === 'number' ? oSymbol.toString(10) : '4';
        return new TeoriaChord(teoria.note(root[0].toLowerCase() + octave),
                              name.substr(root[0].length));
      }
    } else if (name instanceof TeoriaNote) {
      return new TeoriaChord(name, oSymbol || '');
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
    var quality, intervalNumber, interval, pattern = /^(AA|A|P|M|m|d|dd)(\d+)$/;

    // Construct a TeoriaInterval object from string representation
    if (typeof from === 'string') {
      pattern = from.match(pattern);
      if (!pattern) {
        throw new Error('Invalid string-interval format');
      }

      quality = kQualityLong[pattern[1]];
      intervalNumber = parseInt(pattern[2], 10);

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
      intervalNumber = parseInt(pattern[2], 10);

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
    var note, diff, octave, index, dist;

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
    simpleInterval = (intervalInt >= 8 && intervalInt % 7 === 1) ?
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
  };

  /**
   * A list of scales, used internally by the TeoriaScale object.
   * Scales are written in absolute interval format.
   */
  teoria.scale.scales = {
    // Modal Scales
    major: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
    ionian: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
    dorian: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
    phrygian: ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    lydian: ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
    mixolydian: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
    minor: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    aeolian: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    locrian: ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],

    // Pentatonic
    majorpentatonic: ['P1', 'M2', 'M3', 'P5', 'M6'],
    minorpentatonic: ['P1', 'm3', 'P4', 'P5', 'm7'],

    // Chromatic
    chromatic: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4',
                'P5', 'm6', 'M6', 'm7', 'M7'],
    harmonicchromatic: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4',
                'P5', 'm6', 'M6', 'm7', 'M7'],
                
    // Other Scales
    acoustic: ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'm7'], 
    adonai_malakh mode: ['P1', 'M2', 'M3', 'P4', 'P5', 'm6', 'm7'], 
    algerian: ['P1', 'M2', 'm3', 'A4', 'P5', 'm6', 'M7', 'etc.'], 
    altered: ['P1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'], 
    augmented: ['P1', 'm3', 'M3', 'P5', 'A5', 'M7'], 
    bebop_dominant: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7', 'M7'], 
    blues: ['P1', 'm3', 'P4', 'A4', 'P5', 'm7'], 
    double_harmonic: ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'M7'], 
    enigmatic: ['P1', 'm2', 'M3', 'A4', 'A5', 'A6', 'M7'], 
    flamenco_mode: ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'M7'], 
    gypsy: ['P1', 'M2', 'm3', 'A4', 'P5', 'm6', 'm7'], 
    half_diminished: ['P1', 'M2', 'm3', 'P4', 'm5', 'm6', 'm7'], 
    harmonic_major: ['P1', 'M2', 'M3', 'P4', 'P5', 'm6', 'M7'], 
    harmonic_minor: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', '7'], // *
    hirajoshi: ['P1', 'M2', 'm3', 'P5', 'm6'], 
    hungarian_gypsy: ['P1', 'M2', 'm3', 'A4', 'P5', 'm6', 'M7'], 
    hungarian_minor: ['P1', 'M2', 'm3', 'A4', 'P5', 'm6', 'M7'], 
    in_scale: ['P1', 'm2', 'P4', 'P5', 'm6'], 
    insen: ['P1', 'm2', 'P4', 'P5', 'm7'], 
    istrian: ['P1', 'm2', 'm3', 'm4', 'm5', 'P5'], 
    iwato: ['P1', 'm2', 'P4', 'm5', 'm7'], 
    lydian_augmented: ['P1', 'M2', 'M3', 'A4', 'A5', 'M6', 'M7'], 
    bebop: ['P1', 'M2', 'M3', 'P4', 'P5', '(A5/m6)', 'M6', 'M7'], 
    melodic_minor: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'], 
    neapolitan_major: ['P1', 'm2', 'm3', 'P4', 'P5', 'M6', 'M7'], 
    neapolitan_minor: ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'M7'], 
    octatonic: ['P1', 'M2', 'm3', 'P4', 'm5', 'm6', 'M6', '7'], // * '1', 'm2', 'm3', 'M3', 'A4', 'P5', 'M6', 'm7'] 
    persian: ['P1', 'm2', 'M3', 'P4', 'm5', 'm6', 'M7'], 
    phrygian_dominant: ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'm7'], 
    prometheus: ['P1', 'M2', 'M3', 'A4', 'M6', 'm7'], 
    tritone: ['P1', 'm2', 'M3', 'm5', 'P5', 'm7'], 
    ukrainian_dorian: ['P1', 'M2', 'm3', 'A4', 'P5', 'M6', 'm7'], 
    whole_tone: ['P1', 'M2', 'M3', 'A4', 'A5', 'A6'], 
    yo_scale: ['P1', 'm3', 'P4', 'P5', 'M7'], 
  };

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

