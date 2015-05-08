/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Teoria = __webpack_require__(1);

	// Add sugar methods
	Teoria.TeoriaNote.prototype.scale = function(scale) {
	  return Teoria.TeoriaScale.build(this, scale);
	}

	var kChordShort = {
	  'major': 'M',
	  'minor': 'm',
	  'augmented': 'aug',
	  'diminished': 'dim',
	  'half-diminished': '7b5',
	  'power': '5',
	  'dominant': '7'
	};
	Teoria.TeoriaNote.prototype.chord = function(chord) {
	  chord = (chord in kChordShort) ? kChordShort[chord] : chord;

	  return new Teoria.TeoriaChord(this, chord);
	}

	if(typeof(window) !== 'undefined') window.teoria = Teoria;

	module.exports = Teoria;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var TeoriaInterval = __webpack_require__(2);
	var TeoriaNote = __webpack_require__(3);
	var TeoriaChord = __webpack_require__(4);
	var TeoriaScale = __webpack_require__(5);

	var Teoria = { ver: "a" };

	Teoria.note = TeoriaNote.build;
	Teoria.note.fromKey = TeoriaNote.fromKey;
	Teoria.note.fromFrequency = TeoriaNote.fromFrequency;
	Teoria.note.fromMIDI = TeoriaNote.fromMIDI;
	Teoria.note.fromString = TeoriaNote.fromString;

	Teoria.chord = TeoriaChord.build;

	Teoria.interval = function(from, to) {
	  // Construct a TeoriaInterval object from string representation
	  if (typeof from === 'string')
	    return TeoriaInterval.fromString(from);

	  if (typeof to === 'string' && from instanceof TeoriaNote)
	    return TeoriaNote.transpose(from, TeoriaInterval.fromString(to));

	  if (to instanceof TeoriaInterval && from instanceof TeoriaNote)
	    return TeoriaNote.transpose(from, to);

	  if (to instanceof TeoriaNote && from instanceof TeoriaNote)
	    return TeoriaInterval.between(from, to);

	  throw new Error('Invalid parameters');
	};

	Teoria.interval.from = TeoriaNote.transpose;
	Teoria.interval.between = TeoriaInterval.between;
	Teoria.interval.invert = TeoriaInterval.invert;

	Teoria.scale = TeoriaScale.build;
	Teoria.Scales = TeoriaScale.Scales;

	Teoria.TeoriaNote = TeoriaNote;
	Teoria.TeoriaChord = TeoriaChord;
	Teoria.TeoriaScale = TeoriaScale;
	Teoria.TeoriaInterval = TeoriaInterval;

	module.exports = Teoria;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var vector = __webpack_require__(6);

	var sharp = [-4, 7];

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

	var intervalsIndex = ['unison', 'second', 'third', 'fourth', 'fifth',
	  'sixth', 'seventh', 'octave', 'ninth', 'tenth',
	  'eleventh', 'twelfth', 'thirteenth', 'fourteenth',
	  'fifteenth'];
	var intervalFromFifth = ['second', 'sixth', 'third', 'seventh', 'fourth',
	  'unison', 'fifth'];
	var kAlterations = {
	    perfect: ['dd', 'd', 'P', 'A', 'AA'],
	    minor: ['dd', 'd', 'm', 'M', 'A', 'AA']
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

	function TeoriaInterval(coord) {
	  this.coord = coord;
	}

	/**
	* Returns the interval between two instances of teoria.note
	*/
	TeoriaInterval.between = function(from, to) {
	  return new TeoriaInterval(vector.sub(to.coord, from.coord));
	}

	TeoriaInterval.invert = function(sInterval) {
	  return TeoriaInterval.fromString(sInterval).invert().toString();
	}

	TeoriaInterval.fromString = function(simple) {
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
	  coord = vector.add(base, [octaves, 0]);

	  type = base[0] <= 1 ? 'perfect' : 'minor';
	  if ((type === 'perfect' && (quality === 'M' || quality === 'm')) ||
	      (type === 'minor' && quality === 'P')) {
	    throw new Error('Invalid interval quality');
	  }

	  alt = kAlterations[type].indexOf(quality) - 2;
	  coord = vector.add(coord, vector.mul(sharp, alt));
	  coord = down ? vector.mul(coord, -1) : coord;

	  return new TeoriaInterval(coord);
	}

	TeoriaInterval.prototype = {
	  name: function() {
	    return intervalsIndex[this.number() - 1];
	  },

	  semitones: function() {
	    return vector.sum(vector.mul(this.coord, [12, 7]));
	  },

	  number: function() {
	    return Math.abs(this.value());
	  },

	  value: function() {
	    var without = vector.sub(this.coord,
	      vector.mul(sharp, Math.floor((this.coord[1] - 2) / 7) + 1))

	    var i = intervalFromFifth[without[1] + 5];
	    var val = kStepNumber[i] + (without[0] - intervals[i][0]) * 7;

	    return (val > 0) ? val : val - 2;
	  },

	  type: function() {
	    return intervals[this.base()][0] <= 1 ? 'perfect' : 'minor';
	  },

	  base: function() {
	    var fifth = vector.sub(this.coord, vector.mul(sharp, this.qualityValue()))[1], name;
	    fifth = this.value() > 0 ? fifth + 5 : -(fifth - 5) % 7;
	    fifth = fifth < 0 ? intervalFromFifth.length + fifth : fifth;

	    name = intervalFromFifth[fifth];
	    if (name === 'unison' && this.number() >= 8)
	      name = 'octave';

	    return name;
	  },

	  direction: function(dir) {
	    if (dir) {
	      var is = this.value() >= 1 ? 'up' : 'down';
	      if (is !== dir)
	        this.coord = vector.mul(this.coord, -1);

	      return this;
	    }
	    else
	      return this.value() >= 1 ? 'up' : 'down';
	  },

	  simple: function(ignore) {
	    // Get the (upwards) base interval (with quality)
	    var simple = intervals[this.base()];
	    simple = vector.add(simple, vector.mul(sharp, this.qualityValue()));

	    // Turn it around if necessary
	    if (!ignore)
	      simple = this.direction() === 'down' ? vector.mul(simple, -1) : simple;

	    return new TeoriaInterval(simple);
	  },

	  isCompound: function() {
	    return this.number() > 8;
	  },

	  octaves: function() {
	    var without, octaves;

	    if (this.direction() === 'up') {
	      without = vector.sub(this.coord, vector.mul(sharp, this.qualityValue()));
	      octaves = without[0] - intervals[this.base()][0];
	    } else {
	      without = vector.sub(this.coord, vector.mul(sharp, -this.qualityValue()));
	      octaves = -(without[0] + intervals[this.base()][0]);
	    }

	    return octaves;
	  },

	  invert: function() {
	    var i = this.base();
	    var qual = this.qualityValue();
	    var acc = this.type() === 'minor' ? -(qual - 1) : -qual;
	    var coord = intervals[intervalsIndex[9 - kStepNumber[i] - 1]];
	    coord = vector.add(coord, vector.mul(sharp, acc));

	    return new TeoriaInterval(coord);
	  },

	  quality: function(lng) {
	    var quality = kAlterations[this.type()][this.qualityValue() + 2];

	    return lng ? kQualityLong[quality] : quality;
	  },

	  qualityValue: function() {
	    if (this.direction() === 'down')
	      return Math.floor((-this.coord[1] - 2) / 7) + 1;
	    else
	      return Math.floor((this.coord[1] - 2) / 7) + 1;
	  },

	  equal: function(interval) {
	      return this.coord[0] === interval.coord[0] &&
	          this.coord[1] === interval.coord[1];
	  },

	  greater: function(interval) {
	    var semi = this.semitones();
	    var isemi = interval.semitones();

	    // If equal in absolute size, measure which interval is bigger
	    // For example P4 is bigger than A3
	    return (semi === isemi) ?
	      (this.number() > interval.number()) : (semi > isemi);
	  },

	  smaller: function(interval) {
	    return !this.equal(interval) && !this.greater(interval);
	  },

	  add: function(interval) {
	    return new TeoriaInterval(vector.add(this.coord, interval.coord));
	  },

	  toString: function(ignore) {
	    // If given true, return the positive value
	    var number = ignore ? this.number() : this.value();

	    return this.quality() + number;
	  }
	};

	module.exports = TeoriaInterval;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var vector = __webpack_require__(6);
	var Interval = __webpack_require__(2);

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Interval = __webpack_require__(2);
	var Note = __webpack_require__(3);

	var kSymbols = {
	  'm': ['m3', 'P5'],
	  'mi': ['m3', 'P5'],
	  'min': ['m3', 'P5'],
	  '-': ['m3', 'P5'],

	  'M': ['M3', 'P5'],
	  'ma': ['M3', 'P5'],
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

	function TeoriaChord(root, name) {
	  name = name || '';
	  this.name = root.name().toUpperCase() + root.accidental() + name;
	  this.symbol = name;
	  this.root = root;
	  this.intervals = [];
	  this._voicing = [];

	  var i, length, c, shortQ, parsing = 'quality', additionals = [],
	      notes = ['P1', 'M3', 'P5', 'm7', 'M9', 'P11', 'M13'],
	      chordLength = 2, bass, symbol, explicitMajor = false;

	  function setChord(intervals) {
	    for (var n = 0, chordl = intervals.length; n < chordl; n++) {
	      notes[n + 1] = intervals[n];
	    }

	    chordLength = intervals.length;
	  }

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
	    if (!(c = name[i])) {
	      break;
	    }

	    switch (parsing) {
	      // Parses for the "base" chord, either a triad or a seventh chord
	      case 'quality':
	        var sub3 = (i + 2) < length ? name.substr(i, 3).toLowerCase() : null;
	        var sub2 = (i + 1) < length ? name.substr(i, 2).toLowerCase() : null;

	        if (sub3 in kSymbols)
	          symbol = sub3;
	        else if (sub2 in kSymbols)
	          symbol = sub2;
	        else if (c in kSymbols)
	          symbol = c;
	        else
	          symbol = '';

	        setChord(kSymbols[symbol]);

	        if (symbol === 'M' || symbol === 'ma' || symbol === 'maj')
	          explicitMajor = true;

	        i += symbol.length - 1;
	        parsing = 'extension';
	        break;

	      // Parses for the top interval or a pure sixth
	      case 'extension':
	        c = (c === '1' && name[i + 1]) ?
	          parseFloat(name.substr(i, 2)) : parseFloat(c);

	        if (!isNaN(c) && c !== 6) {
	          chordLength = (c - 1) / 2;

	          if (chordLength !== Math.round(chordLength)) {
	            throw new Error('Invalid interval extension: ' + c.toString(10));
	          }

	          // Special care for diminished chords
	          if (symbol === 'o' || symbol === 'dim') {
	            notes[3] = 'd7';
	          } else if (explicitMajor) {
	            notes[3] = 'M7';
	          }

	          i += String(c).length - 1;
	        } else if (c === 6) {
	          notes[3] = 'M6';
	          chordLength = (chordLength < 3) ? 3 : chordLength;
	        } else {
	          i -= 1;
	        }

	        parsing = 'alterations';
	        break;

	      // Parses for possible alterations of intervals (#5, b9, etc.)
	      case 'alterations':
	        var alterations = name.substr(i).split(/(#|b|add|maj|sus|M)/i),
	            next, flat = false, sharp = false;

	        if (alterations.length === 1) {
	          throw new Error('Invalid alterations');
	        } else if (alterations[0].length !== 0) {
	          throw new Error('Invalid token: \'' + alterations[0] + '\'');
	        }

	        for (var a = 1, aLength = alterations.length; a < aLength; a++) {
	          next = alterations[a + 1];

	          switch (alterations[a]) {
	          case 'M':
	          case 'Maj':
	          case 'maj':
	            chordLength = (chordLength < 3) ? 3 : chordLength;

	            if (next === '7') { // Ignore the seventh, that is already implied
	              a++;
	            }

	            notes[3] = 'M7';
	            break;

	          case 'Sus':
	          case 'sus':
	            var type = 'P4';
	            if (next === '2' || next === '4') {
	              a++;

	              if (next === '2') {
	                type = 'M2';
	              }
	            }

	            notes[1] = type; // Replace third with M2 or P4
	            break;

	          case 'Add':
	          case 'add':
	            if (next && !isNaN(+next)) {
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
	            if (alterations[a].length === 0) {
	              break;
	            }

	            var token = +alterations[a], quality, intPos;
	            if (isNaN(token) ||
	                String(token).length !== alterations[a].length) {
	              throw new Error('Invalid token: \'' + alterations[a] + '\'');
	            }

	            if (token === 6) {
	              if (sharp) {
	                notes[3] = 'A6';
	              } else if (flat) {
	                notes[3] = 'm6';
	              } else {
	                notes[3] = 'M6';
	              }

	              chordLength = (chordLength < 3) ? 3 : chordLength;
	              continue;
	            }

	            // Calculate the position in the 'note' array
	            intPos = (token - 1) / 2;
	            if (chordLength < intPos) {
	              chordLength = intPos;
	            }

	            if (token < 5 || token === 7 ||
	                intPos !== Math.round(intPos)) {
	              throw new Error('Invalid interval alteration: ' + token);
	            }

	            quality = notes[intPos][0];

	            // Alterate the quality of the interval according the accidentals
	            if (sharp) {
	              if (quality === 'd') {
	                quality = 'm';
	              } else if (quality === 'm') {
	                quality = 'M';
	              } else if (quality === 'M' || quality === 'P') {
	                quality = 'A';
	              }
	            } else if (flat) {
	              if (quality === 'A') {
	                quality = 'M';
	              } else if (quality === 'M') {
	                quality = 'm';
	              } else if (quality === 'm' || quality === 'P') {
	                quality = 'd';
	              }
	            }

	            sharp = flat = false;
	            notes[intPos] = quality + token;
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

	  // Sixth-nine chord is an exception to the bass rule (e.g. C6/9)
	  if (bass && bass === '9') {
	    additionals.push('M9');
	    bass = null;
	  }

	  this.intervals = notes
	    .slice(0, chordLength + 1)
	    .concat(additionals)
	    .map(function(i) { return Interval.fromString(i); });

	  for (i = 0, length = this.intervals.length; i < length; i++) {
	    this._voicing[i] = this.intervals[i];
	  }

	  if (bass) {
	    var intervals = this.intervals, bassInterval, note;
	    // Make sure the bass is atop of the root note
	    note = Note.build(bass + (root.octave() + 1));

	    bassInterval = Interval.between(root, note);
	    bass = bassInterval.simple();

	    bassInterval = bassInterval.invert();
	    bassInterval.direction('down');

	    this._voicing = [bassInterval];
	    for (i = 0; i < length; i++) {
	      if (intervals[i].simple().equal(bass))
	        continue;

	      this._voicing.push(intervals[i]);
	    }
	  }
	}

	TeoriaChord.build  = function(name, symbol) {
	  if (typeof name === 'string') {
	    var root, octave;
	    root = name.match(/^([a-h])(x|#|bb|b?)/i);
	    if (root && root[0]) {
	      octave = typeof symbol === 'number' ? symbol.toString(10) : '4';
	      return new TeoriaChord(Note.build(root[0].toLowerCase() + octave),
	                            name.substr(root[0].length));
	    }
	  } else if (name instanceof Note)
	    return new TeoriaChord(name, symbol);

	  throw new Error('Invalid Chord. Couldn\'t find note name');
	};

	TeoriaChord.prototype = {
	  notes: function() {
	    var voicing = this.voicing(), notes = [];

	    for (var i = 0, length = voicing.length; i < length; i++) {
	      notes.push(Note.transpose(this.root, voicing[i]));
	    }

	    return notes;
	  },

	  voicing: function(voicing) {
	    // Get the voicing
	    if (!voicing) {
	      return this._voicing;
	    }

	    // Set the voicing
	    this._voicing = [];
	    for (var i = 0, length = voicing.length; i < length; i++) {
	      this._voicing[i] = teoria.interval(voicing[i]);
	    }

	    return this;
	  },

	  resetVoicing: function() {
	    this._voicing = this.intervals;
	  },

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
	    var quality = this.quality();

	    if (this.chordType() !== 'triad' || quality === 'diminished' ||
	        quality === 'augmented') {
	      throw new Error('Only major/minor triads have parallel chords');
	    }

	    if (quality === 'major') {
	      return new TeoriaChord(this.root.interval('m3', 'down'), 'm');
	    } else {
	      return new TeoriaChord(this.root.interval('m3', 'up'));
	    }
	  },

	  quality: function() {
	    var third, fifth, seventh, intervals = this.intervals;

	    for (var i = 0, length = intervals.length; i < length; i++) {
	      if (intervals[i].number() === 3) {
	        third = intervals[i];
	      } else if (intervals[i].number() === 5) {
	        fifth = intervals[i];
	      } else if (intervals[i].number() === 7) {
	        seventh = intervals[i];
	      }
	    }

	    if (!third) {
	      return;
	    }

	    third = (third.direction() === 'down') ? third.invert() : third;
	    third = third.simple().toString();

	    if (fifth) {
	      fifth = (fifth.direction === 'down') ? fifth.invert() : fifth;
	      fifth = fifth.simple().toString();
	    }

	    if (seventh) {
	      seventh = (seventh.direction === 'down') ? seventh.invert() : seventh;
	      seventh = seventh.simple().toString();
	    }

	    if (third === 'M3') {
	      if (fifth === 'A5') {
	        return 'augmented';
	      } else if (fifth === 'P5') {
	        return (seventh === 'm7') ? 'dominant' : 'major';
	      }

	      return 'major';
	    } else if (third === 'm3') {
	      if (fifth === 'P5') {
	        return 'minor';
	      } else if (fifth === 'd5') {
	        return (seventh === 'm7') ? 'half-diminished' : 'diminished';
	      }

	      return 'minor';
	    }
	  },

	  chordType: function() { // In need of better name
	    var length = this.intervals.length, interval, has, invert, i, name;

	    if (length === 2) {
	      return 'dyad';
	    } else if (length === 3) {
	      has = {first: false, third: false, fifth: false};
	      for (i = 0; i < length; i++) {
	        interval = this.intervals[i];
	        invert = interval.invert();
	        if (interval.base() in has) {
	          has[interval.base()] = true;
	        } else if (invert.base() in has) {
	          has[invert.base()] = true;
	        }
	      }

	      name = (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
	    } else if (length === 4) {
	      has = {first: false, third: false, fifth: false, seventh: false};
	      for (i = 0; i < length; i++) {
	        interval = this.intervals[i];
	        invert = interval.invert();
	        if (interval.base() in has) {
	          has[interval.base()] = true;
	        } else if (invert.base() in has) {
	          has[invert.base()] = true;
	        }
	      }

	      if (has.first && has.third && has.fifth && has.seventh) {
	        name = 'tetrad';
	      }
	    }

	    return name || 'unknown';
	  },

	  get: function(interval) {
	    if (typeof interval === 'string' && interval in kStepNumber) {
	      var intervals = this.intervals, i, length;

	      interval = kStepNumber[interval];
	      for (i = 0, length = intervals.length; i < length; i++) {
	        if (intervals[i].number() === interval) {
	          return teoria.interval.from(this.root, intervals[i]);
	        }
	      }

	      return null;
	    } else {
	      throw new Error('Invalid interval name');
	    }
	  },

	  interval: function(interval) {
	    return new TeoriaChord(this.root.interval(interval), this.symbol);
	  },

	  transpose: function(interval) {
	    this.root.transpose(interval);
	    this.name = this.root.name().toUpperCase() +
	                this.root.accidental() + this.symbol;

	    return this;
	  },

	  toString: function() {
	    return this.name;
	  }
	};

	module.exports = TeoriaChord;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Note = __webpack_require__(3);

	function TeoriaScale(tonic, scale) {
	  var scaleName, i;

	  if (!(tonic instanceof Note)) {
	    throw new Error('Invalid Tonic');
	  }

	  if (typeof scale === 'string') {
	    scaleName = scale;
	    scale = TeoriaScale.Scales[scale];
	    if (!scale) {
	      throw new Error('Invalid Scale: ' + scaleName);
	    }
	  } else {
	    for (i in TeoriaScale.Scales) {
	      if (TeoriaScale.Scales.hasOwnProperty(i)) {
	        if (TeoriaScale.Scales[i].toString() === scale.toString()) {
	          scaleName = i;
	          break;
	        }
	      }
	    }
	  }

	  this.name = scaleName;
	  this.tonic = tonic;
	  this.scale = scale;
	}

	TeoriaScale.build = function(tonic, scale) {
	  if (!(tonic instanceof Note))
	    tonic = Note.build(tonic);

	  return new TeoriaScale(tonic, scale);
	};

	TeoriaScale.Scales = __webpack_require__(7);

	TeoriaScale.prototype = {
	  notes: function() {
	    var notes = [];

	    for (var i = 0, length = this.scale.length; i < length; i++) {
	      notes.push(this.tonic.interval(this.scale[i]));
	    }

	    return notes;
	  },

	  simple: function() {
	    return this.notes().map(function(n) { return n.toString(true); });
	  },

	  type: function() {
	    var length = this.scale.length - 2;
	    if (length < 8) {
	      return ['di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa'][length] +
	        'tonic';
	    }
	  },

	  get: function(i) {
	    i = (typeof i === 'string' && i in kStepNumber) ? kStepNumber[i] : i;

	    return this.tonic.interval(this.scale[i - 1]);
	  },

	  solfege: function(index, showOctaves) {
	    if (index)
	      return this.get(index).solfege(this, showOctaves);

	    return this.notes().map(function(n) {
	      return n.solfege(this, showOctaves);
	    });
	  },

	  interval: function(interval) {
	    return new TeoriaScale(this.tonic.interval(interval), this.scale);
	  },

	  transpose: function(interval) {
	    var scale = this.interval(interval);
	    this.scale = scale.scale;
	    this.tonic = scale.tonic;

	    return this;
	  }
	};

	module.exports = TeoriaScale;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

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

	module.exports = { add: add, sub: sub, mul: mul, sum: sum };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	  'use strict';

	  var Scales = {};
	  Scales.ionian = Scales.major =
	    ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'];
	  Scales.dorian = ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'];
	  Scales.phrygian = ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'];
	  Scales.lydian = ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'];
	  Scales.mixolydian = ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'];
	  Scales.aeolian = Scales.minor =
	    ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'];
	  Scales.locrian = ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'];
	  Scales.majorpentatonic = ['P1', 'M2', 'M3', 'P5', 'M6'];
	  Scales.minorpentatonic = ['P1', 'm3', 'P4', 'P5', 'm7'];
	  Scales.chromatic = Scales.harmonicchromatic =
	    ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7'];

	module.exports = Scales;


/***/ }
/******/ ]);