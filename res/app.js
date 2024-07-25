
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
        this.openOrderLineData = 0;
        this.packingListData = "";
        this.quotes = "";

        this.locations = [];
        this.esboStock = {};
        this.shopStock = {};

        this.totalStock = 0;
        this.LVStock = 0;
        this.availableShopStock = 0;

        this.eoqQty = 0;
        this.stockWeeks = 0;
    }

    setSDS0001Values( salesLocation, ref, name, highestSale, averageSale, availableStock, eoq, volume, palletQty ) {
        this.salesLocation = salesLocation;
        this.reference = ref;
        this.name = name;
        this.highestSale = highestSale;
        this.averageSale = averageSale;
        this.totalStock = availableStock;
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

    setOpenOrderLineValues( openOrderLineData ){
        this.openOrderLineData = openOrderLineData;
    }
    
    setPackingListValues( packingListData ) {
        let space = "";
        if(this.packingListData != ""){
            space = ", ";
        }
        this.packingListData = (this.packingListData + space + packingListData );
    }

    setPreviousOrderValues( previousOrderData ) {
        debugger
        this.packingListData = ( "(" + previousOrderData + ") " + this.packingListData );
        console.log("Pedido: ", this.packingListData);
    }

    setDataObsValues( quotes ){
        this.quotes = quotes;
    }

    setShopAndEsboStockPallets( shopStock, esboStock ){
        this.shopStock.stock = shopStock.stock;
        this.shopStock.pallets = shopStock.pallets;

        this.esboStock.stock = esboStock.stock;
        this.esboStock.pallets = esboStock.pallets;
    }

    setLVStock(){
        this.LVStock = this.totalStock - ( this.shopStock.stock + this.esboStock.stock );
    }

    setAvailableShopStock(){
        this.availableShopStock = this.totalStock - this.esboStock.stock;
    }

    setEoqQty(){
        this.eoqQty = this.availableShopStock / this.eoq;
    }

    setStockWeeks(){
        this.stockWeeks = this.availableShopStock / this.highestSale;
    }
}

// *********************************************************
// VARIABLES AND CONSTANTS

// Configuration Data Map
let reportsConfigMap;

// Data object elements Map (SG010 Data and references)
let dataObjectElementsMap;

// data from 'SDS0001' report
let dataSDS0001;

// data from 'SA021' report 
let dataSA021;

// data from 'OPEN ORDER LINE' report 
let dataOOL;

// data from 'Packing List' report 
let dataPackingList;

// data from 'Obs Especiales' report 
let dataObs;

// data from 'Pedido anterior ESBO' report 
let dataPreviousOrder;

const configDataURL = "./res/configData.json";
const teclas = ["ArrowDown", "ArrowUp", "PageDown", "PageUp"];

const tableHeadersView = [
    "Referencia",
    "Nombre",
    "V.Max",
    "VMS",
    "Ult Sem",
    "Semana",
    "Sem Stock",
    "EOQ",
    "Pallet Qty",
    "Stock Tienda",
    "Stock LV",
    "Pall Tienda",
    "Reservas",
    "Pedir",
    "Prox Camión",
    "Obs Esp.",
    "Pall ESBO",
    "Stock ESBO",
    "EOQ %",
    "LV Venta",
    "Cabeceras"
];

const REPO_SDS0001 = "SDS0001";
const REPO_SA021 = "SA021";
const REPO_SG010 = "SG010";
const REPO_OPEN_ORDER_LINE = "OOL";
const REPO_OBS_ESPECIAL = "Obs-Especiales";
const REPO_PACKING_LIST = "Packing-List";
const REPO_PREVIOUS_ORDER = "Pedido-ESBO";

const SGF_LOCATION = "SGFLOCATION";
const ESBO_LOCATION = "990501";
const REFERENCE_SG010 = "STORAGE_UNICODE";
const PALLET_QUANTITY = "QTY";





const auxPanel = document.getElementById("auxiliar-panel");

// reports panel 
const reportsPanel = document.getElementById("reports-panel");
const cancelButton = document.getElementById("cancel-aux-panel");
const SDS0001_Button = document.getElementById(REPO_SDS0001);
const SA021_Button = document.getElementById(REPO_SA021);
const SG010_Button = document.getElementById(REPO_SG010);
const OOL_Button = document.getElementById(REPO_OPEN_ORDER_LINE);
const PACKING_LIST_Button = document.getElementById(REPO_PACKING_LIST);
const OBS_ESPECIAL_Button = document.getElementById(REPO_OBS_ESPECIAL);
const previousOrder_Button = document.getElementById(REPO_PREVIOUS_ORDER);
const loadReportsB = document.getElementById("process-reports-go");

// table results panel
const tableResultsPanel = document.getElementById("table-results-panel");

