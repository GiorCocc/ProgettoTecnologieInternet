// jscs:disable validateIndentation
ig.module(
  'game.entities.remote-player'
)
  .requires(
    'impact.entity',
  )
  .defines(function () {
    EntityRemotePlayer = ig.Entity.extend({

      type: ig.Entity.TYPE.B,

      size: { x: 11, y: 16 },
      offset: { x: 10, y: 12 },

      stateUpdated: false,

      animSheet: new ig.AnimationSheet('media/sprites/lancelot_.png', 32, 32),
      flip: true,
      direction: null,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.addAnim('idle', 0.25, [0, 1, 2, 3, 2, 1, 0]);
        this.addAnim('move', 0.3, [8, 9, 10, 11, 16, 17, 18, 19], true);
        this.addAnim('shrug', 0.3, [3, 3, 3, 3, 3, 3, 4, 3, 3], true);
        this.addAnim('run', 0.07, [6, 7, 8, 9, 10, 11]);
        this.addAnim('jump', 1, [15]);
        this.addAnim('fall', 0.4, [12, 13]);
        this.addAnim('land', 0.15, [14]);
        this.addAnim('die', 0.07, [18, 19, 20, 21, 22, 23, 16, 16, 16]);
        this.addAnim('spawn', 0.07, [16, 16, 16, 23, 22, 21, 20, 19, 18]);

        this.currentAnim = this.anims.idle;
      },

      setState: function (state) {
        var x = state.getX();
        var y = state.getY();

        this.dx = state.getVelX(); //x - this.pos.x;
        this.dy = state.getVelY(); //y - this.pos.y;

        this.pos = {
          x: x,
          y: y
        };

        // console.log(state.getFlip());

        this.currentAnim = this.anims.idle;
        this.direction = state.getAnim();
        this.currentAnim.frame = state.getFrame();
        this.currentAnim.flip.x = state.getFlip();
        this.stateUpdated = true;
      },

      update: function () {
        if (this.stateUpdated) {
          this.stateUpdated = false;
        } else {
          this.pos.x += this.dx;
          this.pos.y += this.dy;

          if (this.currentAnim) {
            this.currentAnim.update();
          }
        }

        if(this.accel.x > 0) this.flip = false;
        else if(this.accel.x < 0) this.flip = true;

        this.currentAnim.flip.x = (this.dx < 0) ? true : false;
      },
      kill: function () {
        this.parent();
      }
    });

  });
