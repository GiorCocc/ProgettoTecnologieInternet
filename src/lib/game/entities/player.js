ig.module(
    'game.entities.player'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPlayer = ig.Entity.extend({

            size: { x: 11, y: 16 },
            offset: { x: 10, y: 12 },
            collides: ig.Entity.COLLIDES.PASSIVE,
            type: ig.Entity.TYPE.A,

            // animation
            animSheet: new ig.AnimationSheet('media/arthurPendragon_.png', 32, 32),
            flip: true,

            accelGround: 200,
            accelAir: 310,
            jump: 200,
            friction: { x: 600, y: 0 },
            maxVel: { x: 100, y: 110 },
            killed: false,
            touchedKillEntity: false,
            timer: null,

            health: 20,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 0.25, [0, 1, 2, 3, 2, 1, 0]);
                this.addAnim('run', 0.07, [8, 9, 10, 11, 16, 17, 18, 19]);
                this.addAnim('jump', 1, [24, 25]);
                this.addAnim('fall', 0.4, [27, 26, 58, 25, 24]);
                this.addAnim('hit', 0.1, [48, 49, 50, 51, 50, 51]);
                this.addAnim('death', 0.2, [48, 49, 50, 51, 50, 51, 57, 58, 59]);
                this.addAnim('deathIdle', 0.2, [50, 51, 50, 51]);

            },

            // TODO: fare in modo che venga eseguita l'animazione e solo dopo averla visualizzata, il gioco elimina il player
            kill: function () {
                this.parent();
            },

            // Method to register the damage received by the player
            receiveDamage: function (from) {
                // console.log("player.js: reciveDamage() called");

                // decrese player health by the damage received
                this.health -= from.damage;
                // play the hit animation
                this.currentAnim = this.anims.hit.rewind();
                // console.log("player.js: reciveDamage() -> this.health = " + this.health);
                
                // backflip the player
                this.vel.x = this.flip ? -this.maxVel.x : this.maxVel.x;
                this.vel.y = -this.maxVel.y;
            },

            // Method to check if the player is touching a kill entity
            collideWith: function () {
                var killEntities = ig.game.getEntitiesByType(EntityKill);

                for (var i = 0; i < killEntities.length; i++) {
                    if (this.touches(killEntities[i]) && this.touchedKillEntity == false) {
                        // console.log("player.js -> collideWith(): touched kill entity");
                        this.touchedKillEntity = true;
                        var killEntity = killEntities[i];

                        this.receiveDamage(killEntity);
                    }
                }
            },

            update: function () {
                var acceleration = this.standing ? this.accelGround : this.accelAir;

                // movements
                if( ig.input.state('left') ) {
                    this.accel.x = -acceleration;
                    this.flip = true;
                }
                else if( ig.input.state('right') ) {
                    this.accel.x = acceleration;
                    this.flip = false;
                }
                else {
                    this.accel.x = 0;
                }
        
                // jump
                if( this.standing && ig.input.pressed('up') ) {
                    this.vel.y = -this.jump;
                }

                if( 
                    this.currentAnim == this.anims.hit &&
                    this.currentAnim.loopCount < 1
                ) {
                    // If we're dead, fade out
                    if( this.health <= 0 ) {
                        // The pain animation is 0.3 seconds long, so in order to 
                        // completely fade out in this time, we have to reduce alpha
                        // by 3.3 per second === 1 in 0.3 seconds
                        var dec = (1/this.currentAnim.frameTime) * ig.system.tick;
                        this.currentAnim.alpha = (this.currentAnim.alpha - dec).limit(0,1);
                    }
                }
                else if( this.health <= 0 ) {
                    // We're actually dead and the death (pain) animation is 
                    // finished. Remove ourself from the game world.
                    this.kill();
                }
                else if( this.vel.y < 0 ) {
                    this.currentAnim = this.anims.jump;
                }
                else if( this.vel.y > 0 ) {
                    if( this.currentAnim != this.anims.fall ) {
                        this.currentAnim = this.anims.fall.rewind();
                    }
                }
                else if( this.vel.x != 0 ) {
                    this.currentAnim = this.anims.run;
                }
                else {
                    this.currentAnim = this.anims.idle;
                }


                this.currentAnim.flip.x = this.flip;
                this.collideWith();
                this.parent();
            }
        });
    });
