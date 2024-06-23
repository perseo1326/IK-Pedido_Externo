
'use strict';

    // EXCEL constantes
    /* const FILE_MYME_TYPE_ARRAY = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]; */


// *********************************************************
// VARIABLES AND CONSTANTS

const auxPanel = document.getElementById("auxiliar-panel");

// reports panel 
const reportsPanel = document.getElementById("reports-panel");
const cancelButton = document.getElementById("cancel-aux-panel");
const sds0001Button = document.getElementById("sds0001");
const loadReportsB = document.getElementById("process-reports-go");

// table results panel
const tableResultsPanel = document.getElementById("table-results-panel");

// Table Elements
const table = document.getElementById("table");
const tableHeaders = document.getElementById("table-headers");
const tableData = document.getElementById("table-data");




const configDataURL = "./res/configData.json";
const teclas = ["ArrowDown", "ArrowUp", "PageDown", "PageUp"];



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


sds0001Button.addEventListener("change", loadSDS0001File);

loadReportsB.addEventListener("click", ProcessReports );

// *********************************************************
// *********************************************************

initialize();

// *********************************************************
function initialize() {
    console.log("Procediendo a cargar datos de configuración.")

    fetch( configDataURL )
    .then((response) => response.json())
    .then((data) => {
        // Aquí puedes trabajar con el objeto JavaScript resultante
        console.log("JSON DATA: ", data);
    })
    .catch((error) => {
        // const jsonObject = JSON.parse(jsonString);
        console.log("Error procesando Datos de configuración inicial.");
    });



}
// *********************************************************
// *********************************************************
// Function to read 'SDS0001' Report selected file
function loadSDS0001File ( evento ) {
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
        console.log("ERROR:loadSDS0001File: ", error);
        alert(error.message);
        // TODO: inicializar la variable del contenido para evitar errores
    //     // initializePage();
    })
    .finally( () => {
        auxPanel.classList.add("no-visible");
    });
}



// *********************************************************
function showFileNameReport  ( idElement, text ) {
    document.getElementById(idElement).innerText = text;
}


// *********************************************************
function ProcessReports() {

    reportsPanel.classList.add("no-visible"),
    console.log("ProcessReports function!");

}


// *********************************************************
