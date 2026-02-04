class Credits extends Phaser.Scene{
    constructor(){
        super("creditsScene")
    }
    preload(){
        
    }
    
    create() {
        this.creditsTitleText = this.add.text(400, 50, 'Credits', { fontSize: '85px' }).setOrigin(0.5)
        this.optionsText = this.add.text(400, 550, 'Press ← to go back to menu', { fontSize: '30px' }).setOrigin(0.5)

        this.creditsText= this.add.text(60, 800, '\nMusic made in Bandlab\n\nSound effects made with JFXR\n\nUsed ImageMagick to make background animation spritesheet\n\nUsed resources from youtube, stackoverflow, \n\n\t\t4geeks, Prof. Altice, and phaser, *all cited in code*\n', { fontSize: '20px', backgroundColor: '#5b739f'})

        this.creditsTitleText.setScale(0.01)

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)

        this.selectSound = this.sound.add('selectSound', {volume: 0.25})
    }

    update() {
        // text grows
        if (this.creditsTitleText.scale < 1){ 
            this.creditsTitleText.setScale(this.creditsTitleText.scale * Math.pow(1.09, 60/fps))
        }
        if (this.creditsText.y > 140) this.creditsText.y -= 10 * (60/fps)

                
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {  
            this.selectSound.play() 
            this.scene.start('menuScene')
        }

    }//170

}