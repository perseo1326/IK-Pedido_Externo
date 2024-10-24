

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

    // Ref
    htmlRow += "<td>";
    htmlRow += row.reference;
    htmlRow += "</td>";

    // Name
    htmlRow += "<td class='text-left' >";
    htmlRow += row.name;
    htmlRow += "</td>";

    // highestSale
    htmlRow += "<td>";
    htmlRow += row.highestSale;
    htmlRow += "</td>";

    // averageSale
    htmlRow += "<td>";
    htmlRow += row.averageSale;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.lastWkSales;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.thisWkSales;
    htmlRow += "</td>";

    htmlRow += "<td class='stockWeeksHighligter'>";
    htmlRow += row.stockWeeks.toFixed(2);
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.eoq;
    htmlRow += "</td>";

    htmlRow += "<td>";
    htmlRow += row.palletQty;
    htmlRow += "</td>";

    htmlRow += "<td title='Stock Disponible total en tienda (LV)' >";
    htmlRow += row.availableShopStock;
    htmlRow += "</td>";
    
    // // LV stock
    // htmlRow += "<td>";
    // htmlRow += row.LVStock;
    // htmlRow += "</td>";

    // pallets SGF
    htmlRow += "<td>";
    htmlRow += row.shopStock.pallets;
    htmlRow += "</td>";

    // // Reservas
    // TODO: eliminar esta columna
    // htmlRow += "<td>";
    // htmlRow += row.openOrderLineData;
    // htmlRow += "</td>";

    // Pedir
    htmlRow += "<td contenteditable='true' >"; 
    htmlRow += "";
    htmlRow += "</td>";

    // Packing List
    htmlRow += "<td>'";
    htmlRow += row.packingListData;
    htmlRow += "</td>";

    // Obs Especiales
    htmlRow += "<td class='text-left'>";
    htmlRow += row.quotes;
    htmlRow += "</td>";

    // // Pallets ESBO
    // TODO: remover columna
    // htmlRow += "<td>";
    // htmlRow += row.esboStock.pallets;
    // htmlRow += "</td>";

    // Stock ESBO
    htmlRow += "<td>";
    htmlRow += row.esboStock.stock;
    htmlRow += "</td>";

    // Num EOQ
    htmlRow += "<td>";
    htmlRow += row.eoqQty.toFixed(2);
    htmlRow += "</td>";

    // LV
    htmlRow += "<td>";
    htmlRow += row.salesLocation;
    htmlRow += "</td>";
    
    // cabeceras
    htmlRow += "<td>";
    htmlRow += "'" + row.salesLocation.substr(2);
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
    tableHeaders.innerHTML = drawTableHeaders( tableHeadersView );

    // tableData.innerHTML = drawTableData( datos );
    tableData.innerHTML = drawTableData( dataElementsMap );
    // tableData.isContentEditable = true;
}


// *********************************************************
function showFileNameReport  ( idElement, text ) {
    document.getElementById(idElement).innerText = text;
}


// *********************************************************






