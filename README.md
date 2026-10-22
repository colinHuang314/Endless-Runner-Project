# Galaxy Cruiser

An endless runner in 3D, built in Phaser 3 with my own 3D line renderer. Steer a neon ship past the blocks in your path, collect pyramids for points and to charge your jump, and survive as long as you can while the game speeds up.

**[▶ Play it in your browser](https://colinhuang314.github.io/Endless-Runner-Project/)**

## Controls
- **← →** steer
- **↑** jump (one jump at a time: collect a pyramid to charge the next one)
- **→** on the menu to start, **↓** for credits

## How it works
- **Custom 3D renderer.** Phaser is a 2D engine, so every object (the ship, the pyramids, the floor) is a set of 3D points connected by lines. Each frame, the points are projected to the screen with a perspective projection from a field-of-view camera that follows the ship, and the objects are sorted back to front before drawing. (No camera rotation; crossing lines can occasionally draw in the wrong order.)
- **Neon look.** The lines are drawn onto a render texture that is darkened a little each frame instead of cleared, which leaves motion-blur trails, plus a slight jitter effect.
- **Difficulty ramp.** Over time the ship speeds up, obstacles and pickups spawn more often, and the camera's field of view widens to sell the speed.
- **Background.** A starfield animation rendered in Blender, exported as frames, packed into a spritesheet with ImageMagick, and shifted slightly with the ship for a parallax effect.
- **Audio.** The 1:53 soundtrack is my own (made in BandLab); sound effects made with jfxr plus a few from freesound.org.

## Code
| File | What |
|---|---|
| `src/scenes/Play.js` | game loop, projection and drawing, spawning, collisions, difficulty |
| `src/prefabs/` | `Camera`, `Player`, `Point`, `Pyramid` and `RectPrism` (3D shapes as connected points) |
| `src/scenes/` | menu, load, game over and credits scenes |

Made by Colin Huang in about 20 hours (2026).
