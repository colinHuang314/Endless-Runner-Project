class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics()
        this.load.on('progress', (value) => {
            loadingBar.clear()                              // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1)               // (color, alpha)
            loadingBar.fillRect(0, game.config.height/2, game.config.width * value, 5)   // (x, y, w, h)
        })
        this.load.on('complete', () => {
            loadingBar.destroy()
        })

        // audio
        this.load.audio('music', './assets/bg-music.mp3')
        this.load.audio('shipNoise', './assets/shipNoise.wav')
        this.load.audio('collect1', './assets/collectSound1.wav')
        this.load.audio('collect2', './assets/collectSound2.wav')
        this.load.audio('crash', './assets/crash.wav')
        
        // spritesheet background
        this.load.spritesheet('bgAnim', './assets/starsSpritesheet.png', {
            frameWidth: 800,
            frameHeight: 600
        })
    }

    create() {
        this.scene.start('menuScene')
    }
}