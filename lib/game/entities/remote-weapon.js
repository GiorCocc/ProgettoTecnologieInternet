ig.module(
  'game.entities.remote-weapon'
)
  .requires(
    'plusplus.core.config',
    'plusplus.core.animation',
    'plusplus.helpers.utils',
    'plusplus.abstractities.character',
  )
  .defines(function () {

    ig.EntityRemoteWeapon = ig.global.EntityRemoteWeapon = ig.Character.extend({

      name: 'remoteWeapon',
      class: 'EntityRemoteWeapon',
      size: { x: 11, y: 16 },
      offset: { x: 10, y: 12 }, 
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.NEVER,  
      owner: null,   

      animSheet: new ig.AnimationSheet('media/weapons/excalibur_.png', 32, 32),
      animSettings: { init: { frameTime: 1, sequence: [0] }, },
      animInit: 'idle',

      usage: 3,
      maxUsage: 3,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.owner = settings.owner || null;
      },

      update: function () {
        this.parent();

        this.followPlayer();
      },

      followPlayer: function () {
        var remotePlayer = this.owner;

        if (remotePlayer) {
          this.pos.y = remotePlayer.pos.y;
          if (remotePlayer.dx > 0) {
            this.pos.x = remotePlayer.pos.x + this.size.x;
          } else if (remotePlayer.dx < 0){
            this.pos.x = remotePlayer.pos.x - this.size.x;
          } else {
            this.pos.x = this.pos.x;
          }
        }
      },

    }); // end of ig.EntityRemoteWeapon
  });  // end of ig.module