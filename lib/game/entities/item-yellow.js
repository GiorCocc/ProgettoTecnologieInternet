// oggetto di colore giallo, scegliere cosa fargli fare item 65
ig.module(
  'game.entities.item-yellow'
)
  .requires(
    'plusplus.core.config',
    'plusplus.core.animation',
    'plusplus.helpers.utils',
    'plusplus.ui.ui-meter',
    'plusplus.abstractities.character',
  )
  .defines(function () {

    ig.EntityItemYellow = ig.global.EntityItemYellow = ig.Character.extend({

      name: 'item-yellow',
      class: 'EntityItemYellow',
      size: { x: 16, y: 16 },
      offset: { x: 0, y: 0 },
      collides: ig.Entity.COLLIDES.NEVER,
      animSheet: new ig.AnimationSheet('media/tiles/castle-tileset.png', 16, 16),
      animSettings: { init: { frameTime: 1, sequence: [65] }, },
      animInit: "idle",
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,

      weaponBonus: 2,
      healthBonus: 20,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.weaponBonus = this.weaponBonus || settings.weaponBonus || 1;
        this.healthBonus = this.healthBonus || settings.healthBonus || 1;
      },

      // check collision with player
      check: function (other) {
        if(other instanceof ig.global.EntityPlayer) {
          // get the weapon in the game
          var weapon = ig.game.getEntityByName('weapon');
          var player = ig.game.getPlayer();

          // weapon usage update
          if(weapon) {
            if(weapon.usage < weapon.maxUsage) {
              weapon.usage += this.weaponBonus;
            }
            else {
              weapon.usage = weapon.maxUsage;
            }

            weapon.updateMeter();
          }

          // player health update
          if(player.health < player.healthMax) {
            player.health += this.healthBonus;
          }
          else {
            player.health = player.healthMax;
          }

          player.updateMeter();
          
          this.kill();
        }
      },

    });  // end EntityItemYellow


  });  // end ig.module