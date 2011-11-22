//  Teoria.js - TeoriaChord
// ========================

// This is an object representation of a TeoriaChord object containing a Cmaj7 chord.
var TeoriaNote = {
    // Member Variables
    // ----------------
    
    // The `name` member is the name of the chord (European style).
    name: 'Cmaj7',
    
    // The `root` member is, as the name hints at, the root note (`TeoriaNote`) of the chord.
    root: teoria.note('c'),
    
    // The `notes` member is an array of `TeoriaNote`s, which the chord contains. Here c,e,g and b which constitutes a Cmaj7 chord.
    notes: [teoria.note('c'), teoria.note('e'), teoria.note('g'), teoria.note('b')],
    
    // The `quality` member describes what quality the chord has, `major` or `minor`. But, be aware that this is *not* the type of the chord
    // for example a diminished chord is `minor`, and an augmented is `major`.
    quality: 'major',
    
    // The `type` member is on the other hand exactly what the quality isn't. This can be `major`, `minor`, `diminished` or `augmented`.
    type: 'major',
    
    // Member Methods
    // --------------
    
    // The `dominant` method returns the dominant chord, taking this chord as the first chord in the scale (I/Tonica).
    // The `additional` parameter is 'extra stuff' you can put on the chord, like '7' or '7b5' or 'm'.
    // It would return a G as a `TeoriaChord` for this, but if called `chord.dominant('7')` it would return G7 as a `TeoriaChord`.
    dominant: function(additional) {},
    
    // The `subdominant` works as the `dominant`. Just returning as the name suggests the subdominant, which is located a perfect fourth over the tonic.
    // The `additional` parameter is the same as above.
    subdominant: function(additional) {},
    
    // The `parallel` method only works for major/minor triads. It returns the parallel chord.
    // The `additional` parameter is the same as above.
    parallel: function() {additional},
    
    // `chordType` method returns the "type" of chord. "Type" is in need of a better word, because what it returns is `dyad`, `triad`, `tetrad` and such.
    chordType: function() {},
    
    // The JavaScript Core function `toString` is supported for making debugging and printing easy. It just returns the name of the chord.
    toString: function() {}
};