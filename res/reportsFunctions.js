
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
function normalizeReferences ( dataArray, refColumn ){

    for (let index = 0; index < dataArray.length; index++) {

        const reference = String( dataArray[index][refColumn]).padStart( 8, "0");
        dataArray[index][refColumn] = reference;
    }
    return dataArray;
}


// *********************************************************
function filterByEsboLocation( dataArray, columnSgfLocation, reference, palletQuantity, esboLocation ) {

    const referencesMap = new Map();
    for ( const row of dataArray ) {

        // console.log("SG010 Ref: ", typeof(row[reference]) , row[reference] );

        if( row[columnSgfLocation] === esboLocation ){
            if(!referencesMap.has( row[reference] )){

                referencesMap.set( row[reference], new dataObjectElement() );
            }

            const palletLocation = { 
                "palletLocation" : row[ columnSgfLocation ],
                "palletQuantity" : row[ palletQuantity ] 
            };
            referencesMap.get( row[reference] ).locations.push( palletLocation );
            // console.log("ROW: ", row[reference], row[columnSgfLocation]);
        }
    }

    return referencesMap;
}


// *********************************************************
function loadSDS0001Values(SDS0001DataArray, dataObjectElements, columns) {
    for (const row of SDS0001DataArray ) {
        
        console.log("DATA OBJ: ", dataObjectElements, columns );
        console.log("REf: ", typeof (row[ columns[1]] ), row[ columns[1]]);

        if( dataObjectElements.has( row[ columns[1]] ) ){
            
            dataObjectElements.get( row[columns[1]]).setSDS0001Values( 
                row[columns[0]],
                row[columns[1]],
                row[columns[2]],
                row[columns[4]],
                row[columns[5]],
                row[columns[3]],
                row[columns[8]],
                row[columns[9]]
                );
            console.log("OBJECT: ", dataObjectElements.get( row[columns[1]]) );
        }

        return;
    }
    
}


// *********************************************************





// *********************************************************
