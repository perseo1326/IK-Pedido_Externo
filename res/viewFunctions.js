

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

    htmlRow += "<td>";
    htmlRow += row.salesLocation;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.reference;
    htmlRow += "</td>";

    htmlRow += "<td class='text-left' >";
    htmlRow += row.name;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.highestSale;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.averageSale;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.lastWkSales;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.thisWkSales;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.stockWeeks;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.eoq;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.palletQty;
    htmlRow += "</td>";

    // Stock ESBO
    htmlRow += "<td>";
    htmlRow += "X";
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.shopStock;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.palletsSGF;
    htmlRow += "</td>";

    // Reservas
    htmlRow += "<td>";
    htmlRow += "Y";
    htmlRow += "</td>";

    // Pedir
    htmlRow += "<td>";
    htmlRow += "P";
    htmlRow += "</td>";

    // Packing List
    htmlRow += "<td>";
    htmlRow += "PL";
    htmlRow += "</td>";

    // Obs Especiales
    htmlRow += "<td>";
    htmlRow += "Obs.";
    htmlRow += "</td>";

    // Pallets ESBO
    htmlRow += "<td>";
    htmlRow += "Pall Esbo";
    htmlRow += "</td>";

    // Num EOQ
    htmlRow += "<td>";
    htmlRow += "EOQ";
    htmlRow += "</td>";

    // cabeceras
    htmlRow += "<td>";
    htmlRow += "Cab";
    htmlRow += "</td>";

    return htmlRow;
}


// *********************************************************
function drawTableData ( dataMap ) {

    // console.log("DATA MAP: ", dataMap );
    let htmlDataTable = "";
    
    dataMap.forEach( ( object, key ) => {
        
        // console.log("DATA object: ", key, object );
        htmlDataTable += "<tr class='centrar' data-reference=" + key + " >" + drawTableRow( object ) + "</tr>";
        
    });
    return htmlDataTable;
}


// *********************************************************
function showTable( dataElementsMap ) {
    tableHeaders.innerHTML = drawTableHeaders(cabeceras);

    // tableData.innerHTML = drawTableData( datos );
    tableData.innerHTML = drawTableData( dataElementsMap );
    // tableData.isContentEditable = true;
}


// *********************************************************
function showFileNameReport  ( idElement, text ) {
    document.getElementById(idElement).innerText = text;
}


// *********************************************************






