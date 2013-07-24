function TeoriaScale(tonic, scale) {
  var scaleName, i;

  if (!(tonic instanceof TeoriaNote)) {
    throw new Error('Invalid Tonic');
  }

  if (typeof scale === 'string') {
    scaleName = scale;
    scale = teoria.scale.scales[scale];
    if (!scale)
      throw new Error('Invalid Scale');
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
  this.tonic = tonic;
  this.scale = scale;
}

TeoriaScale.prototype = {
  notes: function() {
    var notes = [];

    for (var i = 0, length = this.scale.length; i < length; i++) {
      notes.push(teoria.interval(this.tonic, this.scale[i]));
    }

    return notes;
  },

  simple: function() {
    return this.notes().map(function(n) { return n.toString(true); });
  },

  type: function() {
    var length = this.scale.length - 2;
    if (length < 8) {
      return ['di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa'][length] +
        'tonic';
    }
  },

  get: function(i) {
    i = (typeof i === 'string' && i in kStepNumber) ? kStepNumber[i] : i;

    return this.tonic.interval(this.scale[i - 1]);
  },

  solfege: function(index, showOctaves) {
    if (index)
      return this.get(index).solfege(this, showOctaves);

    return this.notes().map(function(n) {
      return n.solfege(this, showOctaves);
    });
  },

  interval: function(interval) {
    return new TeoriaScale(this.tonic.interval(interval), this.scale);
  },

  transpose: function(interval) {
    var scale = this.interval(interval);
    this.scale = scale.scale;
    this.tonic = scale.tonic;

    return this;
  }
};

