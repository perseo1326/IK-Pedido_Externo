
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


SDS0001_Button.addEventListener("change", loadSDS0001_File);

loadReportsB.addEventListener("click", ProcessReports );

// *********************************************************
// *********************************************************

initialize();

// *********************************************************
function initialize() {
    console.log("Procediendo a cargar datos de configuración.")

    fetch( configDataURL )
    .then((response) => response.json())
    .then(( jsonData ) => {
        console.log("JSON DATA: ", jsonData);

        const reportsConfig = new Map();
        // console.log("OBJECT JSON ", jsonData.reports);

        jsonData.reports.forEach( element => {
            reportsConfig.set( element.name, element );
        });

        console.log("MAPA: ", reportsConfig );

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
// Function to read 'SDS0001' Report selected file
function loadSDS0001_File ( evento ) {
    const file = evento.target.files[0];
    auxPanel.classList.remove("no-visible");

    const report = reportsMap.get(REPO_SDS0001);
    const filePointer = new ExcelFileOpen(file, report.FILE_EXTENSION_ARRAY, report.FILE_WORKBOOK_SHEET, report.FILE_MYME_TYPE_ARRAY );
    // console.log("FILE: ", filePointer.file );

    showFileNameReport( report.name + "-file-name" , filePointer.file.name);

    const promiseData = loadExcelFile(filePointer);
    promiseData.then( (response) => {
        console.log("Carga \"" + filePointer.file.name + "\" Finalizada!", response); 
        report.data = response;
        reportsMap.set(report.name, report);
    })
    .catch( (error) => {
        console.log("ERROR:loadSDS0001_File: ", error);
        alert(error.message);
        // TODO: inicializar la variable del contenido para evitar errores
    //     // initializePage();
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************
// Function to read 'SA021' Report selected file
function loadSA021_File ( evento ) {
    const file = evento.target.files[0];
    auxPanel.classList.remove("no-visible");
    const filePointer = new ExcelFileOpen(file, FILE_EXTENSION_ARRAY, FILE_WORKBOOK_SHEET, FILE_MYME_TYPE_ARRAY );
    // console.log("FILE: ", filePointer.file );

    showFileNameReport( this.id + "-file-name" , filePointer.file.name);

    const promiseData = loadExcelFile(filePointer);
    promiseData.then( (response) => {
        // let contentData = validateShipmentsFile( response );
        console.log("Carga \"" + filePointer.file.name + "\" Finalizada!", response); 
        // SDS0001 = response;
    })
    .catch( (error) => {
        console.log("ERROR:loadSA021_File: ", error);
        alert(error.message);
        // TODO: inicializar la variable del contenido para evitar errores
    //     // initializePage();
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}


// *********************************************************

// *********************************************************
function ProcessReports() {

    reportsPanel.classList.add("no-visible"),
    console.log("ProcessReports function!");

}


// *********************************************************
