# Dungeon Castle

Multiplayer RPG video game based on WebRTC and [ImpactJS](https://impactjs.com/) for the Internet Technologies course of the University of Parma created by [Giorgio Coccapani]( https://github.com/GiorCocc ) (serial number 317280) and [Riccardo Mazza](https://github.com/sirMallet ) (serial number 321655).

## Features

- **Real-time Multiplayer**: Support for up to 5 players in the same game room
- **Peer-to-Peer Networking**: Direct communication between players using WebRTC technology
- **Multiple Character Classes**: Choose from 6 different characters including Arthur Pendragon, Merlin, King Fisher, Lancelot, Guinevere, and The Lady of the Lake
- **Dynamic Gameplay**: Collect items, engage in combat, and explore a medieval castle environment
- **Cross-Platform Compatibility**: Runs in any modern web browser with WebRTC support
- **Room-based Matchmaking**: Create or join game rooms with custom names
- **Real-time State Synchronization**: Player positions, movements, and actions are synchronized across all clients
- **Item Collection System**: Three types of collectible items (Life, Sword, Bonus) with different effects
- **Combat System**: Sword-based combat with usage limits and regeneration mechanics
- **Respawn System**: Automatic respawning after player death with random positioning

## Index

- [Dungeon Castle](#dungeon-castle)
  - [Index](#index)
  - [Features](#features)
  - [System Requirements](#system-requirements)
  - [Technologies Used](#technologies-used)
  - [Project structure](#project-structure)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Step-by-step Installation](#step-by-step-installation)
    - [Development Setup](#development-setup)
  - [Structure of the game](#structure-of-the-game)
    - [Starting the game](#starting-the-game)
    - [The game](#the-game)
    - [Game commands](#game-commands)
    - [Adding new players](#adding-new-players)
  - [Technical Architecture](#technical-architecture)
    - [Signaling server](#signaling-server)
    - [Information exchanged between players](#information-exchanged-between-players)
    - [Game Engine Architecture](#game-engine-architecture)
    - [Networking Architecture](#networking-architecture)
  - [Troubleshooting](#troubleshooting)
  - [Known Issues and Limitations](#known-issues-and-limitations)
  - [Contributing](#contributing)
  - [License](#license)
  - [References and credits](#references-and-credits)

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10, macOS 10.14, or Ubuntu 18.04 (or equivalent Linux distribution)
- **Node.js**: Version 12.0 or higher
- **npm**: Version 6.0 or higher (usually comes with Node.js)
- **Web Browser**: 
  - Chrome 60+ (recommended)
  - Firefox 55+
  - Safari 11+
  - Edge 79+
- **RAM**: At least 4GB (8GB recommended for development)
- **Network**: Stable internet connection for signaling server, WiFi network for local P2P gameplay

### Browser Requirements

The game requires a modern web browser with support for:
- **WebRTC**: For peer-to-peer communication
- **WebAudio API**: For game sounds and music
- **Canvas API**: For game rendering
- **WebSockets**: For signaling server communication
- **ES6 Features**: Arrow functions, promises, and modern JavaScript syntax

### Development Requirements

For development and contributing to the project:
- **Git**: For version control
- **Code Editor**: VS Code, WebStorm, or similar with JavaScript support
- **Browser Developer Tools**: For debugging and testing

## Technologies Used

This project leverages several key technologies and libraries:

### Core Technologies
- **[Node.js](https://nodejs.org/)**: Server-side JavaScript runtime for the signaling server
- **[WebRTC](https://webrtc.org/)**: Real-time peer-to-peer communication protocol
- **HTML5 Canvas**: For game rendering and graphics
- **JavaScript ES6+**: Modern JavaScript features and syntax

### Game Engine and Libraries
- **[ImpactJS](https://impactjs.com/)**: 2D game engine for HTML5 canvas
- **[Impact++](https://collinhover.github.io/impactplusplus/)**: Extended library for ImpactJS with additional features and improvements
- **Weltmeister**: Level editor included with ImpactJS for creating game maps

### Networking Libraries
- **[Socket.io](https://socket.io/)**: Real-time bidirectional event-based communication for the signaling server
- **[http-server](https://www.npmjs.com/package/http-server)**: Simple HTTP server for serving the game files

### Development Tools
- **npm**: Package manager for Node.js dependencies
- **Git**: Version control system

### Browser APIs Used
- **WebRTC RTCPeerConnection**: For establishing P2P connections
- **WebRTC RTCDataChannel**: For sending game data between peers
- **WebAudio API**: For game sound effects and music
- **Canvas 2D API**: For game graphics rendering
- **WebSocket API**: For signaling server communication

## Project structure

The project has the following structure:

```text
.
├── lib/                          # Core game libraries and modules
│   ├── game/                     # Game-specific code and logic
│   │   ├── abilities/            # Game abilities and special powers
│   │   │   └── weaponDamage.js   # Weapon damage calculation system
│   │   ├── entities/             # Game entities (players, items, weapons)
│   │   │   ├── player.js         # Main player entity and logic
│   │   │   ├── remote-player.js  # Remote player representation and synchronization
│   │   │   ├── weapon.js         # Local player weapon entity
│   │   │   ├── remote-weapon.js  # Remote player weapon synchronization
│   │   │   ├── damage.js         # Damage system and effects
│   │   │   ├── item-blue.js      # Life restoration items
│   │   │   ├── item-red.js       # Sword usage restoration items
│   │   │   └── item-yellow.js    # Bonus items (life + sword usage)
│   │   ├── levels/               # Game levels and maps
│   │   │   ├── testR.js          # Main game level definition
│   │   │   └── ...               # Additional level files
│   │   ├── ui/                   # User interface components
│   │   │   ├── healthBar.js      # Player health display
│   │   │   ├── usageBar.js       # Weapon usage counter display
│   │   │   ├── copyUrlButton.js  # Share game room URL functionality
│   │   │   ├── informations.js   # Game information displays
│   │   │   └── label.js          # Text label UI component
│   │   ├── main.js               # Main game initialization and loop
│   │   └── events.js             # Game event handling system
│   ├── impact/                   # ImpactJS game engine core files
│   │   ├── game.js               # Core game class and functionality
│   │   ├── entity.js             # Base entity class
│   │   ├── system.js             # System and platform abstraction
│   │   ├── loader.js             # Asset loading system
│   │   ├── input.js              # Input handling (keyboard, mouse)
│   │   ├── sound.js              # Audio system
│   │   ├── timer.js              # Game timing and animation
│   │   └── ...                   # Additional core engine files
│   ├── plusplus/                 # Impact++ extension library
│   │   └── ...                   # Extended features and improvements
│   ├── weltmeister/              # Level editor for creating game maps
│   │   └── ...                   # Map editing tools and interface
│   ├── network/                  # Networking and P2P communication
│   │   ├── peer-connection.js    # WebRTC peer connection management
│   │   ├── room-connection.js    # Game room connection handling
│   │   └── socket.io.js          # Socket.io client library
│   └── messages.js               # Message types and communication protocols
├── media/                        # Game assets and multimedia resources
│   ├── sprites/                  # Character and entity sprite sheets
│   ├── tiles/                    # Environment and terrain tiles
│   ├── weapons/                  # Weapon graphics and animations
│   ├── *.png                     # Image files (sprites, tiles, UI elements)
│   ├── *.ogg                     # Audio files (music and sound effects)
│   └── *.font.png                # Bitmap fonts for game text
├── img/                          # Website and documentation images
│   ├── index.png                 # Main menu screenshot
│   ├── gameScreen.png            # Gameplay screenshot
│   └── ...                       # Additional screenshots and graphics
├── signalling/                   # WebRTC signaling server
│   └── server.js                 # Node.js signaling server implementation
├── index.html                    # Character selection and room creation page
├── entry.html                    # Main game canvas and gameplay page
├── weltmeister.html              # Level editor interface
├── package.json                  # Node.js dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── favicon.ico                   # Website favicon
├── .gitignore                    # Git ignore patterns
└── README.md                     # Project documentation (this file)
```

### Key Directories Explained

- **`lib/`**: Contains all game libraries and modules
  - **`game/`**: Game-specific logic including entities, UI components, and level definitions
  - **`impact/`**: Core ImpactJS game engine providing fundamental game functionality
  - **`plusplus/`**: Extended features and improvements over base ImpactJS
  - **`network/`**: WebRTC and networking implementation for multiplayer functionality
  - **`weltmeister/`**: Built-in level editor for creating and modifying game maps

- **`media/`**: All multimedia assets including sprites, sounds, textures, and fonts

- **`signalling/`**: Backend signaling server for WebRTC peer discovery and connection establishment

- **`*.html`**: Frontend pages for different aspects of the game (menu, gameplay, level editing)

## Structure of the game

### Starting the game

The game is meant to be played in peer-to-peer mode. To be able to play in this mode you need to run (starting from the game folder) the following two commands defined in the ` package.json ` file:

```bash
npm run signaling
npm run http
```

where the first command starts the signaling server and the second the http server. In order to play in peer-to-peer mode both players must be connected under the same wifi network and connected to the ip address of the player who started the http server. To find out your ip address , you can use the command ` ipconfig ` on Windows or ` ifconfig ` on Linux.

### The game

![index.png](./img/index.png)

When you start the game, the `index.html` page will open where you can choose your game character and name for your game room. Among the players that it is possible to impersonate we find:

- Arthur Pendragon
- Merlin
- King Fisher
- Lancelot
- Guinevere
- The Lady of the Lake

Once you open the game room you will appear with your player in a random position on the game map.

![gameScreen.png](./img/gameScreen.png)

In the game map there are three types of items to collect:

- **Life**: Increases player's life
- **Sword**: Resets the number of sword uses by one
- **Bonus**: Increases the number of sword uses and player lives

> Objective of the game: Your castle has been attacked by a demonic force and your army is turning against you. Your goal is to rid the castle of demons and kill your army.

### Game commands

The game controls are as follows:

- `WASD` or `↑↓←→`: character movement
- `C`: sword attack

### Adding new players

Once the game room has been created, new players can be added to the game. To do this, simply enter the same room name or press the button at the top right which copies the site address with the page name already set. This address can be sent to other players who will then be able to join the game. Up to 5 players can be present in the same room.

Each remote player on the screen is represented by a soldier from your army (Lancelot, Gawain, and Mordred ) and it is impossible for the player to tell which remote player they are facing. Each player can attack and be attacked. When a player's life ends, he is respawned in a random location on the map and can continue playing.

## Installation

### Prerequisites

Before installing and running Dungeon Castle, ensure you have the following software installed on your system:

#### 1. Node.js and npm

**Windows:**
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation by opening Command Prompt and running:
   ```cmd
   node --version
   npm --version
   ```

**macOS:**
1. Download Node.js from [nodejs.org](https://nodejs.org/) or install via Homebrew:
   ```bash
   brew install node
   ```
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

#### 2. Git (Optional but recommended for development)

**Windows:** Download from [git-scm.com](https://git-scm.com/)

**macOS:** 
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

### Step-by-step Installation

#### Option 1: Download and Run (Recommended for Players)

1. **Download the project:**
   - Download the ZIP file from the GitHub repository
   - Extract it to your desired location

2. **Navigate to the project directory:**
   ```bash
   cd ProgettoTecnologieInternet
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the game servers:**
   
   **Option A: Using npm scripts (Recommended)**
   ```bash
   # In first terminal - Start signaling server
   npm run signalling
   
   # In second terminal - Start HTTP server
   npm run http
   ```
   
   **Option B: Manual startup**
   ```bash
   # In first terminal - Start signaling server
   node signalling/server.js
   
   # In second terminal - Start HTTP server on port 8080
   npx http-server -c-1 . -p 8080
   ```

5. **Access the game:**
   - Open your web browser
   - Go to `http://localhost:8080`
   - For local network play, use your IP address instead of localhost

#### Option 2: Clone from Git (Recommended for Developers)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GiorCocc/ProgettoTecnologieInternet.git
   cd ProgettoTecnologieInternet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Follow steps 4-5 from Option 1**

### Development Setup

For developers who want to modify or contribute to the game:

#### 1. Development Environment Setup

1. **Install a code editor** (recommended):
   - [Visual Studio Code](https://code.visualstudio.com/)
   - [WebStorm](https://www.jetbrains.com/webstorm/)
   - [Sublime Text](https://www.sublimetext.com/)

2. **Install useful VS Code extensions** (if using VS Code):
   - JavaScript (ES6) code snippets
   - HTML CSS Support
   - Live Server
   - GitLens

#### 2. Development Workflow

1. **Start development servers:**
   ```bash
   # Terminal 1: Signaling server with auto-restart
   npm run signalling
   
   # Terminal 2: HTTP server
   npm run http
   ```

2. **Access the level editor:**
   - Navigate to `http://localhost:8080/weltmeister.html`
   - Create and modify game levels using the built-in editor

3. **Development tips:**
   - Use browser developer tools for debugging
   - Check the browser console for WebRTC connection logs
   - Monitor network traffic in the Network tab
   - Use the Sources tab for JavaScript debugging

#### 3. Custom Configuration

**Signaling Server Port Configuration:**
Edit `signalling/server.js` to change the default port (8034):
```javascript
var PORT = 8034; // Change this to your desired port
```

**HTTP Server Port Configuration:**
Modify the npm script in `package.json` or run manually:
```bash
npx http-server -c-1 . -p YOUR_PORT
```

**Maximum Room Users:**
Edit `signalling/server.js` to change the player limit:
```javascript
var MAX_ROOM_USERS = 5; // Change this to your desired limit
```

### Network Configuration for Multiplayer

#### Local Network Play (Same WiFi)

1. **Find your IP address:**
   
   **Windows:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" under your active network adapter
   
   **macOS/Linux:**
   ```bash
   ifconfig
   ```
   Look for "inet" address under your active network interface

2. **Share your game:**
   - Start both servers on your machine
   - Share your IP address with other players
   - Other players access: `http://YOUR_IP:8080`
   - All players must be on the same WiFi network

#### Firewall Configuration

Ensure the following ports are open in your firewall:
- **Port 8034**: Signaling server (WebSocket connections)
- **Port 8080**: HTTP server (or your chosen port)
- **Random UDP ports**: WebRTC data channels (automatically handled by most firewalls)

### Troubleshooting Installation

**Common Issues:**

1. **Node.js/npm not found:**
   - Ensure Node.js is properly installed and added to PATH
   - Restart your terminal/command prompt after installation

2. **Port already in use:**
   ```bash
   # Find process using the port (Linux/macOS)
   lsof -i :8080
   
   # Kill the process or choose a different port
   npm run http -- -p 3000
   ```

3. **npm install fails:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **WebRTC connection issues:**
   - Ensure both players are on the same network
   - Check that firewall allows the applications
   - Try disabling antivirus temporarily for testing
   - Use Chrome for best WebRTC compatibility

## Implementation

The game, to be played in peer-to-peer mode, requires a server that allows you to create the game rooms in which to place players. When a user wants to join a room to play:

- tells the server the name of the room you want to enter
- the server replies with the list of players present in the room
- if the number of players is less than the maximum capacity of the room, then the other players receive a message containing the data of the new peer

### Signaling server

Each of the users must know at least the address and port where his opponent is listening and is able to receive incoming data. To obtain this information, a signaling server is used. The procedure for exchanging data via signaling is as follows:

1. User A sends a connection request to user B;
2. User B confirms A's request;
3. After receiving the confirmation, user A identifies his IP, port, any session parameters and sends them to user B;
4. User B responds by sending his address, port, and session parameters to User A.

Once these operations are completed, both users know each other's address and parameters and can start exchanging data. In order to obtain the information relating to one's public address and port, a STUN server is used, such as that of [Google](https://gist.github.com/zziuni/3741933).

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

### Information exchanged between players

Each player present in the room communicates a set of basic information:

- player position
- player speed
- direction of movement

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

The information sent by the remote player must be received instantly by the local player. However, this is practically impossible due to the speed and stability of the connection and the possible latency of the system. As a result, the information sent by the remote player is interpolated by the local player to predict the remote player's movement. This information interpolation technique is essential to ensure smooth gameplay and a stable connection between players.

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

This method helps to reduce the negative effects of the connection, since the location processing is done locally. However, this doesn't solve the problem when the connection is particularly slow. There are several workarounds that can be adopted in these cases, such as using compression algorithms to reduce the amount of data transmitted or implementing a local cache to reduce the number of location requests sent to the server. Additionally, it might be worth considering using caching techniques to store the most frequently requested location information in order to reduce response times. Finally, it is important to remember that choosing the best solution depends on the specific requirements of the application and the needs of the users.

## References and credits

We thank [rottingpixels](https://rottingpixels.itch.io/) for making available for use the [set of images]( https://rottingpixels.itch.io/castle-platformer-tileset-16x16free) used for the making of the map and [analogstudios](https://analogstudios.itch.io/) for the [game players and weapons](https://analogstudios.itch.io/camelot).

Music made by [Riccardo Mazza](https://github.com/sirMallet ) with [boscaceoil](https://boscaceoil.net/).
