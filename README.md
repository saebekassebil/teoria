Teoria.js
=========

Teoria.js is a lightweight and fast JavaScript library
for music theory, both Jazz and Classical. It aims at providing an intuitive
programming interface for music software (such as Sheet Readers,
Sheet Writers, MIDI Players etc.).

Features
---------

 - A note object (`teoria.note`), which understands alterations, octaves,
 key number, frequency and etc. and Helmholtz notation

 - A chord object (`teoria.chord`), which understands everything
 from simple major/minor chords to advanced Jazz chords (Ab#5b9, F(#11) and such)

 - A scale object (`teoria.scale`), The scale object is a powerful presentation of
 a scale, which supports quite a few handy methods. A scale can either be
 constructed from the predefined scales, which by default contains the 7 modes
 (Ionian, Dorian, Phrygian etc.) a major and minor pentatonic and the harmonic
 chromatic scale or from an arbitrary array of intervals. The scale object
 also supports solfège, which makes it perfect for tutorials on sight-reading.

 - An interval object (`teoria.interval`), which makes it easy to find the
 interval between two notes, or find a note that is a given interval from a note.
 There's also support for counting the interval span in semitones and inverting the
 interval.

Usage
-----

In node environments (including webpack & browserify) you can require the library:

```js
var teoria = require('teoria');
```

You can also load individual files:
```js
var Chord = require('teoria/chord');
```

For browsers environments there is a distribution file inside `dist` folder that you can use as src with a script tag.

Syntax
---------

This is just a short introduction to what teoria-code looks like,
for a technical library reference, look further down this document.

```javascript

// Create notes:
var a4 = teoria.note('a4');       // Scientific notation
var g5 = teoria.note("g''");      // Helmholtz notation
var c3 = teoria.note.fromKey(28); // From a piano key number

// Find and create notes based on intervals
teoria.interval(a4, g5);    // Returns a TeoriaInterval object representing a minor seventh
teoria.interval(a4, 'M6');  // Returns a TeoriaNote representing F#5
a4.interval('m3');          // Returns a TeoriaNote representing C#4
a4.interval(g5);            // Returns a TeoriaInterval object representing a minor seventh
a4.interval(teoria.note('bb5')).invert(); // Returns a TeoriaInterval representing a major seventh

// Create scales, based on notes.
a4.scale('mixolydian').simple();  // Returns: ["a", "b", "c#", "d", "e", "f#", "g"]
a4.scale('aeolian').simple();     // Returns: ["a", "b", "c", "d", "e", "f", "g"]
g5.scale('ionian').simple();      // Returns: ["g", "a", "b", "c", "d", "e", "f#"]
g5.scale('dorian');               // Returns a TeoriaScale object

// Create chords with the powerful chord parser
a4.chord('sus2').name;    // Returns the name of the chord: 'Asus2'
c3.chord('m').name;       // Returns 'Cm'
teoria.chord('Ab#5b9');   // Returns a TeoriaChord object, representing a Ab#5b9 chord
g5.chord('dim');          // Returns a TeoriaChord object, representing a Gdim chord

// Calculate note frequencies or find the note corresponding to a frequency
teoria.note.fromFrequency(467); // Returns: {'note':{...},'cents':3.102831} -> A4# a little out of tune.
a4.fq(); // Outputs 440
g5.fq(); // Outputs 783.9908719634985

// teoria allows for crazy chaining:
teoria.note('a')    // Create a note, A3
  .scale('lydian')  // Create a lydian scale with that note as root (A lydian)
  .interval('M2')   // Transpose the whole scale a major second up (B lydian)
  .get('third')     // Get the third note of the scale (D#4)
  .chord('maj9')    // Create a maj9 chord with that note as root (D#maj9)
  .toString();      // Make a string representation: 'D#maj9'
```

Documentation
------------------------

## teoria.note (name | coord[, duration])

*name* - The name argument is the note name as a string. The note can both
be expressed in scientific and Helmholtz notation.
Some examples of valid note names: `Eb4`, `C#,,`, `C4`, `d#''`, `Ab2`

*coord* - If the first argument isn't a string, but a coord array,
it will instantiate a `TeoriaNote` instance.

*duration* - The duration argument is an optional `object` argument.
The object has two also optional parameters:

 - `value` - A `number` corresponding to the value of the duration, such that:
`1 = whole`, `2 = half (minim)`, `4 = quarter`, `8 = eight`

 - `dots` - The number of dots attached to the note. Defaults to `0`.

### teoria.note.fromKey(key)
A static method that returns an instance of TeoriaNote set to the note
at the given piano key, where A0 is key number 1.
See [Wikipedia's piano key article](http://en.wikipedia.org/wiki/Piano_key_frequencies)
for more information.

### teoria.note.fromFrequency(fq)
A static method returns an object containing two elements:

*note* - A `TeoriaNote` which corresponds to the closest note with the given frequency

*cents* - A number value of how many cents the note is out of tune

### teoria.note.fromMIDI(note)
 - Returns an instance of TeoriaNote set to the corresponding MIDI note value.

*note* - A number ranging from 0-127 representing a MIDI note value

### teoria.note.fromString(note)
 - Returns an instance of TeoriaNote representing the note name

*note* - The name argument is the note name as a string. The note can both
be expressed in scientific and Helmholtz notation.
Some examples of valid note names: `Eb4`, `C#,,`, `C4`, `d#''`, `Ab2`

#### TeoriaNote.name()
 - The name of the note, in lowercase letter (*only* the name, not the
 accidental signs)

#### TeoriaNote.octave()
 - The numeric value of the octave of the note

#### TeoriaNote.duration
 - The duration object as described in the constructor for TeoriaNote

#### TeoriaNote.accidental()
 - Returns the string symbolic of the accidental sign (`x`, `#`, `b` or `bb`)

#### TeoriaNote.accidentalValue()
 - Returns the numeric value (mostly used internally) of the sign:
`x = 2, # = 1, b = -1, bb = -2`

#### TeoriaNote#key([whitenotes])
 - Returns the piano key number. E.g. A4 would return 49

*whitenotes* - If this parameter is set to `true` only the white keys will
be counted when finding the key number. This is mostly for internal use.

#### TeoriaNote#midi()
 - Returns a number ranging from 0-127 representing a MIDI note value

#### TeoriaNote#fq([concertPitch])
 - Calculates and returns the frequency of the note.

*concertPitch* - If supplied this number will be used instead of the normal
concert pitch which is 440hz. This is useful for some classical music.

#### TeoriaNote#chroma()
 - Returns the pitch class (index) of the note.

This allows for easy enharmonic checking:

    teoria.note('e').chroma() === teoria.note('fb').chroma();

The chroma number is ranging from pitch class C which is 0 to 11 which is B

#### TeoriaNote#scale(scaleName)
 - Returns an instance of TeoriaScale, with the tonic/root set to this note.

*scaleName* - The name of the scale to be returned. `'minor'`,
`'chromatic'`, `'ionian'` and others are valid scale names.

#### TeoriaNote#interval(interval)
 - A sugar function for calling teoria.interval(note, interval);

Look at the documentation for `teoria.interval`

#### TeoriaNote#transpose(interval)
 - Like the `#interval` method, but changes `this` note, instead of returning a new

#### TeoriaNote#chord([name])
 - Returns an instance of TeoriaChord, with root note set to this note

*name* - The name attribute is the last part of the chord symbol.
Examples: `'m7'`, `'#5b9'`, `'major'`. If the name parameter
isn't set, a standard major chord will be returned.

#### TeoriaNote#helmholtz()
 - Returns the note name formatted in Helmholtz notation.

Example: `teoria.note('A5').helmholtz() -> "a''"`

#### TeoriaNote#scientific()
 - Returns the note name formatted in scientific notation.

Example: `teoria.note("ab'").scientific() -> "Ab4"`

#### TeoriaNote#enharmonics(oneAccidental)
 - Returns all notes that are enharmonic with the note

*oneAccidental* - Boolean, if set to true, only enharmonic notes with one
accidental is returned. E.g. results such as 'eb' and 'c#' but not 'ebb' and 'cx'

```javascript
teoria.note('c').enharmonics().toString();
// -> 'dbb, b#'

teoria.note('c').enharmonics(true).toString();
// -> 'b#'
```

#### TeoriaNote#durationInSeconds(bpm, beatUnit)
 - Returns the duration of the note, given a tempo (in bpm) and a beat unit
 (the lower numeral of the time signature)

#### TeoriaNote#solfege(scale, showOctaves)
 - Returns the solfege step in the given scale context

*scale* - An instance of `TeoriaScale`, which is the context of the solfege step measuring

*showOctaves* - A boolean. If set to true, a "Helmholtz-like" notation will be
used if there's bigger intervals than an octave

#### TeoriaNote#durationName()
 - Returns the duration name.

Examples: `teoria.note('A', 8).durationName() -> 'eighth'`,
`teoria.note('C', 16).durationName() -> 'sixteenth'`

#### TeoriaNote#scaleDegree(scale)
 - Returns this note's degree in a given scale (TeoriaScale). For example a
 `D` in a C major scale will return `2` as it is the second degree of that scale.
 If however the note *isn't* a part of the scale, the degree returned will be
 `0`, meaning that the degree doesn't exist. This allows this method to be both
 a scale degree index finder *and* an "isNoteInScale" method.

*scale* - An instance of `TeoriaScale` which is the context of the degree measuring

#### TeoriaNote#toString([dontShow])
 - Usability function for returning the note as a string

*dontShow* - If set to `true` the octave will not be included in the returned string.

## TeoriaChord(root, chord)
 - A chord class with a lot of functionality to alter and analyze the chord.

*root* - A `TeoriaNote` instance which is to be the root of the chord

*chord* - A string containing the chord symbol. This can be anything from
simple chords, to super-advanced jazz chords thanks to the detailed and
robust chord parser engine. Example values:
`'m'`, `'m7'`, `'#5b9'`, `'9sus4` and `'#11b5#9'`

### teoria.chord(name || note[, octave || symbol])
 - A simple function for getting the notes, no matter the octave, in a chord

*name* - A string containing the full chord symbol, with note name. Examples:
`'Ab7'`, `'F#(#11b5)'`

*note* - Instead of supplying a string containing the full chord symbol,
one can pass a `TeoriaNote` object instead. The note will be considered root in
the new chord object

*octave* - If the first argument of the function is a chord name (`typeof "string"`),
then the second argument is an optional octave number (`typeof "number"`) of the root.

*symbol* - A string containing the chord symbol (excluding the note name)

#### TeoriaChord.name
 - Holds the full chord symbol, inclusive the root name.

#### TeoriaChord.root
 - Holds the `TeoriaNote` that is the root of the chord.

#### TeoriaChord#notes()
 - Returns an array of `TeoriaNote`s that the chord consists of.

#### TeoriaChord#voicing([voicing])
 - Works both as a setter and getter. If no parameter is supplied the
 current voicing is returned as an array of `TeoriaInterval`s

*voicing* - An optional array of intervals in simple-format
that represents the current voicing of the chord.

Here's an example:
```javascript
var bbmaj = teoria.chord('Bbmaj7');
// Default voicing:
bbmaj.voicing();  // #-> ['P1', 'M3', 'P5', 'M7'];
bbmaj.notes();    // #-> ['bb', 'd', 'f', 'a'];

// New voicing
bbmaj.voicing(['P1', 'P5', 'M7', 'M10']);
bbmaj.notes();    // #-> ['bb', 'f', 'a', 'd'];
```
*NB:* Note that above returned results are pseudo-results, as they will be
returned wrapped in `TeoriaInterval` and `TeoriaNote` objects.

#### TeoriaChord#quality()
 - Returns a string which holds the quality of the chord, `'major'`, `'minor'`,
 `'augmented'`, `'diminished'`, `'half-diminished'`, `'dominant'` or `undefined`

#### TeoriaChord#get(interval)
 - Returns the note at a given interval in the chord, if it exists.

*interval* - A string name of an interval, for example `'third'`, `'fifth'`, `'ninth'`.

#### TeoriaChord#dominant([additional])
 - Returns the naïvely chosen dominant which is a perfect fifth away.

*additional* - Additional chord extension, for example: `'b9'` or `'#5'`

#### TeoriaChord#subdominant([additional])
 - Returns the naïvely chosen subdominant which is a perfect fourth away.

*additional* - Like the dominant's.

#### TeoriaChord#parallel([additional])
 - Returns the parallel chord for major and minor triads

*additional* - Like the dominant's

#### TeoriaChord#chordType()
 - Returns the type of the chord: `'dyad'`, `'triad'`, `'trichord'`,
 `'tetrad'` or `'unknown'`.

#### TeoriaChord#interval(interval)
 - Returns the same chord, a `interval` away

#### TeoriaChord#transpose(interval)
 - Like the `#interval` method, except it's `this` chord that gets changed instead of
 returning a new chord.

#### TeoriaChord#toString()
 - Simple usability function which is an alias for TeoriaChord.name


## TeoriaScale(tonic, scale)
 - The teoria representation of a scale, with a given tonic.

*tonic* - A `TeoriaNote` which is to be the tonic of the scale

*scale* - Can either be a name of a scale (string), or an array of
absolute intervals that defines the scale. The scales supported by default are:

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

#### TeoriaScale.notes()
 - Returns an array of `TeoriaNote`s which is the scale's notes

#### TeoriaScale.name
 - The name of the scale (if available). Type `string` or `undefined`

#### TeoriaScale.tonic
 - The `TeoriaNote` which is the scale's tonic

#### TeoriaScale#simple()
 - Returns an `Array` of only the notes' names, not the full `TeoriaNote` objects.

#### TeoriaScale#type()
 - Returns the type of the scale, depending on the number of notes.
 A scale of length x gives y:
  - 2 gives 'ditonic'
  - 3 gives 'tritonic'
  - 4 gives 'tetratonic'
  - 5 gives 'pentatonic'
  - 6 gives 'hexatonic',
  - 7 gives 'heptatonic',
  - 8 gives 'octatonic'

#### TeoriaScale#get(index)
 - Returns the note at the given scale index

*index* - Can be a number referring to the scale step, or the name (string) of the
scale step. E.g. 'first', 'second', 'fourth', 'seventh'.

#### TeoriaScale#solfege(index, showOctaves)
 - Returns the solfege name of the given scale step

*index* Same as `TeoriaScale#get`

*showOctaves* - A boolean meaning the same as `showOctaves` in `TeoriaNote#solfege`


## teoria.interval(from, to)
 - A sugar function for the `#from` and `#between` methods of the same namespace and
 for creating `TeoriaInterval` objects.

#### teoria.interval(`string`: from)
 - A sugar method for the `teoria.interval.toCoord` function

#### teoria.interval(`TeoriaNote`: from, `string`: to)
 - A sugar method for the `teoria.interval.from` function

#### teoria.interval(`TeoriaNote`: from, `TeoriaInterval`: to)
 - Like above, but with a `TeoriaInterval` instead of a string representation of
 the interval

#### teoria.interval(`TeoriaNote`: from, `TeoriaNote`: to)
 - A sugar method for the `teoria.interval.between` function

#### teoria.interval.from(from, to)
 - Returns a note which is a given interval away from a root note.

*from* - The `TeoriaNote` which is the root of the measuring

*to* - A `TeoriaInterval`

#### teoria.interval.between(from, to)
 - Returns an interval object which represents the interval between two notes.

*from* and *to* are two `TeoriaNote`s which are the notes that the
interval is measured from. For example if 'a' and 'c' are given, the resulting
interval object would represent a minor third.

```javascript
teoria.interval.between(teoria.note("a"), teoria.note("c'")) -> teoria.interval('m3')
```

#### teoria.interval.toCoord(simpleInterval)
 - Returns a `TeoriaInterval` representing the interval expressed in string form.

#### teoria.interval.invert(simpleInterval)
 - Returns the inversion of the interval provided

*simpleInterval* - An interval represented in simple string form. Examples:

 - 'm3' = minor third
 - 'P4' = perfect fourth
 - 'A4' = augmented fifth
 - 'd7' = diminished seventh
 - 'M6' = major sixth.

`'m' = minor`, `'M' = major`, `'A' = augmented` and
`'d' = diminished`

The number may be prefixed with a `-` to signify that its direction is down. E.g.:

`m-3` means a descending minor third, and `P-5` means a descending perfect fifth.

## TeoriaInterval(coord)
 - A representation of a music interval

#### TeoriaInterval.coord
 - The interval representation of the interval

#### TeoriaInterval.number()
 - The interval number (A ninth = 9, A seventh = 7, fifteenth = 15)

#### TeoriaInterval.value()
 - The value of the interval - That is a ninth = 9, but a downwards ninth is = -9

#### TeoriaInterval.toString()
 - Returns the *simpleInterval* representation of the interval. E.g. `'P5'`,
 `'M3'`, `'A9'`, etc.

#### TeoriaInterval.base()
 - Returns the name of the simple interval (not compound)

#### TeoriaInterval.type()
 - Returns the type of array, either `'perfect'` (1, 4, 5, 8) or `'minor'` (2, 3, 6, 7)

#### TeoriaInterval.quality([verbose])
 - The quality of the interval (`'dd'`, `'d'` `'m'`, `'P'`, `'M'`, `'A'` or `'AA'`)

*verbose*  is set to a truish value, then long quality names are returned:
 `'doubly diminished'`, `'diminished'`, `'minor'`, etc.

#### TeoriaInterval.direction([dir])
 - The direction of the interval

*dir* - If supplied, then the interval's direction is to the `newDirection`
which is either `'up'` or `'down'`

#### TeoriaInterval#semitones()
 - Returns the `number` of semitones the interval span.

#### TeoriaInterval#simple([ignoreDirection])
 - Returns the simple part of the interval as a TeoriaInterval. Example:

*ignoreDirection* - An optional boolean that, if set to `true`, returns the
"direction-agnostic" interval. That is the interval with a positive number.

```javascript
teoria.interval('M17').simple();    // #-> 'M3'
teoria.interval('m23').simple();    // #-> 'm2'
teoria.interval('P5').simple();     // #-> 'P5'
teoria.interval('P-4').simple();    // #-> 'P-4'

// With ignoreDirection = true
teoria.interval('M3').simple(true);     // #->'M3'
teoria.interval('m-10').simple(true);   // #-> 'm3'
```

*NB:* Note that above returned results are pseudo-results, as they will be
returned wrapped in `TeoriaInterval` objects.

#### TeoriaInterval#octaves()
 - Returns the number of compound intervals

#### TeoriaInterval#isCompound()
 - Returns a boolean value, showing if the interval is a compound interval

#### TeoriaInterval#add(interval)
 - Adds the `interval` to this interval, and returns a `TeoriaInterval`
 representing the result of the addition

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
 E.g. a teoria.interval('M6'), will have a relative quality value of 1, as all the
 intervals defaults to minor and perfect respectively.
