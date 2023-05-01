ig.module(
  'game.abilities.weaponDamage'
)
  .requires(
    'plusplus.core.config',
    'plusplus.abilities.ability-damage'
  )
  .defines(function () {
    "use strict";

    ig.AbilityWeaponDamage = ig.AbilityDamage.extend({

      damage: 1,

      init: function (entity, settings) {
          this.parent(entity, settings);
  
          this.damage = settings.damage || this.damage;
      },

      initTypes: function () {
        this.parent();

        ig.utils.addType(ig.Ability, this, 'type', "SPAMMABLE");

      },

      activateComplete: function () {
        var damage;

        if (this.damageAsPct) {
          damage = this.entityTarget.health * this.damage;
        }
        else {
          damage = this.damage;
        }

        this.entityTarget.receiveDamage(damage, this.entityCaster, this.damageUnblockable);

        this.parent();

      },



    }); // ig.AbilityWeaponDamage
  }); // ig.module