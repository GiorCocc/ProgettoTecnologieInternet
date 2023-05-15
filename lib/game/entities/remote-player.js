ig.module(
  'game.entities.remote-player'
)
  .requires(
    'plusplus.core.config',
    'plusplus.core.animation',
    'plusplus.helpers.utils',
    'plusplus.abstractities.character',
    'impact.entity'
  )
  .defines(function () {
    ig.EntityRemotePlayer = ig.global.EntityRemotePlayer = ig.Entity.extend({

      name: 'remotePlayer',
      class: 'EntityRemotePlayer',
      type: ig.Entity.TYPE.B,
      collides: ig.Entity.COLLIDES.NEVER,

      size: { x: 11, y: 16 },
      offset: { x: 10, y: 12 },

      stateUpdated: false,

      animSheet: new ig.AnimationSheet('media/sprites/lancelot_.png', 32, 32),
      animSettings: {
        init: { frameTime: 1, sequence: [0] },
        idleX: { frameTime: 0.25, sequence: [0, 1, 2, 3, 2, 1, 0] },
        idleY: { frameTime: 0.25, sequence: [4, 5, 6, 7, 6, 5, 4] },
        move: { frameTime: 0.3, sequence: [8, 9, 10, 11, 16, 17, 18, 19] },
      },
      animInit: 'idle',
      animAutomatic: true,

      frictionGrounded: { x: 600, y: 0 },

      // animSheet: new ig.AnimationSheet('media/tiles/castle-tileset-blue.png', 16, 16),
      // animSettings: { init: { frameTime: 1, sequence: [65] }, },
      // animInit: "idle",

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.name = settings.name || this.name;

        this.addAnim('idle', 0.25, [0, 1, 2, 3, 2, 1, 0]);
        // this.addAnim('move', 0.3, [8, 9, 10, 11, 16, 17, 18, 19], true);
        // this.addAnim('shrug', 0.3, [3, 3, 3, 3, 3, 3, 4, 3, 3], true);
        // this.addAnim('run', 0.07, [6, 7, 8, 9, 10, 11]);
        // this.addAnim('jump', 1, [15]);
        // this.addAnim('fall', 0.4, [12, 13]);
        // this.addAnim('land', 0.15, [14]);
        // this.addAnim('die', 0.07, [18, 19, 20, 21, 22, 23, 16, 16, 16]);
        // this.addAnim('spawn', 0.07, [16, 16, 16, 23, 22, 21, 20, 19, 18]);

        this.currentAnim = this.anims.idle;

      },

      setState: function (state) {
        // console.log(state);
        var x = state.getX();
        var y = state.getY();

        this.dx = state.getVelX() / 10; //x - this.pos.x;
        this.dy = state.getVelY() / 10; //y - this.pos.y;

        this.pos = { x: x, y: y };

        // BUG: fix facing direction
        // this.facing.x = state.getFlip();
        this.stateUpdated = true;
      },

      update: function () {
        // this.parent();

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
          // this.currentAnim = this.anims.idleX;
          this.currentAnim.flip.x = false;
        } else if(this.dx < 0){
          this.currentAnim.flip.x = true;
          // this.currentAnim = this.anims.idleX;
        }



      },

      kill: function () {
        this.parent();
      }
    });

  });
