module.exports = {
  add: function(note, interval) {
    return [note[0] + interval[0], note[1] + interval[1]];
  },

  sub: function(note, interval) {
    return [note[0] - interval[0], note[1] - interval[1]];
  },

  mul: function(note, interval) {
    if (typeof interval === 'number')
      return [note[0] * interval, note[1] * interval];
    else
      return [note[0] * interval[0], note[1] * interval[1]];
  },

  sum: function(coord) {
    return coord[0] + coord[1];
  }
};
