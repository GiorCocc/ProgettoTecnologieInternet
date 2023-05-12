// oggetto di colore rosso, posizionato sulla mappa, per aggiungere vita al giocatore
ig.module(
  'game.entities.item-red'
)
.requires(
  'impact.entity'
)
.defines(function() {

  EntityItemRed = ig.Entity.extend({

    // TODO: cambiare il colore dell'oggetto da giallo a rosso
    animSheet: new ig.AnimationSheet( 'media/tiles/castel-tileset-red.png', 16, 16 ),
    animSettings: {
      idle: { frameTime: 1, sequence: [63] }
    },
    animInit: "idle",

    size: { x: 16, y: 16 },

    healthBonus: 20,

    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,

    check: function( other ) {
      other.health += this.healthBonus;

      console.log("collected health bonus: player health is now " + other.health);

      this.kill();
    }

  });  // end EntityItemRed

});  // end ig.module