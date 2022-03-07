// Initialization of the game
// Script handling  


( function () {

    // fetching the element from Overworld.js & game_container
    const overworld = new Overworld({
        element: document.querySelector(".game_container")
    });

    overworld.init();

}) ();
