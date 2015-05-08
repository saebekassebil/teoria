'use strict';

var TeoriaInterval = require('./interval.js');
var TeoriaNote = require('./note.js');
var TeoriaChord = require('./chord.js');
var TeoriaScale = require('./scale.js');

var Teoria = {};

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
