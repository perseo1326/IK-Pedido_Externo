

'use strict';



// *********************************************************
function drawTableHeaders ( headers ) {

    let htmlHeaders = "";

    htmlHeaders += "<tr>"; 

    headers.forEach( ( cell ) => {
        htmlHeaders += "<th><span>" + cell + "</span></th>";
    });

    htmlHeaders += "</tr>";

    return htmlHeaders;
}


// *********************************************************
function drawTableRow ( row ) {

    // console.log("Tabla: ", row);

    let htmlRow = "";

    row.forEach( ( value ) => {
        htmlRow += "<td>" + value + "</td>";
    });

    // console.log("VAlores: ", nueva);
    return htmlRow;
}


// *********************************************************
function drawTableData ( data ) {
        
    let htmlDataTable = "";
    data.forEach( ( row ) => {
        htmlDataTable += "<tr class='centrar'>" + drawTableRow( row ) + "</tr>";
    });
        
    return htmlDataTable;
}


// *********************************************************
function showTable() {
    tableHeaders.innerHTML = drawTableHeaders(cabeceras);

    tableData.innerHTML = drawTableData( datos );
    // tableData.isContentEditable = true;
    // console.log("Tabla focus: ", tableData);
    // tableData.focus();
}

// *********************************************************


// *********************************************************

showTable();




