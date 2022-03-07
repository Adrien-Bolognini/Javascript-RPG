// Create and instantiate game objects for the game to render
// manages characters & their shadows
// 

    class GameObject {
        constructor(config) {
            this.id = null;
            this.isMounted = false;
            this.x = config.x || 0;
            this.y = config.y || 0;
            this.direction = config.direction || "down";
            this.sprite = new Sprite({
                gameObject: this,
                src: config.src || "images/characters/hero.png",
            });


            this.behaviorLoop = config.behaviorLoop || [];
            this.behaviorLoopIndex = 0;

            this.talking = config.talking || [];

        }
        mount(map) {
            console.log("mounting")
            this.isMounted = true;
            map.addWall(this.x, this.y);

            // If there is a behavior, will apply after delay
            setTimeout(() => {
                this.doBehaviorEvent(map);
            }, 10)
        }
        
        update () {

        }

        async doBehaviorEvent(map) { // async is needed to make await work below 

            // Don't attempt to do anything below if Cutscene is on or not receiving config
            if(map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
                return;
            }

            // Setting up the event with relevant data
            let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
            eventConfig.who = this.id;
            
            // Create the event instance from the event config
            const eventHandler = new OverworldEvent({ map, event: eventConfig});
            await eventHandler.init(); // Needed to make the code wait for resolve any code below will wait for resolve before proceeding

            // Setting the next event to be executed 
            this.behaviorLoopIndex += 1;
            if(this.behaviorLoopIndex === this.behaviorLoop.length) {
                this.behaviorLoopIndex = 0;
            }

            // Repeat it more 
            this.doBehaviorEvent(map);
        }
    }