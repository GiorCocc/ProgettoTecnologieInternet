ig.module(
  'game.ui.informations'
)
  .requires(
    'plusplus.core.config',
    'plusplus.core.font',
    'plusplus.ui.ui-text'
  )
  .defines(function () {
    "use strict";

    ig.UIInformations = ig.global.UIInformations = ig.UIText.extend({
      posPct: { x: 0.5, y: 0 },
      marginAsPct: false,
      margin: { x: - 64, y: 20 },
      font: new ig.Font('media/04b03.font.png'),
      textAlign: 'left',
      textBaseline: 'top',
      size: { x: 128, y: 8 },
      fillStyle: 'rgb(255,255,255)',
      text: null,
      timer: null,

      init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.text = settings.text;
      },

      draw: function () {
        this.parent();
        
        if (this.timer && this.timer.delta() > 0) {
          this.kill();
        }
      }



    });  // ig.UILabel

  }); // ig.module