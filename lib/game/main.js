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

		// Messages
		var MESSAGE_STATE = 0;
		var MESSAGE_DIED = 2;
		var MESSAGE_ATTACK = 3;
		var MESSAGE_COLLECT_ITEM = 4;
		var MESSAGE_FRAG_COUNT = 5;

		// SpawnPoints
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

			// lighting and shadows settings
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
			itemQueue: [],

			fragCount: 0,
			fragLabel: null,



			init: function () {
				this.parent();

				// Music
				ig.music.add('media/Possible.ogg');
				ig.music.volume = 0.5;
				ig.music.play();
				ig.music.loop = true;

				// Item timer
				this.timerItem = new ig.Timer(30);

				// Create connection
				this.connection = gameRoom.roomConnection;
				this.connectionHandlers = {
					'peer_message': this.onPeerMessage,
					'user_leave': this.onUserLeave
				};
				Events.on(this.connection, this.connectionHandlers, this);

				// Initialize main level
				this.loadLevel(ig.global.LevelTestR);

				// Atmosphere
				ig.game.camera.addAtmosphere(0, { alpha: 1, });

				// Load UI
				this.windowWidth = window.innerWidth;
				this.windowHeight = window.innerHeight;
				this.initUI();

				// Spawn player and weapon
				this.spawnPlayer();
				this.spawnWeapon();
			},



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
				this.infoLabel = this.spawnEntity(ig.UIInformations, 0.5, 0, { text: '' });

				// room name label
				this.spawnEntity(ig.UILabel, 0, 0, {
					text: 'Room name: ' + this.roomName,
					margin: { x: 20, y: 70 },
				});

				// user id label
				this.spawnEntity(ig.UILabel, 0, 0, {
					text: 'User id: ' + this.connection.roomInfo.userId,
					margin: { x: 20, y: 85 },
				});

				// frag count label
				// this.fragLabel = this.spawnEntity(ig.UILabel, 0, 0, {
				// 	text: 'Frag count: ' + this.fragCount,
				// 	margin: { x: 20, y: 100 },
				// });

				// player health bar
				this.spawnEntity(ig.UIHealthBar, 0, 0, {});

				// weapon usage bar
				this.spawnEntity(ig.UIUsageBar, 0, 0, {});

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



			// Bind input keys
			inputStart: function () {
				this.parent();

				// arrow keys (other keys are binded by default)
				ig.input.bind(ig.KEY.UP_ARROW, 'jump');

				// WASD (other keys are binded by default)
				ig.input.bind(ig.KEY.W, 'jump');

				// ability keys
				ig.input.bind(ig.KEY.C, 'attack');
			},



			// Unbind input keys
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



			// Refresh UI elements when window size changes
			refreshUI: function () {
				var windowWidth = window.innerWidth;
				var windowHeight = window.innerHeight;

				if (windowWidth === this.windowWidth || windowHeight === this.windowHeight)
					return;

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



			// Send the player's death to other peer in the room
			playerDied: function (killerId) {
				var message = MessageBuilder.createMessage(MESSAGE_DIED);

				if (killerId)
					message.setKillerId(killerId);

				this.connection.broadcastMessage(message);

				// respawn the player in a new position
				this.spawnPlayer();
			},



			// comunnicate to other peers that a user left the room
			onUserLeave: function (user) {
				var remotePlayer = this.remotePlayers[user.userId];
				var remoteWeapon = this.remoteWeapons[user.userId];

				// remove remote player and his weapon
				if (remotePlayer) {
					remotePlayer.kill();
					remoteWeapon.kill();

					delete this.remotePlayers[user.userId];
					delete this.remoteWeapons[user.userId];

					this.updateLabel('User ' + user.userId + ' left the room');
				}
			},



			onPeerMessage: function (message, user) {
				var remotePlayer = this.remotePlayers[user.userId];
				var remoteWeapon = this.remoteWeapons[user.userId];

				// if the message is a STATE and there is no remote player, spawn a new one
				if (!remotePlayer && message.getType() === MESSAGE_STATE) {
					remotePlayer = this.spawnRemotePlayer(user, message.getX(), message.getY());

					this.updateLabel('A new enemy has joined the room');
				}

				// based on the message type, call the appropriate method to handle it
				switch (message.getType()) {
					case MESSAGE_STATE:
						this.onPlayerState(remotePlayer, message);
						break;
					case MESSAGE_DIED:
						this.onPlayerDied(remotePlayer, message, user);
						break;
					case MESSAGE_ATTACK:
						this.onPlayerAttack(remoteWeapon, message);
						break;
					case MESSAGE_COLLECT_ITEM:
						this.onRemotePlayerCollectedItem(remotePlayer, message);
						break;
					case MESSAGE_FRAG_COUNT:
						this.onRemotePlayerFragCount(remotePlayer, message, user);
						break;
				}
			},


			// When the message is a STATE, update the remote player's position
			onPlayerState: function (remotePlayer, message) {
				remotePlayer.setState(message);
			},



			// When the message is an ATTACK, attack with the remote player's weapon
			onPlayerAttack: function (remoteWeapon, message) {
				remoteWeapon.attack(message);
				remoteWeapon.setHasPlayerAttacked(true);
			},



			// When the message is a DIED, kill the remote player and his weapon
			onPlayerDied: function (remotePlayer, message, user) {
				if (message.getKillerId() === this.connection.roomInfo.userId) {
					this.fragCount++;

					this.connection.broadcastMessage(MessageBuilder.createMessage(MESSAGE_FRAG_COUNT).setFragCount(this.fragCount));

					this.updateLabel('A soldier has been killed');
					this.fragLabel.setText('Frag count: ' + this.fragCount);
				}

				if (remotePlayer)
					remotePlayer.kill();
				if (this.remoteWeapons[user.userId])
					this.remoteWeapons[user.userId].kill();

				delete this.remotePlayers[user.userId];
				delete this.remoteWeapons[user.userId];
			},



			// When the message is a COLLECT_ITEM, collect the item
			onRemotePlayerCollectedItem: function (remotePlayer, message) {
				this.onItemCollected(message.getWeaponId());
			},



			// When the message is a FRAG_COUNT, update the frag count
			onRemotePlayerFragCount: function (message, user) {
				this.updateLabel('The player ' + user.userId + ' has killed a soldier');
			},



			// Send a COLLECT_ITEM message to the server when the player collects an item
			onPlayerCollectedItem: function (item) {
				this.connection.broadcastMessage(MessageBuilder.createMessage(MESSAGE_COLLECT_ITEM).setWeaponId(item.itemId));
				this.onItemCollected(item.itemId);
			},



			// When the player collects an item, remove it from the game
			onItemCollected: function (itemId) {
				var item = ig.game.getEntitiesByClass(EntityItemBlue).find(function (item) { return item.itemId === itemId; }) ||
					ig.game.getEntitiesByClass(EntityItemRed).find(function (item) { return item.itemId === itemId; }) ||
					ig.game.getEntitiesByClass(EntityItemYellow).find(function (item) { return item.itemId === itemId; });

				// remove the item from the game
				if (item) {
					item.kill();

					this.itemQueue.push(item);
				}
			},



			update: function () {
				this.parent();

				this.camera.follow(this.getPlayer());

				this.broadcastState();

				this.playerOutOfBounds();
				this.checkPlayerDeath();
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
				if (this.timerItem && this.timerItem.delta() > 0) {
					while (this.itemQueue.length > 0) {
						var item = this.itemQueue.pop();
						ig.game.spawnEntity(item.constructor, item.pos.x, item.pos.y, { itemId: item.itemId });
					}

					this.timerItem.reset();
				}
			},



			updateLabel: function (message) {
				this.infoLabel = this.spawnEntity(ig.UIInformations, 0, 0, {
					text: message,
				});

				this.infoLabel.text = message;

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



			// Method to check if the player is dead (health <= 0)
			checkPlayerDeath: function () {
				var player = this.getPlayer();
				var weapon = this.getEntitiesByClass(EntityWeapon)[0];

				if (player.health <= 0) {
					this.removePlayer();

					if (weapon)
						weapon.kill();
				}
			},



			playerAttack: function () {
				var isFlip = this.player.flip;
				var x = this.player.pos.x + (isFlip ? -3 : 5);
				var y = this.player.pos.y + 6;

				// send a message to the server to broadcast the attack
				this.connection.broadcastMessage(MessageBuilder.createMessage(MESSAGE_ATTACK)
					.setX(x)
					.setY(y)
					.setVelX((this.getPlayer().pos.x - this.getPlayer().last.x))
					.setVelY((this.getPlayer().pos.y - this.getPlayer().last.y))
					.setFlip(this.getPlayer().dx < 0 ? -1 : 1)

				);
			},



			draw: function () {
				this.parent();
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

				// spawn the remote player
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

				this.remoteWeapons[user.userId] = this.spawnEntity(EntityRemoteWeapon, weaponX, weaponY, {
					owner: remotePLayer
				});

				return this.remoteWeapons[user.userId];
			},



			spawnPlayer: function () {
				var randomIndex = Math.floor(Math.random() * 8);

				// spawn the player with the sprite selected by the user
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



			setWeaponTimer: function (seconds) {
				this.timerWeapon = new ig.Timer(seconds);
			},



			// Method to check if the player is out of the map
			playerOutOfBounds: function () {
				var player = this.getPlayer();
				var weapon = this.getEntitiesByClass(EntityWeapon)[0];

				if (player.pos.x < 0 ||
					player.pos.x > this.collisionMap.pxWidth ||
					player.pos.y < 0 ||
					player.pos.y > this.collisionMap.pxHeight) {

					this.updateLabel('You fell out of the map');

					this.removePlayer();

					if (weapon) weapon.kill();


				}
			},
		});







		GameRoom = ig.Class.extend({
			roomId: null,
			roomConnection: null,
			socket: null,

			
			
			// create a room with the name passed as parameter and connect to it
			init: function (socketUrl) {
				this.roomId = window.location.search.split("/")[0].slice(1);

				this.registerMessages();

				this.socket = io(socketUrl);

				this.roomConnection = new RoomConnection(this.roomId, this.socket);
				this.roomConnection.on('joined', this.onJoinedRoom, this);
				this.roomConnection.connect();
			},

			
			
			// Definition of the messages that can be sent and received and the information they contain
			registerMessages: function () {
				MessageBuilder.registerMessageType(MESSAGE_STATE, [
					FIELD_TYPE,
					FIELD_X,
					FIELD_Y,
					FIELD_VEL_X,
					FIELD_VEL_Y,
					FIELD_FLIP
				]);

				MessageBuilder.registerMessageType(MESSAGE_DIED, [
					FIELD_TYPE,
					FIELD_KILLER_ID
				]);

				MessageBuilder.registerMessageType(MESSAGE_ATTACK, [
					FIELD_TYPE,
					FIELD_X,
					FIELD_Y,
					FIELD_VEL_X,
					FIELD_VEL_Y,
					FIELD_FLIP,
				]);

				MessageBuilder.registerMessageType(MESSAGE_COLLECT_ITEM, [
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

		ig.main('#canvas', MyGame, 60, 320, 240, 4, ig.LoaderExtended);

	});
