// oggetto di colore blu, per aggiungere utilizzi all'arma del giocatore
ig.module(
  'game.entities.item-blue'
)
.requires(
  'impact.entity'
)
.defines(function() {

  EntityItemBlue = ig.Entity.extend({

    // TODO: cambiare il colore dell'oggetto da giallo a blu
    animSheet: new ig.AnimationSheet( 'media/tiles/castel-tileset-blue.png', 16, 16 ),
    animSettings: {
      idle: { frameTime: 1, sequence: [64] }
    },
    animInit: "idle",

    size: { x: 16, y: 16 },

    weaponBonus: 1,

    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,

    check: function( other ) {
      other.weapon += this.weaponBonus;

      console.log("collected weapon bonus: player weapon is now " + other.weapon);

      this.kill();
    }

  });  // end EntityItemBlue


});  // end ig.module