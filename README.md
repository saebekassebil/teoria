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

#### TeoriaNote.name
 - The name of the note, in lowercase letter (*only* the name, not the
 accidental signs)

#### TeoriaNote.octave
 - The numeric value of the octave of the note

#### TeoriaNote.duration
 - Holds the numeric value supplied in the construct. If no value was given
 the duration will default to 4

#### TeoriaNote.accidental
 - An object containing two elements:

*sign* - The string symbolic of the accidental sign ```#, x, b or bb```

*value* - The numeric value (mostly used internally) of the sign:
```# = 1, x = 2, b = -1, bb = -2```

#### TeoriaNote#key([whitetones])
 - Returns the piano key number. Fx A4 would return 49

*whitenotes* - If this parameter is set to ````true``` only the white keys will
be counted when finding the key number. This is mostly used internally.

#### TeoriaNote#fq([concertPitch])
 - Calculates and returns the frequency of the note.

*concertPitch* - If supplied this number will be used instead of the normal
concert pitch which is 440hz. This is useful for older classical music.

#### TeoriaNote#scale(scaleName)
 - Returns an instance of TeoriaScale, with tonic set to this note.

*scaleName* - The name of the scale to be returned. ```'minor'```, 
```'chromatic'````, ```'ionian'``` and others are valid scale names.

#### TeoriaNote#interval(interval[, direction])
 - A sugar function for calling teoria.interval(interval, direction)

Look at the documentation for ```teoria.interval```

#### TeoriaNote#chord([name])
 - Returns an instance of TeoriaChord, with root note set to this note

*name* - The name attribute is the last part of the chord symbol.
Examples: ```'m7'```, ```'#5b9'```, ```'major'```. If the name parameter
isn't set, a standard major chord will be returned.

#### TeoriaNote#helmholtz()
 - Returns the note name formatted in helmholtz notation.

Example: ```teoria.note('A5').helmholtz() -> "a''"```

#### TeoriaNote#scientific()
 - Returns the note name formatted in scientific notation.

Example: ```teoria.note("ab'").scientific() -> "Ab4"```

#### TeoriaNote#enharmonics()
 - Returns all notes that are enharmonic with the note

Example: ```teoria.note('C').enharmonics() -> [teoria.note('Dbb'), teoria.note('b#')]```

#### TeoriaNote#durationName()
 - Returns the duration name.

Example: ```teoria.note('A', 8).durationName() -> 'eighth'```, 
```teoria.note('C', 16).durationName() -> 'sixteenth'```

#### TeoriaNote#toString([dontShow])
 - Usability function for returning the note as a string

*dontShow* - If set to ```true``` the value will not be included in the returned
string.

