ig.module(
  'network.room-connection'
)
  .requires(
    'game.events',
    'network.peer-connection'
  )
  .defines(function () {

    RoomConnection = Events.Emitter.extend({
      peers: null,
      socket: null,
      roomName: null,
      roomInfo: null,
      pendingSdp: null,
      pendidateCandidates: null,

      
      
      init: function (roomName, socket) {
        this.parent();

        this.socket = socket;
        this.roomName = roomName;

        this.pendingSdp = {};
        this.pendingCandidates = {};

        // socket event handlers
        this.socketHandlers = {
          'sdp': this.onSdp,
          'ice_candidate': this.onIceCandidate,
          'room': this.onJoinedRoom,
          'user_join': this.onUserJoin,
          'user_ready': this.onUserReady,
          'user_leave': this.onUserLeave,
          'error': this.onError
        };

        // peer connection event handlers
        this.peerConnectionHandlers = {
          'open': this.onPeerChannelOpen,
          'close': this.onPeerChannelClose,
          'message': this.onPeerMessage
        };

        // create an event emitter for each peer connection we have in the room
        Events.on(this.socket, this.socketHandlers, this);
      },

      
      
      // Method to destroy the room connection
      destroy: function () {
        this.parent();

        Events.off(this.socket, this.socketHandlers, this);
      },

      
      
      // Method that enables the user to join a room
      connect: function () { this.sendJoin(this.roomName); },

      
      
      // Method to initialize a peer connection with another user
      initPeerConnection: function (user, isInitiator) {
        var connection = new PeerConnection(this.socket, user, isInitiator);

        Events.on(connection, this.peerConnectionHandlers, this, connection, user);

        var userId = user.userId;

        // if we have a pending sdp for this room, add it to the connection
        var pendingSdp = this.pendingSdp[userId];
        if (pendingSdp) {
          connection.setSdp(pendingSdp);
          delete this.pendingSdp[userId];
        }

        // if we have pending candidates for this room, add them to the connection
        var pendingCandidates = this.pendingCandidates[userId];
        if (pendingCandidates) {
          pendingCandidates.forEach(connection.addIceCandidate, connection);

          delete this.pendingCandidates[userId];
        }

        return connection;
      },

      
      
      // When the user joins a room with SDP, send a message to the server to join the room
      onSdp: function (message) {
        var userId = message.userId;

        if (!this.peers[userId]) {
          this.log('Adding pending sdp from another player. id = ' + userId, 'gray');

          this.pendingSdp[userId] = message.sdp;

          return;
        }

        this.peers[userId].setSdp(message.sdp);
      },

      
      
      // When the user joins a room with Candidate, send a message to the server to join the room
      onIceCandidate: function (message) {
        var userId = message.userId;

        if (!this.peers[userId]) {
          this.log('Adding pending candidate from another player. id =' + userId, 'gray');

          if (!this.pendingCandidates[userId]) {
            this.pendingCandidates[userId] = [];
          }

          this.pendingCandidates[userId].push(message.candidate);

          return;
        }

        this.peers[userId].addIceCandidate(message.candidate);
      },

      
      
      // Method to handle when the user joins a room
      onJoinedRoom: function (roomInfo) {
        this.emit('joined', roomInfo);

        // room parameters
        this.roomInfo = roomInfo;
        this.peers = {};  // list of players in the room

        for (var k in this.roomInfo.users) {
          var user = this.roomInfo.users[k];

          // if the user is not us, create a peer connection with them
          if (user.userId !== this.roomInfo.userId) {
            this.peers[user.userId] = this.initPeerConnection(this.roomInfo.users[k], true);
          }
        }
      },

      
      
      // Error handler for when the user fails to connect to a room
      onError: function (error) { this.log('Error connecting to room' + error.message, 'red'); },

      
      
      // Method to handle when another user joins the room
      onUserJoin: function (user) {
        this.log('Another player joined. id = ' + user.userId, 'orange');

        var connection = this.initPeerConnection(user, false);

        this.roomInfo.users.push(user);
        this.peers[user.userId] = connection;
      },

      
      
      // Method to handle when another user is ready to play
      onUserReady: function (user) {
        this.log('Another player ready. id = ' + user.userId, 'orange');

        this.emit('user_ready', user);
      },

      
      
      // Channel related event handlers
      onPeerChannelOpen: function (peer, user) { this.emit('peer_open', user, peer); },
      
      
      onPeerChannelClose: function (peer, user) { this.emit('peer_close', user, peer); },
      
      
      onPeerMessage: function (peer, user, message) { this.emit('peer_message', message, user, peer); },

      
      
      // Method to handle when another user leaves the room
      onUserLeave: function (user) {
        if (!this.peers[user.userId]) 
          return;

        var connection = this.peers[user.userId];

        // unlisten all events from the connection
        Events.off(connection, this.peerConnectionHandlers, this);

        // close the connection
        connection.destroy();
        delete this.peers[user.userId];
        delete this.roomInfo.users[user.userId];

        this.emit('user_leave', user);
      },

      
      
      sendJoin: function (roomName) {
        this.socket.emit('join', { roomName: roomName });
      },

      
      
      sendLeave: function () {
        this.socket.emit(MessageType.LEAVE);
      },

      
      
      broadcastMessage: function (message) {
        this.broadcast(MessageBuilder.serialize(message));
      },

      
      
      sendMessageTo: function (userId, message) {
        var peer = this.peers[userId];
        this.peerSend(peer, MessageBuilder.serialize(message));
      },

      
      
      broadcast: function (arrayBuffer) {
        for (var p in this.peers) {
          this.peerSend(this.peers[p], arrayBuffer);
        }
      },

      
      
      peerSend: function (peer, data) {
        peer.sendMessage(data);
      },

      
      // Method to log messages to the console with a color
      // red -> error
      // orange -> important
      // gray -> info
      log: function (message, color) {
        console.log('%c%s', 'color:' + color, message);
      }


    });

  });
