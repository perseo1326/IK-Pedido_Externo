
'use strict';

class dataObjectElement {

    constructor( ){
        this.reference = "";
        this.name = "";
        this.salesLocation = "";
        this.highestSale = 0;
        this.averageSale = 0;
        this.lastWkSales = 0;
        this.thisWkSales = 0;
        this.eoq = 0;
        this.palletQty = 0;
        this.locations = [];
        this.stockEsbo = 0;
        this.palletsSGF = 0;
        this.shopStock = 0;
        this.stockWeeks = 0;
        this.eoqQty = 0;
    }

    setSDS0001Values( salesLocation, ref, name, highestSale, averageSale, eoq, volume, palletQty ) {
        this.salesLocation = salesLocation;
        this.reference = ref;
        this.name = name;
        this.highestSale = highestSale;
        this.averageSale = averageSale;
        this.eoq = eoq;
        this.volume = volume;
        this.palletQty = palletQty;
    }

    setSA021Values( thisWkSales, lastWkSales, expSale ){
        this.thisWkSales = thisWkSales;
        this.lastWkSales = lastWkSales;
        if( this.highestSale !== expSale ){
            console.log("Venta + Alta: ERROR! ");
        }
    }
}

// *********************************************************
// VARIABLES AND CONSTANTS

// Configuration Data Map
let reportsConfigMap;

// Data object elements Map (SG010 Data and references)
let dataObjectElementMap;

// data from 'SDS0001' report
let dataSDS0001;

// data from 'SA021' report 
let dataSA021;

// data from 'Packing List' report 
let dataPackingList;

// data from 'Obs Especiales' report 
let dataObs;

const configDataURL = "./res/configData.json";
const teclas = ["ArrowDown", "ArrowUp", "PageDown", "PageUp"];

const REPO_SDS0001 = "SDS0001";
const REPO_SA021 = "SA021";
const REPO_SG010 = "SG010";
const REPO_PACKING_LIST = "Packing-List";
const REPO_OBS_ESPECIAL = "Obs-Especiales";

const SGF_LOCATION = "SGFLOCATION";
const ESBO_LOCATION = 990501;
const REFERENCE_SG010 = "STORAGE_UNICODE";
const PALLET_QUANTITY = "QTY";





const auxPanel = document.getElementById("auxiliar-panel");

// reports panel 
const reportsPanel = document.getElementById("reports-panel");
const cancelButton = document.getElementById("cancel-aux-panel");
const SDS0001_Button = document.getElementById(REPO_SDS0001);
const SA021_Button = document.getElementById(REPO_SA021);
const SG010_Button = document.getElementById(REPO_SG010);
const PACKING_LIST_Button = document.getElementById(REPO_PACKING_LIST);
const OBS_ESPECIAL_Button = document.getElementById(REPO_OBS_ESPECIAL);
const loadReportsB = document.getElementById("process-reports-go");

// table results panel
const tableResultsPanel = document.getElementById("table-results-panel");

// Table Elements
const table = document.getElementById("table");
const tableHeaders = document.getElementById("table-headers");
const tableData = document.getElementById("table-data");




// *********************************************************
// EVENT LISTENERS

auxPanel.addEventListener("wheel", ( evento ) => {
    console.log("Evento RUEDA.");
    evento.preventDefault();
});


document.addEventListener("keydown", ( evento ) => {
    if( teclas.includes(evento.key) && auxPanel.hidden === false){
        console.log("Key down");
        // TODO: revisar el comportamiento
        // evento.preventDefault();
    }
});


table.addEventListener("keydown", () => {
    console.log("EVENTO TABLE Keydown: ");
});


cancelButton.addEventListener("click", () => {
    // auxPanel.classList.add("no-visible");
    auxPanel.hidden = true;
});


SG010_Button.addEventListener("change", loadSG010_File );
SDS0001_Button.addEventListener("change", loadSDS0001_File) ;
SA021_Button.addEventListener("change", loadSA021_File );
PACKING_LIST_Button.addEventListener("change", loadPackingList_File );
OBS_ESPECIAL_Button.addEventListener("change", loadObservations_File );

loadReportsB.addEventListener("click", ProcessReports );

// *********************************************************
// *********************************************************

initialize();

// *********************************************************
function initialize() {
    console.log("Procediendo a cargar datos de configuración...")

    dataObjectElementMap = new Map();
    dataSDS0001 = [];
    dataSA021 = [];
    dataPackingList = [];
    dataObs = [];

    fetch( configDataURL )
    .then((response) => response.json())
    .then(( jsonData ) => {

        const reportsConfig = new Map();

        jsonData.reports.forEach( element => {
            reportsConfig.set( element.name, element );
        });

        // console.log("MAPA de configuraion: ", reportsConfig );

        // reportsConfig hacerlo global para acceso
        reportsConfigMap = reportsConfig;
    })
    .catch((error) => {
        console.log("ERROR:initialize: " + error.message );
        alert("Error procesando Datos de configuración inicial.");
    });

}


