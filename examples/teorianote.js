//  Teoria.js - TeoriaNote 
// ========================

// This is an object representation of a TeoriaNote object containing a c' note.
var TeoriaNote = {
    // Member Variables
    // ----------------
    
    // The `name` value, contains the name *without* any accidentals
    name: 'c',
    // Duration of the note 4 = fourth, 8 = eighth and so on.
    duration: 4,
    // Defines the `octave` of the note
    octave: 4,
    // The `accidental` object has to parameters:
    accidental: {
      // `sign` - Which is a string representation of any accidentals the note might have, such as `x`, `#`, `b` or `bb`.
      // Notice that `x` is used as a double-sharp
      sign: '',
      // `value` - The numeric value of the accidental, `'x' = 2`, `'#' = 1`, `'' = 0`, `'b' = -1`, `'bb' = -2`
      value: 0
    },
    
    // Member Methods
    // --------------
    
    // Returns the keynumber (on a Piano) of the note
    // The parameter `whitetones`, is mostly used internal, but if set to true, only 'white' keys will be counted upwards
    key: function(whitetones) {},
    
    // Returns the frequency of the note.
    // The parameter `concertPitch` is optional and defaults to `440` which is International standard, but can be set to other values
    // such as `442`, which some classical pianists uses.
    fq: function(concertPitch) {},
    
    // Returns a scale, which is an array of notes, with the note as root.
    // The `type` parameter decides which scale that should be returned, `major`, `minor`, `dorian`, `phrygian`, `mixolydian` etc.
    // The `simple` parameter is optional. If set to `true`, only the names of the notes and not whole `TeoriaNote` objects are returned.
    scale: function(type, simple) {},
    
    // The interval method can be used for two things, and therefor the `to` parameter can have two different types of values:
    // 
    //  - A `string`, representing an interval. This could be `m2` for minor second, `M3` for major third, `P4`, for a perfect fourth, `d5` for a diminished fifth etc.
    // 
    //  - An instance of `TeoriaNote` - When an instance of a `TeoriaNote` is given, the function returns the interval *between* these two notes.
    interval: function(to) {},
    
    // The chord function takes only one parameters, the `name` of the chord. This can either be verbose such as `major` or `diminished` or
    // it can be an (European Style) chordsymbol, such as `m7b5` or `11`. Imagine the `name` part as the part after the note name.
    chord: function(name) {},
    
    // Helmholtz Notation is used when describing a note precisely. For example the keyhole c (C4) is notated: `c'` and A#1 as `,A#`<br />
    // Look Helmholtz up at wikipedia or google or something. It's quite a beautiful notation
    helmholtz: function() {},
    
    // This method returns the scientific notation of the note, such as: `C4`, `F#3`, `Bb5` etc.
    scientific: function() {},
    
    // An, right now, experimental feature, which returns an array of tones which are enharmonic with the note.
    // for example it would return `['Dbb', 'B#']`, for this note.
    enharmonics: function() {},
    
    // A rather useless function which returns the duration as a string. Such as `sixteenth` or `thirty-second` or `longa`...
    valueName: function() {},
    
    // Highly useful for when writing out, or debugging the `toString` method returns the name + octave
    // If the parameter `noOctave` is set to `true`, then no octave will be returned.
    toString: function(noOctave) {}
};
