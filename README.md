Teoria.js
=========

Teoria.js is a lightweight (3.9KB Gzipped) and fast JavaScript framework 
for music theory, both Jazz and Classical. It aims at providing an intuitive 
programming interface for music software (such as Sheet Readers, 
Sheet Writers, MIDI Players etc.). The framework is both modular and 
object oriented, since almost every component can be used together, 
but doesn't *require* the other.

Features
---------

 - A note object (teoria.note), which understands alterations, octaves, 
 keynumber, frequency and etc. and Helmholtz notation
 
 - A chord object (teoria.chord), which understands everything 
 from simple major/minor chords to advanced Jazz chords (Ab#5b9, F(#11) and such)

 - A scale object (teoria.scale), The scale object is a powerful presentation of
 a scale, which support quite a few handy methods. A scale can either be 
 constructed from the predefined scales, which by default contains the 7 modes 
 (Ionian, Dorian, Phrygian etc.) a major and minor pentatonic and the harmonic
 chromatic scale or from a arbitary array of intervals. The scale object
 also supports solfège, which makes it perfect for tutorials on sight reading.

 - An interval object (teoria.interval), which makes it easy to find the 
 interval between to notes, or find a note which is a given interval from a note.
 
Syntax
---------

This is just a short introduction to what the framework can be used to.
For a technical library reference, look further down this document.

```javascript

// Note creation with scientific and Helmholtz notation
var a4 = teoria.note("a4");   // equivalent to teoria.note("a'");
var g5 = teoria.note("g''");  // equivalent to teoria.note("g5");
var c3 = teoria.note.fromKey(28); // equivalent to teoria.note('c');
    
// Intervals
teoria.interval(a4, g5);   // Outputs: {"direction": "up", "name": "seventh", "quality": "minor"}            -> A minor sevent
teoria.interval(a4, 'M6'); // Outputs: {"value":4,"accidental":{"value":1,"name":"#"},"name":"f","octave":5} -> F5#
a4.interval('m3'); // Output a c#4 teoria.note object
a4.interval(g5); // Outputs: {"direction": "up", "name": "seventh", "quality": "minor"} 
    
// Scales
a4.scale('mixolydian').simple(); // Outputs: ["a", "b", "c#", "d", "e", "f#", "g"]
a4.scale('aeolian').simple();    // Outputs: ["a", "b", "c", "d", "e", "f", "g"]
g5.scale('ionian').simple();     // Outputs: ["g", "a", "b", "c", "d", "e", "f#"]
g5.scale('dorian');    // Outputs an TeoriaScale object
    
// Frequency
teoria.note.fromFrequency(467); // Outputs: {"note":{...},"cents":3.1028314220028586} -> A4# a little out of tune.
a4.fq(); // Outputs 440
g5.fq(); // Outputs 783.9908719634985
```

Documentation
------------------------

### teoria.note (TeoriaNote)

The teoria.note object is teoria's interpretation and representation of a
musical note. When calling teoria.note you're actually instantiating a
TeoriaNote object.

#### TeoriaNote(name[, duration])
 - This function construct a teoria.note object.

*name* - The name argument is the note name as a string. The note can both
be expressed in scientific and Helmholtz notation.
Some examples of valid note names:
```Eb4```, ```,,C#```, ```C4```, ```d#''```, ```Ab2```

*duration* - The duration argument is optional, and not much used in the library.
If supplied, it should be number corresponding to a note duration, such as:
```1 = whole```, ```2 = half (minim)```, ```4 = quarter```, ```8 = eigth```

#### TeoriaNote#key()
 - Returns the piano key number. Fx A4 would return 49
