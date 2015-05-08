  'use strict';

  var Scales = {};
  Scales.ionian = Scales.major =
    ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'];
  Scales.dorian = ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'];
  Scales.phrygian = ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'];
  Scales.lydian = ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'];
  Scales.mixolydian = ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'];
  Scales.aeolian = Scales.minor =
    ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'];
  Scales.locrian = ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'];
  Scales.majorpentatonic = ['P1', 'M2', 'M3', 'P5', 'M6'];
  Scales.minorpentatonic = ['P1', 'm3', 'P4', 'P5', 'm7'];
  Scales.chromatic = Scales.harmonicchromatic =
    ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7'];

module.exports = Scales;
