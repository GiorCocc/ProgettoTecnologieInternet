ig.module(
    'game.entities.sword'
)
.requires(
    'plusplus.core.config',
    'plusplus.core.animation',
    'plusplus.helpers.utils',
    'plusplus.abstractities.character',
    'game.abilities.weaponDamage',
)

// TODO: rendere questa classe espandibile in modo da poterci associare più armi, tanto il codice è sempre lo stesso
.defines(function() {

    ig.EntitySword = ig.global.EntitySword = ig.Character.extend({

        name: 'sword',
        class: 'EntitySword',
        size: { x: 11, y: 16 },
        offset: { x: 10, y: 12 },
        collides: ig.Entity.COLLIDES.NEVER,

        animSheet: new ig.AnimationSheet('media/excalibur_.png', 32, 32),
        animSettings: {
            init: {
                frameTime: 1,
                sequence: [0]
            },
            attackLeft: { 
                frameTime: 1,
                sequence: [8],
                
            },
            attackRight: {
                frameTime: 1,
                sequence: [4],
                
            },
        },
        animInit: 'idle',

        usage: 3,

        hasPlayerAttacked: false,
        hasPlayerAWapon: true,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.currentAnim = this.anims.init.rewind();
        },

        initProperties: function() {
            this.parent();

            this.shoot = new ig.AbilityDamage(this, {
                damage: 1,
            });

            this.abilities.addDescendants([
                this.shoot,
            ]);
        },

        // update the weapon position according to the player position
        followPlayer: function() {
            var player = ig.game.getPlayer();

            if (player) {
                this.pos.y = player.pos.y;
                if(player.facing.x > 0) {
                    this.pos.x = player.pos.x + this.size.x;
                } else {
                    this.pos.x = player.pos.x - this.size.x;
                }
            }
        },

        update: function () {
            this.parent();

            this.followPlayer();

            this.handleInput();
        },

        handleInput: function() {
            this.parent();

            var player = ig.game.getPlayer();

            if (ig.input.pressed('attack')) {
                if(this.checkUsage() <= 0) {
                    return;
                }

                this.hasPlayerAttacked = true;
                

                if (player.facing.x > 0) {
                    // attacco a destra
                    // this.currentAnim = this.anims.attackRight;
                    this.currentAnim.angle += 45;
                }
                else {
                    // attacco a sinistra
                    // this.currentAnim = this.anims.attackLeft;
                    this.currentAnim.angle -= 45;
                }

                setTimeout(function() { this.currentAnim.angle = 0; }.bind(this), 100);
                this.hasPlayerAttacked = false;
            }
        },

        checkUsage: function() {
            console.log(this.usage);
            if (this.usage <= 0) {
                this.kill();
                return 0;
            } else {
                return this.usage--;
            }
        },

        kill: function() {
            // destroy the weapon
            //this.parent();
            // ? Sarebbe meglio usare this.parent() per rimuoverla dal gioco. Uso removeWeapon() per rimuoverla dal player e farla ricomparire
            ig.game.removeWeapon();
            // ig.game.getPlayer().hasWeapon = false;
        },


        

        

        

        

        

        
        



        
    });
});