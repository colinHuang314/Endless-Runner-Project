/*
Name: Colin Huang

Game Title: Galaxy Cruiser

Creative Tilt:
    Technical aspect: I made my own 3d renderer for simple lines in 3d space and a camera that follows the player
    Visual style: I made my own sound track and also chose a cool neon lines style with motion blur

Time Tracked (total: ):
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
    - added menu text (5 min)
    - made a pyramid constructor (10 min)
    - added jitter, trailblur, turbulence effects (60 min)
    - added a floor to scene (40 min)
    - deleted objects that pass behind the player for optimization (5 min)
    - refactoring, player jump, load screen (45 min)
    - made player 3d (30 min)
    ---------- 12 hr mark 1/28/2026 -------------
    - added helper class, added pyramid class added random generation, refactored drawing loop, refactored collision (90 min)
    - added crash sound and gameover scene (60 min)
    - added jump and select sounds, changed some text display, refactored the drawing loop (45 min)
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
    scene: [ Load, Menu, Play, GameOver],
    fps: {
        target: 60,
        forceSetTimeOut: true
    }

}


let game = new Phaser.Game(config)

let highScore = 0
let fps = game.config.fps.target

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
    lDONE
Properly transition between Scenes and allow the player to restart w/out having to reload the page (1)
    DONE
Include in-game instructions using text or other means (e.g., tooltips, tutorial, diagram, etc.) (1)
    DONE
Have some form of player input/control appropriate to your game design (1)
    DONE
Include one or more animated characters that use a texture atlas/sprite sheet* (1)
    DONE
Simulate scrolling with a tileSprite (or equivalent means) (1)
    DONE
Implement proper collision detection (via Arcade Physics or a custom routine) (1)
    DONE
Have looping background music* (1)
    DONE
Use a minimum of four sound effects for key mechanics, UI, and/or significant events appropriate to your game design (1)
    DONE  (buttonClick, collect, crash, ship movement)
Use randomness to generate escalating challenge, e.g. terrain, pickups, etc. (1)
    to-do
Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (1)
    DONE
Be theoretically endless (1)
    DONE
Be playable for at least 15 seconds for a new player of low to moderate skill (1)
    to-do
Run without significant crashes or errors (1)
    to-do
Include in-game credits for all roles, assets, music, etc. (1)
    to-do

*/