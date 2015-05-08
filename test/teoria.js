var vows = require('vows'),
    assert = require('assert');

var teoria = require('../lib/teoria.js');

function assertDefined(obj, name) {
  assert(typeof(obj) !== 'undefined', name + " should be defined.");
}

vows.describe("Teoria distribution").addBatch({
  "it should export": function() {
    assertDefined(teoria, "teoria");
  },
  "teoria objects": function() {
    assertDefined(teoria.TeoriaNote, 'teoria.TeoriaNote');
    assertDefined(teoria.note, "teoria.note");
    assertDefined(teoria.note.fromString, "teoria.note.fromString");
  }
}).export(module);
