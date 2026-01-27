/*
Name: Colin Huang

Time Tracked:
    - basic 3d renderer (150 min)
    - drawing player and aligning with camera (60 min)
    - refactoring player (30 min)
    - rotating player (60 min)
    - rotating smoothly (20 min)
    - made and added 1:53 background music track (80 min)
    - added ship engine noise and collect sfx (20 min)
*/

config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [ Menu ],
    fps: {
        target: 60,
        forceSetTimeOut: true
    }

}


let game = new Phaser.Game(config);

let keyUP, keyDOWN, keyRIGHT, keyLEFT, keySPACE, keySHIFT, keyIncreaseFov, keyDecreaseFov

/*

cound add a jump or just up and down control

animation with sprite sheet could be smoke trailing



*/