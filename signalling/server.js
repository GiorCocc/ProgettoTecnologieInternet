/**
 * Room server
 * 
 * Activate the server by running the following command:
 *  node signalling\server.js
 * or 
 *  npm run signalling
 * 
 * The server will listen to port 8034 by default.
 */

// change this two variables to your liking
var PORT = 8034;        // port to listen to
var MAX_ROOM_USERS = 5; // maximum number of users in a room

var io = require('socket.io')(PORT);

var rooms = {};
var lastUserId = 0;

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



function User() {
  this.userId = ++lastUserId;
}



User.prototype = {
  getId: function () { return this.userId; }
};



function Room(name) {
  this.roomName = name;
  this.users = [];
  this.sockets = {};
}



Room.prototype = {

  getRoomName: function () { return this.roomName; },



  getUsers: function () { return this.users; },



  getUserById: function (id) {
    return this.users.find(function (user) {
      return user.getId() === id;
    });
  },



  numUsers: function () { return this.users.length; },



  isEmpty: function () { return this.users.length === 0; },



  addUser: function (user, socket) {
    this.users.push(user);
    this.sockets[user.getId()] = socket;
  },



  removeUser: function (id) {
    this.users = this.users.filter(function (user) {
      return user.getId() !== id;
    });

    delete this.sockets[id];
  },



  sendToUser: function (user, message, data) {
    var socket = this.sockets[user.getId()];
    socket.emit(message, data);
  },



  sendToUserById: function (userId, message, data) {
    return this.sendToUser(this.getUserById(userId), message, data);
  },



  broadcastMessageFromUser: function (fromUser, message, data) {
    this.users.forEach(function (user) {
      if (user.getId() !== fromUser.getId()) {
        this.sendToUser(user, message, data);
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
      room.sendToUser(user, MessageType.ERROR_USER_INITIALIZED);
      return;
    }

    // Get a room or create a new one if the room name is not specified
    room = getOrCreateRoom(joinData.roomName);

    // Check if the room is full
    if (room.numUsers() >= MAX_ROOM_USERS) {
      room.sendToUser(user, MessageType.ERROR_ROOM_IS_FULL);
      return;
    }

    // Add a new user
    room.addUser(user = new User(), socket);

    // Send room info to new user
    room.sendToUser(user, MessageType.ROOM, {
      userId: user.getId(),
      roomName: room.getRoomName(),
      users: room.getUsers()
    });

    // Notify others of a new user joined
    room.broadcastMessageFromUser(user, MessageType.USER_JOIN, {
      userId: user.getId(),
      users: room.getUsers()
    });

    console.log('User %s joined room %s. Users in room: %d', user.getId(), room.getRoomName(), room.numUsers());
  }



  function getOrCreateRoom(name) {
    var room;

    // if the room does not exist, create a new one
    if (!rooms[name]) {
      room = new Room(name);
      rooms[name] = room;
    }

    return rooms[name];
  }



  // When a user leaves the room
  function onLeave() {
    // if there is no room, do nothing
    if (room === null)
      return;

    room.removeUser(user.getId());  // remove user from room

    console.log('User %d left room %s. Users in room: %d', user.getId(), room.getRoomName(), room.numUsers());

    // if there are no users left, the room is no longer needed
    if (room.isEmpty()) {
      console.log('Room is empty - room %s will be deleted', room.getRoomName());
      delete rooms[room.getRoomName()];
    }

    // notify others of a user left
    room.broadcastMessageFromUser(user, MessageType.USER_LEAVE, {
      userId: user.getId()
    });
  }



  // When a user sends an SDP message
  function onSdp(message) {
    room.sendToUserById(message.userId, MessageType.SDP, {
      userId: user.getId(),
      sdp: message.sdp
    });
  }



  // When a user sends an ICE candidate message
  function onIceCandidate(message) {
    room.sendToUserById(message.userId, MessageType.ICE_CANDIDATE, {
      userId: user.getId(),
      candidate: message.candidate
    });
  }
}



io.on('connection', handleSocket);
console.log('Running room server on port %d', PORT);