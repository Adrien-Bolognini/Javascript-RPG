//
//

    class OverworldEvent {
        constructor( { map, event}) {
            this.map = map;
            this.event = event;
        }

        // allow NPC to take idle state
        stand(resolve) {
            const who = this.map.gameObjects[ this.event.who ];
            who.startBehavior({
                map: this.map
            }, {
                type: "stand",
                direction: this.event.direction,
                time: this.event.time
            })

            // Set up handler to complete when the right character is done walking then execute event
            const completeHandler = e => {
                if(e.detail.whoId === this.event.who) {
                    document.removeEventListener("CharacterStandingComplete", completeHandler);
                    resolve();
                }
            }
            document.addEventListener("CharacterStandingComplete", completeHandler)
        }

        // allow NPC to walk
        walk(resolve) {
            const who = this.map.gameObjects[ this.event.who];
            who.startBehavior({
                map: this.map
            }, {
                type: "walk",
                direction: this.event.direction,
                retry: true
            })


            // Set up handler to complete when the right character is done walking then execute event
            const completeHandler = e => {
                if(e.detail.whoId === this.event.who) {
                    document.removeEventListener("CharacterWalkingComplete", completeHandler);
                    resolve();
                }
            }
            document.addEventListener("CharacterWalkingComplete", completeHandler)

        }

        textMessage(resolve) {

            if (this.event.faceHero) {
                const obj = this.map.gameObjects[this.event.faceHero];
                obj.direction = utility.oppositeDirection(this.map.gameObjects["hero"].direction);
            }
          
            const message = new TextMessage({
                text: this.event.text,
                onComplete: () => resolve()
            })
            message.init( document.querySelector(".game_container") )
        }
          
        changeMap(resolve) {
          
            const sceneTransition = new SceneTransition();
            sceneTransition.init(document.querySelector(".game_container"), () => {
                this.map.overworld.startMap( window.OverworldMaps[this.event.map] );
                resolve();
          
                sceneTransition.fadeOut();
            })
        }
          
        init() {
            return new Promise(resolve => {
            this[this.event.type](resolve)      
            })
        }
          
    }
    
