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
    var root = scale.notes()[chordIndex - 1],
        chordLength = 3,
        voicing = [],
        noteIndex,
        interval;

    for(var i = 1; i < chordLength; i++) {
      noteIndex = (chordIndex - 1) + (i * 2);
      noteIndex = noteIndex % scale.notes().length;
      interval = teoria.interval(root, scale.notes()[noteIndex]);
      interval = interval.direction() === 'down' ? interval.invert() : interval;
      voicing.push(interval.toString());
    }

    return teoria.chord(root, findMatchingSymbol(voicing));
  });

  function findMatchingSymbol(intervals) {
    for(var kSymbol in kSymbols) {
      var symbolIntervals = kSymbols[kSymbol];
      if(arraysIdentical(intervals, symbolIntervals)) {
        return kSymbol;
      }
    }
    return '';
  }

  function arraysIdentical(a, b) {
    var i = a.length;
    if (i !== b.length) return false;
    while (i--) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
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