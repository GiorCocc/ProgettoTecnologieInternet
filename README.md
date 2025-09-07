<div align="center">
  <img src="./img/gameScreen.png" alt="Dungeon Castle Gameplay Screenshot" width="80%">
  <h1>🏰 Dungeon Castle 🏰</h1>
  <p>
    A real-time multiplayer RPG powered by <strong>WebRTC</strong> and the <strong>ImpactJS</strong> game engine.
  </p>
  <p>
    Created for the Internet Technologies course at the University of Parma by:<br>
    <strong>Giorgio Coccapani</strong> (<a href="https://github.com/GiorCocc">@GiorCocc</a>) & <strong>Riccardo Mazza</strong> (<a href="https://github.com/sirMallet">@sirMallet</a>)
  </p>
</div>

## ✨ Features

-   **⚔️ Real-Time Multiplayer**: Dive into battle with support for up to 5 players in the same game room.
-   **🌐 Peer-to-Peer Networking**: Experience low-latency gameplay through direct communication between players using cutting-edge WebRTC technology.
-   **🛡️ Multiple Character Classes**: Choose your hero from 6 legendary characters: Arthur Pendragon, Merlin, King Fisher, Lancelot, Guinevere, and The Lady of the Lake.
-   **🗺️ Dynamic Gameplay**: Explore a medieval castle, collect powerful items, and engage in fast-paced sword combat.
-   **💻 Cross-Platform Compatibility**: Play seamlessly in any modern web browser that supports WebRTC. No downloads required!
-   **🚪 Room-Based Matchmaking**: Easily create or join game rooms with custom names to play with your friends.
-   **🔄 Real-Time State Synchronization**: Player positions, movements, and actions are flawlessly synchronized across all clients for a consistent game world.
-   **💎 Item Collection System**: Discover three types of collectible items (Life, Sword, Bonus) with unique effects to aid you in your quest.
-   **🤺 Combat & Respawn System**: Engage in a simple yet satisfying sword combat system. If you fall in battle, you'll automatically respawn at a random location to jump right back into the action!

## 📖 Table of Contents

