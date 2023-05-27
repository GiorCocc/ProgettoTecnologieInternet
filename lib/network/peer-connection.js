ig.module(
  'network.peer-connection'
)
  .requires(
    'game.events'
  )
  .defines(function () {

    PeerConnection = Events.Emitter.extend({

      CHANNEL_NAME: 'data',

      // STUN servers for NAT traversal
      iceServers: [{
        url: 'stun:stun.l.google.com:19302'
      }],

      socket: null,
      isInitiator: false,
      dataChannelReady: false,
      peerConnection: null,
      dataChannel: null,
      remoteDescriptionReady: false,
      pendingCandidates: null,
      lastMessageOrd: null,

      
      
      init: function (socket, peerUser, isInitiator) {
        this.parent();

        this.socket = socket;
        this.peerUser = peerUser;
        this.isInitiator = isInitiator;
        this.pendingCandidates = [];
        this.peerHandlers = {
          'icecandidate': this.onLocalIceCandidate,
          'iceconnectionstatechange': this.onIceConnectionStateChanged,
          'datachannel': this.onDataChannel
        };
        this.dataChannelHandlers = {
          'open': this.onDataChannelOpen,
          'close': this.onDataChannelClose,
          'message': this.onDataChannelMessage
        };

        this.connect();
      },

      
      
      destroy: function () {
        this.parent();

        this.closePeerConnection();
      },

      
      
      connect: function () {
        this.peerConnection = new RTCPeerConnection({
          iceServers: this.iceServers
        });

        Events.listen(this.peerConnection, this.peerHandlers, this);

        if (this.isInitiator) {
          this.openDataChannel(
            this.peerConnection.createDataChannel(this.CHANNEL_NAME, {
              ordered: false
            }));
        }

        if (this.isInitiator) {
          this.setLocalDescriptionAndSend();
        }
      },

      
      
      // Close che data channel and remove all listeners from it
      closePeerConnection: function () {
        this.closeDataChannel();

        Events.unlisten(this.peerConnection, this.peerHandlers, this);

        if (this.peerConnection.signalingState !== 'closed') {
          this.peerConnection.close();
        }
      },

      
      
      // Setter for the data channel
      setSdp: function (sdp) {
        var self = this;
        // Create session description from sdp data
        var rsd = new RTCSessionDescription(sdp);
        // And set it as remote description for peer connection
        self.peerConnection.setRemoteDescription(rsd).then(function () {
            self.remoteDescriptionReady = true;

            self.log('Got SDP from remote peer', 'green');
            
            // Add all received remote candidates
            while (self.pendingCandidates.length) {
              self.addRemoteCandidate(self.pendingCandidates.pop());
            }

            // Got offer? send answer
            if (!self.isInitiator) {
              self.setLocalDescriptionAndSend();
            }
          });
      },

      
      // Used to set the local description of the peer connection and send it to the remote peer 
      setLocalDescriptionAndSend: function () {
        var self = this;

        self.getConnectionDescription()
          .then(function (localDescription) {
            self.peerConnection.setLocalDescription(localDescription)
              .then(function () {
                self.log('Sending SDP', 'green');

                self.sendSdp(self.peerUser.userId, localDescription);
              });
          })
          .catch(function (error) {
            self.log('onSdpError: ' + error.message, 'red');
          });
      },

      
      
      // If the first peer is initiator, he send the offer to the second peer
      getConnectionDescription: function () {
        return this.isInitiator ?
          this.peerConnection.createOffer() :
          this.peerConnection.createAnswer();
      },

      
      
      // Add ice candidate to the peer connection
      addIceCandidate: function (candidate) {
        if (this.remoteDescriptionReady) {
          this.addRemoteCandidate(candidate);
        } else {
          this.pendingCandidates.push(candidate);
        }
      },

      
      
      // Send ice candidate to the remote peer
      addRemoteCandidate: function (candidate) {
        try {
          this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));

          this.log('Added his ICE-candidate:' + candidate.candidate, 'gray');
        } catch (err) {
          this.log('Error adding remote ice candidate' + err.message, 'red');
        }
      },

      
      
      // When ice framework discoveres new ice candidate, we should send it
      // to opponent, so he knows how to reach us
      onLocalIceCandidate: function (event) {
        if (event.candidate) {
          this.log('Send my ICE-candidate: ' + event.candidate.candidate, 'gray');

          this.sendIceCandidate(this.peerUser.userId, event.candidate);
        } else {
          this.log('No more candidates', 'gray');
        }
      },

      
      
      // Connectivity has changed? For example someone turned off wifi
      onIceConnectionStateChanged: function (event) {
        this.log('Connection state: ' + event.target.iceConnectionState, 'green');
      },

      
      // The data channel is opened by the peer who is not initiator
      onDataChannel: function (event) {
        if (!this.isInitiator) {
          this.openDataChannel(event.channel);
        }
      },

      
      
      // Assign the data channel and listen for events from it
      openDataChannel: function (dataChannel) {
        this.dataChannel = dataChannel;
        Events.listen(this.dataChannel, this.dataChannelHandlers, this);
      },

      
      
      // Close the data channel and unlisten all events from it
      closeDataChannel: function () {
        Events.unlisten(this.dataChannel, this.dataChannelHandlers, this);
        this.dataChannel.close();
      },

      
      
      // Send message to the remote peer over the data channel
      sendMessage: function (message) {
        if (!this.dataChannelReady) {
          return;
        }

        this.dataChannel.send(message);
      },

      
      
      onDataChannelOpen: function () {
        this.dataChannelReady = true;

        this.emit('open');
      },

      
      
      onDataChannelMessage: function (event) {
        this.emit('message', MessageBuilder.deserialize(event.data));
      },

      
      
      onDataChannelClose: function () {
        this.dataChannelReady = false;

        this.emit('closed');
      },

      
      
      sendSdp: function (userId, sdp) {
        this.socket.emit('sdp', {
          userId: userId,
          sdp: sdp
        });
      },

      
      
      sendIceCandidate: function (userId, candidate) {
        this.socket.emit('ice_candidate', {
          userId: userId,
          candidate: candidate
        });
      },

      
      
      // Method to log messages to the console in different colors
      // red -> error
      // green -> connection state
      // gray -> info
      log: function (message, color) {
        console.log('%c[Peer-%d, %s] %s', 'color:' + color, this.peerUser.userId, this.peerConnection.signalingState, message);
      }
    });

  });
