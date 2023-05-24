ig.module(
  'game.ui.copyUrlButton'
).requires(
  'plusplus.core.config',
  'plusplus.ui.ui-button'
).defines(function () {
  //definizione uiButton
  ig.UICopyUrlButton = ig.global.UICopyUrlButton = ig.UIInteractive.extend({
    name: 'copyUrlButton',
    size: { x: 16, y: 16 },
    // place in the top right corner of the screen
    posPct: { x: 0.95, y: 0 },
    margin: { x: -40, y: 20 },

    marginAsPct: false,
    animSheet: new ig.AnimationSheet('media/Icon-Spritesheet-16.png', 16, 16),
    animInit: 'init',
    animSettings: {
      init: {
        frameTime: 1,
        sequence: [54]
      },
    },
    // margin: { x: 100, y: 20 },

    activateComplete: function (entity) {
      this.parent();
    },

  }); // End of ig.module

}); // End of ig.module