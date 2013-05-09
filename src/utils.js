/* exported getDistance, pad, compareArray */

/**
 * getDistance, returns the distance in semitones between two notes
 **/
function getDistance(from, to) {
  from = kNotes[from];
  to = kNotes[to];
  if (from.distance > to.distance) {
    return (to.distance + 12) - from.distance;
  } else {
    return to.distance - from.distance;
  }
}

/**
 * pad, returns the string, padded with character ch
 **/
function pad(str, ch, len) {
  for (; len > 0; len--) {
    str += ch;
  }

  return str;
}

/**
 * compareArray, shallow matches two arrays
 **/
function compareArray(first, second) {
  if (first.length !== second.length) {
    return false;
  }

  for (var i = 0, length = first.length; i < length; i++) {
    if (first[i] !== second[i]) {
      return false;
    }
  }

  return true;
}

