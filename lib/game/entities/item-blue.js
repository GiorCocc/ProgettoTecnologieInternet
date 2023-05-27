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

      // glow options
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

      weaponBonus: 1,

      
      
      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.weaponBonus = settings.weaponBonus || this.weaponBonus || 1;
      },

      
      
      initProperties: function () {
        this.parent();

        this.glow = new ig.AbilityGlow(this, this.glowSettings);
        this.abilities.addDescendants([ this.glow, ]);
      },

      
      
      // check collision with player in order to collect the item and give the bonus
      check: function (other) {
        if (other instanceof ig.global.EntityPlayer) {
          var weapon = ig.game.getEntityByName('weapon');

          // if there is no weapon, then we can't give a bonus
          if (!weapon)
            return;

          if (weapon.usage < weapon.maxUsage) {
            weapon.usage += this.weaponBonus;
          }
          else {
            weapon.usage = weapon.maxUsage;
          }

          weapon.updateMeter();

          ig.game.onPlayerCollectedItem(this);
        }
      },



    });  // end EntityItemBlue


  });  // end ig.module