/*
Name: Colin Huang

Time Tracked:
    - basic 3d renderer (150 min)
    - drawing player and aligning with camera (60 min)
    - refactoring player (30 min)
    - rotating player (60 min)
    - rotating smoothly (20 min)
    - made and added 1:53 background music track (80 min) (bandlab)
    - added ship engine noise and collect sfx (20 min) (https://jfxr.frozenfractal.com/) (freesound.org)
    - added spritesheet background by making an animation in blender, exporting the frames, (see: https://www.youtube.com/watch?v=_J5okZLZzFY&list=LL&index=1&pp=gAQBiAQBsAgC)
        then using ImageMagick to create the spritesheet (https://imagemagick.org/index.php#gsc.tab=0), 
        made it move slightly when player moves for paralax type effect (100 min)
    - started menu scene (10 min)
    - added menu text, made a pyramid constructor, added jitter, trailblur, turbulence effects, added a floor to scene, deleted objects that pass behind the player for optimization
*/

config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    render: { // https://tessl.io/registry/tessl/npm-phaser/3.90.0/files/docs/rendering.md
        antialias: true,         // Enable anti-aliasing
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [ Menu, Play],
    fps: {
        target: 60,
        forceSetTimeOut: true
    }

}


let game = new Phaser.Game(config)

let keyUP, keyDOWN, keyRIGHT, keyLEFT, keySPACE, keySHIFT, keyIncreaseFov, keyDecreaseFov

let keyIncreaseBloomStrength, keyDecreaseBloomStrength, keyIncreaseBloomScale, keyDecreaseBloomScale

/*

performance looking okay so far at 60fps

    would be fun to have gravity and only left right movement, but have orange circle collectables
    that make your plane jump into the air until falling back down to collect more points or used to dodge

jump? 
up down control or just left right?
could add vignette as sprite overlay
change fov, and bganimation as level speeds up? (fov is already adjusted for that (cubes look elongated))

lines move to the music?

make player look better
break animations: objects break into lines or polygons upon collision





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