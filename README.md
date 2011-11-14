Teoria.js
=========

Teoria.js is a lightweight and fast JavaScript framework for music theory, both Jazz and Classical. 
It aims at providing an intuitive programming interface for music software (such as Sheet Readers, MIDI Players etc.).
The framework is both modular and object oriented, since almost every component can be used together, but doesn't *require* the other.

Features
---------

 - A note object (teoria.note), which understands alterations, octaves, keynumber, frequency and etc. and Helmholtz notation
 - Chord representations. Right now they're quite limited, but their functionality will be expanded.
 - Frequency to Note, takes in a frequency and translates it to an object containing the corresponding note and how many cents it's out of tune.
 - Intervals. A very strong interval structure, which can find intervals between notes, or return a note given a relative interval and a note object.
 - Scales, contains right now only the 7 modes (Ionian, Dorian, Phrygian etc.) and a major and minor pentatonic, but this is *easily* extendable.
 
Syntax
---------

This is just a short introduction to what the framework can be used to. You can experiment with it yourself, be simply dropping a <script> tag.
   
  // Note creation
  var a4 = new teoria.note("a4");   // equivalent to new teoria.note("a'");
  var g5 = new teoria.note("g''");  // equivalent to new teoria.note("g5");
  
  // Intervals
  console.log(teoria.interval(a4, g5));   // Outputs: {"direction": "up", "name": "seventh", "quality": "minor"}            -> A minor sevent
  console.log(teoria.interval(a4, 'M6')); // Outputs: {"value":4,"accidental":{"value":1,"name":"#"},"name":"f","octave":5} -> F5#
  
  // Scales
  console.log(teoria.scale.list(a4, 'aeolian', true));    // Outputs: ["a", "b", "c", "d", "e", "f", "g"]
  console.log(teoria.scale.list(a4, 'mixolydian', true)); // Outputs: ["a", "b", "c#", "d", "e", "f#", "g"]
  console.log(teoria.scale.list(g5, 'ionian', true));     // Outputs: ["g", "a", "b", "c", "d", "e", "f#"]
  console.log(teoria.scale.list(g5, 'dorian'));     // Outputs: [{...}, {...}, {...}, {...}, {...}, {...}, {...}], an array of teoria.note objects
  
  // Frequency
  console.log(teoria.frequency.note(467)); // Outputs: {"note":{...},"cents":3.1028314220028586} -> A4# a little out of tune.