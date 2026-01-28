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
    - added spritesheet background by making an animation in blender, exporting the frames, then using ImageMagick, 
         made it move slightly when player moves for paralax type effect (90 min)
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
need to fulful: Include one or more animated characters that use a texture atlas/sprite sheet* (1)


could animate a background or have an animation that grows in size to look 3d as it passes by (needs to be a small object for perspective reasons)

animation with sprite sheet could be smoke trailing

cound add a jump or just up and down control




*/