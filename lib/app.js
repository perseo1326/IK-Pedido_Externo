
'use strict';


// *********************************************************
// VARIABLES AND CONSTANTS

const teclas = ["ArrowDown", "ArrowUp", "PageDown", "PageUp"];

const auxPanel = document.getElementById("auxiliar-panel");

const cancelButton = document.getElementById("cancel-aux-panel");

let a = 0;
// *********************************************************
// EVENT LISTENERS

auxPanel.addEventListener("wheel", ( evento ) => {
    evento.preventDefault();
});

document.addEventListener("keydown", ( evento ) => {
    if( teclas.includes(evento.key) && auxPanel.hidden === false){
        console.log("Teclas OFF! ", a++);
        evento.preventDefault();
    }
});

cancelButton.addEventListener("click", () => {
    // auxPanel.classList.add("no-visible");
    auxPanel.hidden = true;
    console.log("panel visible: ", auxPanel);
});

// *********************************************************


// *********************************************************
