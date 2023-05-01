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
		'plusplus.core.plusplus',
		'game.levels.testR',
		'game.entities.player',
		'game.entities.pain',
		'game.entities.kill',
		'game.entities.weapon',
		'game.ui.healthBar',


		'plusplus.entities.pain',
		'plusplus.ui.ui-toggle-pause',
		'plusplus.ui.ui-meter',
		'plusplus.ui.ui-text',

		'plusplus.debug.debug'
	)
	.defines(function () {

		var log = console.log.bind(console);

		var MyGame = ig.GameExtended.extend({

			// Load a font
			font: new ig.Font('media/04b03.font.png'),

			gravity: 300,

			shapesPasses: {
				lighting: {
					ignoreClimbable: true,
					discardBoundaryInner: true
				}
			},

			init: function () {
				this.parent();
				// Initialize main level
				this.loadLevel(ig.global.LevelTestR);
				// Load UI
				this.initUI();
				// camera
				// ig.game.camera.follow(ig.game.player, false, false);
				ig.game.camera.addAtmosphere(0,{
					r: 0.1,
					g: 0.1,
					b: 0.1,
					alpha: 0.7,
			});
			},

			// TODO: da implementare la barra della vita del giocatore e un pulsante per la condivisione della stanza di gioco
			initUI: function () {
				// health text label
				var healthLabel = this.spawnEntity(ig.UIText, 0, 0, {
					// position to top left
					posPct: {
						x: 0,
						y: 0
					},
					// set the margin
					marginAsPct: false,
					margin: {
						x: 20,
						y: 20
					},
					// text settings
					text: 'Health',
					font: new ig.Font('media/04b03.font.png'),
					textAlign: 'left',
					textBaseline: 'top',
					// size of text
					size: {
						x: 64,
						y: 8
					},
					// the color of the text set to white
					fillStyle: 'rgb(255,255,255)',
					
					
				});
				// player health
				// TODO: implementare il riempimento della barra in base alla vita del giocatore

				var healthBar = this.spawnEntity(ig.UIHealthBar, 0, 0, {});
				

				// share button
			},

			

			inputStart: function () {
				this.parent();

				// arrow keys (other keys are binded by default)
				ig.input.bind(ig.KEY.UP_ARROW, 'jump');

				// WASD (other keys are binded by default)
				ig.input.bind(ig.KEY.W, 'jump');

				// ability keys
				ig.input.bind(ig.KEY.C, 'attack');
			},

			inputEnd: function () {
				this.parent();

				// arrow keys (other keys are unbinded by default)
				ig.input.unbind(ig.KEY.UP_ARROW, 'jump');
				// ig.input.unbind(ig.KEY.DOWN_ARROW, 'down');

				// WASD (other keys are unbinded by default)
				ig.input.unbind(ig.KEY.W, 'jump');

				// ability keys
				ig.input.unbind(ig.KEY.C, 'attack');
			},

			update: function () {
				// Update all entities and backgroundMaps
				this.parent();

				this.camera.follow(this.getPlayer());

				this.playerOutOfBounds();

				this.checkPlayerDeath();

				this.collideWith();
			},

			// Method to check if the player is colliding with a kill entity
			collideWith: function () {
				
				
			},

			// Method to check if the player is dead (health <= 0)
			checkPlayerDeath: function () {
				var player = this.getPlayer();

				if (player.health <= 0) {
					this.removePlayer();
					this.removeWeapon();
				}
			},

			draw: function () {
				// Draw all entities and backgroundMaps
				this.parent();
			},

			// TODO: modificare la funzione mettendo il giocatore in una nuova posizione casuale (scegliere da un set predefinito di posizioni)
			spawnPlayer: function () {
				ig.game.spawnEntity(EntityPlayer, 56, 146);
				ig.game.spawnEntity(UIHealthBar, 0, 0);
				// log("Player spawned");
			},

			spawnWeapon: function () {
				ig.game.spawnEntity(EntitySword, 56 - 10, 146);
				log("Weapon spawned");
			},

			// TODO: creare una funzione che permetta di inserire le armi sulla mappa
			spawnWeapons: function () { },

			removePlayer: function () {
				var player = this.getPlayer();
				var playerhealthMeter = this.getEntitiesByClass(UIHealthBar)[0];

				this.removeEntity(player);
				this.removeEntity(playerhealthMeter);

				this.spawnPlayer();
			},

			removeWeapon: function () {
				var weapon = this.getEntitiesByClass(EntitySword)[0];

				if(!weapon) return;

				this.removeEntity(weapon);
				this.spawnWeapon();
			},

			// Method to check if the player is out of the map
			playerOutOfBounds: function () {
				var player = this.getPlayer();

				if (player.pos.x < 0 ||
					player.pos.x > this.collisionMap.pxWidth ||
					player.pos.y < 0 ||
					player.pos.y > this.collisionMap.pxHeight) {
					this.removePlayer();
					this.removeWeapon();

					// log("Player fall out of the map");
				}
			},
		});


		// Start the Game with 60fps, a resolution of 320x240, scaled
		// up by a factor of 2
		ig.main('#canvas', MyGame, 60, 320, 240, 4, ig.LoaderExtended);

	});
