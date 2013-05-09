var kTriads = {
  'M': ['M3', 'P5'],
  'm': ['m3', 'P5'],
  'aug': ['M3', 'A5'],
  'dim': ['m3', 'd5'],
  'sus2': ['M2', 'P5'],
  'sus4': ['P4', 'P5'],
  'sus2#5': ['M2', 'A5'],
  'sus2b5': ['M2', 'd5'],
  'sus4#5': ['P4', 'A5'],
  'sus4b5': ['P4', 'd5'],
  'Mb5': ['M3', 'd5'],
  'm#5': ['m3', 'A5']
};

function inferTriad(notes) {
  var i, length, note, others, interval, type;

  for (i = 0, length = notes.length; i < length; i++) {
    note = notes[i];

    // Get all the other notes and map them to the interval relative to root
    others = notes.slice(0, i).concat(notes.slice(i+1)).map(function(other) {
      interval = note.interval(other);

      return interval.direction === 'down' ?
        interval.invert().simple(true) : interval.simple()
    });

    // Look through the triads hash table
    for (type in kTriads) {
      if (compareArray(kTriads[type], others)) {
        return teoria.chord(note, type);
      }
    }
  }
};

