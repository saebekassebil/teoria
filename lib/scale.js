'use strict';

var Note = require('./note.js');

function TeoriaScale(tonic, scale) {
  var scaleName, i;

  if (!(tonic instanceof Note)) {
    throw new Error('Invalid Tonic');
  }

  if (typeof scale === 'string') {
    scaleName = scale;
    scale = TeoriaScale.Scales[scale];
    if (!scale) {
      throw new Error('Invalid Scale: ' + scaleName);
    }
  } else {
    for (i in TeoriaScale.Scales) {
      if (TeoriaScale.Scales.hasOwnProperty(i)) {
        if (TeoriaScale.Scales[i].toString() === scale.toString()) {
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

TeoriaScale.build = function(tonic, scale) {
  if (!(tonic instanceof Note))
    tonic = Note.build(tonic);

  return new TeoriaScale(tonic, scale);
};

TeoriaScale.Scales = require('./scales.js');

TeoriaScale.prototype = {
  notes: function() {
    var notes = [];

    for (var i = 0, length = this.scale.length; i < length; i++) {
      notes.push(this.tonic.interval(this.scale[i]));
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

module.exports = TeoriaScale;
