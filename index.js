'use strict';

var Teoria = require('./lib/teoria.js');

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
