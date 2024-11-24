

'use strict';

const SVG_ICON = '<path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3L304 256l0-96c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32l0 96-57.7 0C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z"/>';


// *********************************************************
// function to change dot for decimal number into a comma for Excel format
function replaceDotPerComma ( dataNumber ) {

    if( dataNumber === NaN ){
        return dataNumber;
    }

    let dataString = String (dataNumber);
    return dataString.replace( ".", ",");
}


// *********************************************************
// function to draw report buttons in the first page
function drawDownloadIcon ( configDataMap ){

    const svgList = document.querySelectorAll(".svg-icon");
    
    for (const linkElement of svgList ) {
        
        const idReport = linkElement.id.replace("-icon", "");
        linkElement.href = configDataMap.get( idReport ).url;
        linkElement.title = "Descargar Reporte " + configDataMap.get( idReport ).name;
        linkElement.firstElementChild.innerHTML = SVG_ICON;
    }
}


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

    // console.log("FILA ", row);

    let htmlRow = "";

    // Ref
    htmlRow += "<td>";
    htmlRow += row.reference;
    htmlRow += "</td>";

    // Name
    htmlRow += "<td class='text-left' >";
    htmlRow += row.name;
    htmlRow += "</td>";

    // averageSale
    htmlRow += "<td>";
    // htmlRow += row.averageSale;
    htmlRow += "";
    htmlRow += "</td>";

    // current Forecast Value
    htmlRow += "<td title='Venta 1/2: " + row.averageSale + " Venta Last Wk: " + row.lastWkSales + "'>";
    htmlRow += replaceDotPerComma( row.currentForecastValue );
    htmlRow += "</td>";

    // this Week Sales
    htmlRow += "<td>";
    htmlRow += replaceDotPerComma( row.thisWkSales );
    htmlRow += "</td>";

    // forecast for next week
    htmlRow += "<td>";
    htmlRow += replaceDotPerComma( row.wk2FCO) ;
    htmlRow += "</td>";

    // stock weeks
    htmlRow += "<td class='stockWeeksHighligter'>";
    htmlRow += replaceDotPerComma( row.stockWeeks.toFixed(2) );
    htmlRow += "</td>";

    // EOQ -> ASSQ
    htmlRow += "<td>";
    htmlRow += replaceDotPerComma( row.eoq );
    htmlRow += "</td>";

    // Num EOQ%
    htmlRow += "<td>";
    htmlRow += replaceDotPerComma( row.eoqQty.toFixed(2) );
    htmlRow += "</td>";

    // Pallet Quantity
    htmlRow += "<td>";
    htmlRow += replaceDotPerComma( row.palletQty );
    htmlRow += "</td>";

    // Shop Available stock
    htmlRow += "<td title='Stock Disponible total en tienda (LV + SGF)' >";
    htmlRow += replaceDotPerComma( row.availableShopStock );
    htmlRow += "</td>";
    
    // pallets SGF
    htmlRow += "<td>";
    htmlRow += replaceDotPerComma( row.shopStock.pallets );
    htmlRow += "</td>";

    // Pedir
    htmlRow += "<td contenteditable='true' class='order'>"; 
    htmlRow += "";
    htmlRow += "</td>";

    // Packing List
    htmlRow += "<td>'";
    htmlRow += replaceDotPerComma( row.packingListData );
    htmlRow += "</td>";

    // Stock ESBO
    htmlRow += "<td title='" + row.esboStock.stock + " unds.'>";
    htmlRow += replaceDotPerComma( row.esboStock.pallets );
    htmlRow += "</td>";

    // LV
    htmlRow += "<td>";
    htmlRow += replaceDotPerComma( row.salesLocation );
    htmlRow += "</td>";

    // Obs Especiales
    htmlRow += "<td class='text-left'>";
    htmlRow += row.quotes;
    htmlRow += "</td>";

    // Analisis column
    htmlRow += "<td>"; 
    htmlRow += row.analisysPriority;
    htmlRow += "</td>"; 

    // Offer-type Column
    htmlRow += "<td>"; 
    htmlRow += row.type;
    // console.log("Ofertas: ", row.reference );
    htmlRow += "</td>"; 
        
    // // LV stock
    // htmlRow += "<td>";
    // htmlRow += row.LVStock;
    // htmlRow += "</td>";

    // // Pallets ESBO
    // TODO: remover columna
    // htmlRow += "<td>";
    // htmlRow += row.esboStock.pallets;
    // htmlRow += "</td>";

    // // Reservas
    // TODO: eliminar esta columna
    // htmlRow += "<td>";
    // htmlRow += row.openOrderLineData;
    // htmlRow += "</td>";

    // // cabeceras
    // htmlRow += "<td>";
    // htmlRow += "'" + row.salesLocation.substr(2);
    // htmlRow += "</td>";

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
    console.log("ShowTable items: ", dataElementsMap.size );
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






