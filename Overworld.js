// Overworld manage both maps & entities showing on the canvas
// Logic is map shown as layer 0 and entities on a layer on top
// entities are made to be centered on map tiles to make the game grid-like such as old 2D games


    class Overworld {
        constructor(config) {
            this.element = config.element;
            this.canvas = this.element.querySelector(".game_canvas");
            this.ctx = this.canvas.getContext("2d");
            this.map = null;
        }

        StartGameLoop() {
            const step = () => {
                // Clear previous frame to prevent them remaining on the Canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Draw Camera 
                const cameraPerson = this.map.gameObjects.hero;

                // Update every objects 
                Object.values(this.map.gameObjects).forEach(object => {
                    object.update({
                        arrow: this.directionInput.direction,
                        map: this.map,
                    })
                })

                // Draw lower layer of the map
                this.map.drawLowerImage(this.ctx, cameraPerson);

                // Draw game object
                Object.values(this.map.gameObjects).sort((a, b) => {
                    return a.y - b.y; // used to re-order sprites if characters meet-up to prevent bad layer order
                }).forEach(object => {
                    object.sprite.draw(this.ctx, cameraPerson);
                })

                // Draw upper layer of the map (layer X)
                this.map.drawUpperImage(this.ctx, cameraPerson);

                requestAnimationFrame(() => {
                    step();
                })
            }
            step ();
        }

        bindActionInput() {
            new KeyPressListener("Space", () => {
                // Check if there is someone to talk to
                this.map.checkForActionCutscene()
            })
        }

        bindHeroPositionCheck() {
            document.addEventListener("CharacterWalkingComplete", e => {
                if (e.detail.whoId === "hero") {
                    // Hero position has changed
                    this.map.checkForFootstepCutscene()
                }
            })
        }

        startMap(mapConfig) {
            this.map = new OverworldMap(mapConfig);
            this.map.Overworld = this;
            this.map.mountObjects();
        }

        init () {
            this.startMap(window.OverworldMaps.DemoRoom);

            this.bindActionInput();
            this.bindHeroPositionCheck();

            this.directionInput = new DirectionInput();
            this.directionInput.init();

            this.StartGameLoop();

            //this.map.startCutscene([
                //{ type: "changeMap", map: "DemoRoom"}
                //{ type: "textMessage", text: "Sample message 101"},
            //])

        }
    }
