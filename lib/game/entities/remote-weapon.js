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

      type: ig.Entity.TYPE.NONE,
      checkAgainst: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.NEVER,
      // by default, the weapon is a sword
      animSheet: new ig.AnimationSheet('media/weapons/excalibur_.png', 32, 32),
      animSettings: {
        init: { frameTime: 1, sequence: [0] },
      },
      animInit: 'idle',

      usage: 3,
      maxUsage: 3,

      hasPlayerAttacked: false,
      hasPlayerAWapon: true,
      hasHit: false,



      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.animSheet = this.animSheet || settings.animSheet;
        this.animSettings = this.animSettings || settings.animSettings;
        this.usage = this.usage || settings.usage;
        this.maxUsage = this.maxUsage || settings.maxUsage;

        this.currentAnim = this.anims.init.rewind();
      },



      update: function () {
        this.parent();

        this.followPlayer();
      },


      // method to follow the player movement
      followPlayer: function () {
        var remotePlayer = this.owner;

        if (remotePlayer) {
          this.pos.y = remotePlayer.pos.y;
          if (remotePlayer.dx > 0) {
            this.pos.x = remotePlayer.pos.x + this.size.x;
          } else if (remotePlayer.dx < 0) {
            this.pos.x = remotePlayer.pos.x - this.size.x;
          } else {
            this.pos.x = this.pos.x;
          }
        }
      },



      attack: function (message) {
        var remotePlayer = this.owner;

        this.dx = message.getVelX(); //x - this.pos.x;
        this.dy = message.getVelY(); //y - this.pos.y;

        if (this.dx > 0) {
          remotePlayer.flip.x = false;
        } else if (this.dx < 0) {
          remotePlayer.flip.x = true;
        }

        if (remotePlayer.dx > 0 || remotePlayer.flip.x == false) {
          this.currentAnim.angle += 45;
        }
        else if (remotePlayer.dx < 0 || remotePlayer.flip.x == true) {
          this.currentAnim.angle -= 45;
        }
        
        this.hasPlayerAttacked = false;

        // timeout to reset the angle of the weapon
        setTimeout(function () { this.currentAnim.angle = 0; }.bind(this), 100);
      },
      
      
      setHasPlayerAttacked(state) {
        this.hasPlayerAttacked = state
      },

      
      // check the collision with the player and apply damage
      check: function (other) {
        if (this.hasPlayerAttacked) {
          other.receiveDamage(25, this);
          this.currentAnim = this.anims.hit;
          this.vel.x = 0;

        }

        this.hasPlayerAttacked = false;
      }



    }); // end of ig.EntityRemoteWeapon

  });  // end of ig.module