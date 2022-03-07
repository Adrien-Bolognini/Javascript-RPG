

    class OverworldMap {
        constructor(config) {
            this.overworld = null;
            this.gameObjects = config.gameObjects;
            this.cutsceneSpaces = config.cutsceneSpaces || {};
            this.walls = config.walls || {};

            this.lowerImage = new Image ();
            this.lowerImage.src = config.lowerSrc;

            this.upperImage = new Image ();
            this.upperImage.src = config.upperSrc;

            this.isCutscenePlaying = false;  // if set to true stops any behavior to allow main Cutscenes to happen

        }

        drawLowerImage(ctx, cameraPerson) {
            ctx.drawImage(
              	this.lowerImage, 
              	utility.withGrid(10.5) - cameraPerson.x, 
              	utility.withGrid(6) - cameraPerson.y)
        }

        drawUpperImage(ctx, cameraPerson) {
            ctx.drawImage(
              	this.upperImage, 
              	utility.withGrid(10.5) - cameraPerson.x, 
              	utility.withGrid(6) - cameraPerson.y)
        }

        isSpaceTaken(currentX, currentY, direction) {
            const {x,y} = utility.nextPosition(currentX,currentY, direction);
            return this.walls[`${x},${y}`] || false;
        }

        mountObjects () {
            Object.keys(this.gameObjects).forEach(key => {

                let object = this.gameObjects[key];
                object.id = key;

                // checkup if the object should actually mount or not to be added
                object.mount(this);

            })
        }

        async startCutscene(events) {  
            this.isCutscenePlaying = true;

            // Start a loop of async events 
            // await each one of them
            for (let i=0; i<events.length; i++) {
                const eventHandler = new OverworldEvent({
                    event: events[i], 
                    map: this,
                })
                await eventHandler.init();
            }

            this.isCutscenePlaying = false;

            // Reset NPC's to do their loops/idle behavior
            Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
        }

        checkForActionCutscene() {
            const hero = this.gameObjects["hero"];
            const nextCoords = utility.nextPosition(hero.x, hero.y, hero.direction);
            const match = Object.values(this.gameObjects).find(object => {
                return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
            });
            if (!this.isCutscenePlaying && match && match.talking.length) {
                this.startCutscene(match.talking[0].events)
            }
        }
        
        checkForFootstepCutscene() {
            const hero = this.gameObjects["hero"];
            const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
            if (!this.isCutscenePlaying && match) {
                this.startCutscene( match[0].events )
            }
        }

        addWall(x,y) {
            this.walls[`${x},${y}`] = true;
        }
        removeWall(x,y) {
            delete this.walls[`${x},${y}`]
        }
        moveWall(wasX, wasY, direction) {
            this.removeWall(wasX, wasY);
            const {x,y} = utility.nextPosition(wasX, wasY, direction);
            this.addWall(x,y);
        }
    }

    window.OverworldMaps = {
        DemoRoom: {
            lowerSrc: "images/maps/DemoRoomLower.png",
            upperSrc: "images/maps/DemoRoomUpper.png",
            gameObjects: {
                hero: new Character({
                    isPlayerControlled: true,
                    x: utility.withGrid(5),
                    y: utility.withGrid(10),
                }),
                npcA: new Character({
                    x: utility.withGrid(9),
                    y: utility.withGrid(12),
                    //src: "images/characters/npc1.png",
                    behaviorLoop: [
                        { type: "stand", direction: "up" , time: 800},
                        { type: "stand", direction: "right", time: 800 },
                        { type: "stand", direction: "down" , time: 800},
                        { type: "stand", direction: "left", time: 800 },
                    ],
                    talking : [
                        {
                            events: [
                                { type: "textMessage", text: "Go away!", faceHero: "npcA"},
                                { type: "textMessage", text: "Go away, I tell you!"},
                                { who: "hero", type: "walk",  direction: "left" },
                                { type: "textMessage", text: "About time!"},
                            ]
                        }
                    ]
                }),
                npcB: new Character({
                    x: utility.withGrid(13),
                    y: utility.withGrid(10),
                    //src: "images/characters/npc1.png",
                    behaviorLoop: [
                        { type: "walk", direction: "up", time: 1600 },
                        { type: "walk", direction: "right", time: 1600 },
                        { type: "walk", direction: "down", time: 1600 },
                        { type: "walk", direction: "left", time: 1600 },
                    ]
                }),
            },
            walls: {
                [utility.asGridCoord(3,10)] : true,
                [utility.asGridCoord(3,11)] : true,
                [utility.asGridCoord(3,12)] : true,
                [utility.asGridCoord(3,13)] : true,

                [utility.asGridCoord(4,9)] : true,
                [utility.asGridCoord(5,8)] : true,
                [utility.asGridCoord(16,9)] : true,
                [utility.asGridCoord(6,9)] : true,
                [utility.asGridCoord(7,9)] : true,
                [utility.asGridCoord(8,9)] : true,
                [utility.asGridCoord(9,9)] : true,
                [utility.asGridCoord(10,9)] : true,
                [utility.asGridCoord(11,9)] : true,
                [utility.asGridCoord(12,9)] : true,


                [utility.asGridCoord(13,8)] : true,
                [utility.asGridCoord(14,8)] : true,

                [utility.asGridCoord(15,7)] : true,
                [utility.asGridCoord(16,7)] : true,
                [utility.asGridCoord(17,7)] : true,
                [utility.asGridCoord(18,7)] : true,
                [utility.asGridCoord(19,7)] : true,
                [utility.asGridCoord(20,7)] : true,
                [utility.asGridCoord(21,7)] : true,
                [utility.asGridCoord(22,7)] : true,
                [utility.asGridCoord(23,7)] : true,
                [utility.asGridCoord(24,7)] : true,

                [utility.asGridCoord(24,5)] : true,
                [utility.asGridCoord(24,6)] : true,

                [utility.asGridCoord(26,5)] : true,
                [utility.asGridCoord(26,6)] : true,


                [utility.asGridCoord(26,7)] : true,
                [utility.asGridCoord(27,7)] : true,

                [utility.asGridCoord(28,8)] : true,
                [utility.asGridCoord(28,9)] : true,

                [utility.asGridCoord(30,9)] : true,
                [utility.asGridCoord(31,9)] : true,
                [utility.asGridCoord(32,9)] : true,
                [utility.asGridCoord(33,9)] : true,



                // Grass mount area
                [utility.asGridCoord(16,9)] : true,
                [utility.asGridCoord(16,11)] : true,
                [utility.asGridCoord(16,10)] : true,
                [utility.asGridCoord(17,9)] : true,
                [utility.asGridCoord(17,11)] : true,
                [utility.asGridCoord(18,11)] : true,
                [utility.asGridCoord(19,11)] : true,
                [utility.asGridCoord(17,10)] : true,

                // Grass mount area 2
                [utility.asGridCoord(25,9)] : true,
                [utility.asGridCoord(25,10)] : true,
                [utility.asGridCoord(25,11)] : true,
                [utility.asGridCoord(26,9)] : true,
                [utility.asGridCoord(26,10)] : true,
                [utility.asGridCoord(26,11)] : true,

                // Road
                [utility.asGridCoord(4,14)] : true,
                [utility.asGridCoord(5,14)] : true,
                [utility.asGridCoord(6,14)] : true,
                [utility.asGridCoord(7,14)] : true,
                [utility.asGridCoord(8,14)] : true,
                [utility.asGridCoord(9,14)] : true,
                [utility.asGridCoord(10,14)] : true,
                [utility.asGridCoord(11,14)] : true,
                [utility.asGridCoord(12,14)] : true,
                [utility.asGridCoord(13,14)] : true,
                [utility.asGridCoord(14,14)] : true,
                [utility.asGridCoord(15,14)] : true,
                [utility.asGridCoord(16,14)] : true,
                [utility.asGridCoord(17,14)] : true,
                [utility.asGridCoord(18,14)] : true,
                [utility.asGridCoord(19,14)] : true,
                [utility.asGridCoord(20,14)] : true,
                [utility.asGridCoord(21,14)] : true,
                [utility.asGridCoord(22,14)] : true,
                [utility.asGridCoord(23,14)] : true,
                [utility.asGridCoord(24,14)] : true,
                [utility.asGridCoord(25,14)] : true,
                [utility.asGridCoord(26,14)] : true,
                [utility.asGridCoord(27,14)] : true,
                [utility.asGridCoord(28,14)] : true,
                [utility.asGridCoord(29,14)] : true,
                [utility.asGridCoord(30,14)] : true,
                [utility.asGridCoord(31,14)] : true,
                [utility.asGridCoord(32,14)] : true,
                [utility.asGridCoord(33,14)] : true,

                [utility.asGridCoord(34,10)] : true,
                [utility.asGridCoord(34,11)] : true,
                [utility.asGridCoord(34,12)] : true,
                [utility.asGridCoord(34,13)] : true,

                // Next map outside past cord
                [utility.asGridCoord(25,7)] : true,



            },
            cutsceneSpaces: {
                [utility.asGridCoord(29,9)]: [
                    {
                        events: [
                            { type: "textMessage", text:"You can't be in there!"},
                            { who: "hero", type: "walk",  direction: "down" },

                            //{ type: "changeMap", map: "Starting" } // to be added to swap map
                        ]
                    }
                ],
                [utility.asGridCoord(25,6)]: [
                    {
                        events: [
                            { type: "textMessage", text:"Sorry can't proceed further!"},
                            { type: "changeMap", map: "DemoRoom" } // to be added to swap map
                        ]
                    }
                ],
                [utility.asGridCoord(5,9)]: [
                    {
                        events: [
                            { type: "textMessage", text:"You can't enter, we're closed!"},
                            { who: "hero", type: "walk",  direction: "down" },

                            //{ type: "changeMap", map: "Starting" } // to be added to swap map
                        ]
                    }
                ]
            }
        },
        SecondMap: {
            lowerSrc: "images/maps/DemoRoomLower.png",
            upperSrc: "images/maps/DemoRoomUpper.png",
            gameObjects: {
                hero: new Character({
                    isPlayerControlled: true,
                    x: utility.withGrid(5),
                    y: utility.withGrid(10),
                }),
                npcA: new Character({
                    x: utility.withGrid(9),
                    y: utility.withGrid(12),
                    //src: "images/characters/npc1.png",
                    behaviorLoop: [
                        { type: "stand", direction: "up" , time: 800},
                        { type: "stand", direction: "right", time: 800 },
                        { type: "stand", direction: "down" , time: 800},
                        { type: "stand", direction: "left", time: 800 },
                    ],
                    talking : [
                        {
                            events: [
                                { type: "textMessage", text: "Go away!", faceHero: "npcA"},
                                { type: "textMessage", text: "Go away, I tell you!"},
                                { who: "hero", type: "walk",  direction: "left" },
                                { type: "textMessage", text: "About time!"},
                            ]
                        }
                    ]
                }),
                npcB: new Character({
                    x: utility.withGrid(13),
                    y: utility.withGrid(10),
                    //src: "images/characters/npc1.png",
                    behaviorLoop: [
                        { type: "walk", direction: "up", time: 1600 },
                        { type: "walk", direction: "right", time: 1600 },
                        { type: "walk", direction: "down", time: 1600 },
                        { type: "walk", direction: "left", time: 1600 },
                    ]
                }),
            },
            walls: {
                [utility.asGridCoord(3,10)] : true,
                [utility.asGridCoord(3,11)] : true,
                [utility.asGridCoord(3,12)] : true,
                [utility.asGridCoord(3,13)] : true,

                [utility.asGridCoord(4,9)] : true,
                [utility.asGridCoord(5,8)] : true,
                [utility.asGridCoord(16,9)] : true,
                [utility.asGridCoord(6,9)] : true,
                [utility.asGridCoord(7,9)] : true,
                [utility.asGridCoord(8,9)] : true,
                [utility.asGridCoord(9,9)] : true,
                [utility.asGridCoord(10,9)] : true,
                [utility.asGridCoord(11,9)] : true,
                [utility.asGridCoord(12,9)] : true,


                [utility.asGridCoord(13,8)] : true,
                [utility.asGridCoord(14,8)] : true,

                [utility.asGridCoord(15,7)] : true,
                [utility.asGridCoord(16,7)] : true,
                [utility.asGridCoord(17,7)] : true,
                [utility.asGridCoord(18,7)] : true,
                [utility.asGridCoord(19,7)] : true,
                [utility.asGridCoord(20,7)] : true,
                [utility.asGridCoord(21,7)] : true,
                [utility.asGridCoord(22,7)] : true,
                [utility.asGridCoord(23,7)] : true,
                [utility.asGridCoord(24,7)] : true,

                [utility.asGridCoord(24,5)] : true,
                [utility.asGridCoord(24,6)] : true,

                [utility.asGridCoord(26,5)] : true,
                [utility.asGridCoord(26,6)] : true,


                [utility.asGridCoord(26,7)] : true,
                [utility.asGridCoord(27,7)] : true,

                [utility.asGridCoord(28,8)] : true,
                [utility.asGridCoord(28,9)] : true,

                [utility.asGridCoord(30,9)] : true,
                [utility.asGridCoord(31,9)] : true,
                [utility.asGridCoord(32,9)] : true,
                [utility.asGridCoord(33,9)] : true,



                // Grass mount area
                [utility.asGridCoord(16,9)] : true,
                [utility.asGridCoord(16,11)] : true,
                [utility.asGridCoord(16,10)] : true,
                [utility.asGridCoord(17,9)] : true,
                [utility.asGridCoord(17,11)] : true,
                [utility.asGridCoord(18,11)] : true,
                [utility.asGridCoord(19,11)] : true,
                [utility.asGridCoord(17,10)] : true,

                // Grass mount area 2
                [utility.asGridCoord(25,9)] : true,
                [utility.asGridCoord(25,10)] : true,
                [utility.asGridCoord(25,11)] : true,
                [utility.asGridCoord(26,9)] : true,
                [utility.asGridCoord(26,10)] : true,
                [utility.asGridCoord(26,11)] : true,

                // Road
                [utility.asGridCoord(4,14)] : true,
                [utility.asGridCoord(5,14)] : true,
                [utility.asGridCoord(6,14)] : true,
                [utility.asGridCoord(7,14)] : true,
                [utility.asGridCoord(8,14)] : true,
                [utility.asGridCoord(9,14)] : true,
                [utility.asGridCoord(10,14)] : true,
                [utility.asGridCoord(11,14)] : true,
                [utility.asGridCoord(12,14)] : true,
                [utility.asGridCoord(13,14)] : true,
                [utility.asGridCoord(14,14)] : true,
                [utility.asGridCoord(15,14)] : true,
                [utility.asGridCoord(16,14)] : true,
                [utility.asGridCoord(17,14)] : true,
                [utility.asGridCoord(18,14)] : true,
                [utility.asGridCoord(19,14)] : true,
                [utility.asGridCoord(20,14)] : true,
                [utility.asGridCoord(21,14)] : true,
                [utility.asGridCoord(22,14)] : true,
                [utility.asGridCoord(23,14)] : true,
                [utility.asGridCoord(24,14)] : true,
                [utility.asGridCoord(25,14)] : true,
                [utility.asGridCoord(26,14)] : true,
                [utility.asGridCoord(27,14)] : true,
                [utility.asGridCoord(28,14)] : true,
                [utility.asGridCoord(29,14)] : true,
                [utility.asGridCoord(30,14)] : true,
                [utility.asGridCoord(31,14)] : true,
                [utility.asGridCoord(32,14)] : true,
                [utility.asGridCoord(33,14)] : true,


                [utility.asGridCoord(34,10)] : true,
                [utility.asGridCoord(34,11)] : true,
                [utility.asGridCoord(34,12)] : true,
                [utility.asGridCoord(34,13)] : true,

                // Next map outside past cord lockdown
                [utility.asGridCoord(25,7)] : true,



            },
            cutsceneSpaces: {
                [utility.asGridCoord(29,9)]: [
                    {
                        events: [
                            { type: "textMessage", text:"You can't be in there!"},
                            { who: "hero", type: "walk",  direction: "down" },

                            //{ type: "changeMap", map: "Starting" } // to be added to swap map
                        ]
                    }
                ],
                [utility.asGridCoord(25,6)]: [
                    {
                        events: [
                            { type: "textMessage", text:"Sorry, can't proceed further!"},
                            { type: "changeMap", map: "DemoRoom" } // to be added to swap map
                        ]
                    }
                ],
                [utility.asGridCoord(5,9)]: [
                    {
                        events: [
                            { type: "textMessage", text:"You can't enter, we're closed!"},
                            { who: "hero", type: "walk",  direction: "down" },

                            //{ type: "changeMap", map: "Starting" } // to be added to swap map
                        ]
                    }
                ]
            }
        },
        // Insert more maps to load and their parameters
    }