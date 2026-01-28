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
    - added spritesheet background by making an animation in blender, exporting the frames, 
        then using ImageMagick to create the spritesheet (https://imagemagick.org/index.php#gsc.tab=0), 
        made it move slightly when player moves for paralax type effect (100 min)
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



Use multiple Scene classes (dictated by your game's style) (1)
    menu, play, credits
Properly transition between Scenes and allow the player to restart w/out having to reload the page (1)
    like in rocket patrol
Include in-game instructions using text or other means (e.g., tooltips, tutorial, diagram, etc.) (1)
    like in rp
Have some form of player input/control appropriate to your game design (1)
    DONE
Include one or more animated characters that use a texture atlas/sprite sheet* (1)
    background counts as character???
Simulate scrolling with a tileSprite (or equivalent means) (1)
    DONE
Implement proper collision detection (via Arcade Physics or a custom routine) (1)
    DONE
Have looping background music* (1)
    DONE
Use a minimum of four sound effects for key mechanics, UI, and/or significant events appropriate to your game design (1)
    buttonClick, collect, die, ship movement(subtle, might want to re-do)
Use randomness to generate escalating challenge, e.g. terrain, pickups, etc. (1)
    to-do
Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (1)
    time + collected
Be theoretically endless (1)
    to-do
Be playable for at least 15 seconds for a new player of low to moderate skill (1)
    to-do
Run without significant crashes or errors (1)
    to-do
Include in-game credits for all roles, assets, music, etc. (1)
    to-do

*/