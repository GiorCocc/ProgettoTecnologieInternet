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

      followPlayer: function () {
        var remotePlayer = this.owner; // owner because 

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
      
      attack: function () {
        
        var remotePlayer = this.owner;  
        this.hasPlayerAttacked = true;
        
        
        

        if (remotePlayer.dx > 0) {
          // attacco a destra
          // this.currentAnim = this.anims.attackRight;
          this.currentAnim.angle += 45;
        }
        else {
          // attacco a sinistra
          // this.currentAnim = this.anims.attackLeft;
          this.currentAnim.angle -= 45;
        }

        setTimeout(function () { this.currentAnim.angle = 0; }.bind(this), 100);
        this.hasPlayerAttacked = false;
      
      },
      
    
     
    }); // end of ig.EntityRemoteWeapon
    
  });  // end of ig.module