function TeoriaProgression(scale, progression) {
  if (!(scale instanceof TeoriaScale)) {
    throw new Error('Invalid Scale');
  }

  if (!(progression instanceof Array)) {
    throw new Error('Invalid Progression');
  }

  this.scale = scale;
  this.chords = progression.map(function(chordIndex) {
    var chord = teoria.chord(scale.tonic),
        chordLength = 3,
        voicing = [],
        voiceIndex;

    for(var i = 0; i < chordLength; i++) {
      voiceIndex = (i * 2) + (chordIndex - 1);
      voiceIndex = voiceIndex % scale.scale.length;
      voicing.push(scale.scale[voiceIndex]);
    }

    return chord.voicing(voicing);
  });
}

TeoriaProgression.prototype = {
  simple: function() {
    return this.chords.map(function(chord) {
      return chord.notes().map(function(note){
        return note.toString();
      });
    });
  }
};