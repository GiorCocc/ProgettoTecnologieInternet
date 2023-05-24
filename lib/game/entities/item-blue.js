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
    'plusplus.abilities.glow',
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
      glowSettings: {
        light: {
          performance: ig.EntityExtended.PERFORMANCE.DYNAMIC,
          castsShadows: true,
        },
        r: 0,
        g: 0,
        b: 1,
        alpha: 0.7,
        radius: 50,
        sizeMod: 2,

      },
      opaque: true,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.weaponBonus = this.weaponBonus || settings.weaponBonus || 1;
      },

      initProperties: function () {
        this.parent();
        this.glow = new ig.AbilityGlow(this, this.glowSettings);

        this.abilities.addDescendants([ this.glow, ]);

      },

      // check collision with player
      check: function (other) {
        if (other instanceof ig.global.EntityPlayer) {
          // get the weapon in the game
          var weapon = ig.game.getEntityByName('weapon');

          if (!weapon)
            return;

          if (weapon.usage < weapon.maxUsage) {
            weapon.usage += this.weaponBonus;
          }
          else {
            weapon.usage = weapon.maxUsage;
          }

          weapon.updateMeter();

          // this.kill();
          ig.game.onPlayerCollectedWeapon(this);
        }
      },

    });  // end EntityItemBlue


  });  // end ig.module