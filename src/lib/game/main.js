/**
 * Pagina principale del gioco
 * --------------------------
 * * collegarei tasti per il gioco
 * * caricare la mappa
 * * caricare il giocatore con la sua arca predefinita
 * - gestire la morte del giocatore
 * - gestire la comparsa dei giocatori in posizioni casuali (creare un set di posizioni da cui effettuare la scelta)
 * - gestire la comparsa delle armi
 */

ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.debug.debug',

	'game.levels.testR', 

	'plugins.camera'
)
.defines(function(){

	var log = console.log.bind(console);

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	gravity: 300,
	
	
	init: function() {
		// Initialize main level
		this.loadLevel(LevelTestR);
		// Initialize your game here; bind keys etc.
		this.bindKeys();

		// camera
		this.setupCamera();

		// spawn player
		// this.spawnPlayer();
	},

	bindKeys: function() {
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );

		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );

		ig.input.bind(ig.KEY.C, 'attack');
	},

	setupCamera: function() {
		this.camera = new ig.Camera(ig.system.width/2, ig.system.height/2, 5);
		// this.camera.trap.size.x = ig.system.width/2;
		// this.camera.trap.size.y = ig.system.height/2;
		// this.camera.lookAhead.x = ig.system.width/3;
		// this.camera.lookAhead.y = ig.system.height/3;
		this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
    this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
    this.camera.set( this.getEntitiesByType(EntityPlayer)[0]);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		// Add your own, additional update code here
		this.camera.follow(this.getEntitiesByType(EntityPlayer)[0]);

		this.playerOutOfBounds();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	},
	
	// TODO: modificare la funzione mettendo il giocatore in una nuova posizione casuale (scegliere da un set predefinito di posizioni)
	spawnPlayer: function(){
		ig.game.spawnEntity(EntityWeapon, 56 - 10, 146);
		log("Player spawned");
		ig.game.spawnEntity(EntityPlayer, 56, 146);
		log("Weapon spawned");
	},

	// TODO: creare una funzione che permetta di inserire le armi sulla mappa
	spawnWeapons: function(){},

	removePLayer: function(){
		var player = this.getEntitiesByType(EntityPlayer)[0];
		var weapon = this.getEntitiesByType(EntityWeapon)[0] || null;
		this.removeEntity(player);
		this.removeEntity(weapon);

		this.spawnPlayer();
	},

	// TODO: creare una funzione per gestire la morte di un personaggio (da parte di un altro personaggio o da un nemico)
	playerDied: function(killerID){},

	playerOutOfBounds: function(){
		var player = this.getEntitiesByType(EntityPlayer)[0];

		if(	player.pos.x < 0 || 
				player.pos.x > this.collisionMap.pxWidth || 
				player.pos.y < 0 || 
				player.pos.y > this.collisionMap.pxHeight	) {
					this.removePLayer();
					log("Player fall out of the map");
				}

		
	},

	drawTextOnScreen: function(text) {
		// Add your own drawing code here
		var x = ig.system.width/2;
		var y = ig.system.height/2;
		
		this.font.draw( text, x, y, ig.Font.ALIGN.CENTER );
	}

});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
