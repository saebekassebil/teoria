/*jshint unused:false */

//    Teoria.js
//    http://saebekassebil.github.com/teoria
//    Copyright Jakob Miland (saebekassebil)
//    Teoria may be freely distributed under the MIT License.

(function teoriaScope() {
  'use strict';

  var teoria = {};

  function add(note, interval) {
    return [note[0] + interval[0], note[1] + interval[1]];
  }

  function sub(note, interval) {
    return [note[0] - interval[0], note[1] - interval[1]];
  }

  function mul(note, interval) {
    if (typeof interval === 'number')
      return [note[0] * interval, note[1] * interval];
    else
      return [note[0] * interval[0], note[1] * interval[1]];
  }

  function sum(coord) {
    return coord[0] + coord[1];
  }

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

  var intervals = {
    unison: [0, 0],
    second: [3, -5],
    third: [2, -3],
    fourth: [1, -1],
    fifth: [0, 1],
    sixth: [3, -4],
    seventh: [2, -2],
    octave: [1, 0]
  };

  var intervalFromFifth = ['second', 'sixth', 'third', 'seventh', 'fourth',
                           'unison', 'fifth'];

  var intervalsIndex = ['unison', 'second', 'third', 'fourth', 'fifth',
                        'sixth', 'seventh', 'octave', 'ninth', 'tenth',
                        'eleventh', 'twelfth', 'thirteenth', 'fourteenth',
                        'fifteenth'];

  // linaer index to fifth = (2 * index + 1) % 7
  var fifths = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
  var accidentals = ['bb', 'b', '', '#', 'x'];

  var sharp = [-4, 7];
  var A4 = add(notes.a, [4, 0]);

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

  var kQualityLong = {
    P: 'perfect',
    M: 'major',
    m: 'minor',
    A: 'augmented',
    AA: 'doubly augmented',
    d: 'diminished',
    dd: 'doubly diminished'
  };

  var kAlterations = {
    perfect: ['dd', 'd', 'P', 'A', 'AA'],
    minor: ['dd', 'd', 'm', 'M', 'A', 'AA']
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

  var kStepNumber = {
    'unison': 1,
    'first': 1,
    'second': 2,
    'third': 3,
    'fourth': 4,
    'fifth': 5,
    'sixth': 6,
    'seventh': 7,
    'octave': 8,
    'ninth': 9,
    'eleventh': 11,
    'thirteenth': 13
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

  function pad(str, ch, len) {
    for (; len > 0; len--) {
      str += ch;
    }

    return str;
  }

  // teoria.note namespace - All notes should be instantiated
  // through this function.
  teoria.note = function(name, duration) {
    if (typeof name === 'string')
      return teoria.note.fromString(name, duration);
    else
      return new TeoriaNote(name, duration);
  };

  teoria.note.fromKey = function(key) {
    var octave = Math.floor((key - 4) / 12);
    var distance = key - (octave * 12) - 4;
    var name = fifths[(2 * Math.round(distance / 2) + 1) % 7];
    var note = add(sub(notes[name], A4), [octave + 1, 0]);
    var diff = (key - 49) - sum(mul(note, [12, 7]));

    return teoria.note(diff ? add(note, mul(sharp, diff)) : note);
  };

  teoria.note.fromFrequency = function(fq, concertPitch) {
    var key, cents, originalFq;
    concertPitch = concertPitch || 440;

    key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
    key = Math.round(key);
    originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
    cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

    return { note: teoria.note.fromKey(key), cents: cents };
  };

  teoria.note.fromMIDI = function(note) {
    return teoria.note.fromKey(note - 20);
  };

  teoria.note.fromString = function(name, dur) {
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
    note = add(note, [octave, 0]);
    note = add(note, mul(sharp, accidentals.indexOf(accidental) - 2));

    return new TeoriaNote(sub(note, A4), dur);
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
    } else if (name instanceof TeoriaNote)
      return new TeoriaChord(name, symbol);

    throw new Error('Invalid Chord. Couldn\'t find note name');
  };

  /**
   * teoria.interval
   *
   * Sugar function for #from and #between methods, with the possibility to
   * declare a interval by its string name: P8, M3, m7 etc.
   */
  teoria.interval = function(from, to) {
    // Construct a TeoriaInterval object from string representation
    if (typeof from === 'string')
      return teoria.interval.toCoord(from);

    if (typeof to === 'string' && from instanceof TeoriaNote)
      return teoria.interval.from(from, teoria.interval.toCoord(to));

    if (to instanceof TeoriaInterval && from instanceof TeoriaNote)
      return teoria.interval.from(from, to);

    if (to instanceof TeoriaNote && from instanceof TeoriaNote)
      return teoria.interval.between(from, to);

    throw new Error('Invalid parameters');
  };

  teoria.interval.toCoord = function(simple) {
    var pattern = /^(AA|A|P|M|m|d|dd)(-?\d+)$/
      , parser, number, coord, quality, lower, octaves, base, type, alt, down;

    parser = simple.match(pattern);
    if (!parser)
      throw new Error('Invalid simple format interval');

    quality = parser[1];
    number = +parser[2];
    down = number < 0;
    number = down ? -number : number;

    lower = number > 8 ? ((number % 7) ? number % 7 : 7) : number;
    octaves = (number - lower) / 7;

    base = intervals[intervalsIndex[lower - 1]];
    coord = add(base, [octaves, 0]);

    type = base[0] <= 1 ? 'perfect' : 'minor';
    if ((type === 'perfect' && (quality === 'M' || quality === 'm')) ||
        (type === 'minor' && quality === 'P')) {
      throw new Error('Invalid interval quality');
    }

    alt = kAlterations[type].indexOf(quality) - 2;
    coord = add(coord, mul(sharp, alt));
    coord = down ? mul(coord, -1) : coord;

    return new TeoriaInterval(coord);
  };

  /**
   * Returns the note from a given note (from), with a given interval (to)
   */
  teoria.interval.from = function(from, to) {
    return new TeoriaNote(add(from.coord, to.coord));
  };

  /**
   * Returns the interval between two instances of teoria.note
   */
  teoria.interval.between = function(from, to) {
    return new TeoriaInterval(sub(to.coord, from.coord));
  };

  teoria.interval.invert = function(sInterval) {
    return teoria.interval(sInterval).invert().toString();
  };

  // teoria.scale namespace - Scales are constructed through this function.
  teoria.scale = function(tonic, scale) {
    if (!(tonic instanceof TeoriaNote))
      tonic = teoria.note(tonic);

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
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = teoria;

    exports.teoria = teoria;
  } else if (typeof this !== 'undefined')
    this.teoria = teoria;
  else if (typeof window !== 'undefined')
    window.teoria = teoria;
})();

