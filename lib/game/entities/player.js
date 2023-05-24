ig.module(
    'game.entities.player'
)
    .requires(
        'plusplus.abstractities.player',
        'plusplus.abilities.glow',
        'plusplus.helpers.utils',
        'plusplus.core.config',

        'plusplus.ui.ui-meter',

        'game.entities.weapon'
    )
    .defines(function () {

        ig.EntityPlayer = ig.global.EntityPlayer = ig.Player.extend({

            name: 'player',
            size: { x: 11, y: 16 },
            offset: { x: 10, y: 12 },
            gravityFactor: 2.5,
            
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            // animation
            animSheet: new ig.AnimationSheet('media/sprites/arthurPendragon_.png', 32, 32),
            // flip: true,
            animInit: 'idle',
            // ? Animazioni di default: climb, stairs, jump, fall, moveX, moveY, Left, Right, Up, Down, idle
            animSettings: {
                idle: { sequence: [0, 1, 2, 3, 2, 1, 0], frameTime: 0.25 },
                move: { sequence: [8, 9, 10, 11, 16, 17, 18, 19], frameTime: 0.07 },
                jump: { sequence: [24, 25], frameTime: 1 },
                fall: { sequence: [27, 26, 58, 25, 24], frameTime: 0.4 },
                death: { sequence: [48, 49, 50, 51, 50, 51], frameTime: 0.2 },
                hit: { sequence: [48, 49, 50, 51, 50, 51], frameTime: 0.1 }
            },

            // light
            glowSettings: {
                light: {
                    performance: ig.EntityExtended.PERFORMANCE.DYNAMIC,
                    castsShadows: true,
                }
            },
            opaque: true,
            opaqueOffset: {
                left: 6,
                right: -6,
                top: -1,
                bottom: 3
            },

            // accelGround: 200,
            // accelAir: 310,
            // jump: 200,
            frictionGrounded: { x: 600, y: 0 },
            // maxVel: { x: 100, y: 110 },
            // killed: false,
            // touchedKillEntity: false,
            // timer: null,

            maxHealth: 100,
            health: 100,
            regen: true,
            regenHealth: false,
            regenHealthRate: 1,
            regenDelay: 2,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.name = this.name || settings.name;
                this.animSheet =  this.animSheet || settings.animSheet;
                this.animSettings = this.animSettings || settings.animSettings;
            },

            initProperties: function () {
                this.parent();
                this.glow = new ig.AbilityGlow(this);

                this.abilities.addDescendants([
                    this.glow,
                ]);
            },

            

            handleInput: function () { },

            collideWith: function (entity, axis) { },

            // TODO: fare in modo che venga eseguita l'animazione e solo dopo averla visualizzata, il gioco elimina il player
            kill: function () {
                // this.parent();
            },

            // Method to register the damage received by the player
            receiveDamage: function (amount) {
                // console.log("player.js: reciveDamage() called");

                // decrese player health by the damage received
                this.health -= amount;
                // console.log("player.js: reciveDamage() -> this.health = " + this.health);
                // play the hit animation
                this.currentAnim = this.anims.hit.rewind();
                // console.log("player.js: reciveDamage() -> this.health = " + this.health);

                // backflip the player
                this.vel.x = this.flip ? -this.maxVel.x : this.maxVel.x;
                this.vel.y = -this.maxVel.y;

                // update the player's health bar
                var healthMeter = ig.game.getEntityByName('healthMeter');
                healthMeter.setMeterValue(this.health / this.maxHealth);
            },

            // Method to check if the player is touching a kill entity
            collideWith: function () {
                // var painEntities = ig.game.getEntitiesByType(EntityDamage);
                // console.log("player.js -> collideWith(): painEntities.length = " + painEntities.length);
            },

            updateMeter: function() {
                var healthMeter = ig.game.getEntityByName('healthMeter');
                healthMeter.setMeterValue(this.health / this.maxHealth);
            },
        });
    });
