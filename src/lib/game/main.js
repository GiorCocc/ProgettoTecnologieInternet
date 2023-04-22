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

	setupCamera: function() {
		this.camera = new ig.Camera(ig.system.width/2, ig.system.height/2, 5);
		this.camera.trap.size.x = ig.system.width/2;
		this.camera.trap.size.y = ig.system.height/2;
		this.camera.lookAhead.x = ig.system.width/3;
		this.camera.lookAhead.y = ig.system.height/3;
		this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
    this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
    this.camera.set( this.getEntitiesByType(EntityPlayer)[0]);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
		this.camera.follow(this.getEntitiesByType(EntityPlayer)[0]);
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
		
		//this.font.draw( 'Sembra che tutto funzioni!', x, y, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
