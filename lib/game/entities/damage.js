ig.module(
  'game.entities.damage'
)
  .requires(
    'plusplus.core.config',
    'plusplus.entities.trigger',
    'plusplus.helpers.utils'
  )
  .defines(function () {
    ig.EntityDamage = ig.global.EntityDamage = ig.EntityTrigger.extend({
      _wmDrawBox: true,
      _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
      _wmScalable: true,

      message: 'You died!',
      killTimer: null,
      font: new ig.Font('media/04b03.font.png'),
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.BOTH,
      performance: ig.EntityExtended.PERFORMANCE.STATIC,

      damage: 10,
      damageAsPct: false,
      damageUnblockable: false,
      once: false,
      suicidal: false,


      init: function (x, y, settings) {
        this.parent(x, y, settings);

        ig.utils.addType(ig.EntityExtended, this, 'type', "DANGEROUS");
        ig.utils.addType(ig.EntityExtended, this, 'checkAgainst', "CHARACTER");
      },

      check: function (other) {
        if (other instanceof ig.global.EntityPlayer) {
          this.killTimer = new ig.Timer(2);

          var damage;
          if (this.damageAsPct) {
            damage = other.health * this.damage;
          }
          else {
            damage = this.damage;
          }

          other.receiveDamage(damage, this, this.damageUnblockable);

          ig.game.updateLabel("Killed by a mistirious force!");
        }
      },

      activate: function (entity) {
        this.parent(entity);

        var damage;
        if (this.damageAsPct) {
          damage = entity.health * this.damage;
        }
        else {
          damage = this.damage;
        }

        entity.receiveDamage(damage, this, this.damageUnblockable);
      },

      // draw: function () {

      //   if (this.killTimer && this.killTimer.delta() < 0) { // if the timer is set and has not expired, delta significa che è passato un secondo
      //     this.font.draw(this.message, ig.system.width / 2, ig.system.height / 2);
      //   }
      //   else {
      //     this.font.draw("", ig.system.width / 2, ig.system.height / 2);
      //   };
      // }


    });
  });
