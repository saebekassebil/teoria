/* exported inferTriad */

var kTriads = {
  '': ['M3', 'P5'],
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

// Return all combinations of k elements in set of length n
function k_combinations(set, k) {
  var i, j, combs = [], head, tailcombs, n = set.length, x;

  if (k > n || k <= 0) {
    return combs;
  } else if (k === n) {
    return [set];
  } else if (k === 1) {
    return set.map(function(el) { return [el]; });
  }

  for (i = 0; i < (n - k + 1); i++) {
    head = [set[i]];
    tailcombs = k_combinations(set.slice(i + 1), k - 1);

    for (j = 0, x = tailcombs.length; j < x; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }

  return combs;
}

function permutate(set) {
  function p(set, index, callback) {
    // Swap elements i1 and i2 in array a[]
    function swap(a, i1, i2) {
      var t = a[i1];
      a[i1] = a[i2];
      a[i2] = t;
    }

    if (index == set.length - 1) {
      callback(set);
    } else {
      p(set, index + 1, callback);

      for (var i = index + 1; i < set.length; i++) {
        swap(set, i, index);
        p(set, index + 1, callback);
        swap(set, i, index);
      }
    }
  }

  if (!set || !set.length) {
    return [];
  }

  var permutations = [];
  p(set, 0, function(a) { permutations.push(a.slice(0)); });

  return permutations;
}

// Get all possible triad combinations of a set of notes
function possibleTriads(notes) {
  var combs = [], triads = [];

  // Get all k combinations and each of their permutations
  k_combinations(notes, 3).forEach(function(comb) {
    permutate(comb).forEach(function(perm) {
      combs.push(perm);
    });
  });

  combs.forEach(function(triad) {
    var third = triad[0].interval(triad[1]);
    third = third.direction === 'down' ? third.invert().simple(true) : third.simple();
    var fifth = triad[0].interval(triad[2]);
    fifth = fifth.direction === 'down' ? fifth.invert().simple(true) : fifth.simple();

    for (var type in kTriads) {
      if (compareArray(kTriads[type], [third, fifth])) {
        triads.push({ notes: triad, type: type });
      }
    }
  });

  return triads;
}

function inferChord(notes) {
  var triads = possibleTriads(notes), chords = [];

  triads.forEach(function(triad) {
    var indexes = triad.notes.map(function(n) { return n.toString() });
    var rest = notes.filter(function(el) {
      return indexes.indexOf(el.toString()) === -1;
    });

    var root = triad.notes[0];
    var name = root.name.toUpperCase() + root.accidental.sign + triad.type;

    var exts = rest.map(function(n) { return triad.notes[0].interval(n) });

    var extensions = [], got = {};
    for (var i = 0, length = exts.length; i < length; i++) {
      var inv = exts[i].direction === 'down' ? exts[i].invert() : exts[i];
      var str = exts[i].direction === 'down' ?
        exts[i].invert().compound(true) : exts[i].compound();

      var q = inv.simple()[0];

      switch (inv.interval) {
        case 2:
        case 4:
          got[inv.interval + 7] = q;
          extensions.push(q + (inv.interval + 7));
          break;

        case 3:
          // Sus chords, don't have thirds
          if (triad.type.indexOf('sus') !== -1)
            return;

          break;

        default:
          got[inv.interval] = str.charAt(0);
          extensions.push(str);
          break;
      }
    }

    // Sort descending
    extensions.sort(function(a, b) {
      return +b.substr(1) - +a.substr(1);
    });

    var normal = ['m7', 'M9', 'P11', 'M13'];

    console.log(got);
    chords.push({ name: name, exts: extensions });
    //console.log('Chord', name, extensions);
  });

  return chords;
}

window.inferChord = inferChord;
window.k_combinations = k_combinations;
window.permutate = permutate;
window.possibleTriads = possibleTriads;
