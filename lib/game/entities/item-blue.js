// oggetto di colore blu, per aggiungere utilizzi all'arma del giocatore
ig.module(
  'game.entities.item-blue'
)
  .requires(
    'plusplus.core.config',
    'plusplus.core.animation',
    'plusplus.helpers.utils',
    'plusplus.ui.ui-meter',
    'plusplus.abstractities.character',
  )
  .defines(function () {

    ig.EntityItemBlue = ig.global.EntityItemBlue = ig.Character.extend({

      name: 'item-blue',
      class: 'EntityItemBlue',
      size: { x: 16, y: 16 },
      offset: { x: 0, y: 0 },
      collides: ig.Entity.COLLIDES.NEVER,
      animSheet: new ig.AnimationSheet('media/tiles/castle-tileset-blue.png', 16, 16),
      animSettings: { init: { frameTime: 1, sequence: [65] }, },
      animInit: "idle",
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,
      weaponBonus: 1,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.weaponBonus = this.weaponBonus || settings.weaponBonus || 1;
      },

      // check collision with player
      check: function (other) {
        if(other instanceof ig.global.EntityPlayer) {
          // get the weapon in the game
          var weapon = ig.game.getEntityByName('weapon');

          if(weapon.usage < weapon.maxUsage) {
            weapon.usage += this.weaponBonus;
          }
          else {
            weapon.usage = weapon.maxUsage;
          }

          weapon.updateMeter();
          
          this.kill();
        }
      },

    });  // end EntityItemBlue


  });  // end ig.module