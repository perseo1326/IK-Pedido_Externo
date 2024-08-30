
'use strict';

// *********************************************************
// *********************************************************
// VARIABLES AND CONSTANTS






// *********************************************************
// Compare if all mandatory columns exist into the data object(keys array)
// And first and last row are the same
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
function normalizeRecord ( dataArray, refColumn, stringSize ){

    // console.log("normalizeRecord: ", refColumn, stringSize, dataArray);

    for (let index = 0; index < dataArray.length; index++) {

        const reference = String( dataArray[index][refColumn]).padStart( stringSize, "0");
        dataArray[index][refColumn] = reference;
    }
    return dataArray;
}


// *********************************************************
function filterByEsboLocation( dataArray, reference, columnSgfLocation, esboLocation ) {

    const referencesMap = new Map();
    for ( const row of dataArray ) {

        if( row[columnSgfLocation] === esboLocation ){

            referencesMap.set( row[reference], new dataObjectElement() );
        }
    }

    // console.log("Tamaño SET: ", referencesMap.size );
    return referencesMap;
}


// *********************************************************
function getLocationsByRef( response, referencesMap, reference, columnSgfLocation, palletQuantity ) {

    for ( const row of response ) {
        // console.log("ROW SG010 Location: ", row );

        if( referencesMap.has( row[reference] )){

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

    // console.log("DATA OBJ: ", SDS0001DataArray, columns );
    
    for (const row of SDS0001DataArray ) {
        
        // console.log("loadSDS0001Values: row: ", columns, row );
        
        if( dataObjectElements.has( row[ columns[1]] ) ){
            
            // console.log("REf: ", row[ columns[1]], row );

            dataObjectElements.get( row[columns[1]])
                .setSDS0001Values( 
                    row[columns[0]],
                    row[columns[1]],
                    row[columns[2]],
                    row[columns[4]],
                    row[columns[5]],
                    row[columns[6]],
                    row[columns[3]],
                    row[columns[8]],
                    row[columns[9]]
                );
            // console.log("OBJECT: ", dataObjectElements.get( row[columns[1]]) );
        }
        
        // console.log("OBJECT By REF:", dataObjectElements.get( "00102065") );
    }
    return dataObjectElements;
}


// *********************************************************
function loadSA021Values(SA021DataArray, dataMap, columns) {

    for ( const row of SA021DataArray ) {
        if( dataMap.has( row[ columns[0] ])) {

            // console.log("ROW SA021: ", columns);
            // console.log("ROW SA021: ", row );
            dataMap.get( row[ columns[0] ]).
                setSA021Values( 
                    row[ columns[2] ], 
                    row[ columns[3] ], 
                    row[ columns[1] ]
                );
        }
    }
    return dataMap;
}


// *********************************************************
function loadOpenOrderLineValues( OpenOrderLineDataArray, dataMap, columns ) {

    // console.log("ROW Open Order Line: ", columns, OpenOrderLineDataArray);

    for ( const row of OpenOrderLineDataArray ) {
        if( dataMap.has( row[ columns[0] ])) {

            dataMap.get( row[ columns[0] ]).
                setOpenOrderLineValues( 
                    row[ columns[1] ]
                );
        }
    }
    return dataMap;
}

// *********************************************************
function loadPackingListValues( packingListDataArray, dataMap, columns ) {

    // console.log("ROW Packing list: ", columns, packingListDataArray);

    for ( const row of packingListDataArray ) {
        if( dataMap.has( row[ columns[0] ])) {

            // console.log("ROW Packing list value: ", row );
            dataMap.get( row[ columns[0] ]).
                setPackingListValues(
                    row[ columns[1] ]
                );
        }
    }
    return dataMap;
}


// *********************************************************
function loadDataObsValues ( dataObsDataArray, dataMap, columns ) {
    
    for ( const row of dataObsDataArray ) {

        if( dataMap.has( row[ columns[0] ])) {
            dataMap.get( row[ columns[0] ]).
                setDataObsValues( 
                    row[ columns[1] ]
                );
        }
    }
    return dataMap;
}


// *********************************************************
// Integrate 'Pedido Anterior ESBO' data into 'dataObjectElementMap'
function loadPreviousOrderValues ( previousOrderDataArray, dataMap, columns ) {

    for ( const row of previousOrderDataArray ) {

        if( dataMap.has( row[ columns[0] ])) {
            
            dataMap.get( row[ columns[0] ]).
                setPreviousOrderValues( 
                    row[ columns[1] ]
                );
        }
    }
    return dataMap;
}


// *********************************************************
// *********************************************************
// *********************************************************
// *********************************************************
