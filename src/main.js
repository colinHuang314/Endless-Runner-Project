/*
Name: Colin Huang

Time Tracked:
- basic 3d renderer (150 min)
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
        target: 30
    }

}


let game = new Phaser.Game(config);

let keyUP, keyDOWN, keyRIGHT, keyLEFT, keySPACE, keySHIFT, keyIncreaseFov, keyDecreaseFov

/*game where you are forced to move forward (like all runners) and you have to try to collide with some things and not with others (like all runners)

controls are left right and jump (could add duck)


*/