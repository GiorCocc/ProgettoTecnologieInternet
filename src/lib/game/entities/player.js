ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityPlayer = ig.Entity.extend({

        size: { x: 11, y: 16 },
        offset: { x: 10, y: 12 },
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/arthurPendragon_.png', 32, 32),
        flip: true,

        accelGround: 200,
        accelAir: 310,
        jump: 200,
        friction: { x: 600, y: 0 },
        maxVel: { x: 100, y: 110 }, // TODO: cambiare questi valori affinchè il personaggio vada più veloce e salti più in alto

        init: function (x, y, settings) {

            this.parent(x, y, settings);

            // ? il foglio con le animazioni contine 4 frame per ogni animazione. Nella pagina c'è anche la versione specchiata (non usare)
            // ? animazioni disponibili: idle, run, jump idle, jump run, turn, hit, death
            // TODO: modificare il secondo parametro (la velocità) a piacimento per l'animazione
            this.addAnim('idle', 0.25, [0, 1, 2, 3, 2, 1, 0]);
            this.addAnim('run', 0.07, [8, 9, 10, 11, 16, 17, 18, 19]);
            this.addAnim('jump', 1, [24, 25]);
            this.addAnim('fall', 0.4, [27, 26, 58, 25, 24]);
            this.addAnim('hit', 1, [48, 49, 50, 51, 50, 51]);
            this.addAnim('death', 1, [48, 49, 50, 51, 50, 51, 57, 58, 59]);

        },

        update: function() {

            var acceleration = this.standing ? this.accelGround : this.accelAir;

            // associate the keys to the player's movement (left and right)
            if (ig.input.state('left')) {
                console.log('left');
                this.accel.x = -acceleration;
                this.flip = true;
            } else if (ig.input.state('right')) {
                this.accel.x = acceleration;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }

            // jump logic
            if(this.standing && ig.input.state('up')){
                if(this.vel.y == 0){
                    this.vel.y = -this.jump;
                    this.falling = false;
                }
            }
            else if(this.standing && !this.falling && !ig.input.state('up')){
                this.vel.y = Math.floor(this.vel.y/3);
                this.falling = true;
            }

            // flip the player's sprite when he's moving right
            this.currentAnim.flip.x = this.flip;

            this.parent();

            // animation logic
            if(this.vel.y < 0 && !this.standing) this.currentAnim = this.anims.jump;
            else if(this.vel.y > 0 && !this.standing) this.currentAnim = this.anims.fall;
            else if(this.vel.x != 0) this.currentAnim = this.anims.run;
            else this.currentAnim = this.anims.idle;
        }
    });
});
