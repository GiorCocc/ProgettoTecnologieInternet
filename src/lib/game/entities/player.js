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
        killed: false,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            
            this.addAnim('idle', 0.25, [0, 1, 2, 3, 2, 1, 0]);
            this.addAnim('run', 0.07, [8, 9, 10, 11, 16, 17, 18, 19]);
            this.addAnim('jump', 1, [24, 25]);
            this.addAnim('fall', 0.4, [27, 26, 58, 25, 24]);
            this.addAnim('hit', 1, [48, 49, 50, 51, 50, 51]);
            this.addAnim('death', 0.2, [48, 49, 50, 51, 50, 51, 57, 58, 59]);
            this.addAnim('deathIdle', 0.2, [50, 51, 50, 51]);

        },
        
        kill: function() {
            // this.currentAnim = this.anims.death;
            this.currentAnim = new ig.Animation(this.animSheet, 0.2, [48, 49, 50], true);
            this.currentAnim = this.anims.deathIdle;
            // display the death animation only once
            if (this.currentAnim.loopCount > 3 && this.currentAnim.loopCount < 5) {
                this.currentAnim = new ig.Animation(this.animSheet, 0.2, [57, 58, 59], false);
                ig.game.removePlayer();
            }
        },

        collideWith: function() {
            var killEntities = ig.game.getEntitiesByType(EntityKill);
            for (var i = 0; i < killEntities.length; i++) {
                if (this.touches(killEntities[i])) {
                    this.killed = true;
                }
            }
        },
        

        update: function() {
            var acceleration = this.standing ? this.accelGround : this.accelAir;
           
            if (ig.input.state('left') && this.killed == false) {
                // console.log('left');
                this.accel.x = -acceleration;
                this.flip = true;
            } else if (ig.input.state('right') && this.killed == false) {
                this.accel.x = acceleration;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }
          
            if(this.standing && ig.input.state('up') && this.killed == false){
                if(this.vel.y == 0){
                    this.vel.y = -this.jump;
                    this.falling = false;
                }
            }
            else if(this.standing && !this.falling && !ig.input.state('up') && this.killed == false){
                this.vel.y = Math.floor(this.vel.y/3);
                this.falling = true;
            }

           
            this.currentAnim.flip.x = this.flip;
            this.collideWith();
            this.parent();

            
            if(this.vel.y < 0 && !this.standing) 
                this.currentAnim = this.anims.jump;
            else if(this.vel.y > 0 && !this.standing) 
                this.currentAnim = this.anims.fall;
            else if(this.vel.x != 0) 
                this.currentAnim = this.anims.run;
            else if(this.killed) 
                this.kill();
            else 
                this.currentAnim = this.anims.idle;
        }
    });
});
