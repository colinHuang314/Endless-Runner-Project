/*
Name: Colin Huang

Game Title: Galaxy Cruiser

Creative Tilt:
    Technical aspect: I made my own 3d renderer for simple lines in 3d space and a camera that follows the player. (doesn't support camera rotation and sometimes intersecting lines makes object lines drawn in wrong order)
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
    ---------- 12 hr mark 01/28/2026 -------------
    - added helper class, added pyramid class added random generation, refactored drawing loop, refactored collision (90 min)
    - added crash sound and gameover scene (60 min)
    - added jump and select sounds, changed some text display, refactored the drawing loop (45 min)
    - added barriers so the player cant move left or right forever, made game get harder as game goes on, made mechanic where you need to collect an item to charge your jump (80 min)
    - fixed input lag issue by changing fps to 24 and changed constants accordingly. did other small tweaks and testing (60 min)
    - added credits scene (30 min)
    ----------- 18 hr mark 02/04/2026 ------------
    
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
    scene: [ Load, Menu, Credits, Play, GameOver],
    fps: {
        target: 24, // had to reduce because I had some lag at 60 fps 
        forceSetTimeOut: true // enforce the fps
    }

}


let game = new Phaser.Game(config)

let highScore = 0
let fps = game.config.fps.target

let keyUP, keyDOWN, keyRIGHT, keyLEFT, keySPACE, keySHIFT, keyIncreaseFov, keyDecreaseFov

let keyIncreaseBloomStrength, keyDecreaseBloomStrength, keyIncreaseBloomScale, keyDecreaseBloomScale

/*

performance looking okay so far at 60fps
ran into problem with input lag all of a sudden. 
    im guessing its because the game has more objects to draw now that i added infinite generation, although it still lags before the objects are generated so idk. 
    when holdnig a key down, it would lag the game, even though update loop stayed fast at 1-2 ms per frame
    i lowered frame rate to 24 from 60 and now phaser can handle it when you hold down buttons (at about 1-2 ms per frame still)

break animations: objects break into lines or polygons upon collision



Use multiple Scene classes (dictated by your game's style) (1)
    DONE
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
    DONE
Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (1)
    DONE
Be theoretically endless (1)
    DONE
Be playable for at least 15 seconds for a new player of low to moderate skill (1)
    DONE
Run without significant crashes or errors (1)
    DONE
Include in-game credits for all roles, assets, music, etc. (1)
    DONE

*/