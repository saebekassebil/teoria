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

  TeoriaNote.prototype.interval = function(interval) {
    return teoria.interval(this, interval);
  }

  TeoriaNote.prototype.transpose = function(interval) {
    var note = teoria.interval(this, interval);
    this.coord = note.coord;

    return this;
  }

  TeoriaNote.prototype.scaleDegree = function(scale) {
    var inter = scale.tonic.interval(this);

    // If the direction is down, or we're dealing with an octave - invert it
    if (inter.direction() === 'down' ||
       (inter.coord[1] === 0 && inter.coord[0] !== 0)) {
      inter = inter.invert();
    }

    inter = inter.simple(true).coord;

    return scale.scale.reduce(function(index, current, i) {
      var coord = teoria.interval(current).coord;
      return coord[0] === inter[0] && coord[1] === inter[1] ? i + 1 : index;
    }, 0);
  }
}
