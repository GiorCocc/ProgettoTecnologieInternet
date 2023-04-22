/**
 * Classe di base per la gestione delle armi
 * * ogni arma deve ignorare la collizione con i blocchi
 * * ogni arma deve eseguire un'animazione all'attacco (quando il giocatore preme il tasto per attaccare)
 * - ogni arma deve sparire quando il giocatore muore e quando finisce i suoi colpi
 */

ig.module(
    'game.entities.weapon'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityWeapon = ig.Entity.extend({

        size: { x: 11, y: 16 },
        offset: { x: 10, y: 12 },
        collides: ig.Entity.COLLIDES.NEVER,

        animSheet: new ig.AnimationSheet('media/excalibur_.png', 32, 32),
        hasPlayerAttacked: false,
        hasPlayerAWapon: true,

        damage: 1,
        usage: 3,

        init: function (x, y, settings) {

            // the weapon is placed on the left side of the player by the SpawnEntity function
            this.parent(x, y, settings);

            this.addAnim('init', 1, [0]);

            
        },

        update: function() {

            // update the weapon position according to the player position
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            if (this.hasPlayerAWapon) {
                this.pos.y = player.pos.y;
                // if player is moving left, place the weapon on the left of the player
                if(ig.input.state('left')) {
                    this.pos.x = player.pos.x - this.size.x;
                } else if(ig.input.state('right')) {
                    this.pos.x = player.pos.x + this.size.x;
                }
            }

            
            this.parent();

            // TODO: ruotare l'arma in senso circolare, di 45 gradi ogni volta che il giocatore preme il tasto per attaccare
            if (ig.input.pressed('attack')) {
                if(this.pos.x < player.pos.x){
                    this.currentAnim = new ig.Animation(this.animSheet, 0.1, [7,6,5,4, 5,6, 0], true);
                }  
                else{
                    this.currentAnim = new ig.Animation(this.animSheet, 0.1, [11,10,9,8, 9,10, 0], true);
                }
                    
            }
            

            
        },

        // TODO: rimuovere l'arma quando il giocatore muore o quando usage è uguale a 0
        remove: function(){

        }
    });
});
