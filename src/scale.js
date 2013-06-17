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
    var length = this.notes.length - 2;
    if (length < 8) {
      return ['di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa'][length] +
        'tonic';
    }
  },

  get: function(i) {
    i = (typeof i === 'string' && i in kStepNumber) ? kStepNumber[i] : i;

    return this.notes[i - 1];
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

