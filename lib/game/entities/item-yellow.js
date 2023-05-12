// oggetto di colore giallo, scegliere cosa fargli fare item 65
ig.module(
  'game.entities.item-yellow'
)
.requires(
  'impact.entity'
)
.defines(function() {

  EntityItemYellow = ig.Entity.extend({

    animSheet: new ig.AnimationSheet( 'media/tiles/castel-tileset.png', 16, 16 ),
    animSettings: {
      idle: { frameTime: 1, sequence: [65] }
    },
    animInit: "idle",

    size: { x: 16, y: 16 },

    weaponBonus: 2,
    healthBonus: 20,

    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,

    check: function( other ) {
      other.weapon += this.weaponBonus;
      other.health += this.healthBonus;

      console.log("collected super bonus: player weapon is now " + other.weapon + " and health is now " + other.health);

      this.kill();
    }

  });  // end EntityItemYellow

});  // end ig.module