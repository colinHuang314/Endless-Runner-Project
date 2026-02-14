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

        // draw player
        this.player = this.add.sprite(400, 360, 'player')
        this.player.setScale(0.8)

        // text configs
        let titleConfig = {
            fontFamily: 'Verdana',
            fontSize: '80px',
            color: '#FF00FF',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 4,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#FF00FF',
                blur: 15,
                stroke: true,
                fill: true
            },
            padding: {
                top: 10,
                bottom: 10,
            },
        }

        let intructionsConfig = {
            fontFamily: 'Verdana',
            fontSize: '28px',
            color: '#0000EE',
            align: 'center',
            stroke: '#0000E0',
            strokeThickness: 1.5,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#2222E0',
                blur: 15,
                stroke: true,
                fill: true
            },
            padding: {
                top: 10,
                bottom: 10,
            },
        }
        let startConfig = {
            fontFamily: 'Verdana',
            fontSize: '40px',
            backgroundColor: '#000000',
            color: '#00FF00',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // display menu text
        // title
        this.add.text(game.config.width/2, 60, 'Galaxy Cruiser', titleConfig).setOrigin(0.5)

        // movement
        this.add.text(game.config.width/2, 160, 'Use ←→ arrows to move and ↑ arrow to Jump', intructionsConfig).setOrigin(0.5)

        // collectables
        intructionsConfig.color = '#FF9900'
        intructionsConfig.shadow.color = '#FF9900'
        intructionsConfig.stroke = '#FF9900'
        this.add.text(game.config.width/2, 200, 'Collect Pyramids for points and to charge your Jump', intructionsConfig).setOrigin(0.5)

        // obstacles
        intructionsConfig.color = '#FF0000'
        intructionsConfig.shadow.color = '#FF0000'
        intructionsConfig.stroke = '#FF0000'
        this.add.text(game.config.width/2, 240, 'Dont hit the Red Cubes!', intructionsConfig).setOrigin(0.5)

        // start
        this.add.text(game.config.width/2, game.config.height/2 + 180, 'Press → to start', startConfig).setOrigin(0.5)

        // credits
        startConfig.fontSize = '28px'
        startConfig.color = '#FFFF00'
        this.add.text(game.config.width/2, game.config.height - 30, 'Press ↓ for credits', startConfig).setOrigin(0.5)
    
        // keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    
        //audio
        this.selectSound = this.sound.add('selectSound', {volume: 0.25})

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.selectSound.play()
            this.scene.start('playScene')
        }else if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.selectSound.play()
            this.scene.start('creditsScene')
        }
    }

}