
'use strict';


// *********************************************************
// VARIABLES AND CONSTANTS

const teclas = ["ArrowDown", "ArrowUp", "PageDown", "PageUp"];

const auxPanel = document.getElementById("auxiliar-panel");

const cancelButton = document.getElementById("cancel-aux-panel");

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

// *********************************************************


// *********************************************************
