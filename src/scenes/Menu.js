class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene")
    }
    preload(){
        
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
            fontStyle: 'bold',
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
        menuConfig.fontSize = '80px'
        this.add.text(game.config.width/2, 128, 'Galaxy Cruiser', menuConfig).setOrigin(0.5)
        menuConfig.fontSize = '28px'
        this.add.text(game.config.width/2, game.config.height/2 - 40, 'Use ←→ arrows to move and ↑ to jump', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#ff47a6'
        this.add.text(game.config.width/2, game.config.height/2 + 0, 'Collect Pyramids for points', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#FF0000'
        this.add.text(game.config.width/2, game.config.height/2 + 40, 'Dont hit RED!', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#00FF00'
        menuConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + 80, 'Press → to start', menuConfig).setOrigin(0.5)
    
        // keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    
        //audio
        this.selectSound = this.sound.add('selectSound', {volume: 0.25})

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.selectSound.play()            
            this.scene.start('playScene')    
        }
    }

}