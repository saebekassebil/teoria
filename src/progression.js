function TeoriaProgression(scale, progression) {
  if (!(scale instanceof TeoriaScale)) {
    throw new Error('Invalid Scale');
  }

  if (!(progression instanceof Array)) {
    throw new Error('Invalid Progression');
  }

  this.scale = scale;
  this.progression = progression;
  this.chords = progression.map(function(chordIndex) {
    var chord = teoria.chord(scale.notes()[chordIndex - 1]),
        chordLength = 3,
        voicing = [],
        noteIndex;

    for(var i = 0; i < chordLength; i++) {
      noteIndex = (chordIndex - 1) + i * 2;
      noteIndex = noteIndex % scale.notes().length;
      voicing.push(teoria.interval(chord.root, scale.notes()[noteIndex]).toString());
    }

    chord.voicing(voicing);
    return chord;
  });
}

TeoriaProgression.prototype = {
  simple: function() {
    return this.chords.map(function(chord) {
      return chord.notes().map(function(note){
        return note.toString();
      });
    });
  },
  getChord: function(i) {
    return this.chords[i];
  }
};