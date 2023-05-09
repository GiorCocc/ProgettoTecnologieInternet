ig.module(
  'game.ui.healthBar'
)
  .requires(
    'plusplus.core.config',
    'plusplus.ui.ui-meter'
  )
  .defines(function () {
    ig.UIHealthBar = ig.global.UIHealthBar = ig.UIMeter.extend({
      name: 'healthMeter',
      fillStyle: 'rgb(223, 35, 38)',
      emptyStyle: 'rgb(0,0,0)',
      posPct: { x: 0, y: 0 },
      size: { x: 64, y: 8 },
      margin: { x: 100, y: 20 },
      marginAsPct: false,
      fillDirection: 'right',
      value: 100,
      valueMax: 100,

      init: function (entity, settings) {
        this.parent(entity, settings);
        this.valueMax = entity.health;
      },

    });

  });