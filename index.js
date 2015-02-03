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

// teoria.note namespace - All notes should be instantiated
// through this function.
teoria.note = function(name, duration) {
  if (typeof name === 'string')
    return TeoriaNote.fromString(name, duration);
  else
    return new TeoriaNote(name, duration);
};

teoria.note.fromKey = function(key) {
  var octave = Math.floor((key - 4) / 12);
  var distance = key - (octave * 12) - 4;
  var name = knowledge.fifths[(2 * Math.round(distance / 2) + 1) % 7];
  var note = vector.add(vector.sub(knowledge.notes[name], knowledge.A4), [octave + 1, 0]);
  var diff = (key - 49) - vector.sum(vector.mul(note, [12, 7]));

  return new TeoriaNote(diff ? vector.add(note, vector.mul(knowledge.sharp, diff)) : note);
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
    return TeoriaInterval.toCoord(from);

  if (typeof to === 'string' && from instanceof TeoriaNote)
    return teoria.interval.from(from, TeoriaInterval.toCoord(to));

  if (to instanceof TeoriaInterval && from instanceof TeoriaNote)
    return teoria.interval.from(from, to);

  if (to instanceof TeoriaNote && from instanceof TeoriaNote)
    return TeoriaInterval.between(from, to);

  throw new Error('Invalid parameters');
};


/**
 * Returns the note from a given note (from), with a given interval (to)
 */
teoria.interval.from = function(from, to) {
  return new TeoriaNote(vector.add(from.coord, to.coord));
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

teoria.TeoriaNote = TeoriaNote;
teoria.TeoriaChord = TeoriaChord;
teoria.TeoriaScale = TeoriaScale;
teoria.TeoriaInterval = TeoriaInterval;
teoria.scale.scales = scales;

require('./lib/sugar')(teoria);

exports = module.exports = teoria;
