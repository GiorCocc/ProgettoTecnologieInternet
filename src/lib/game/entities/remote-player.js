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
        // animSheet: new ig.AnimationSheet('media/remote-player.png', 32, 32),

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
