var PORT = 8034;
var MAX_ROOM_USERS = 5;

var fs = require('fs');
var io = require('socket.io')(PORT);

var rooms = {};
var lastUserId = 0;
var lastRoomId = 0;

var MessageType = {
  JOIN: 'join',
  DISCONNECT: 'disconnect',

  // Room related
  ROOM: 'room',

  // User related
  USER_JOIN: 'user_join',
  USER_READY: 'user_ready',
  USER_LEAVE: 'user_leave',

  // Communication related
  SDP: 'sdp',
  ICE_CANDIDATE: 'ice_candidate',

  // Error related
  ERROR_ROOM_IS_FULL: 'error_room_is_full',
  ERROR_USER_INITIALIZED: 'error_user_initialized'
};

function User() { this.userId = ++lastUserId; }

User.prototype = {
  getId: function() { return this.userId; }
};

function Room(name) {
  this.roomName = name;
  this.users = [];
  this.sockets = {};
}

Room.prototype = {
  getName: function() {
    return this.roomName;
  },

  getUsers: function() {
    return this.users;
  },

  getUserById: function(id) {
    return this.users.find(function(user) { return user.getId() === id; });
  },

  numUsers: function() {
    return this.users.length;
  },

  isEmpty: function() {
    return this.users.length === 0;
  },

  addUser: function(user, socket) {
    this.users.push(user);
    this.sockets[user.getId()] = socket;
  },

  removeUser: function(id) {
    this.users = this.users.filter(function(user) { return user.getId() !== id; });
    delete this.sockets[id];
  },

  sendTo: function(user, message, data) {
    var socket = this.sockets[user.getId()];
    socket.emit(message, data);
  },

  sendToId: function(userId, message, data) {
    return this.sendTo(this.getUserById(userId), message, data);
  },

  broadcastFrom: function(fromUser, message, data) {
    this.users.forEach(function(user) {
      if (user.getId() !== fromUser.getId()) {
        this.sendTo(user, message, data);
      }
    }, this);
  }
};

// socket
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
      room.sendTo(user, MessageType.ERROR_USER_INITIALIZED);
      return;
    }

    // Let's get a room, or create if none still exists
    room = getOrCreateRoom(joinData.roomName);
    if (room.numUsers() >= MAX_ROOM_USERS) {
      room.sendTo(user, MessageType.ERROR_ROOM_IS_FULL);
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
    room.broadcastFrom(user, MessageType.USER_JOIN, {
      userId: user.getId(),
      users: room.getUsers()
    });

    console.log('User %s joined room %s. Users in room: %d', user.getId(), room.getName(), room.numUsers());
  }

  function getOrCreateRoom(name) {
    var room;

    // if the room name is not specified, create a new one
    if (!name) {
      name =  ++lastRoomId + '_room';
    }

    // if the room does not exist, create a new one
    if (!rooms[name]) {
      room = new Room(name);
      rooms[name] = room;
    }

    return rooms[name];
  }

  function onLeave() {
    if (room === null) return;

    room.removeUser(user.getId());  // remove user from room

    console.log('User %d left room %s. Users in room: %d', user.getId(), room.getName(), room.numUsers());

    // if there are no users left, the room is no longer needed
    if (room.isEmpty()) {
      console.log('Room is empty - dropping room %s', room.getName());
      delete rooms[room.getName()];
    }

    // notify others of a user left
    room.broadcastFrom(user, MessageType.USER_LEAVE, { userId: user.getId() });
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