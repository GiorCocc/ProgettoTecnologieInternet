// oggetto di colore rosso, posizionato sulla mappa, per aggiungere vita al giocatore
ig.module(
  'game.entities.item-red'
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

    ig.EntityItemred = ig.global.EntityItemRed = ig.Character.extend({

      name: 'item-red',
      class: 'EntityItemRed',
      size: { x: 16, y: 16 },
      offset: { x: 0, y: 0 },
      collides: ig.Entity.COLLIDES.NEVER,
      animSheet: new ig.AnimationSheet('media/tiles/castle-tileset-red.png', 16, 16),
      animSettings: { init: { frameTime: 1, sequence: [65] }, },
      animInit: "idle",
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,
      glowSettings: {
        light: {
          performance: ig.EntityExtended.PERFORMANCE.DYNAMIC,
          castsShadows: true,
        },
        r: 1,
        g: 0,
        b: 0,
        alpha: 0.5,
        radius: 50,
        sizeMod: 2,

      },
      opaque: true,

      healthBonus: 10,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.healthBonus = this.healthBonus || settings.healthBonus || 1;
      },

      initProperties: function () {
        this.parent();
        this.glow = new ig.AbilityGlow(this, this.glowSettings);
        this.abilities.addDescendants([ this.glow, ]);
      },

      // check collision with player
      check: function (other) {
        if(other instanceof ig.global.EntityPlayer) {
          // get the weapon in the game
          var player = ig.game.getPlayer();

          // player health update
          if(player.health < player.healthMax) {
            player.health += this.healthBonus;
          }
          else {
            player.health = player.healthMax;
          }

          player.updateMeter();
          
          // this.kill();
          ig.game.onPlayerCollectedWeapon(this);
        }
      },

    });  // end EntityItemRed


  });  // end ig.module