// *********************************************************
// *********************************************************
function loadFile ( evento, report ){

    const file = evento.target.files[0];
    auxPanel.classList.remove("no-visible");

    const filePointer = new ExcelFileOpen(file, report.FILE_EXTENSION_ARRAY, report.FILE_WORKBOOK_SHEET, report.FILE_MYME_TYPE_ARRAY );

    // console.log("FILE: ", filePointer.file );

    return new Promise( ( resolve, reject ) => {
        const promiseData = loadExcelFile(filePointer);
        promiseData.then( (response) => {
            console.log("Carga \"" + filePointer.file.name + "\" Finalizada!", response.length); 
            
            showFileNameReport( report.name + "-file-name" , filePointer.file.name);
            resolve( response );
        })
        .catch( (error) => {
            // Delete the file name in the view
            showFileNameReport( report.name + "-file-name" , "");
            reject( error );
        });
    });
}


// *********************************************************
// Function to read 'SG010' Report selected file
function loadSG010_File( evento ) {

    const report = reportsConfigMap.get( REPO_SG010 ); 
    const promise = loadFile( evento, report );   
    promise.then( ( response ) => {

        // validating data structure
        if( !validateReportColumns( response, report.columns )) {
            throw new Error("Validación de datos en '" + report.name + "' fallida!");
        }

        // global map variable for export data
        dataObjectElementMap = filterByEsboLocation( response, SGF_LOCATION, REFERENCE_SG010, PALLET_QUANTITY, ESBO_LOCATION );

        console.log("DATA ARRAY '" + report.name + "': ", dataObjectElementMap );
    })
    .catch( (error) => {
        console.log("ERROR:loadSG010_File: ", error );
        dataObjectElementMap = undefined;
        showFileNameReport( ( report.name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'SDS0001' Report selected file
function loadSDS0001_File ( evento ) {
    
    const report = reportsConfigMap.get( REPO_SDS0001 ); 
    const promise = loadFile( evento, report );   
    promise.then( ( response ) => {

        // validating data structure
        if( !validateReportColumns( response, report.columns )) {
            throw new Error("Validación de datos en '" + report.name + "' fallida!");
        }

        response = normalizeRecord( response, report.columns[1], 8 );
        response = normalizeRecord( response, report.columns[0], 6 );

        // global map variable for export data
        dataSDS0001 = response;
        console.log("DATA ARRAY '" + report.name + "': ", response );
    })
    .catch( (error) => {
        console.log("ERROR:loadSDS0001_File: ", error );
        dataSDS0001 = undefined;
        showFileNameReport( ( report.name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'SA021' Report selected file
function loadSA021_File ( evento ) {

    const report = reportsConfigMap.get( REPO_SA021 ); 
    const promise = loadFile( evento, report );   
    promise.then( ( response ) => {

        // validating data structure
        if( !validateReportColumns( response, report.columns )) {
            throw new Error("Validación de datos en '" + report.name + "' fallida!");
        }
        
        response = normalizeRecord( response, report.columns[0], 8 );

        // global map variable for export data
        dataSA021 = response;
        console.log("DATA ARRAY '" + report.name + "': ", response );
    })
    .catch( (error) => {
        console.log("ERROR:loadSA021_File: ", error );
        dataSA021 = undefined;
        showFileNameReport( ( report.name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'Packing List' Report selected file
function loadPackingList_File( evento ){

    const report = reportsConfigMap.get( REPO_PACKING_LIST ); 
    const promise = loadFile( evento, report );   
    promise.then( ( response ) => {

        // validating data structure
        if( !validateReportColumns( response, report.columns )) {
            throw new Error("Validación de datos en '" + report.name + "' fallida!");
        }

        // global map variable for export data
        dataPackingList = response;
        console.log("DATA ARRAY '" + report.name + "': ", response );
    })
    .catch( (error) => {
        console.log("ERROR:loadPackingList_File: ", error );
        dataPackingList = undefined;
        showFileNameReport( ( report.name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'Obs Especiales' Report selected file
function loadObservations_File( evento ){

    const report = reportsConfigMap.get( REPO_OBS_ESPECIAL ); 
    const promise = loadFile( evento, report );   
    promise.then( ( response ) => {

        // validating data structure
        if( !validateReportColumns( response, report.columns )) {
        }

        // global map variable for export data
        dataObs = response;
        console.log("DATA ARRAY '" + report.name + "': ", response );
    })
    .catch( (error) => {
        console.log("ERROR:loadObservations_File: ", error );
        dataObs = undefined;
        showFileNameReport( ( report.name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
function ProcessReports() {

    console.log("ProcessReports function!");

    /*
    dataObjectElementMap
    dataSDS0001
    dataSA021
    dataPackingList
    dataObs
    */

try {
    // console.log("TAMAÑO de data obj map: ", dataObjectElementMap.size );

    if( dataObjectElementMap.size <= 0 ){
        console.log("WARNING:ProcessReports: No 'SG010' data loaded.");
        throw new Error("No se han cargado datos del reporte 'SG010'.");
    }

    // Integrate 'SDS0001' data into 'dataObjectElementMap'
    if( dataSDS0001.length <= 0 ){
        console.log(confirm("Reporte vacio!"));
    }
    dataObjectElementMap = loadSDS0001Values( dataSDS0001, dataObjectElementMap, reportsConfigMap.get( REPO_SDS0001 ).columns );
    
    // Integrate 'SA021' data into 'dataObjectElementMap'
    dataObjectElementMap = loadSA021Values( dataSA021, dataObjectElementMap, reportsConfigMap.get( REPO_SA021 ).columns );


    reportsPanel.classList.add("no-visible");
    showTable( dataObjectElementMap );

} catch (error) {
    console.log(error)
    alert(error.message);
}

}


// *********************************************************
