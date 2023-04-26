ig.module(
    'game.entities.kill'
)
.requires(
    'impact.entity'
)
.defines(function() {

EntityKill = ig.Entity.extend({
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
    _wmScalable: true,

    message : 'You died!',
    killTimer: null,
    font:  new ig.Font( 'media/04b03.font.png' ),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.BOTH,
    
    check: function( other ) {
        other.kill();
        this.killTimer = new ig.Timer( 2 );
        
    },
    update: function() {},
    draw: function() {
        
        if( this.killTimer && this.killTimer.delta()<  0 ) { // if the timer is set and has not expired, delta significa che è passato un secondo
            this.font.draw( this.message, ig.system.width/2, ig.system.height/2 );
        }
        else{
            this.font.draw( "", ig.system.width/2, ig.system.height/2 );
        };
    }
});
});