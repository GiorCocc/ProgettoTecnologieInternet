// TODO: creata ma non ancora implementata nel gioco
// La classe è stata essa in un file a parte rispetto al progetto originale. 
// Se qualcosa non funziona, provare a rimetterla nel file main.js

ig.module(
  'game.gameroom'
)
  .define(function () {

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

    GameRoom = ig.Class.extend({
      roomId: null,
      roomName: null,
      socket: null,

      init: function (socketURL) {
        this.roomId = window.location.search.slice(1);
        this.registerMessages();
        this.socket = io(socketURL);
        this.roomConnection = new RoomConnection(this.roomId, this.socket);
        this.roomConnection.on('joined', this.onClientJoinedRoom, this);
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

      onClientJoinedRoom: function () {
        console.log("%c Joined room", "color: red", roomInfo);
        ig.main('#canvas', Game, 60, 640, 480, 1);
      },
    });

    var gameRoom = new GameRoom('http://' + window.location.hostname + ':6666');
  });