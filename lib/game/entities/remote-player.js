ig.module(
  'game.entities.remote-player'
)
  .requires(
    'plusplus.core.config',
    'plusplus.core.animation',
    'plusplus.helpers.utils',
    'plusplus.abstractities.character',
    'impact.entity',
    'impact.animation'
  )
  .defines(function () {
    ig.EntityRemotePlayer = ig.global.EntityRemotePlayer = ig.Character.extend({
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.NONE,
      collides: ig.Entity.COLLIDES.PASSIVE,
      name: 'remotePlayer',
      class: 'EntityRemotePlayer',
      type: ig.Entity.TYPE.B,
      

      size: { x: 11, y: 16 },
      offset: { x: 10, y: 12 },
      dx: 0,
      dy: 0,

      stateUpdated: false,

      animSheet: new ig.AnimationSheet('media/sprites/lancelot_.png', 32, 32),
      animSettings: {
        init: { frameTime: 1, sequence: [0] },
        idle: { frameTime: 0.25, sequence: [0, 1, 2, 3, 2, 1, 0] },
        move: { frameTime: 0.3, sequence: [8, 9, 10, 11, 16, 17, 18, 19] },
      },
      animInit: 'idle',
      animAutomatic: true,
      canFlipX: true,
      canFlipY: true,

      frictionGrounded: { x: 600, y: 0 },


      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.name = settings.name || this.name;
        this.animSheet = settings.animSheet || this.animSheet;
        this.currentAnim = this.anims.init.rewind();

        // this.name = settings.name || this.name;

        // this.addAnim('idle', 0.25, [0, 1, 2, 3, 2, 1, 0]);
        // // this.addAnim('move', 0.3, [8, 9, 10, 11, 16, 17, 18, 19], true);
        // // this.addAnim('shrug', 0.3, [3, 3, 3, 3, 3, 3, 4, 3, 3], true);
        // // this.addAnim('run', 0.07, [6, 7, 8, 9, 10, 11]);
        // // this.addAnim('jump', 1, [15]);
        // // this.addAnim('fall', 0.4, [12, 13]);
        // // this.addAnim('land', 0.15, [14]);
        // // this.addAnim('die', 0.07, [18, 19, 20, 21, 22, 23, 16, 16, 16]);
        // // this.addAnim('spawn', 0.07, [16, 16, 16, 23, 22, 21, 20, 19, 18]);

        // this.currentAnim = this.anims.idle.rewind();

      },

      setState: function (state) {
        var x = state.getX();
        var y = state.getY();

        this.dx = state.getVelX(); //x - this.pos.x;
        this.dy = state.getVelY(); //y - this.pos.y;

        this.pos = { x: x, y: y };

        this.stateUpdated = true;
      },

      update: function () {
        this.parent();

        

        if (this.stateUpdated) {
          this.stateUpdated = false;
        } else {
          this.pos.x += this.dx;
          this.pos.y += this.dy;

          if (this.currentAnim) {
            this.currentAnim.update();
          }
        }

        if(this.dx > 0){
          this.flip.x = false;
        } else if(this.dx < 0){
          this.flip.x = true;
        }

        // console.log(this.dx + " " + this.dy);

        


        // this.currentAnim = this.anims.idle.rewind();

      },

      kill: function () {
        this.parent();
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
    });

  });
