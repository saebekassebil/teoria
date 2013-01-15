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

 - A note object (`teoria.note`), which understands alterations, octaves,
 keynumber, frequency and etc. and Helmholtz notation
 
 - A chord object (`teoria.chord`), which understands everything
 from simple major/minor chords to advanced Jazz chords (Ab#5b9, F(#11) and such)

 - A scale object (`teoria.scale`), The scale object is a powerful presentation of
 a scale, which support quite a few handy methods. A scale can either be
 constructed from the predefined scales, which by default contains the 7 modes
 (Ionian, Dorian, Phrygian etc.) a major and minor pentatonic and the harmonic
 chromatic scale or from a arbitary array of intervals. The scale object
 also supports solfège, which makes it perfect for tutorials on sight reading.

 - An interval object (`teoria.interval`), which makes it easy to find the
 interval between to notes, or find a note which is a given interval from a note.
 There's also support for counting the interval span in semitones and inverting the
 interval.
 
Syntax
---------

This is just a short introduction to what the framework can be used to.
For a technical library reference, look further down this document.

```javascript

// Note creation with scientific and Helmholtz notation
var a4 = teoria.note('a4');   // equivalent to teoria.note('a');
var g5 = teoria.note("g''");  // equivalent to teoria.note('g5');
var c3 = teoria.note.fromKey(28); // equivalent to teoria.note('c');
    
// Intervals
teoria.interval(a4, g5);   // Outputs a TeoriaInterval object representing a minor seventh
teoria.interval(a4, 'M6'); // Outputs a TeoriaNote representing F#5
a4.interval('m3'); // Output a TeoriaNote representing C#4
a4.interval(g5); // Outputs a TeoriaInterval object representing a minor seventh
a4.interval(teoria.note('bb5')).invert(); // Outputs a TeoriaInterval representing a major seventh
    
// Scales
a4.scale('mixolydian').simple(); // Outputs: ["a", "b", "c#", "d", "e", "f#", "g"]
a4.scale('aeolian').simple();    // Outputs: ["a", "b", "c", "d", "e", "f", "g"]
g5.scale('ionian').simple();     // Outputs: ["g", "a", "b", "c", "d", "e", "f#"]
g5.scale('dorian');    // Outputs a TeoriaScale object

// Chords
a4.chord('sus2').name; // Outputs 'Asus2'
c3.chord('m').name; // Outputs 'Cm'
teoria.chord('Ab#5b9'); // Outputs a TeoriaChord object, representing a Ab#5b9 chord
g5.chord('dim'); // Outputs a TeoriaChord object, representing a Gdim chord

// Frequency
teoria.note.fromFrequency(467); // Outputs: {"note":{...},"cents":3.1028314220028586} -> A4# a little out of tune.
a4.fq(); // Outputs 440
g5.fq(); // Outputs 783.9908719634985

// teoria allows for crazy chaining
teoria.note('a').scale('lydian').interval('M2').get('third').chord('maj9').toString() // -> 'D#maj9'
```

Documentation
------------------------


## TeoriaNote(name[, duration])
 - This function construct a teoria.note object.

*name* - The name argument is the note name as a string. The note can both
be expressed in scientific and Helmholtz notation.
Some examples of valid note names:
```Eb4```, ```C#,,```, ```C4```, ```d#''```, ```Ab2```

*duration* - The duration argument is an optional `object` argument.
The object has two also optional parameters:
 - `value` - A `number` corresponding to the value of the duration, such that:
```1 = whole```, ```2 = half (minim)```, ```4 = quarter```, ```8 = eight```

 - `dots` - The number of dots attached to the note. Defaults to 0.

### teoria.note (TeoriaNote)

The teoria.note object is teoria's interpretation and representation of a
musical note. When calling teoria.note you're actually instantiating a
```TeoriaNote``` object.

### teoria.note.fromKey(key)
Returns an instance of TeoriaNote set to the note at the given piano key

### teoria.note.fromFrequency(fq)
Returns an object containing two elements:

*note* - A ```TeoriaNote``` which corresponds to the closest note with the
given frequency

*cents* - A number value of how many cents the note is out of tune

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

#### TeoriaNote#transpose(interval[, direction])
 - Like the #interval method, but changes `this` note, instead of returning a new

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

#### TeoriaNote#durationInSeconds(bpm, beatUnit)
 - Returns the duration of the note, given a tempo (in bpm) and a beat unit
 (the lower numeral of the time signature)

#### TeoriaNote#solfege(scale, showOctaves)
 - Returns the solfege step in the given scale context

*scale* - An instance of ```TeoriaScale```, which is the context of the
solfege step measuring

*showOctaves* - A boolean. If set to true, a "Helmholtz-like" notation will be
used if there's bigger intervals than an octave

#### TeoriaNote#durationName()
 - Returns the duration name.

Example: ```teoria.note('A', 8).durationName() -> 'eighth'```, 
```teoria.note('C', 16).durationName() -> 'sixteenth'```

#### TeoriaNote#scaleDegree(scale)
 - Returns this note's degree in a given scale (TeoriaScale). For example a 
 `D` in a C major scale will return "2" as it is the second degree of that scale.
 If however the note *isn't* a part of the scale, the degree returned will be
 `0`, meaning that the degree doesn't exists. This allows this method to be both
 a scale degree index finder *and* a "isNoteInScale" method.

*scale* - An instance of `TeoriaScale` which is the context of the degree measuring

#### TeoriaNote#toString([dontShow])
 - Usability function for returning the note as a string

*dontShow* - If set to ```true``` the value will not be included in the returned
string.


## TeoriaChord(root, chord)
 - A chord class with a lot of functionality to alter and analyze the chord.

*root* - A ```TeoriaNote``` instance which is to be the root of the chord

*chord* - A string containing the chord symbol. This can be anything from
simple chords, to super-advanced jazz chords thanks to the detailed and
robust chord parser engine. Example values:
```'m'```, ```'m7'```, ```'#5b9'```, ```'9sus4``` and ```'#11b5#9'```

### teoria.chord(name || note[, octave || symbol])
 - A simple function for getting the notes, no matter the octave, in a chord

*name* - A string containing the full chord symbol, with note name. Examples:
```'Ab7'```, ```'F#(#11b5)'```

*note* - Instead of supplying a string containing the full chord symbol,
one can pass a ```TeoriaNote``` object instead. The note will be considered root in
the new chord object

*octave* - If the first argument of the function is a chord name (`typeof "string"`),
then the second argument is an optional octave number (`typeof "number"`) of the root.

*symbol* - A string containing the chord symbol (exluding the note name)

#### TeoriaChord.name
 - Holds the full chord symbol, inclusive the root name

#### TeoriaChord.root
 - Holds the ```TeoriaNote``` that is the root of the chord

#### TeoriaChord.notes
 - An array of notes that the chords is built of

#### TeoriaChord.quality
 - A string which holds the quality of the chord, 'major', 'minor',
 'augmented' or 'diminished'

#### TeoriaChord#get(interval)
 - Returns the note at a given interval in the chord, if it exists.

*interval* - A string name of an interval, for example 'third', 'fifth', 'ninth'.

#### TeoriaChord#dominant([additional])
 - Returns the naïvely chosen dominant which is a perfect fifth away.

*additional* - Additional chord extension, for example: 'b9' or '#5'

#### TeoriaChord#subdominant([additional])
 - Returns the naïvely chosen subdominant which is a perfecth fourth away.

*additional* - Like the dominant's.

#### TeoriaChord#parallel([additional])
 - Returns the parallel chord for major and minor triads

*additional* - Like the dominant's

#### TeoriaChord#chordType()
 - Returns the type of the chord: 'dyad', 'triad', 'trichord',
 'tetrad' or 'unknown'.

#### TeoriaChord#interval(interval[, direction)
 - Returns the same chord, a `interval` away

#### TeoriaChord#transpose(interval[, direction])
 - Like the `#interval` method, except it's `this` chord that gets changed instead of
 returning a new chord.

#### TeoriaChord#toString()
 - Simple usability function which is an alias for TeoriaChord.name


## TeoriaScale(tonic, scale)
 - The teoria representation of a scale, with a given tonic.

*tonic* - A ```TeoriaNote``` which is to be the tonic of the scale

*scale* - Can either be a name of a scale (string), or an array of
absolute intervals that defines the scale. The default supported scales are:

 - major
 - minor
 - ionian (Alias for major)
 - dorian
 - phrygian
 - lydian
 - mixolydian
 - aeolian (Alias for minor)
 - locrian
 - majorpentatonic
 - minorpentatonic
 - chromatic
 - harmonicchromatic (Alias for chromatic)

### teoria.scale(tonic, scale)
 - Sugar function for constructing a new `TeoriaScale` object

### TeoriaScale.notes
 - An array of ```TeoriaNote```s which is the scale's notes

### TeoriaScale.name
 - The name of the scale (if available). Type `string` or `undefined`

### TeoriaScale.tonic
 - The ```TeoriaNote``` which is the scale's tonic

### TeoriaScale#simple()
 - Returns an `Array` of only the note's name, not the full ```TeoriaNote``` objects.

### TeoriaScale#type()
 - Returns the type of the scale, depending on the number of notes.
 A scale of length x gives y:
  - 2 gives 'ditonic'
  - 3 gives 'tritonic'
  - 4 gives 'tetratonic'
  - 5 gives 'pentatonic'
  - 6 gives 'hexatonic',
  - 7 gives 'heptatonic',
  - 8 gives 'octatonic'

### TeoriaScale#get(index)
 - Returns the note at the given scale index

*index* - Can be a number referring to the scale step, or the name (string) og the
scale step. Example 'first', 'second', 'fourth', 'seventh'.

### TeoriaScale#solfege(index, showOctaves)
 - Returns the solfege name of the given scale step

*index* Same as ```TeoriaScale#get```

*showOctaves* - A boolean meaning the same as `showOctaves` in TeoriaNote#solfege


## teoria.interval(from, to[, direction])
 - A sugar function for the #from and #between methods of the same namespace and
 for creating `TeoriaInterval` objects.

*from* - Either a string, in "simple-format" or a ```TeoriaNote``` that is
the root of the interval measuring. If a string is supplied, it's treated as
an interval in simple format, and returns a `TeoriaInterval` object.

*to* - Either a string, which is a "simple-format" interval such as 'M2' for 
major second, and 'P5' for perfect fifth. More details on this format later.
If it's a string the note which is the given interval (*to*) away from the 
note (*from*) is returned. If *to* is a ```TeoriaNote``` then an interval
object is returned, which represents the interval between the two notes. For
the format of this interval object, take a look at the #between method

*direction* - The direction of the interval (only relevant when *to* is a string).
Can be 'up' or 'down', defaults to 'up'

#### teoria.interval.from(from, to[, direction])
 - Returns a note which lies a given interval away from a root note.

*from* - Same as above, the ```TeoriaNote``` which is the base of the measuring

*to* - A string as described above.

*direction* - The direction as described above.

#### teoria.interval.between(from, to)
 - Returns an interval object which represents the interval between two notes.

*from* and *to* are two ```TeoriaNote```s which are the notes that the
interval is measured from. For example if 'a' and 'c' are given, the resulting
interval object would represent a minor third.

```javascript
teoria.interval.between(teoria.note("a"), teoria.note("c'")) -> teoria.interval('m3')
```

#### teoria.interval.invert(simpleInterval)
 - Returns the inversion of the interval provided

*simpleInterval* - An interval represented in simple string form. Examples:

 - 'm3' = minor third
 - 'P4' = perfect fourth
 - 'A4' = augmented fifth
 - 'd7' = diminished seventh
 - 'M6' = major sixth.

```'m' = minor```, ```'M' = major```, ```'A' = augmented``` and 
```'d' = diminished```

## TeoriaInterval(intervalNumber, quality[, direction])
 - A representation of a music interval

#### TeoriaInterval.interval
 - The interval number (A ninth = 9, A seventh = 7, fifteenth = 15)

#### TeoriaInterval.simpleIntervalType
 - The type of interval (mostly used internally)

#### TeoriaInterval.quality
 - The quality of the interval (`'diminished'`, `'minor'`, `'perfect'`, `'major'`
 or `'augmented'`)

#### TeoriaInterval.direction
 - The direction of the interval (defaults to `'up'`)

#### TeoriaInterval#semitones()
 - Returns the `number` of semitones the interval span.

#### TeoriaInterval#simple()
 - Returns the simple part of the interval (as opposed to #compound). Example:

```javascript
teoria.interval('M17').simple() === 'M3'
teoria.interval('m23').simple() === 'm2'
teoria.interval('P5').simple() === 'P5'
```

#### TeoriaInterval#compound()
 - Returns the whole interval, compound or not.

```javascript
teoria.interval('M17').compound() === 'M17'
teoria.interval('m23').compound() === 'm23'
teoria.interval('P5').compound() === 'P5'
```

#### TeoriaInterval#isCompound()
 - Returns a boolean value, showing if the interval is a compound interval

#### TeoriaInterval#equal(interval)
 - Returns true if the supplied `interval` is equal to this interval

#### TeoriaInterval#greater(interval)
 - Returns true if the supplied `interval` is greater than this interval

#### TeoriaInterval#smaller(interval)
 - Returns true if the supplied `interval` is smaller than this interval

#### TeoriaInterval#invert()
 - Returns the inverted interval as a `TeoriaInterval`

#### TeoriaInterval#qualityValue() - *internal*
 - Returns the relative to default, value of the quality.
 Fx a teoria.interval('M6'), will have a relative quality value of 1, as all the
 intervals defaults to minor and perfect respectively.

