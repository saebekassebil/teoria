'use strict';

function add(note, interval) {
  return [note[0] + interval[0], note[1] + interval[1]];
}

function sub(note, interval) {
  return [note[0] - interval[0], note[1] - interval[1]];
}

function mul(note, interval) {
  if (typeof interval === 'number')
    return [note[0] * interval, note[1] * interval];
  else
    return [note[0] * interval[0], note[1] * interval[1]];
}

function sum(coord) {
  return coord[0] + coord[1];
}

module.exports = { add: add, sub: sub, mul: mul, sum: sum };
