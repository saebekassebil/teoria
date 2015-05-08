var vows = require('vows'),
    assert = require('assert');

var Note = require('../lib/note.js');
var Scale = require('../lib/scale.js');

vows.describe('Scale').addBatch({
  "build a scale": function() {
    assert.deepEqual(Scale.build('C', 'major').simple(),
      ['c', 'd', 'e', 'f', 'g', 'a', 'b']);
  },
  "scale degree": function() {
    s = Scale.build('C', 'major');
  }
}).export(module);
