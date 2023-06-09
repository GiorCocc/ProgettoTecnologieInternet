ig.module(
  'game.entities.weapon'
)
  .requires(
    'plusplus.core.config',
    'plusplus.core.animation',
    'plusplus.helpers.utils',
    'plusplus.ui.ui-meter',
    'plusplus.abstractities.character',
    'game.abilities.weaponDamage',
  )
  .defines(function () {

    ig.EntityWeapon = ig.global.EntityWeapon = ig.Character.extend({

      name: 'weapon',
      class: 'EntityWeapon',
      size: { x: 11, y: 16 },
      offset: { x: 10, y: 12 },
      type: ig.Entity.TYPE.NONE,
      checkAgainst: ig.Entity.TYPE.B,
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

      
      
      initProperties: function () {
        this.parent();

        this.shoot = new ig.AbilityDamage(this, {
          damage: 1,
        });

        this.abilities.addDescendants([
          this.shoot,
        ]);
      },

      
      
      // update the weapon position according to the player position
      followPlayer: function () {
        var player = ig.game.getPlayer();

        if (player) {
          this.pos.y = player.pos.y;
          if (player.facing.x > 0) {
            this.pos.x = player.pos.x + this.size.x;
          } else {
            this.pos.x = player.pos.x - this.size.x;
          }
        }
      },

      
      
      update: function () {
        this.parent();

        this.followPlayer();
        this.handleInput();
      },

      
      // read the input from the player to attack
      handleInput: function () {
        this.parent();

        var player = ig.game.getPlayer();
        
        if (ig.input.pressed('attack')) {
          if (this.checkUsage() <= 0) {
            return;
          }
          ig.game.playerAttack();
          this.hasPlayerAttacked = true;

          // attack animation
          if (player.facing.x > 0) {
            this.currentAnim.angle += 45;
          }
          else {
            this.currentAnim.angle -= 45;
          }
          
          setTimeout(function () { this.currentAnim.angle = 0; }.bind(this), 100);
          this.hasPlayerAttacked = false;
        }
      },

      
      
      checkUsage: function () {
        var usageMeter = ig.game.getEntityByName('usageMeter');

        if (this.usage <= 0) {
          this.kill();
          return 0;
        } else {
          this.usage--;
          usageMeter.setMeterValue(this.usage / this.maxUsage);
          return this.usage;
        }
      },

      
      
      updateMeter: function () {
        var usageMeter = ig.game.getEntityByName('usageMeter');
        usageMeter.setMeterValue(this.usage / this.maxUsage);
      },
      
      
      
      kill: function () {
        this.parent();

        ig.game.setWeaponTimer(5);
      },



    });
  });