-   [✨ Features](#-features)
-   [💻 System Requirements](#-system-requirements)
-   [🛠️ Technologies Used](#-technologies-used)
-   [📁 Project Structure](#-project-structure)
-   [🏰 The Game](#-the-game)
-   [🚀 Getting Started](#-getting-started)
-   [🔧 Technical Architecture](#-technical-architecture)
-   [🤔 Troubleshooting](#-troubleshooting)
-   [🚧 Known Issues and Limitations](#-known-issues-and-limitations)
-   [🤝 Contributing](#-contributing)
-   [📜 License](#-license)
-   [💖 Acknowledgements](#-acknowledgements)

## 💻 System Requirements

### Minimum Requirements

-   **Operating System**: Windows 10, macOS 10.14, or Ubuntu 18.04 (or a similar Linux distro) 🐧
-   **Node.js**: Version 12.0 or higher 🟢
-   **npm**: Version 6.0 or higher (comes with Node.js) 📦
-   **RAM**: At least 4GB (8GB is recommended for development) 💾
-   **Network**: A stable internet connection for the initial setup and a local WiFi network for P2P gameplay. 🌐

### Browser Support

The game requires a modern web browser with native support for:
-   **WebRTC**: For peer-to-peer communication.
-   **WebAudio API**: For immersive game sounds and music.
-   **Canvas API**: For rendering all the game's graphics.
-   **WebSockets**: For communicating with the signaling server.
-   **ES6+ JavaScript**: For modern language features.

We recommend using the latest versions of **Chrome** or **Firefox** for the best experience.

### Development Requirements

For development and contributing to the project:
- **Git**: For version control
- **Code Editor**: VS Code, WebStorm, or similar with JavaScript support
- **Browser Developer Tools**: For debugging and testing

## 🛠️ Technologies Used

This project is built on a foundation of powerful open-source technologies.

### Core Technologies 🚀
-   **[Node.js](https://nodejs.org/)**: Powers the server-side signaling mechanism.
-   **[WebRTC](https://webrtc.org/)**: The core of our real-time, peer-to-peer networking.
-   **HTML5 Canvas**: Renders the game world and all its entities.
-   **JavaScript (ES6+)**: The primary language for all game logic.

### Game Engine & Libraries 🎮
-   **[ImpactJS](https://impactjs.com/)**: A fantastic 2D game engine for HTML5.
-   **[Impact++](https://collinhover.github.io/impactplusplus/)**: An extension library that adds powerful features to ImpactJS.
-   **Weltmeister**: The integrated level editor used to build our castle map.

### Networking & Development 📡
-   **[Socket.io](https://socket.io/)**: Manages real-time, bidirectional communication with the signaling server.
-   **[http-server](https://www.npmjs.com/package/http-server)**: A simple, zero-configuration server to host the game files locally.
-   **npm**: The package manager for all our Node.js dependencies.
-   **Git**: Used for version control and collaboration.

## 📁 Project Structure

The project is organized into several key directories to keep the code clean and manageable.

```text
.
├── lib/                          # 📚 Core game libraries and modules
│   ├── game/                     # 🎮 Game-specific code and logic
│   │   ├── entities/             # 🤺 Game entities (players, items, etc.)
│   │   ├── levels/               # 🗺️ Game level definitions
│   │   ├── ui/                   # 📊 User interface components
│   │   ├── main.js               # 🚀 Main game initialization loop
│   │   └── ...
│   ├── impact/                   # 💥 ImpactJS game engine core
│   ├── plusplus/                 # ✨ Impact++ extension library
│   ├── network/                  # 🌐 Networking and P2P logic
│   └── ...
├── media/                        # 🎨 Game assets (sprites, sounds, music)
├── img/                          # 🖼️ Website and documentation images
├── signalling/                   # 🚦 WebRTC signaling server
│   └── server.js                 #  NodeJS server implementation
├── index.html                    # 📝 Character selection & room creation page
├── entry.html                    # 🕹️ Main game canvas page
├── package.json                  # 📦 Node.js dependencies and scripts
└── README.md                     # 📄 You are here!
```

-   **`lib/`**: Contains all the source code. The `game/` folder holds our custom logic, while `impact/` and `plusplus/` contain the game engine libraries. The `network/` directory manages all the WebRTC complexity.
-   **`media/`**: All multimedia assets live here, including sprites, sound effects, and music.
-   **`signalling/`**: This holds the simple Node.js server that helps players find each other before establishing a direct P2P connection.

## 🏰 The Game

### The Story

Your castle has been overrun by a demonic force, turning your loyal army against you! As a legendary hero of the realm, your mission is to explore the cursed halls, defeat the corrupted soldiers, and reclaim your stronghold.

### How to Play

![Character Selection](./img/index.png)

When you first launch the game, you'll land on the character selection screen. Here, you can choose your hero and enter a name for your game room.

**Playable Characters:**
-   Arthur Pendragon
-   Merlin
-   King Fisher
-   Lancelot
-   Guinevere
-   The Lady of the Lake

After creating a room, you'll be dropped into the castle at a random location. Explore the map to find three types of magical items:

-   ❤️ **Life**: Restores a portion of your health.
-   🗡️ **Sword**: Grants you an additional sword attack.
-   🌟 **Bonus**: A rare item that restores health AND gives you a sword attack!

### Game Controls

-   **Movement**: `WASD` or `↑↓←→`
-   **Attack**: `C`

### Inviting Friends

To add friends to your game, they simply need to enter the exact same room name you created. For an even easier way, click the "Copy URL" button in the top-right corner of the game screen. This will copy a direct link to your room that you can share with up to 4 other players!

In-game, all other players will appear as corrupted soldiers. You won't know which hero is behind each helmet, adding to the chaotic fun. Attack and be attacked, and if your health runs out, you'll respawn at a new location to continue the fight!

## 🚀 Getting Started

Ready to play? Follow these steps to get Dungeon Castle running on your local machine.

### Prerequisites

First, ensure you have **[Node.js](https://nodejs.org/)** (which includes npm) installed on your system. You can verify this by opening a terminal and running:

```bash
node --version
npm --version
```

### Installation and Launch

1.  **Clone or Download the Repository**
    ```bash
    git clone https://github.com/GiorCocc/ProgettoTecnologieInternet.git
    cd ProgettoTecnologieInternet
    ```
    Alternatively, you can download the project as a ZIP file and extract it.

2.  **Install Dependencies**
    In the project directory, run the following command to install the required Node.js packages:
    ```bash
    npm install
    ```

3.  **Start the Servers**
    You need to run two servers simultaneously in separate terminal windows.

    -   **Terminal 1: Start the Signaling Server**
        This server helps players discover each other.
        ```bash
        npm run signalling
        ```

    -   **Terminal 2: Start the HTTP Server**
        This server hosts the game files for your browser.
        ```bash
        npm run http
        ```

4. **Run the servers**
    To start the game you need to run the following commands in two different terminals:

    ```bash
    node signalling/server.js
    http-server -c-1 . -p <port>
    ```

    where instead of <port> the port on which you want to start the http server must be inserted. In order to play in peer-to-peer mode both players must be connected under the same wifi network and connected to the ip address of the player who started the http server. To find out your ip address   , you can use the command ipconfig on Windows or ifconfig on Linux.

Within the signaling /server.js file it is possible to change the port on which you want to start the signaling server which by default is set to port 8034.

5.  **Play the Game!**
    Open your web browser and navigate to `http://localhost:8080`.

### Playing with Friends on a Local Network

To play with others on the same WiFi network, the host (the person who started the servers) needs to find their local IP address.

-   On **Windows**, open Command Prompt and type `ipconfig`.
-   On **macOS** or **Linux**, open a terminal and type `ifconfig` or `ip addr`.

Look for an "IPv4 Address" that looks something like `192.168.1.x`. Share this address with your friends, and they can connect by navigating to `http://YOUR_IP_ADDRESS:8080` in their browser.

## 🔧 Technical Architecture

Dungeon Castle uses a hybrid architecture that combines a client-server model for initial setup (signaling) with a peer-to-peer model for gameplay. This design minimizes latency by allowing players to send game data directly to each other.

### The Signaling Server

Before two players can connect directly via WebRTC, they need a way to find each other and exchange connection details (like IP addresses and session parameters). This is where the signaling server comes in.

1.  A player connects to the signaling server and joins a named "room."
2.  When a second player joins the same room, the server introduces them.
3.  The players then use the server as a middleman to trade `SDP` (Session Description Protocol) offers and answers, which contain the necessary metadata to establish a direct connection.
4.  To handle network address translation (NAT), the clients use a public **STUN** server (like Google's) to discover their public IP address and port.
5.  Once the connection details are exchanged, a direct **`RTCPeerConnection`** is established, and the signaling server is no longer needed for their communication.

```javascript
iceServers: [{
    url: 'stun:stun.l.google.com:19302'
  }],
```

To set up, monitor and close a connection, you use RTCPeerConnection and its connection lifecycle callbacks . The parameters required for the connection are:

- ` icecandidate `: for processing found peer
- ` iceconnectionstatechange `: to monitor the connection status
- ` datachannel `: for processing the data channel offered by RTCDataChannel . RTCDataChannel offers a series of events that describe the lifecycle of a data channel. Of these `open`, `close` and ` message ` are needed to open and close a channel and receive a message

```javascript
this.dataChannelHandlers = {
      'open': this.onDataChannelOpen,
      'close': this.onDataChannelClose,
      'message': this.onDataChannelMessage
    };
```

`createOffer` method offered by RTCPeerConnection is used to share the session parameters between the peers, and the ` createAnswer ` method to create the response. These methods are used within the lifecycle of the connection and are required for proper communication between peers to work.

The operations that are performed to identify the session parameters are as follows:

1. Peer A creates an SDP offer with a description of the local session and sends it to Peer B via a communication channel.

    ```javascript
    connect: function() {
        // ...
        if (this.isInitiator) {
          this.setLocalDescriptionAndSend();
        }
      },
    
    setLocalDescriptionAndSend: function() {
        var self = this;
        self.getDescription()
          .then(function(localDescription) {
            self.peerConnection.setLocalDescription(localDescription)
              .then(function() {
                self.log('Sending SDP', 'green');
                self.sendSdp(self.peerUser.userId, localDescription);
              });
          })
          .catch(function(error) {
            self.log('onSdpError: ' + error.message, 'red');
          });
      },
    
    getDescription: function() {
        return this.isInitiator ?
          this.peerConnection.createOffer() :
          this.peerConnection.createAnswer();
      },
    ```

2. Client B receives the offer from client A and sets up a description of the remote session, which represents the response to the received offer.

    ```javascript
    setSdp: function(sdp) {
        var self = this;
        // Create session description from sdp data
        var rsd = new RTCSessionDescription(sdp);
        // And set it as remote description for peer connection
        self.peerConnection.setRemoteDescription(rsd)
          .then(function() {
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
    ```

3. Once both peers have set their session descriptions, the connection is established and the peers can start exchanging data.

    ```javascript
    onLocalIceCandidate: function(event) {
        if (event.candidate) {
          this.log('Send my ICE-candidate: ' + event.candidate.candidate, 'gray');
          this.sendIceCandidate(this.peerUser.userId, event.candidate);
        } else {
          this.log('No more candidates', 'gray');
        }
      },
    ```

The information that is exchanged between the peers in the room is as follows:

``` javascript
  Another player joined. id = 2
  [Peer-2, have-remote-offer] Got SDP from remote peer
  [Peer-2, stable] Sending SDP
  [Peer-2, stable] Send my ICE-candidate: candidate:3352083459 1 udp 2113937151 2dc58a58-f3ff-490d-986b-cb3aee17f591.local 60083 typ host generation 0 ufrag qwsh network-cost 999
  [Peer-2, stable] Added his ICE-candidate:candidate:4047144073 1 udp 2113937151 a29cc1f6-6be4-4613-8178-0808e7f03199.local 60001 typ host generation 0 ufrag B6yE network-cost 999
  [Peer-2, stable] Connection state: checking
  [Peer-2, stable] No more candidates
  [Peer-2, stable] Connection state: connected
```

where `candidate` is a unique code assigned to the remote peer and ` typ ` is the type of connection being used. In this case, the connection type is `host` , which indicates that the remote peer is connected to the same network as the local peer. This is the simplest case, where the peers are connected to the same network and you don't need to use a TURN server to establish the connection. Otherwise, the connection type will be ` srflx ` or ` relay `, which indicates that the remote peer is connected to a different network and that a TURN server must be used to establish the connection. The ` udp ` entry indicates that the UDP protocol is used for communication between peers and information exchange.

### Information Exchange Between Players

Once a P2P connection is live, players broadcast their game state directly to everyone else in the room. This includes:

-   **Position & Velocity**: `(x, y)` coordinates and movement vectors.
-   **Actions**: Such as attacking or dying.
-   **State Changes**: Like flipping the character sprite or collecting an item.

```javascript
  broadcastState: function () {
    this.connection.broadcastMessage(MessageBuilder.createMessage(MESSAGE_STATE)
     .setX(this.getPlayer().pos.x)
     .setY(this.getPlayer().pos.y)
     .setVelX((this.getPlayer().pos.x - this.getPlayer().last.x))
     .setVelY((this.getPlayer().pos.y - this.getPlayer().last.y))
     .setFlip(this.getPlayer().dx < 0 ? -1 : 1)
    );
   },
```

To create a smooth experience despite network latency, the game uses **client-side interpolation**. Instead of teleporting remote players to their last known position, the game engine smoothly animates them from their old position to the new one based on their velocity. This prevents jerky movement and makes the gameplay feel more fluid.

```javascript
  setState: function (state) {
        var x = state.getX();
        var y = state.getY();

        this.dx = state.getVelX(); //x - this.pos.x;
        this.dy = state.getVelY(); //y - this.pos.y;

        this.pos = { x: x, y: y };

        this.stateUpdated = true;
      },

      update: function () {
        this.parent();
    
          if (this.stateUpdated) {
            this.stateUpdated = false;
          } else {
            this.pos.x += this.dx;
            this.pos.y += this.dy;

            if (this.currentAnim) {
              this.currentAnim.update();
            }
          }

          if(this.dx > 0){
            this.flip.x = false;
          } else if(this.dx < 0){
            this.flip.x = true;
          }
      }
```

## 🤔 Troubleshooting

Encountered an issue? Here are some common problems and their solutions.

-   **"Port already in use" error when starting a server.**
    -   Another application is using port `8080` or `8034`. You can either close the conflicting application or change the port in `package.json` and `signalling/server.js`.

-   **Cannot connect with friends on the same network.**
    -   Double-check that everyone is on the same WiFi network.
    -   Ensure the host has shared the correct local IP address (not `localhost`).
    -   Your firewall might be blocking the connection. Temporarily disable it to test, and if that works, add rules to allow traffic on ports `8080` and `8034`.

-   **Game runs slowly or is choppy.**
    -   Close other demanding applications or browser tabs.
    -   Ensure you are using a modern, hardware-accelerated browser like Chrome.
    -   A weak WiFi signal can cause lag. Try moving closer to your router.

-   **WebRTC connection fails to establish.**
    -   This can happen on very restrictive networks (like some corporate or university networks). Unfortunately, without a TURN server (which is not implemented), these networks may not work.

## 🚧 Known Issues and Limitations

-   **Local Network Only**: The game is designed for players on the same local network. It does not currently support playing over the internet without a VPN.
-   **No TURN Server**: For networks with very restrictive firewalls (Symmetric NAT), a direct P2P connection may fail. A TURN server would be needed to relay traffic, but is not implemented.
-   **State Desynchronization**: Under conditions of very high latency or packet loss, player states can temporarily desynchronize. A browser refresh usually fixes this.
-   **No In-Game Chat**: There is no built-in way to communicate with other players.
-   **Desktop Only**: The game requires a keyboard and is not designed for mobile or touch devices.

## 🤝 Contributing

We welcome contributions to Dungeon Castle! Whether you want to fix a bug, add a new feature, or improve the documentation, your help is appreciated.

1.  **Fork the Repository**: Create your own copy of the project.
2.  **Create a New Branch**: `git checkout -b feature/my-awesome-feature`
3.  **Make Your Changes**: Write your code and test it thoroughly.
4.  **Submit a Pull Request**: Push your branch to your fork and open a pull request with a clear description of your changes.

Please adhere to the existing code style and conventions. When in doubt, make your code look like the code around it.

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for full details.

### Third-Party Licenses

-   **Game Engine**: The project uses **ImpactJS** (Commercial License) and **Impact++** (MIT License).
-   **Art Assets**: Character and environment art are provided by artists under free-to-use licenses. Please see the Acknowledgements section for details.
-   **Libraries**: Other libraries like Socket.io and http-server are used under the MIT License.

## 💖 Acknowledgements

This game would not have been possible without the amazing work of the open-source community and talented artists.

-   A huge thank you to **[rottingpixels](https://rottingpixels.itch.io/)** for the beautiful [Castle Platformer Tileset](https://rottingpixels.itch.io/castle-platformer-tileset-16x16free).
-   Our heroes and weapons were brought to life by **[analogstudios](https://analogstudios.itch.io/)** with their fantastic [Camelot Character Set](https://analogstudios.itch.io/camelot).
-   All music and sound effects were composed by **[Riccardo Mazza](https://github.com/sirMallet)** using the wonderful tool [Bosca Ceoil](https://boscaceoil.net/).
