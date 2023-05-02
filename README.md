# Progetto Tecnologie Internet

Videogioco RPG multiplayer basato su WebRTC e [ImpactJS](https://impactjs.com/) per il corso di Tecnologie Internet dell'Università degli Studi di Parma.

## Installazione

Per installare correttamente impactJS seguire la guida qui sotto

- Scaricare da [ImpactJS.com](https://impactjs.com/download) la cartella zip con tutti i file della libreria
- Scompattare l’archivio .zip e inserire tutti i file estratti (senza modificare o spostare i file dalle cartelle che li contengono) in una cartella sul proprio disco
- Creare una nuova cartella che conterrà il progetto (nel mio caso è `D:\\Gioco`)
- Nella cartella di progetto, aprire un terminale e digitare il comando

    ```bash
    npm install -g impact-node
    ```

- (**NON NECESSARIO SE SI CLONA IL PROGETTO**) 
  
  Una volta terminata l’installazione del tool, sempre nella cartella di progetto digitare il comando seguente comando

    ```bash
    impact-node create:project {path to impact dir}
    ```

    dove al posto di `{path to impact dir}` occorre inserire il percorso assoluto dove si è estratta la cartella `impact` dall’archivio zip scaricato

    Al termine della procedura comparirà un messaggio di conferma

- Per avviare il sito, digitare il comando `impact-node serve` dove si avverrà il server su `http://localhost:3000/`. All’indirizzo `http://localhost:3000/editor` si avvierà l’editor incluso per la creazione dei livelli e delle mappe.

    È possibile modificare la porta di ascolto aggiungendo al comando `serve` il comando `-p <numero porta>`

- Per aggiungere un file entity (da template) digitare il comando `impact-node create:entity {nome}`. Questo file verrà creato all’interno della cartella `./src/lib/game/entities/`

Per maggiori informazioni, seguire il repository [github](https://github.com/roman01la/impact-node) della cli `impact-node`.

Per poter eseguire il gioco in modalità peer-to-peer è necessario installare il modulo `socket.io` con il comando `npm install socket.io` nella cartella del progetto e un server http, sempre attraverso npm, con il comando `npm install http-server`. Per avviare il server, digitare il comando `http-server` nella cartella del progetto.

> **ATTENZIONE**: per poter avviare il gioco in questa modalità, occorre spostare tuto il contenuto della cartella `lib` nella cartella principale del progetto

## Riferimenti

- [Notion](https://www.notion.so/Risorse-8be48eb96b684f25aa56df6c680b284b)
- [Idea di partenza - Medium](https://medium.com/bumble-tech/webrtc-making-a-peer-to-peer-game-using-javascript-f7123aed769e)
- [Documentazione ImpactJS](https://impactjs.com/documentation/getting-started)