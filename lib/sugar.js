var knowledge = require('./knowledge');

module.exports = function(teoria) {
  var Note = teoria.Note;
  var Chord = teoria.Chord;
  var Scale = teoria.Scale;

  Note.prototype.chord = function(chord) {
    var isShortChord = chord in knowledge.chordShort;
    chord = isShortChord ? knowledge.chordShort[chord] : chord;

    return new Chord(this, chord);
  };

  Note.prototype.scale = function(scale) {
    return new Scale(this, scale);
  };
};
