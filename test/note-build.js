var vows = require('vows'),
    assert = require('assert');

Note = require('../lib/note.js');

vows.describe('TeoriaNote builder methods').addBatch({
  "fromKey": function() {
    n = Note.fromKey(40);
    assert.equal(n.toString(), 'c4');
  },
  "fromFreq": function() {
    r = Note.fromFrequency(441);
    assert.equal(r.note.toString(), 'a4');
    assert.equal(r.cents, 3.93015843943305);
  },
  "fromMIDI": function() {
    n = Note.fromMIDI(40);
    assert.equal(n.toString(), 'e2');
  },
  "fromString": function() {
    n = Note.fromString('A4');
    assert.equal(n.toString(), 'a4');
  }
}).export(module);
