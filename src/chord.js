function TeoriaChord(root, name) {
  if (!(root instanceof TeoriaNote)) {
    return null;
  }

  name = name || '';
  this.name = root.name.toUpperCase() + root.accidental.sign + name;
  this.symbol = name;
  this.root = root;
  this.notes = [root];

  var i, length, c, strQuality, parsing = 'quality', additionals = [],
      notes = ['M3', 'P5', 'm7', 'M9', 'P11', 'M13'],
      chordLength = 2, bass, note, symbol;

  function setChord(intervals) {
    for (var n = 0, chordl = intervals.length; n < chordl; n++) {
      notes[n] = intervals[n];
    }

    chordLength = intervals.length;
  }

  // Remove whitespace, commas and parentheses
  name = name.replace(/[,\s\(\)]/g, '');
  bass = name.split('/');
  if (bass.length === 2) {
    name = bass[0];
    bass = bass[1];
  } else {
    bass = null;
  }

  for (i = 0, length = name.length; i < length; i++) {
    if (!(c = name[i])) {
      break;
    }

    switch (parsing) {
      // Parses for the "base" chord, either a triad or a seventh chord
      case 'quality':
        strQuality = ((i + 3) <= length) ? name.substr(i, 3) : null;
        symbol = (strQuality in kSymbols) ?
          strQuality : (c in kSymbols) ? c : '';

        setChord(kSymbols[symbol]);

        i += symbol.length - 1;
        parsing = 'extension';
        break;

      // Parses for the top interval or a pure sixth
      case 'extension':
        c = (c === '1' && name[i + 1]) ?
          parseFloat(name.substr(i, 2)) : parseFloat(c);

        if (!isNaN(c) && c !== 6) {
          chordLength = (c - 1) / 2;

          if (chordLength !== Math.round(chordLength)) {
            throw new Error('Invalid interval extension: ' + c.toString(10));
          }

          // Special care for diminished chords
          if (symbol === 'o' || symbol === 'dim') {
            notes[2] = 'd7';
          }

          i += String(c).length - 1;
        } else if (c === 6) {
          notes[2] = 'M6';
          chordLength = (chordLength < 3) ? 3 : chordLength;
        } else {
          i -= 1;
        }

        parsing = 'alterations';
        break;

      // Parses for possible alterations of intervals (#5, b9, etc.)
      case 'alterations':
        var alterations = name.substr(i).split(/(#|b|add|maj|sus|M)/),
            next, flat = false, sharp = false;

        if (alterations.length === 1) {
          throw new Error('Invalid alterations');
        } else if (alterations[0].length !== 0) {
          throw new Error('Invalid token: \'' + alterations[0] + '\'');
        }

        for (var a = 1, aLength = alterations.length; a < aLength; a++) {
          next = alterations[a + 1];

          switch (alterations[a]) {
          case 'M':
          case 'maj':
            chordLength = (chordLength < 3) ? 3 : chordLength;

            if (next === '7') { // Ignore the seventh, that is already implied
              a++;
            }

            notes[2] = 'M7';
            break;

          case 'sus':
            var type = 'P4';
            if (next === '2' || next === '4') {
              a++;

              if (next === '2') {
                type = 'M2';
              }
            }

            notes[0] = type; // Replace third with M2 or P4
            break;

          case 'add':
            if (next && !isNaN(parseInt(next, 10))) {
              if (next === '9') {
                additionals.push('M9');
              } else if (next === '11') {
                additionals.push('P11');
              } else if (next === '13') {
                additionals.push('M13');
              }

              a += next.length;
            }
            break;

          case 'b':
            flat = true;
            break;

          case '#':
            sharp = true;
            break;

          default:
            if (alterations[a].length === 0) {
              break;
            }

            var token = parseInt(alterations[a], 10), quality,
                interval = parseInt(alterations[a], 10), intPos;
            if (isNaN(token) ||
                String(token).length !== alterations[a].length) {
              throw new Error('Invalid token: \'' + alterations[a] + '\'');
            }

            if (token === 6) {
              if (sharp) {
                notes[2] = 'A6';
              } else if (flat) {
                notes[2] = 'm6';
              } else {
                notes[2] = 'M6';
              }

              chordLength = (chordLength < 3) ? 3 : chordLength;
              continue;
            }

            // Calculate the position in the 'note' array
            intPos = (interval - 1) / 2 - 1;
            if (chordLength < intPos + 1) {
              chordLength = intPos + 1;
            }

            if (interval < 5 || interval === 7 ||
                intPos !== Math.round(intPos)) {
              throw new Error('Invalid interval alteration: ' +
                  interval.toString(10));
            }

            quality = notes[intPos][0];

            // Alterate the quality of the interval according the accidentals
            if (sharp) {
              if (quality === 'd') {
                quality = 'm';
              } else if (quality === 'm') {
                quality = 'M';
              } else if (quality === 'M' || quality === 'P') {
                quality = 'A';
              }
            } else if (flat) {
              if (quality === 'A') {
                quality = 'M';
              } else if (quality === 'M') {
                quality = 'm';
              } else if (quality === 'm' || quality === 'P') {
                quality = 'd';
              }
            }

            notes[intPos] = quality + interval;
            break;
          }
        }

        parsing = 'ended';
        break;
    }

    if (parsing === 'ended') {
      break;
    }
  }

  notes = notes.slice(0, chordLength).concat(additionals);
  if (bass) {
    bass = teoria.note(bass);
    var bassInterval = teoria.interval.between(root, bass);
    bass.octave -= (bassInterval.direction === 'up') ? 1 : 0;

    this.notes.splice(0, 0, bass);
  }

  for (i = 0; i < notes.length; i++) {
    note = this.root.interval(notes[i]);
    if (bass && note.toString(true) === bass.toString(true)) {
      continue;
    }

    this.notes.push(note);
  }
}

TeoriaChord.prototype = {
  dominant: function(additional) {
    additional = additional || '';
    return new TeoriaChord(this.root.interval('P5'), additional);
  },

  subdominant: function(additional) {
    additional = additional || '';
    return new TeoriaChord(this.root.interval('P4'), additional);
  },

  parallel: function(additional) {
    additional = additional || '';
    var quality = this.quality();

    if (this.chordType() !== 'triad' || quality === 'diminished' ||
        quality === 'augmented') {
      throw new Error('Only major/minor triads have parallel chords');
    }

    if (quality === 'major') {
      return new TeoriaChord(this.root.interval('m3', 'down'), 'm');
    } else {
      return new TeoriaChord(this.root.interval('m3', 'up'));
    }
  },

  quality: function() {
    var third = this.get('third'),
        fifth = this.get('fifth'),
        seventh = this.get('seventh');

    if (!third) {
      return;
    }

    third = this.root.interval(third);
    third = (third.direction === 'down') ? third.invert() : third;
    third = third.simple();

    if (fifth) {
      fifth = this.root.interval(fifth);
      fifth = (fifth.direction === 'down') ? fifth.invert() : fifth;
      fifth = fifth.simple();
    }

    if (seventh) {
      seventh = this.root.interval(seventh);
      seventh = (seventh.direction === 'down') ? seventh.invert() : seventh;
      seventh = seventh.simple();
    }

    if (third === 'M3') {
      if (fifth === 'A5') {
        return 'augmented';
      } else if (fifth === 'P5') {
        return (seventh === 'm7') ? 'dominant' : 'major';
      }

      return 'major';
    } else if (third === 'm3') {
      if (fifth === 'P5') {
        return 'minor';
      } else if (fifth === 'd5') {
        return (seventh === 'm7') ? 'half-diminished' : 'diminished';
      }

      return 'minor';
    }
  },

  chordType: function() { // In need of better name
    var length = this.notes.length, interval, has, invert, i, name;

    if (length === 2) {
      return 'dyad';
    } else if (length === 3) {
      has = {first: false, third: false, fifth: false};
      for (i = 0; i < length; i++) {
        interval = this.root.interval(this.notes[i]);
        invert = interval.invert();
        if (interval.simpleIntervalType.name in has) {
          has[interval.simpleIntervalType.name] = true;
        } else if (invert.simpleIntervalType.name in has) {
          has[invert.simpleIntervalType.name] = true;
        }
      }

      name = (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
    } else if (length === 4) {
      has = {first: false, third: false, fifth: false, seventh: false};
      for (i = 0; i < length; i++) {
        interval = this.root.interval(this.notes[i]);
        invert = interval.invert();
        if (interval.simpleIntervalType.name in has) {
          has[interval.simpleIntervalType.name] = true;
        } else if (invert.simpleIntervalType.name in has) {
          has[invert.simpleIntervalType.name] = true;
        }
      }

      if (has.first && has.third && has.fifth && has.seventh) {
        name = 'tetrad';
      }
    }

    return name || 'unknown';
  },

  get: function(interval) {
    if (typeof interval === 'string' && interval in kStepNumber) {
      var quality = kIntervals[kIntervalIndex[interval]].quality;
      quality = (quality === 'perfect') ? 'P' : 'M';
      interval = this.root.interval(quality + kStepNumber[interval]);
      for (var i = 0, length = this.notes.length; i < length; i++) {
        if (this.notes[i].name === interval.name) {
          return this.notes[i];
        }
      }

      return null;
    } else {
      throw new Error('Invalid interval name');
    }
  },

  interval: function(interval, direction) {
    return new TeoriaChord(this.root.interval(interval, direction),
                           this.symbol);
  },

  transpose: function(interval, direction) {
    var chord = new TeoriaChord(this.root.interval(interval, direction),
                                this.symbol);
    this.name = chord.name;
    this.symbol = chord.symbol;
    this.root = chord.root;
    this.notes = chord.notes;

    return this;
  },

  toString: function() {
    return this.name;
  }
};

