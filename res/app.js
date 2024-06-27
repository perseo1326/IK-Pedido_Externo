
'use strict';

    // EXCEL constantes
    /* const FILE_MYME_TYPE_ARRAY = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]; */


// *********************************************************
// VARIABLES AND CONSTANTS

// Data Variables
let reportsMap = new Map();

const configDataURL = "./res/configData.json";
const teclas = ["ArrowDown", "ArrowUp", "PageDown", "PageUp"];

const REPO_SDS0001 = "SDS0001";
const REPO_SA021 = "SA021";
const REPO_SG010 = "SG010";
const REPO_PACKING_LIST = "Packing List";
const REPO_OBS_ESPECIAL = "Obs Especiales";




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


SDS0001_Button.addEventListener("change", loadSDS0001_File) ;
SA021_Button.addEventListener("change", loadSA021_File );
SG010_Button.addEventListener("change", loadSG010_File );
// PACKING_LIST_Button.addEventListener("change", );
// OBS_ESPECIAL_Button.addEventListener("change", );

loadReportsB.addEventListener("click", ProcessReports );

// *********************************************************
// *********************************************************

initialize();

// *********************************************************
function initialize() {
    console.log("Procediendo a cargar datos de configuración...")

    fetch( configDataURL )
    .then((response) => response.json())
    .then(( jsonData ) => {

        const reportsConfig = new Map();

        jsonData.reports.forEach( element => {
            reportsConfig.set( element.name, element );
        });

        // console.log("MAPA: ", reportsConfig );

        // reportsConfig hacerlo global para acceso
        reportsMap = reportsConfig;
    })
    .catch((error) => {
        console.log("ERROR:initialize: " + error.message );
        alert("Error procesando Datos de configuración inicial.");
    });
}


// *********************************************************
// *********************************************************
function loadFile ( evento, reportName ){

    const file = evento.target.files[0];
    auxPanel.classList.remove("no-visible");

    const report = reportsMap.get(reportName);
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
    const promise = loadFile( evento, REPO_SG010 );   
    promise.then( ( response ) => {

        console.log("EVENTO: ", evento);
        // srcElement

        // validating data structure
        if( !validateReportColumns( response, reportsMap.get( REPO_SG010 ).columns )) {
            throw new Error("Validación de datos fallida!");
        }

        // console.log("Verificando columnas: ", x);

        // console.log("VALORES DE RETORNO: ", response);
    })
    .catch( (error) => {
        console.log("ERROR:loadSG010_File: ", error );
        showFileNameReport( ( reportsMap.get(REPO_SG010).name ) + "-file-name" , "");
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });

}


// *********************************************************
// Function to read 'SDS0001' Report selected file
function loadSDS0001_File ( evento ) {
    
    const promise = loadFile( evento, REPO_SDS0001 );
    promise.then( ( response ) => {

        console.log("VALORES DE RETORNO: ", response);
    })
    .catch( (error) => {
        console.log("NEW ERROR:loadSDS0001_File: ", error );
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'SA021' Report selected file
function loadSA021_File ( evento ) {
    const promise = loadFile( evento, REPO_SA021 );   
    promise.then( ( response ) => {

        console.log("VALORES DE RETORNO: ", response);
    })
    .catch( (error) => {
        console.log("NEW ERROR:loadSA021_File: ", error );
        alert(error.message);
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
function ProcessReports() {

    reportsPanel.classList.add("no-visible"),
    console.log("ProcessReports function!");

}


// *********************************************************
