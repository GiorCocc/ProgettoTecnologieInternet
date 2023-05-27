ig.module(
  'game.ui.usageBar'
).requires(
  'plusplus.core.config',
  'plusplus.ui.ui-meter'
  ).defines(function () { 

    ig.UIUsageBar = ig.global.UIUsageBar = ig.UIMeter.extend({
      name: 'usageMeter',
      fillStyle: 'rgb(26, 121, 237)',
      emptyStyle: 'rgb(0,0,0)',
      posPct: { x: 0, y: 0 },
      size: { x: 64, y: 8 },
      margin: { x: 130, y: 100 },
      marginAsPct: false,
      fillDirection: 'right',
      value: 100,
      valueMax: 100,

      
      
      init: function (entity, settings) {
        this.parent(entity, settings);
        
        this.valueMax = entity.usage;
      },



    }); // End of ig.UIUsageBar

  }); // End of ig.module