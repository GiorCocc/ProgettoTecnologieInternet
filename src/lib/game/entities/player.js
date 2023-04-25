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
        type: ig.Entity.TYPE.A,
       
        animSheet: new ig.AnimationSheet('media/arthurPendragon_.png', 32, 32),
        flip: true,

        accelGround: 200,
        accelAir: 310,
        jump: 200,
        friction: { x: 600, y: 0 },
        maxVel: { x: 100, y: 110 }, 
        init: function (x, y, settings) {

            this.parent(x, y, settings);

            
            this.addAnim('idle', 0.25, [0, 1, 2, 3, 2, 1, 0]);
            this.addAnim('run', 0.07, [8, 9, 10, 11, 16, 17, 18, 19]);
            this.addAnim('jump', 1, [24, 25]);
            this.addAnim('fall', 0.4, [27, 26, 58, 25, 24]);
            this.addAnim('hit', 1, [48, 49, 50, 51, 50, 51]);
            this.addAnim('death', 1, [48, 49, 50, 51, 50, 51, 57, 58, 59]);

        },
        
        kill: function() {
            this.currentAnim = this.anims.death;
            this.deathTimer = new ig.Timer(2); // Imposta un timer di 1 secondo
            this.parent();
            ig.game.spawnEntity(EntityPlayer, 66,160);
        },
        

        update: function() {
            
            
            // Il resto del codice della funzione update rimane invariato
            var acceleration = this.standing ? this.accelGround : this.accelAir;

           
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

           
            this.currentAnim.flip.x = this.flip;

            this.parent();

            
            if(this.vel.y < 0 && !this.standing) this.currentAnim = this.anims.jump;
            else if(this.vel.y > 0 && !this.standing) this.currentAnim = this.anims.fall;
            else if(this.vel.x != 0) this.currentAnim = this.anims.run;
            else this.currentAnim = this.anims.idle;
        }
    });
});
