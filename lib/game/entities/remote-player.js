// Remote player entity
// TODO: da inserire come entità nel file main.js
// TODO: verificarne il funzionamento

ig.module(
    'game.entities.remote-player'
)
.requires(
    'plusplus.core.config',
    'plusplus.core.entity',
    'plusplus.helpers.utils',
    'plusplus.abstractities.player'
)
.defines(function() {

    ig.EntityRemotePlayer = ig.global.EntityRemotePlayer = ig.Player.extend({

        name: 'remote-player',
        size: { x: 11, y: 16 },
        offset: { x: 10, y: 12 },
        stateUpdated: false,

        // TODO: decidere quale deve essere il personaggio remoto da utilizzare
        animSheet: new ig.AnimationSheet('media/arthurPendragon_.png', 32, 32),
            // flip: true,
            animInit: 'idle',
            // ? Animazioni di default: climb, stairs, jump, fall, moveX, moveY, Left, Right, Up, Down, idle
            animSettings: {
                idle: { sequence: [0, 1, 2, 3, 2, 1, 0], frameTime: 0.25 },
                move: { sequence: [8, 9, 10, 11, 16, 17, 18, 19], frameTime: 0.07 },
                jump: { sequence: [24, 25], frameTime: 1 },
                fall: { sequence: [27, 26, 58, 25, 24], frameTime: 0.4 },
                death: { sequence: [48, 49, 50, 51, 50, 51], frameTime: 0.2 },
                hit: { sequence: [48, 49, 50, 51, 50, 51], frameTime: 0.1 }
            },

        init: function (x, y, settings) {
            this.parent(x, y, settings);
        },

        setState: function(state) {
            // update remote player position according to the state
            var x = state.getX() / 10;
            var y = state.getY() / 10;
            this.pos = { x: x, y: y };

            // update remote player velocity according to the state
            this.dx = state.getVelX() / 10;
            this.dy = state.getVelY() / 10;

            // update remote player animation according to the state
            this.currentAnim = this.getAnimById(state.getAnim());
            this.currentAnim.frame = state.getFrame();
            this.currentAnim.flip.x = !!state.getFlip();

            this.stateUpdated = true;
        },

        update: function() {
            if(this.stateUpdated) this.stateUpdated = false;
            else {
                // calculate the new position localy to avoid lag in the remote player movement
                this.pos.x += this.dx;
                this.pos.y += this.dy;

                if(this.currentAnim) this.currentAnim.update();
            }
        },

        kill: function() { this.parent(); },
    });
});
