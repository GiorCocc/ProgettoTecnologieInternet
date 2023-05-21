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
		'plusplus.ui.ui-button',
		'plusplus.ui.ui-interactive',
		'game.ui.label',
		'plusplus.ui.ui-toggle-pause',
		'plusplus.ui.ui-meter',
		'plusplus.ui.ui-text',
		'plusplus.ui.ui-button',
		'game.ui.copyUrlButton',
		'game.ui.informations',

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
		//SpawnPoints
		var SpawnPoints = [
			[464, 160],
			[544, 48],
			[592, 48],
			[272, 208],
			[288, 112],
			[240, 112],
			[176, 96],
			[48, 256]
		];

		var ItemYellowPositions = [
			[40, 64], [608, 48]
		];
		var ItemBluePositions = [
			[176, 72], [80, 240], [276, 112], [336, 256], [488, 80], [564, 188], [432, 240]
		];
		var ItemRedPositions = [
			[16, 128], [368, 96], [336, 176], [164, 288], [436, 160], [96, 160], [496, 272], [576, 272], [624, 144]
		];

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
			timerWeapon: null,
			timerItem: null,
			windowWidth: null,
			windowHeight: null,

			fragCount: 0,

			init: function () {
				this.parent();
				ig.music.add('media/Possible.ogg');

				ig.music.volume = 0.5;
				ig.music.play();
				ig.music.loop = true;

				// item timer
				this.timerItem = new ig.Timer(30);

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
				this.windowWidth = window.innerWidth;
				this.windowHeight = window.innerHeight;
				this.initUI();

				// Spawn player and weapon
				this.spawnPlayer();
				this.spawnWeapon();

				// atmosphere
				// ig.game.camera.addAtmosphere(0, { alpha: 1, });
			},

			refreshUI: function () {
				var windowWidth = window.innerWidth;
				var windowHeight = window.innerHeight;

				if (windowWidth === this.windowWidth || windowHeight === this.windowHeight) return;

				// update window size
				this.windowWidth = windowWidth;
				this.windowHeight = windowHeight;

				// update UI elements
				var UIButton = ig.game.getEntitiesByClass(UICopyUrlButton)[0];
				UIButton.pos.x = windowWidth - 200;
				UIButton.pos.y = 20;

				var infoLabel = ig.game.getEntitiesByClass(ig.UILabel)[0];
				infoLabel.pos.x = windowWidth / 2 - 100;
				infoLabel.pos.y = 20;

			},

			playerDied: function (killerId) {
				var message = MessageBuilder.createMessage(MESSAGE_DIED);

				if (killerId) message.setKillerId(killerId);

				this.connection.broadcastMessage(message);
				this.spawnPlayer();
			},

			// TODO: da implementare
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
				var random = Math.floor(Math.random() * 3);
				var animSheet;

				// choose a random sprite for the remote player (lancelot, gawain, mordred)
				switch (random) {
					case 0:
						animSheet = new ig.AnimationSheet('media/sprites/lancelot_.png', 32, 32);
						break;
					case 1:
						animSheet = new ig.AnimationSheet('media/sprites/gawain_.png', 32, 32);
						break;
					case 2:
						animSheet = new ig.AnimationSheet('media/sprites/mordred_.png', 32, 32);
						break;
				}

				this.remotePlayers[user.userId] = this.spawnEntity(EntityRemotePlayer, x, y, {
					name: user.userId,
					animSheet: animSheet,
				});

				this.spawnRemotePlayerWeapon(user);
				return this.remotePlayers[user.userId];
			},

			spawnRemotePlayerWeapon: function (user) {
				var remotePLayer = this.remotePlayers[user.userId];
				var weaponX = remotePLayer.pos.x + 10;
				var weaponY = remotePLayer.pos.y;

				this.remoteWeapons[user.userId] = this.spawnEntity(EntityRemoteWeapon, weaponX, weaponY, { owner: remotePLayer });

				return this.remoteWeapons[user.userId];
			},

			onPlayerState: function (remotePlayer, message) { remotePlayer.setState(message); },

			onPlayerDied: function (remotePlayer, message, user) {
				if (message.getKillerId() === this.connection.roomInfo.userId) {
					this.fragCount++;
					this.connection.broadcastMessage(MessageBuilder.createMessage(MESSAGE_FRAG_COUNT).setFragCount(this.fragCount));
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
				this.updateLabel('The player ' + user.userId + ' has killed a soldier');
			},

			// TODO: da implementare
			onPlayerCollectedWeapon: function () { },

			onWeaponCollect: function () { },

			initUI: function () {
				// health text label
				ig.game.spawnEntity(ig.UILabel, 0, 0, {
					text: 'Health',
					margin: { x: 20, y: 20 },
				});

				// weapon text label
				this.spawnEntity(ig.UILabel, 0, 0, {
					text: 'Weapon',
					margin: { x: 20, y: 45 },
				});

				// information text label
				this.infoLabel = this.spawnEntity(ig.UIInformations, 0.5, 0, { text: 'Welcome to the game' });

				// room name label
				this.spawnEntity(ig.UILabel, 0, 0, {
					text: 'Room name: ' + this.roomName,
					margin: { x: 20, y: 70 },
				});

				this.spawnEntity(ig.UILabel, 0, 0, {
					text: 'User id: ' + this.connection.roomInfo.userId,
					margin: { x: 20, y: 95 },
				});

				// player health bar
				var healthBar = this.spawnEntity(ig.UIHealthBar, 0, 0, {});

				// weapon usage bar
				var weaponUsageBar = this.spawnEntity(ig.UIUsageBar, 0, 0, {});

				// share room link button
				var UIButton = ig.game.spawnEntity(UICopyUrlButton, 0, 0, {
					alwaysToggleActivate: true,
				});

				UIButton.onActivated.add(function () {
					// copy the window url to the clipboard
					var url = window.location.href.split('/')[2] + "/?" + ig.game.connection.roomInfo.roomName;
					console.log(url);

					var input = document.createElement('input');
					input.value = url;
					document.body.appendChild(input);
					input.select();
					document.execCommand('copy');
					document.body.removeChild(input);

					// show a message
					ig.game.updateLabel('Room url copied to clipboard');
				}, this);
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
				this.parent();

				this.camera.follow(this.getPlayer());

				this.broadcastState();

				this.playerOutOfBounds();

				this.checkPlayerDeath();

				this.collideWith();

				this.checkWeaponTimer();
				this.checkItemTimer();
			},

			checkWeaponTimer: function () {
				if (this.timerWeapon && this.timerWeapon.delta() > 0) {
					this.spawnWeapon();
					this.timerWeapon = null;
				}
			},

			checkItemTimer: function () {
				var yellowItems = this.getEntitiesByClass(EntityItemYellow);
				var blueItems = this.getEntitiesByClass(EntityItemBlue);
				var redItems = this.getEntitiesByClass(EntityItemRed);

				if (this.timerItem && this.timerItem.delta() > 0) {
					this.respawnItemByType(yellowItems, ItemYellowPositions, EntityItemYellow);
					this.respawnItemByType(blueItems, ItemBluePositions, EntityItemBlue);
					this.respawnItemByType(redItems, ItemRedPositions, EntityItemRed);

					this.timerItem.reset();
				}
			},

			respawnItemByType: function (itemSet, positionSet, entity) {
				if (itemSet.length < positionSet.length) {
					for (var i = 0; i < itemSet.length; i++) {
						ig.game.removeEntity(itemSet[i]);
					}

					for (var i = 0; i < positionSet.length; i++) {
						ig.game.spawnEntity(entity, positionSet[i][0], positionSet[i][1]);
					}
				}
			},

			updateLabel: function (message) {
				this.infoLabel = this.spawnEntity(ig.UILabel, 0, 0, {
					text: message,
					margin: { x: 600, y: 20 },
				});

				this.infoLabel.timer = new ig.Timer(1);
			},


			broadcastState: function () {
				this.connection.broadcastMessage(MessageBuilder.createMessage(MESSAGE_STATE)
					.setX(this.getPlayer().pos.x)
					.setY(this.getPlayer().pos.y)
					.setVelX((this.getPlayer().pos.x - this.getPlayer().last.x))
					.setVelY((this.getPlayer().pos.y - this.getPlayer().last.y))
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
				var weapon = this.getEntitiesByClass(EntityWeapon)[0];

				if (player.health <= 0) {
					this.removePlayer();
					if (weapon) weapon.kill();
				}
			},

			draw: function () {
				// Draw all entities and backgroundMaps
				this.parent();
			},

			spawnPlayer: function () {
				var randomIndex = Math.floor(Math.random() * 8);

				this.player = ig.game.spawnEntity(EntityPlayer, SpawnPoints[randomIndex][0], SpawnPoints[randomIndex][1], {
					animSheet: new ig.AnimationSheet('media/sprites/' + window.location.search.split("/")[1] + '_.png', 32, 32),
					animInit: 'idle',
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
			},

			spawnWeapon: function () {
				ig.game.spawnEntity(EntityWeapon, 56 - 10, 146, {
					animSheet: new ig.AnimationSheet('media/weapons/excalibur_.png', 32, 32),
					animSettings: { init: { frameTime: 1, sequence: [0] }, },
					usage: 5,
					maxUsage: 5,
				});
				ig.game.spawnEntity(UIUsageBar, 0, 0);
			},

			removePlayer: function () {
				var player = this.getPlayer();
				var playerhealthMeter = this.getEntitiesByClass(UIHealthBar)[0];

				this.removeEntity(player);
				this.removeEntity(playerhealthMeter);

				this.spawnPlayer();
			},

			setWeaponTimer: function (seconds) { this.timerWeapon = new ig.Timer(seconds); },

			// Method to check if the player is out of the map
			playerOutOfBounds: function () {
				var player = this.getPlayer();
				var weapon = this.getEntitiesByClass(EntityWeapon)[0];

				if (player.pos.x < 0 ||
					player.pos.x > this.collisionMap.pxWidth ||
					player.pos.y < 0 ||
					player.pos.y > this.collisionMap.pxHeight) {
					this.removePlayer();
					if (weapon) weapon.kill();

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
