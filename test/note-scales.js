var vows = require('vows'),
    assert = require('assert');

Note = require('../lib/note.js');
Scale = require('../lib/scale.js');

vows.describe('TeoriaNote scale methods').addBatch({
  'Scale Degrees': {
    'Eb is scale degree 1 (tonic) in an Eb minor scale': function() {
      var note = Note.build('eb');
      assert.equal(note.scaleDegree(Scale.build('eb', 'major')), 1);
    },

    'E is scale degree 3 in a C# dorian': function() {
      var note = Note.build('e');
      assert.equal(note.scaleDegree(Scale.build('c#', 'dorian')), 3);
    },

    'C is scale degree 0 in a D major scale (not in scale)': function() {
      var note = Note.build('c');
      assert.equal(note.scaleDegree(Scale.build('d', 'major')), 0);
    },

    'Bb is scale degree 7 in a C minor': function() {
      var note = Note.build('bb');
      assert.equal(note.scaleDegree(Scale.build('c', 'minor')), 7);
    },

    'Db is scale degree 4 in an Ab major scale': function() {
      var note = Note.build('db');
      assert.equal(note.scaleDegree(Scale.build('ab', 'major')), 4);
    },

    'A# is scale degree 0 in a G minor scale': function() {
      var note = Note.build('a#');
      assert.equal(note.scaleDegree(Scale.build('g', 'minor')), 0);
    }
  }
}).export(module);
