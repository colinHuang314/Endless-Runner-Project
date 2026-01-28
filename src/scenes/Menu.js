class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene")
    }
    preload(){
        // audio    
        this.load.audio('music', './assets/bg-music.mp3')
        this.load.audio('shipNoise', './assets/shipNoise.wav')
        this.load.audio('collect1', './assets/collectSound1.wav')
        this.load.audio('collect2', './assets/collectSound2.wav')
        
        // spritesheet background
        this.load.spritesheet('bgAnim', './assets/starsSpritesheet.png', {
            frameWidth: 800,
            frameHeight: 600
        })
    }
    
    create(){
        // background animation
        this.anims.create({
            key: 'bgAnim',
            frames: this.anims.generateFrameNumbers('bgAnim', { start: 0, end: 99 }),
            frameRate: 30,
            repeat: -1
        })

        // background animation
        this.bgParalax = 0.1
        this.bgCenter = [400, 400]
        this.bgAnimation = this.add.sprite(this.bgCenter[0], this.bgCenter[1], 'bgAnim')
        this.bgAnimation.setScale(1.4)
        this.bgAnimation.play('bgAnim')
        // cover middle of animation with black
        this.blackOverlay = this.add.circle(this.bgCenter[0], this.bgCenter[1], 60, 0x000000)

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // display menu text
        this.add.text(game.config.width/2, game.config.height/2 - 32, 'Space Cruiser', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→↕ arrows to move', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#00FF00'
        menuConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + 32, 'Press → to start', menuConfig).setOrigin(0.5)
    
        // keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {            
            this.scene.start('playScene')    
        }
    }

}