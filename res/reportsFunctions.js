
'use strict';

// *********************************************************
// *********************************************************
// VARIABLES AND CONSTANTS





// *********************************************************
// Compare if all mandatory columns exist into the data object(keys array)
function validateReportColumns( data, columnsArray ){

    const keys = [];

    // verifiy the first and the last line of data
    keys[0] = Object.keys(data[0]);
    keys[1] = Object.keys(data[( data.length - 1 ) ]);

    if( keys[0].length !== keys[1].length ){
        return false;
    }

    for (const row of keys) {
        if( !compareColumnsArrays( row, columnsArray ) ) {
            return false;
        }    
    }

    return true;
}


// *********************************************************
function compareColumnsArrays( objectKeysArray, mandatoryColumns ){

    for (const column of mandatoryColumns ) {
        if( !objectKeysArray.includes( column )) {
            console.log("Columna no encontrada '" + column + "'");
            return false;
        }
    }

    return true;
}


// *********************************************************
function filterByEsboLocation( dataArray, columnSgfLocation, reference, esboLocation ) {

    const referencesSet = new Set();
    for ( const row of dataArray ) {
        if( row[columnSgfLocation] === esboLocation ){
            referencesSet.add( row[reference] );
            console.log("ROW: ", row[reference], row[columnSgfLocation]);
        }
    }

    return referencesSet;
}

// *********************************************************
// *********************************************************
