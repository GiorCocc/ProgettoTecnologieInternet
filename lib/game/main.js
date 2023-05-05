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
		'game.entities.remote-player',
		'plusplus.entities.pain',

		'game.ui.healthBar',
		'plusplus.ui.ui-toggle-pause',
		'plusplus.ui.ui-meter',
		'plusplus.ui.ui-text',

		'game.events',
		// 'game.gameroom',
		'network.room-connection',

		'plusplus.debug.debug'
	)
	.defines(function () {

		var log = console.log.bind(console);

		// Messages
		var MESSAGE_STATE = 0;
		var MESSAGE_DIED = 2;
		var MESSAGE_SHOOT = 3;
		var MESSAGE_COLLECT_WEAPON = 4;
		var MESSAGE_FRAG_COUNT = 5;

		// Fields
		var FIELD_TYPE = 'type';
		var FIELD_X = 'x';
		var FIELD_Y = 'y';
		var FIELD_VEL_X = 'vel_x';
		var FIELD_VEL_Y = 'vel_y';
		var FIELD_ANIM = 'anim';
		var FIELD_FRAME = 'frame';
		var FIELD_FLIP = 'flip';
		var FIELD_WEAPON_ID = 'weapon_id';
		var FIELD_KILLER_ID = 'killer_id';
		var FIELD_FRAG_COUNT = 'frag_count';

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

			// room
			roomName: window.location.search,
			connection: null,
			remotePlayers: {},

			init: function () {
				this.parent();

				// create connection
				this.connection = gameRoom.roomConnection;
				this.connectionHandlers = {
					'peer_message': this.onPeerMessage,
					'user_leave': this.onUserLeave
				};
				Events.on(this.connection, this.connectionHandlers, this);

				// Initialize main level
				this.loadLevel(ig.global.LevelTestR);
				// Load UI
				this.initUI();
				// camera
				// ig.game.camera.follow(ig.game.player, false, false);
				ig.game.camera.addAtmosphere(0, {
					// r: 0.1,
					// g: 0.1,
					// b: 0.1,
					alpha: 1,
				});
			},

			// TODO: creare questi metodi per la connessione
			playerDied: function (killerId) { },
			playerAttack: function () { },
			onUserLeave: function (user) { },
			onPeerMessage: function (message, user) { },

			spawnRemotePlayer: function (user, x, y) {
				this.remotePlayers[user.id] = this.spawnEntity(ig.RemotePlayer, x, y);

				return this.remotePlayers[user.id];
			},

			onPlayerState: function (remotePlayer, message) { },
			onPlayerDied: function (remotePlayer, message, user) { },
			onPlayerAttack: function () { },
			onRemotePlayerCollectedWeapon: function () { },
			onRemotePlayerFragCount: function () { },
			onPlayerCollectedWeapon: function () { },
			onWeaponCollect: function () { },

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

			// TODO: aggiornare con la posizione del giocatore remoto
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

				if (!weapon) return;

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

		GameRoom = ig.Class.extend({
			roomId: null,
			roomConnection: null,
			socket: null,

			init: function (socketUrl) {
				this.roomId = window.location.search.slice(1);
				this.registerMessages();
				this.socket = io(socketUrl);
				this.roomConnection = new RoomConnection(this.roomId, this.socket);
				this.roomConnection.on('joined', this.onJoinedRoom, this);
				this.roomConnection.connect();
			},

			registerMessages: function () {
				MessageBuilder.registerMessageType(MESSAGE_STATE, [
					FIELD_TYPE,
					FIELD_X,
					FIELD_Y,
					FIELD_VEL_X,
					FIELD_VEL_Y,
					FIELD_FRAME,
					FIELD_ANIM,
					FIELD_FLIP
				]);
				MessageBuilder.registerMessageType(MESSAGE_DIED, [
					FIELD_TYPE,
					FIELD_KILLER_ID
				]);
				MessageBuilder.registerMessageType(MESSAGE_SHOOT, [
					FIELD_TYPE,
					FIELD_X,
					FIELD_Y,
					FIELD_FLIP
				]);
				MessageBuilder.registerMessageType(MESSAGE_COLLECT_WEAPON, [
					FIELD_TYPE,
					FIELD_WEAPON_ID
				]);
				MessageBuilder.registerMessageType(MESSAGE_FRAG_COUNT, [
					FIELD_TYPE,
					FIELD_FRAG_COUNT
				]);
			},

			onJoinedRoom: function (roomInfo) {
				console.log('%cJoined room', 'color: green', roomInfo);
				ig.main('#canvas', MyGame, 60, 240, 160, 3);
			}
		});
		var gameRoom = new GameRoom('http://' + window.location.hostname + ':8034');


		// Start the Game with 60fps, a resolution of 320x240, scaled
		// up by a factor of 2
		ig.main('#canvas', MyGame, 60, 320, 240, 4, ig.LoaderExtended);

	});
