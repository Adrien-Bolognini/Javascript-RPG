// Not implemented
//
//

// File & css file not implement on index yet for testing 
// 

    class TitleScreen {
        constructor(){

        }

        getOptions() {
            return [
                {
                    label : "New game",
                    description : "Start a new adventure !",
                    handler: () => {
                        // to be updated later
                    }
                },

                // More options if saving is possible or exit 
            ]
        }

        createElement() {
            this.element = document.createElement("div");
            this.element.classList.add("TitleScreen");
            this.element.innerHTML = (" ")
        }

        close() {
            this.keyboardMenu.end();
            this.element.remove();
        }

        init(container) {

        }
    }
