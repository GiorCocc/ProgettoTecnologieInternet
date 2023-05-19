ig.module(
    'game.ui.copyUrlButton'
  ).requires(
    'plusplus.core.config',
    'plusplus.ui.ui-button'
    ).defines(function () { 
      //definizione uiButton
      ig.UICopyUrlButton = ig.global.UICopyUrlButton = ig.UIButton.extend({
        name: 'copyurlButton',
        text: 'Copy URL',
        font: new ig.Font('media/04b03.font.png'),
        textAlign: 'left',
        // Mostrare il bottone solo se il gioco è in esecuzione su un server
        visible: true,
        // Posizione del bottone
        posPct: { x: 0.5, y: 0.5 },
        // Dimensioni del pulsante
        size: { x: 100, y: 30 },
        // Stato del pulsante (attivo o disattivo)
        state: 'active',
        // img di sfondo del pulsante
        
        // Nome del layer
        layerName: 'ui',

    }); // End of ig.module
  
  }); // End of ig.module