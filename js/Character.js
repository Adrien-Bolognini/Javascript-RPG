// Extension on GameObject to affect entities
// Lock movement to be grid based to make it fit the game 2D style

    class Character extends GameObject {
        constructor(config) {
            super(config);
            this.movingProgressRemaining = 0;
            this.isStanding = false;

            // Allow to be able to decide on which character is being controlled by inputs or control more than one at once
            this.isPlayerControlled = config.isPlayerControlled || false;

            // Movement is managed upon receiving the premade map of the keyboard on the file Directioninput.js
            this.directionUpdate = {
                "up": ["y", -1],
                "down": ["y", 1],
                "left": ["x", -1],
                "right": ["x", 1],
            }
        }
        
        update(state) {
            if (this.movingProgressRemaining > 0) {
            this.updatePosition();
            }   else {
                // More condition or cases might be added later on


                // Case: character controlled & keypress
                if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                    this.startBehavior(state, {
                        type: "walk",
                        direction: state.arrow
                    })
                }
                this.updateSprite(state);
            }

        }

        startBehavior(state, behavior) {
            // Set the character direction to whatever behavior has been given
            this.direction = behavior.direction;
            if (behavior.type === "walk") {
                // Stop if the grid is already taken 
                if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {

                    behavior.retry && setTimeout (() => {
                        this.startBehavior(state, behavior)
                    }, 10)

                    return;
                }
                // Space available walk proceed
                state.map.moveWall(this.x,this.y, this.direction);
                this.movingProgressRemaining = 16;
                this.updateSprite(state);
            }

            if (behavior.type === "stand") {
                this.isStanding = true;
                setTimeout(() => {
                    utility.emitEvent("CharacterStandingComplete", {
                        whoId: this.id
                    })
                    this.isStanding = false;
                }, behavior.time )
            }
        }
        
        updatePosition() {
              	const [property, change] = this.directionUpdate[this.direction];
              	this[property] += change;
              	this.movingProgressRemaining -= 1;

                if (this.movingProgressRemaining === 0) {
                    // Moving to next cell done
                    utility.emitEvent("CharacterWalkingComplete", {
                        whoId: this.id
                    })
                }
        }
        
        updateSprite() {
            if (this.movingProgressRemaining > 0) {
                this.sprite.setAnimation("walk-"+this.direction);
                return;
            }
            this.sprite.setAnimation("idle-"+this.direction);
        }
    }