// Table Elements
const table = document.getElementById("table");
const tableHeaders = document.getElementById("table-headers");
const tableData = document.getElementById("table-data");
const tableDataButton = document.getElementById("copy-data-table");




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
OOL_Button.addEventListener("change", loadOOL_File );
PACKING_LIST_Button.addEventListener("change", loadPackingList_File );
OBS_ESPECIAL_Button.addEventListener("change", loadObservations_File );
previousOrder_Button.addEventListener("change", loadPreviousOrder_File );

loadReportsB.addEventListener("click", ProcessReports );
tableDataButton.addEventListener("click", copyTable );

// *********************************************************
// *********************************************************

initialize();

// *********************************************************
function initialize() {
    console.log("Procediendo a cargar datos de configuración...")

    dataObjectElementsMap = new Map();
    dataSDS0001 = [];
    dataSA021 = [];
    dataOOL = [];
    dataPackingList = [];
    dataObs = [];
    dataPreviousOrder = [];

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

        // convert sales locations from number to string
        response = normalizeRecord( response, report.columns[0], 6 );

        // global map variable for export data
        const referencesMap = filterByEsboLocation( response, REFERENCE_SG010, SGF_LOCATION, ESBO_LOCATION );

        dataObjectElementsMap = getLocationsByRef( response, referencesMap, REFERENCE_SG010, SGF_LOCATION, PALLET_QUANTITY );

        dataObjectElementsMap = locationsSpliter( dataObjectElementsMap, ESBO_LOCATION );

        console.log("DATA ARRAY '" + report.name + "': ", dataObjectElementsMap );
    })
    .catch( (error) => {
        console.log("ERROR:loadSG010_File: ", error );
        dataObjectElementsMap = new Map();
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
        dataSDS0001 = [];
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
        dataSA021 = [];
        showFileNameReport( ( report.name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'OPEN_ORDER_LINE' Report selected file
function loadOOL_File( evento ){

    const report = reportsConfigMap.get( REPO_OPEN_ORDER_LINE ); 
    const promise = loadFile( evento, report );   
    promise.then( ( response ) => {

        // validating data structure
        if( !validateReportColumns( response, report.columns )) {
            throw new Error("Validación de datos en '" + report.name + "' fallida!");
        }
        
        response = normalizeRecord( response, report.columns[0], 8 );

        // global map variable for export data
        dataOOL = response;
        console.log("DATA ARRAY '" + report.name + "': ", response );
    })
    .catch( (error) => {
        console.log("ERROR:loadOOL_File: ", error );
        dataOOL = [];
        showFileNameReport( ( report.name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'Packing-List' Report selected file
function loadPackingList_File( evento ){

    const report = reportsConfigMap.get( REPO_PACKING_LIST ); 
    const promise = loadFile( evento, report );   
    promise.then( ( response ) => {

        // validating data structure
        if( !validateReportColumns( response, report.columns )) {
            throw new Error("Validación de datos en '" + report.name + "' fallida!");
        }

        response = normalizeRecord( response, report.columns[0], 8 );

        // global map variable for export data
        dataPackingList = response;
        console.log("DATA ARRAY '" + report.name + "': ", response );
    })
    .catch( (error) => {
        console.log("ERROR:loadObservations_File: ", error );
        dataPackingList = [];
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
        if( !compareColumnsArrays( Object.keys( response[0] ), report.columns )){
            throw new Error("Validación de datos en '" + report.name + "' fallida!");
        }

        response = normalizeRecord( response, report.columns[0], 8 );

        // global map variable for export data
        dataObs = response;
        console.log("DATA ARRAY '" + report.name + "': ", response );
    })
    .catch( (error) => {
        console.log("ERROR:loadObservations_File: ", error );
        dataObs = [];
        showFileNameReport( ( report.name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'Pedido Anterior ESBO' Report selected file
function loadPreviousOrder_File( evento ){

    const report = reportsConfigMap.get( REPO_PREVIOUS_ORDER ); 
    const promise = loadFile( evento, report );   
    promise.then( ( response ) => {

        // validating data structure
        if( !compareColumnsArrays( Object.keys( response[0] ), report.columns )){
            throw new Error("Validación de datos en '" + report.name + "' fallida!");
        }

        response = normalizeRecord( response, report.columns[0], 8 );

        // global map variable for export data
        dataPreviousOrder = response;
        console.log("DATA ARRAY '" + report.name + "': ", response );
    })
    .catch( (error) => {
        console.log("ERROR:loadPreviousOrder_File: ", error );
        dataPreviousOrder = [];
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

    try {
        if( dataObjectElementsMap.size <= 0 ){
            console.log(`WARNING:ProcessReports: No '${REPO_SG010}' data loaded.`);
            throw new Error(`No se han cargado datos del reporte '${REPO_SG010}'.`);
        }

        // Ask to continue if some report is not provided
        if( !alertNoReportProvided( dataSDS0001, REPO_SDS0001 )) {
            return;
        }

        if( !alertNoReportProvided( dataSA021, REPO_SA021 )) {
            return;
        }

        if( !alertNoReportProvided( dataOOL, REPO_OPEN_ORDER_LINE )) {
            return;
        }

        // console.log("Validation packing list: ", dataPackingList );
        if( !alertNoReportProvided( dataPackingList, REPO_PACKING_LIST )) {
            return;
        }

        if( !alertNoReportProvided( dataObs, REPO_OBS_ESPECIAL )) {
            return;
        }

        // Integrate 'SDS0001' data into 'dataObjectElementMap'
        dataObjectElementsMap = loadSDS0001Values( dataSDS0001, dataObjectElementsMap, reportsConfigMap.get( REPO_SDS0001 ).columns );
        
        // Integrate 'SA021' data into 'dataObjectElementMap'
        dataObjectElementsMap = loadSA021Values( dataSA021, dataObjectElementsMap, reportsConfigMap.get( REPO_SA021 ).columns );

        // Integrate 'Open Order Line OOL' data into 'dataObjectElementMap'
        dataObjectElementsMap = loadOpenOrderLineValues( dataOOL, dataObjectElementsMap, reportsConfigMap.get( REPO_OPEN_ORDER_LINE ).columns );

        // Integrate 'Packing-List' data into 'dataObjectElementMap'
        dataObjectElementsMap = loadPackingListValues( dataPackingList, dataObjectElementsMap, reportsConfigMap.get( REPO_PACKING_LIST ).columns );
        
        // Integrate 'Obs-Especiales' data into 'dataObjectElementMap'
        dataObjectElementsMap = loadDataObsValues( dataObs, dataObjectElementsMap, reportsConfigMap.get( REPO_OBS_ESPECIAL ).columns );

        // Integrate 'Pedido Anterior ESBO' data into 'dataObjectElementMap'
        dataObjectElementsMap = loadPreviousOrderValues( dataPreviousOrder, dataObjectElementsMap, reportsConfigMap.get( REPO_OBS_ESPECIAL ).columns );

        // Fill calculated data
        dataObjectElementsMap = setShopAvailibility( dataObjectElementsMap );
        dataObjectElementsMap = setEOQavailable( dataObjectElementsMap );
        dataObjectElementsMap = setStockWeeks( dataObjectElementsMap );

        // UI updates
        reportsPanel.classList.add("no-visible");
        tableDataButton.parentElement.classList.remove("no-visible");
        showTable( dataObjectElementsMap );

    } catch (error) {
        console.log(error)
        alert(error.message);
    }
}


// *********************************************************
function copyTable( evento ){

    console.log("EVENTO: ", evento );
    copyElement( document.getElementById("table") );

    /*
    setTimeout( () => {
        element.parentNode.classList.remove("copy-shipment");
    }, 1000 );
    */
}


// *********************************************************
// Function to 'copy' a DOM node into the clipboard. 
function copyElement( element ){
    console.log("Copy ELEMENT: ", element);

    // element.innerText = element.innerText.trim();
    
    // clear all selection made before
    window.getSelection().removeAllRanges();

    let result = false;

    let range = document.createRange();
    range.selectNode( element );
    window.getSelection().addRange(range);
    
    try {
        result = document.execCommand('copy');
        console.log("Resultado de la copia: ", result );
        window.getSelection().removeAllRanges();
    } catch (error) {
        console.log("ERROR:copyElement: Problema al copiar el elemento.", result);
        alert("Problema al copiar el elemento.");
    }
}


// *********************************************************
function alertNoReportProvided( dataArray, reportName ) {
    if( dataArray.length <= 0 ){
        const message = `No se ha cargado el reporte '${reportName}', Desea continuar?`;
        console.log("WARNING:alertNoReportProvided: " + message);
        return confirm(message);
    }
    return true;
}


// *********************************************************
function locationsSpliter( dataMap, esboLocation ) {

    for (const element of dataMap.entries() ) {
        
        const esboStock = {
            stock : 0,
            pallets : 0
        }
        
        const shopStock = {
            stock : 0,
            pallets : 0
        }
        
        for ( const location of element[1].locations ) {
            
            if( location.palletLocation === esboLocation ){
                esboStock.stock += location.palletQuantity;
                esboStock.pallets++;
                
            } else {
                shopStock.stock += location.palletQuantity;
                shopStock.pallets++;
            }
        }

        dataMap.get( element[0] ).setShopAndEsboStockPallets( shopStock, esboStock );
    }
    return dataMap;
}


// *********************************************************
function setShopAvailibility ( dataMap ){

    for (const ref of dataMap.keys() ) {

        dataMap.get( ref ).setLVStock();
        dataMap.get( ref ).setAvailableShopStock();
    }
    return dataMap;
}


// *********************************************************
function setEOQavailable( dataMap ){

    for ( const ref of dataMap.keys() ) {

        dataMap.get( ref ).setEoqQty();
    }
    return dataMap;
}


// *********************************************************
function setStockWeeks( dataMap ){
    
    for (const ref of dataMap.keys() ) {

        dataMap.get( ref ).setStockWeeks();
    }
    return dataMap;
}


// *********************************************************


// *********************************************************
// *********************************************************
// *********************************************************
