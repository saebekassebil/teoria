var knowledge = require('./knowledge');

module.exports = function(teoria) {
  var TeoriaNote = teoria.TeoriaNote;
  var TeoriaChord = teoria.TeoriaChord;

  TeoriaNote.prototype.chord = function(chord) {
    chord = (chord in knowledge.kChordShort) ? knowledge.kChordShort[chord] : chord;

    return new TeoriaChord(this, chord);
  }

  TeoriaNote.prototype.scale = function(scale) {
    return teoria.scale(this, scale);
  }
}
