
'use strict';


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




const teclas = ["ArrowDown", "ArrowUp", "PageDown", "PageUp"];

// Excel shipments file manipulation values
const FILE_EXTENSION_ARRAY = [ "xlsx", "xlsm" ];
const FILE_WORKBOOK_SHEET = "SDS0001";
// const FILE_MYME_TYPE_ARRAY = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
const FILE_MYME_TYPE_ARRAY = ["application/vnd.ms-excel.sheet.macroenabled.12"];


// *********************************************************
// EVENT LISTENERS

auxPanel.addEventListener("wheel", ( evento ) => {
    evento.preventDefault();
});

document.addEventListener("keydown", ( evento ) => {
    if( teclas.includes(evento.key) && auxPanel.hidden === false){
        evento.preventDefault();
    }
});

cancelButton.addEventListener("click", () => {
    // auxPanel.classList.add("no-visible");
    auxPanel.hidden = true;
});

sds0001Button.addEventListener("change", loadSDS0001File);

loadReportsB.addEventListener("click", ProcessReports );

// *********************************************************

// *********************************************************
// Function to read a selected file
function loadSDS0001File( evento ) {

    const file = evento.target.files[0];
    auxPanel.classList.remove("no-visible");

    const filePointer = new ExcelFileOpen(file, FILE_EXTENSION_ARRAY, FILE_WORKBOOK_SHEET, FILE_MYME_TYPE_ARRAY );
    
    console.log("FILE: ", filePointer.file );

    showFileNameReport( "sds0001-file-name" , filePointer.file.name);

    let x = loadExcelReport( filePointer );

    console.log("Valor de X: ", x);



}

// *********************************************************
// function to load any excel file
function loadExcelReport ( filePointer, myContenido ) {
    const promiseData = loadExcelFile(filePointer);

    // promiseData.then( (response) => {
        
        // let contentData = validateShipmentsFile( response );
        // console.log("Carga \"" + filePointer.file.name + "\" Finalizada!", response); 

    //     contentData = getShipmentsInfoFromGrossData( contentData );

    //     contentData = sortTrucksInfo(contentData);

    //     document.getElementById("button-load-shipments").classList.add("no-visible");
    //     document.getElementById("shipments-container").classList.remove("no-visible");
    //     document.getElementById("shipments-commands").classList.remove("no-visible");
    //     document.getElementById("box").classList.remove("box");

    //     shipmentsData = arrayToMap( contentData );

    //     showShipmentsData(shipmentsData);
    //     myContenido = response;
    // })
    // .catch( (error) => {
    //     console.log("ERROR:openFile: ", error);
    //     alert(error.message);
    //     // initializePage();
    // })
    // .finally( () => {
    //     auxPanel.classList.add("no-visible");
    // });
    
    return promiseData;
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
