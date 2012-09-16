function TeoriaScale(tonic, scale) {
  var scaleName, i, length;

  if (!(tonic instanceof TeoriaNote)) {
    throw new Error('Invalid Tonic');
  }

  if (typeof scale === 'string') {
    scaleName = scale;
    scale = teoria.scale.scales[scale];
    if (!scale) {
      throw new Error('Invalid Scale');
    }
  } else {
    for (i in teoria.scale.scales) {
      if (teoria.scale.scales.hasOwnProperty(i)) {
        if (teoria.scale.scales[i].toString() === scale.toString()) {
          scaleName = i;
          break;
        }
      }
    }
  }

  this.name = scaleName;
  this.notes = [];
  this.tonic = tonic;
  this.scale = scale;

  for (i = 0, length = scale.length; i < length; i++) {
    this.notes.push(teoria.interval(tonic, scale[i]));
  }
}

TeoriaScale.prototype = {
  simple: function() {
    var sNotes = [];

    for (var i = 0, length = this.notes.length; i < length; i++) {
      sNotes.push(this.notes[i].toString(true));
    }

    return sNotes;
  },

  type: function() {
    var name = null, length = this.notes.length;
    if (length === 2) {
      name = 'ditonic';
    } else if (length === 3) {
      name = 'tritonic';
    } else if (length === 4) {
      name = 'tetratonic';
    } else if (length === 5) {
      name = 'pentatonic';
    } else if (length === 6) {
      name = 'hexatonic';
    } else if (length === 7) {
      name = 'heptatonic';
    } else if (length === 8) {
      name = 'octatonic';
    }

    return name;
  },

  get: function(i) {
    if (typeof i === 'number') {
      return (i > 0 && i <= this.notes.length) ? this.notes[i - 1] : null;
    } else if (typeof i === 'string' && i in kStepNumber) {
      i = parseFloat(kStepNumber[i]);
      return (i > 0 && i <= this.notes.length) ? this.notes[i - 1] : null;
    }
  },

  solfege: function(index, showOctaves) {
    var i, length, solfegeArray = [];

    // Return specific index in scale
    if (index) {
      return this.get(index).solfege(this, showOctaves);
    }

    // Return an array of solfege syllables
    for (i = 0, length = this.notes.length; i < length; i++) {
      solfegeArray.push(this.notes[i].solfege(this, showOctaves));
    }

    return solfegeArray;
  },

  interval: function(interval, direction) {
    return new TeoriaScale(this.tonic.interval(interval, direction),
                           this.scale);
  },

  transpose: function(interval, direction) {
    var scale = new TeoriaScale(this.tonic.interval(interval, direction),
                                this.scale);
    this.notes = scale.notes;
    this.scale = scale.scale;
    this.tonic = scale.tonic;

    return this;
  }
};

