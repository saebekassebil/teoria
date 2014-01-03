function TeoriaChord(root, name) {
  name = name || '';
  this.name = root.name().toUpperCase() + root.accidental() + name;
  this.symbol = name;
  this.root = root;
  this.intervals = [];
  this._voicing = [];

  var i, length, c, shortQ, parsing = 'quality', additionals = [],
      notes = ['P1', 'M3', 'P5', 'm7', 'M9', 'P11', 'M13'],
      chordLength = 2, bass, symbol;

  function setChord(intervals) {
    for (var n = 0, chordl = intervals.length; n < chordl; n++) {
      notes[n + 1] = intervals[n];
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
        shortQ = ((i + 3) <= length) ? name.substr(i, 3).toLowerCase() : null;
        symbol = (shortQ in kSymbols) ?
          shortQ : (c in kSymbols) ? c : '';

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
            notes[3] = 'd7';
          }

          i += String(c).length - 1;
        } else if (c === 6) {
          notes[3] = 'M6';
          chordLength = (chordLength < 3) ? 3 : chordLength;
        } else {
          i -= 1;
        }

        parsing = 'alterations';
        break;

      // Parses for possible alterations of intervals (#5, b9, etc.)
      case 'alterations':
        var alterations = name.substr(i).split(/(#|b|add|maj|sus|M)/i),
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
          case 'Maj':
          case 'maj':
            chordLength = (chordLength < 3) ? 3 : chordLength;

            if (next === '7') { // Ignore the seventh, that is already implied
              a++;
            }

            notes[3] = 'M7';
            break;

          case 'Sus':
          case 'sus':
            var type = 'P4';
            if (next === '2' || next === '4') {
              a++;

              if (next === '2') {
                type = 'M2';
              }
            }

            notes[1] = type; // Replace third with M2 or P4
            break;

          case 'Add':
          case 'add':
            if (next && !isNaN(+next)) {
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

            var token = +alterations[a], quality, intPos;
            if (isNaN(token) ||
                String(token).length !== alterations[a].length) {
              throw new Error('Invalid token: \'' + alterations[a] + '\'');
            }

            if (token === 6) {
              if (sharp) {
                notes[3] = 'A6';
              } else if (flat) {
                notes[3] = 'm6';
              } else {
                notes[3] = 'M6';
              }

              chordLength = (chordLength < 3) ? 3 : chordLength;
              continue;
            }

            // Calculate the position in the 'note' array
            intPos = (token - 1) / 2;
            if (chordLength < intPos) {
              chordLength = intPos;
            }

            if (token < 5 || token === 7 ||
                intPos !== Math.round(intPos)) {
              throw new Error('Invalid interval alteration: ' + token);
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

            sharp = flat = false;
            notes[intPos] = quality + token;
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

  // Sixth-nine chord is an exception to the bass rule (e.g. C6/9)
  if (bass && bass === '9') {
    additionals.push('M9');
    bass = null;
  }

  this.intervals = notes
    .slice(0, chordLength + 1)
    .concat(additionals)
    .map(function(i) { return teoria.interval(i); });

  for (i = 0, length = this.intervals.length; i < length; i++) {
    this._voicing[i] = this.intervals[i];
  }

  if (bass) {
    var intervals = this.intervals, bassInterval, note;
    // Make sure the bass is atop of the root note
    note = teoria.note(bass + (root.octave() + 1));

    bassInterval = teoria.interval.between(root, note);
    bass = bassInterval.simple();

    bassInterval = bassInterval.invert();
    bassInterval.direction('down');

    this._voicing = [bassInterval];
    for (i = 0; i < length; i++) {
      if (intervals[i].simple().equal(bass))
        continue;

      this._voicing.push(intervals[i]);
    }
  }
}

TeoriaChord.prototype = {
  notes: function() {
    var voicing = this.voicing(), notes = [];

    for (var i = 0, length = voicing.length; i < length; i++) {
      notes.push(teoria.interval.from(this.root, voicing[i]));
    }

    return notes;
  },

  voicing: function(voicing) {
    // Get the voicing
    if (!voicing) {
      return this._voicing;
    }

    // Set the voicing
    this._voicing = [];
    for (var i = 0, length = voicing.length; i < length; i++) {
      this._voicing[i] = teoria.interval(voicing[i]);
    }

    return this;
  },

  resetVoicing: function() {
    this._voicing = this.intervals;
  },

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
    var third, fifth, seventh, intervals = this.intervals;

    for (var i = 0, length = intervals.length; i < length; i++) {
      if (intervals[i].number() === 3) {
        third = intervals[i];
      } else if (intervals[i].number() === 5) {
        fifth = intervals[i];
      } else if (intervals[i].number() === 7) {
        seventh = intervals[i];
      }
    }

    if (!third) {
      return;
    }

    third = (third.direction() === 'down') ? third.invert() : third;
    third = third.simple().toString();

    if (fifth) {
      fifth = (fifth.direction === 'down') ? fifth.invert() : fifth;
      fifth = fifth.simple().toString();
    }

    if (seventh) {
      seventh = (seventh.direction === 'down') ? seventh.invert() : seventh;
      seventh = seventh.simple().toString();
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
    var length = this.intervals.length, interval, has, invert, i, name;

    if (length === 2) {
      return 'dyad';
    } else if (length === 3) {
      has = {first: false, third: false, fifth: false};
      for (i = 0; i < length; i++) {
        interval = this.intervals[i];
        invert = interval.invert();
        if (interval.base() in has) {
          has[interval.base()] = true;
        } else if (invert.base() in has) {
          has[invert.base()] = true;
        }
      }

      name = (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
    } else if (length === 4) {
      has = {first: false, third: false, fifth: false, seventh: false};
      for (i = 0; i < length; i++) {
        interval = this.intervals[i];
        invert = interval.invert();
        if (interval.base() in has) {
          has[interval.base()] = true;
        } else if (invert.base() in has) {
          has[invert.base()] = true;
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
      var intervals = this.intervals, i, length;

      interval = kStepNumber[interval];
      for (i = 0, length = intervals.length; i < length; i++) {
        if (intervals[i].number() === interval) {
          return teoria.interval.from(this.root, intervals[i]);
        }
      }

      return null;
    } else {
      throw new Error('Invalid interval name');
    }
  },

  interval: function(interval) {
    return new TeoriaChord(this.root.interval(interval), this.symbol);
  },

  transpose: function(interval) {
    this.root.transpose(interval);
    this.name = this.root.name().toUpperCase() +
                this.root.accidental() + this.symbol;

    return this;
  },

  toString: function() {
    return this.name;
  }
};

