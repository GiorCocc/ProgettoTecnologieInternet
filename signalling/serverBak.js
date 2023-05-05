var PORT = 1234;
var MAX_NUMBER_OF_USERS_PER_ROOM = 10;

var fs = require('fs');
var io = require('socket.io')(PORT);

var rooms = {};
var lastUserId = 0;
var lastRoomId = 0;

var MessageType = {
  JOIN: 'join',
  DISCONNECT: 'disconnect',
  ROOM: 'room',
  USER_JOIN: 'user_join',
  USER_READY: 'user_ready',
  USER_LEAVE: 'user_leave',
  SDP: 'sdp',
  ICE_CANDIDATE: 'ice_candidate',
  ERROR_ROOM_FULL: 'error_room_full',
  ERROR_USER_INIT: 'error_user_init',
};

function User() { this.userId = ++lastUserId; }

User.prototype = {
  getId: function () { return this.userId; },
};

function Room(name) {
  this.roomName = name;
  this.users = [];
  this.sockets = {};
}

Room.prototype = {
  getName: function () { return this.roomName; },
  getUsers: function () { return this.users; },
  getUserById: function (userId) {
    return this.users.find(function (user) { 
      return user.getId() === userId; 
    });
  },
  numberOfUsers: function () { return this.users.length; },
  isEmpty: function () { return this.numberOfUsers() === 0; },
  addUser: function (user, socket) {
    this.users.push(user);
    this.sockets[this.users.getId()] = socket;
  },
  removeUser: function (userId) {
    this.users = this.users.filter(function (user) {
      return user.getId() !== userId;
    });
    delete this.sockets[userId];
  },
  sendTo: function (users, message, data) {
    var socket = this.sockets[users.getId()];
    if (socket) {
      socket.emit(message, data);
    }
  },
  sendToId: function (userId, message, data) { return this.sendTo(this.getUserById(userId), message, data); },
  broadcast: function (fromUser, message, data) {
    this.users.forEach(function (user) {
      if (user.getId() !== fromUser.getId()) {
        this.sendTo(user, message, data);
      }
    }, this);
  },
};

function handleSocket(socket) {
  var user = null;
  var room = null;

  socket.on(MessageType.JOIN, onJoin);
  socket.on(MessageType.SDP, onSdp);
  socket.on(MessageType.ICE_CANDIDATE, onIceCandidate);
  socket.on(MessageType.DISCONNECT, onLeave);

  function onJoin(joinData) {
    // Somehow sent join request twice?
    if (user !== null || room !== null) {
      room.sendTo(user, MessageType.ERROR_USER_INIT);
      return;
    }

    // Let's get a room, or create if none still exists
    room = getOrCreateRoom(joinData.roomName);
    if (room.numUsers() >= MAX_NUMBER_OF_USERS_PER_ROOM) {
      room.sendTo(user, MessageType.ERROR_ROOM_FULL);
      return;
    }

    // Add a new user
    room.addUser(user = new User(), socket);

    // Send room info to new user
    room.sendTo(user, MessageType.ROOM, {
      userId: user.getId(),
      roomName: room.getName(),
      users: room.getUsers()
    });

    // Notify others of a new user joined
    room.broadcast(user, MessageType.USER_JOIN, {
      userId: user.getId(),
      users: room.getUsers()
    });

    console.log('User %s joined room %s. Users in room: %d', user.getId(), room.getName(), room.numUsers());
  }

  function getOrCreateRoom(name) {
    var room;
    if (!name) name = ++lastRoomId + '_room';
    if (!rooms[name]) {
      room = new Room(name);
      rooms[name] = room;
    }

    return rooms[name];
  }

  function onLeave() {
    if (room === null) return;

    room.removeUser(user.getId());

    console.log('User %d left room %s. Users in room: %d', user.getId(), room.getName(), room.numUsers());

    if (room.isEmpty()) {
      console.log('Room is empty - dropping room %s', room.getName());
      delete rooms[room.getName()];
    }

    room.broadcast(user, MessageType.USER_LEAVE, { userId: user.getId() });
  }

  function onSdp(message) {
    room.sendToId(message.userId, MessageType.SDP, {
      userId: user.getId(),
      sdp: message.sdp
    });
  }

  function onIceCandidate(message) {
    room.sendToId(message.userId, MessageType.ICE_CANDIDATE, {
      userId: user.getId(),
      candidate: message.candidate
    });
  }
}

io.on('connection', handleSocket);
console.log('Running room server on port %d', PORT);