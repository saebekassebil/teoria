//  Teoria.js - Teoria Namespaces
// ========================
// 
// The `teoria` object consists of different namespaces or modules if you'd like.
// They're used to interact the objects `TeoriaNote` and `TeoriaChord` with eachother and other functionality.
// 
// Please notice that this representation of the object makes it impossible for a parameter to be both a function and a object, even though this is what some of they are.
// Therefor there is a `__construct` method at some of them, but *it is not* a real function, only a representation of the parents function.

// The main `teoria` object, which is added to the `window` object. `window.teoria`
var teoria = {
    
    // teoria.note
    // -----------
    //
    // The `note` namespace is at its simplest just a wrapper or a so-called sugar function for the `TeoriaNote` object. 
    note: {
      // It can be called as a function with two parameters:
      //
      //  - `name` The note, represented in either scientific notation of Helmholtz notation.
      //  - `duration` The duration of the note where 4 = quarter, 8 = eighth, 16 = sixteenth and etc.
      __construct: function(name, duration) {},

      // The note wrapper has a single method, `fromKey`, which returns a `TeoriaNote` object given a keynumber.
      // Remember that a keynumber can represent different notes fx key 33 can both be an F3 or E#3 note.
      fromKey: function(key) {}
    },
    
    // teoria.chord
    // ------------
    //
    // The `chord` "namespace" is also just a wrapper for the TeoriaChord object. It takes one argument `name` which is a `string`.
    // The `name` argument is the "full" name of the chord, fx: `Emaj7`, `D#7b5` or just plain ol' `C`.
    chord: function(name) {},
    
    // teoria.frequency
    // ----------------
    //
    // The `frequency` namespace holds frequency based functionality, but right now there isn't all that much of it, except though the quite useful method `note`.
    frequency: {
      
      // `note` is a function that "guesses" a note from a given frequency. It's however not guesswork, but a mathematical algorithm it does.
      // `frequency` is just a number (int or float), for example `440`, `261.626` etc.
      // The method returns an object containing to parameters:
      //
      //  - `note` which is the `TeoriaNote` object it has found most similar.
      //  - `cents` which is a float value of cents the note is out of tune.
      note: function(frequency) {}
    },
    
    // teoria.interval
    // ---------------
    //
    // `interval` namespace - Interval functionality
    interval: {
      // The method itself, `teoria.interval`, is a sugar function for its child functionality. It takes three generic arguments, which it passes on to its childs.
      //
      //  - `from` - Is allways a `TeoriaNote` object. This is the note that is gonna be the "root" of the measurements.
      //  - `to` - Can again be two things, a string representation of an interval or a `TeoriaNote` object.
      //           If it's a string, it's passed on to `teoria.interval.from`, if it's `TeoriaNote` to `teoria.interval.between`.
      //  - `direction` - The direction of the interval. `'up'` or `'down'`. Makes only sense passing if the `to` argument is a string.
      __construct: function(from, to, direction) {},
      
      // The `from` method returns a new `TeoriaNote` object which is of `interval` distance to the note.
      // Put in an other way: Returns the note which is placed an `interval` away.
      //
      //  - `note` - A `TeoriaNote` object
      //  - `interval` - A string representing an interval. First the quality, then the numeric notation of the interval. Fx:
      //                 `P4`, means perfect fourth, `M3`, means majord third, `m7` means minor seventh etc.
      //  - `direction` - Decides if the `interval` is measured `up` or `down`.
      from: function(note, interval, diretion) {},
      
      // `between` simply takes in two `TeoriaNote`s and finds the interval between them.
      // It returns an object which has four parameters:
      //
      //  - `name` - The name of the interval, such as `fifth`, `second`, `thirteenth`, `fifth` etc.
      //  - `quality` - `major`, `minor`, `augmented` or `diminished`.
      //  - `direction` - If it's measured `up` or `down`.
      //  - `simple` - The string representation of the interval, `M6`, `m7`, `m9` etc.
      between: function(from, to) {},
      
      // `invert` inverts an interval. The `interval` argument is the string representation of the interval.
      invert: function(interval) {}
    },
    
    // teoria.scale
    // ---------------
    //
    // `scale` namespace - Scale functionality
    scale: {
      
      // The `list` method returns a `scale` with a root `note`.
      // 
      //  - `note` - A `TeoriaNote` object which is the root of the scale.
      //  - `scale` - Can either be a string name of the scale, or an array of intervals as shown in the `scales` object below.
      //  - `simple` - Defaults to `false`. If set to true only the name of the notes are returned in the array, else an array of `TeoriaNote`s is returned.
      list: function(note, scale, simple) {},
      
      // `scales` holds some scales. This object can easily be expanded, but holds right now the seven modes and the major and minor pentatonic.
      // A scale is written as an array of intervals in string representation, as shown below.
      scales: {
        major:      ['M2', 'M2', 'm2', 'M2', 'M2', 'M2'],
        ionian:     ['M2', 'M2', 'm2', 'M2', 'M2', 'M2'],
        dorian:     ['M2', 'm2', 'M2', 'M2', 'M2', 'm2'],
        phrygian:   ['m2', 'M2', 'M2', 'M2', 'm2', 'M2'],
        lydian:     ['M2', 'M2', 'M2', 'm2', 'M2', 'M2'],
        mixolydian: ['M2', 'M2', 'm2', 'M2', 'M2', 'm2'],
        minor:      ['M2', 'm2', 'M2', 'M2', 'm2', 'M2'],
        aeolian:    ['M2', 'm2', 'M2', 'M2', 'm2', 'M2'],
        locrian:    ['m2', 'M2', 'M2', 'm2', 'M2', 'M2'],
        
        majorpentatonic: ['M2', 'M2', 'm3', 'M2'],
        minorpentatonic: ['m3', 'M2', 'M2', 'm3']
      }
    }
};