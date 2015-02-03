//    Teoria.js
//    http://saebekassebil.github.com/teoria
//    Copyright Jakob Miland (saebekassebil)
//    Teoria may be freely distributed under the MIT License.

var TeoriaNote = require('./lib/note');
var TeoriaInterval = require('./lib/interval');
var TeoriaChord = require('./lib/chord');
var TeoriaScale = require('./lib/scale');
var scales = require('./lib/scales');
var knowledge = require('./lib/knowledge');
var vector = require('./lib/vector');

var teoria = {};

teoria.note = function(name, duration) {
  if (typeof name === 'string')
    return TeoriaNote.fromString(name, duration);
  else
    return new TeoriaNote(name, duration);
};

teoria.chord = function(name, symbol) {
  if (typeof name === 'string') {
    var root, octave;
    root = name.match(/^([a-h])(x|#|bb|b?)/i);
    if (root && root[0]) {
      octave = typeof symbol === 'number' ? symbol.toString(10) : '4';
      return new TeoriaChord(TeoriaNote.fromString(root[0].toLowerCase() + octave),
                            name.substr(root[0].length));
    }
  } else if (name instanceof TeoriaNote)
    return new TeoriaChord(name, symbol);

  throw new Error('Invalid Chord. Couldn\'t find note name');
};

teoria.interval = function(from, to) {
  // Construct a TeoriaInterval object from string representation
  if (typeof from === 'string')
    return TeoriaInterval.toCoord(from);

  if (typeof to === 'string' && from instanceof TeoriaNote)
    return TeoriaInterval.from(from, TeoriaInterval.toCoord(to));

  if (to instanceof TeoriaInterval && from instanceof TeoriaNote)
    return TeoriaInterval.from(from, to);

  if (to instanceof TeoriaNote && from instanceof TeoriaNote)
    return TeoriaInterval.between(from, to);

  throw new Error('Invalid parameters');
};


teoria.scale = function(tonic, scale) {
  tonic = (tonic instanceof TeoriaNote) ? tonic : teoria.note(tonic);
  return new TeoriaScale(tonic, scale);
};

teoria.TeoriaNote = TeoriaNote;
teoria.TeoriaChord = TeoriaChord;
teoria.TeoriaScale = TeoriaScale;
teoria.TeoriaInterval = TeoriaInterval;
teoria.scale.scales = scales;

require('./lib/sugar')(teoria);

exports = module.exports = teoria;
