//    Teoria.js
//    http://saebekassebil.github.com/teoria
//    Copyright Jakob Miland (saebekassebil)
//    Teoria may be freely distributed under the MIT License.

var Note = require('./lib/note');
var Interval = require('./lib/interval');
var Chord = require('./lib/chord');
var Scale = require('./lib/scale');
var knowledge = require('./lib/knowledge');
var vector = require('./lib/vector');

var teoria = {};

teoria.note = function(name, duration) {
  if (typeof name === 'string')
    return Note.fromString(name, duration);
  else
    return new Note(name, duration);
};

teoria.chord = function(name, symbol) {
  if (typeof name === 'string') {
    var root, octave;
    root = name.match(/^([a-h])(x|#|bb|b?)/i);
    if (root && root[0]) {
      octave = typeof symbol === 'number' ? symbol.toString(10) : '4';
      return new Chord(Note.fromString(root[0].toLowerCase() + octave),
                            name.substr(root[0].length));
    }
  } else if (name instanceof Note)
    return new Chord(name, symbol);

  throw new Error('Invalid Chord. Couldn\'t find note name');
};

teoria.interval = function(from, to) {
  // Construct a Interval object from string representation
  if (typeof from === 'string')
    return Interval.toCoord(from);

  if (typeof to === 'string' && from instanceof Note)
    return Interval.from(from, Interval.toCoord(to));

  if (to instanceof Interval && from instanceof Note)
    return Interval.from(from, to);

  if (to instanceof Note && from instanceof Note)
    return Interval.between(from, to);

  throw new Error('Invalid parameters');
};


teoria.scale = function(tonic, scale) {
  tonic = (tonic instanceof Note) ? tonic : teoria.note(tonic);
  return new Scale(tonic, scale);
};

teoria.Note = Note;
teoria.Chord = Chord;
teoria.Scale = Scale;
teoria.Interval = Interval;

require('./lib/sugar')(teoria);

exports = module.exports = teoria;
