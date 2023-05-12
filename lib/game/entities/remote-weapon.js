ig.module(
  'game.entities.remote-weapon'
)
  .requires(
    'impact.entity',
  )
  .defines(function () {

    EntityRemoteWeapon = ig.Entity.extend({

      size: { x: 11, y: 16 },
      offset: { x: 10, y: 12 },

      type: ig.Entity.TYPE.B,

      animSheet: new ig.AnimationSheet('media/weapons/excalibur_.png', 32, 32),

      usage: 3,
      maxUsage: 3,

      init: function (x, y, settings) {
        this.parent(x, y, settings);
      },

    }); // end of ig.EntityRemoteWeapon
  });  // end of ig.module