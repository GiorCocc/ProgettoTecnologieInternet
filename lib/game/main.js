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
		'impact.sound',
		'game.levels.testR',

		'game.entities.player',
		'game.entities.damage',
		'game.entities.weapon',
		'game.entities.remote-player',
		'game.entities.remote-weapon',
		'game.entities.item-blue',
		'game.entities.item-red',
		'game.entities.item-yellow',
		'plusplus.entities.pain',

		'game.ui.healthBar',
		'game.ui.usageBar',
		'game.ui.label',
		'plusplus.ui.ui-toggle-pause',
		'plusplus.ui.ui-meter',
		'plusplus.ui.ui-text',


		'game.events',
		// 'game.gameroom',
		'network.room-connection',

		'impact.timer',

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
			roomName: window.location.search.split("/")[0].slice(1),
			connection: null,
			player: null,
			remotePlayers: {},
			remoteWeapons: {},
			infoLabel: null,

			fragCount: 0,

			init: function () {
				this.parent();
				ig.music.add('media/Possible.ogg');


				ig.music.volume = 0.5;
				ig.music.play();
				ig.music.loop = true;


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

				// TODO: spostare spawn player qui e toglierlo dalla mappa
				this.spawnPlayer();

				// camera
				// ig.game.camera.follow(ig.game.player, false, false);
				// ig.game.camera.addAtmosphere(0, { alpha: 1, });
			},

			// TODO: creare questi metodi per la connessione
			playerDied: function (killerId) {
				var message = MessageBuilder.createMessage(MESSAGE_DIED);

				if (killerId) message.setKillerId(killerId);

				this.connection.broadcastMessage(message);
				this.spawnPlayer();
			},

			playerAttack: function () { },

			onUserLeave: function (user) {
				var remotePlayer = this.remotePlayers[user.userId];
				var remoteWeapon = this.remoteWeapons[user.userId];

				if (remotePlayer) {
					remotePlayer.kill();
					remoteWeapon.kill();

					delete this.remotePlayers[user.userId];
					delete this.remoteWeapons[user.userId];

					this.updateLabel('User ' + user.userId + ' left the room');
				}
			},

			onPeerMessage: function (message, user) {
				// console.log(this.remotePlayers);
				var remotePlayer = this.remotePlayers[user.userId];

				if (!remotePlayer && message.getType() === MESSAGE_STATE) {
					// log('%cCreated remote player for %d in pos', 'color: cyan;', user.userId, message.getX(), message.getY());
					remotePlayer = this.spawnRemotePlayer(user, message.getX(), message.getY());

					this.updateLabel('A new enemy has joined the room');
				}

				switch (message.getType()) {
					case MESSAGE_STATE:
						this.onPlayerState(remotePlayer, message);
						break;

					case MESSAGE_DIED:
						this.onPlayerDied(remotePlayer, message, user);
						break;

					case MESSAGE_SHOOT:
						this.onPlayerAttack(remotePlayer, message, user);
						break;

					case MESSAGE_COLLECT_WEAPON:
						this.onRemotePlayerCollectedWeapon(remotePlayer, message);
						break;

					case MESSAGE_FRAG_COUNT:
						this.onRemotePlayerFragCount(remotePlayer, message, user);
						break;
				}
			},

			spawnRemotePlayer: function (user, x, y) {
				// console.log('spawnRemotePlayer', user, x, y);
				this.remotePlayers[user.userId] = this.spawnEntity(EntityRemotePlayer, x, y, { name: user.userId });
				this.spawnRemotePlayerWeapon(user);
				return this.remotePlayers[user.userId];
			},

			spawnRemotePlayerWeapon: function (user) {
				var remotePLayer = this.remotePlayers[user.userId];
				var weaponX = remotePLayer.pos.x + 10;
				var weaponY = remotePLayer.pos.y;

				// console.log('spawnRemotePlayerWeapon', user.userId, weaponX, weaponY, remotePLayer);

				this.remoteWeapons[user.userId] = this.spawnEntity(EntityRemoteWeapon, weaponX, weaponY, { owner: remotePLayer });

				// console.log('remoteWeapons', this.remoteWeapons)

				return this.remoteWeapons[user.userId];
			},

			onPlayerState: function (remotePlayer, message) { remotePlayer.setState(message); },

			onPlayerDied: function (remotePlayer, message, user) {
				if (message.getKillerId() === this.connection.roomInfo.userId) {
					this.fragCount++;
					tjis.connection.broadcastMessage(MessageBuilder.createMessage(MESSAGE_FRAG_COUNT).setFragCount(this.fragCount));
					this.updateLabel('A soldier has been killed');
				}

				if (remotePlayer) remotePlayer.kill();

				delete this.remotePlayers[user.userId];
			},

			// TODO: da implementare
			onPlayerAttack: function () { },

			// TODO: da implementare
			onRemotePlayerCollectedWeapon: function () { },

			onRemotePlayerFragCount: function (message, user) {
				// TODO: scrivere in alto al centro il messaggio "Il giocatore X ha ucciso un giocatore"
			},

			// TODO: da implementare
			onPlayerCollectedWeapon: function () { },

			onWeaponCollect: function () { },

			// TODO: da implementare la barra della vita del giocatore e un pulsante per la condivisione della stanza di gioco
			initUI: function () {

				// health text label
				var healthLabel = ig.game.spawnEntity(ig.UILabel, 0, 0, {
					text: 'Health',
					margin: { x: 20, y: 20 },
				});

				// player health bar
				var healthBar = this.spawnEntity(ig.UIHealthBar, 0, 0, {});

				// health text label
				var weaponLabel = this.spawnEntity(ig.UILabel, 0, 0, {
					text: 'Weapon',
					margin: {
						x: 20,
						y: 45
					},
				});

				// weapon usage bar
				var weaponUsageBar = this.spawnEntity(ig.UIUsageBar, 0, 0, {});

				// information text label
				// TODO: creare una label per le informazioni sulla partita (join di giocatori, morti, ecc...)
				this.infoLabel = this.spawnEntity(ig.UILabel, 0, 0, {
					text: '',
					margin: {
						x: 600,
						y: 20
					},
				});

				// share button
				// TODO: share button con il link della stanza di gioco (link della pagina + ? + roomName). 
				// TODO: Inserire anche un pulsante per copiare il link negli appunti
				// TODO: inserire anche il qr code della stanza di gioco

				// info button
				// TODO: info button con le informazioni della stanza di gioco (numero di giocatori, nome della stanza, ecc...)
				// TODO: inserire anche i tasti della tastiera per giocare (WASD, freccette, ecc...)

				// room name label
				var roomNameLabel = this.spawnEntity(ig.UILabel, 0, 0, {
					text: 'Room name: ' + this.roomName,
					margin: { x: 20, y: 70 },
				});

				var userId = this.spawnEntity(ig.UILabel, 0, 0, {
					text: 'User id: ' + this.connection.roomInfo.userId,
					margin: { x: 20, y: 95 },
				});
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
				this.parent();

				this.camera.follow(this.getPlayer());

				this.broadcastState();

				this.playerOutOfBounds();

				this.checkPlayerDeath();

				this.collideWith();
			},

			updateLabel: function (message) {
				// display the message in the info label for 1 second
				this.infoLabel = this.spawnEntity(ig.UILabel, 0, 0, {
					text: message,
					margin: {
						x: 600,
						y: 20
					},
				});

				this.infoLabel.timer = new ig.Timer(1);
			},


			broadcastState: function () {
				this.connection.broadcastMessage(MessageBuilder.createMessage(MESSAGE_STATE)
					.setX(this.getPlayer().pos.x)
					.setY(this.getPlayer().pos.y)
					.setVelX((this.getPlayer().pos.x - this.getPlayer().last.x))
					.setVelY((this.getPlayer().pos.y - this.getPlayer().last.y))
					// TODO: aggiungere la direzione del movimento
					.setFlip(this.getPlayer().dx < 0 ? -1 : 1)
				);
	},

		// Method to check if the player is colliding with a kill entity
		collideWith: function () {
			// var player = this.getPlayer();
			// var timer = new ig.Timer(1);

			// if(player.collideWith(EntityDamage)) {
			// 	// write on the infoLabel the text "You died" for 1 second
			// 	console.log('You died');
			// 	this.updateLabels('You died');
			// }
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
			// new ig.Timer(2);
			this.player = ig.game.spawnEntity(EntityPlayer, 56, 146, {
				animSheet: new ig.AnimationSheet('media/sprites/'+window.location.search.split("/")[1]+'_.png', 32, 32),
				// flip: true,
				animInit: 'idle',
				// ? Animazioni di default: climb, stairs, jump, fall, moveX, moveY, Left, Right, Up, Down, idle
				animSettings: {
					idle: { sequence: [0, 1, 2, 3, 2, 1, 0], frameTime: 0.25 },
					move: { sequence: [8, 9, 10, 11, 16, 17, 18, 19], frameTime: 0.07 },
					jump: { sequence: [24, 25], frameTime: 1 },
					fall: { sequence: [27, 26, 58, 25, 24], frameTime: 0.4 },
					death: { sequence: [48, 49, 50, 51, 50, 51], frameTime: 0.2 },
					hit: { sequence: [48, 49, 50, 51, 50, 51], frameTime: 0.1 }
				},
			});
			ig.game.spawnEntity(UIHealthBar, 0, 0);
			// log("Player spawned");
		},

		spawnWeapon: function () {
			ig.game.spawnEntity(EntityWeapon, 56 - 10, 146, {
				animSheet: new ig.AnimationSheet('media/weapons/excalibur_.png', 32, 32),
				animSettings: { init: { frameTime: 1, sequence: [0] }, },
				usage: 5,
				maxUsage: 5,
			});
			ig.game.spawnEntity(UIUsageBar, 0, 0);
			// log("Weapon spawned");
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
			var weapon = this.getEntitiesByClass(EntityWeapon)[0];

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
		this.roomId = window.location.search.split("/")[0].slice(1);
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
		console.log('%cJoined room', 'color: yellow', roomInfo);
		ig.main('#canvas', MyGame, 60, 240, 160, 3);
	}
});
var gameRoom = new GameRoom('http://' + window.location.hostname + ':8034');


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main('#canvas', MyGame, 60, 320, 240, 4, ig.LoaderExtended);

	});
