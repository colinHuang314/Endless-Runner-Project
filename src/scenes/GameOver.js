class GameOver extends Phaser.Scene{
    constructor(){
        super("gameOverScene")
    }
    preload(){
        
    }
    
    create() {
        this.inputReady = false

        this.gameOverText = this.add.text(400, 240, 'GAME OVER', { fontSize: '100px' }).setOrigin(0.5)
        this.optionsText = this.add.text(400, 1100, 'Press ← for menu, Press → to play again', { fontSize: '30px' }).setOrigin(0.5)

        this.gameOverText.setScale(0.01)

        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)

        this.selectSound = this.sound.add('selectSound', {volume: 0.25})
    }

    update() {
        // text grows
        if (this.gameOverText.scale < 1){ 
            this.gameOverText.setScale(this.gameOverText.scale * 1.09)
        }
        else{
            this.inputReady = true
        }
        
        if (this.optionsText.y > 320) this.optionsText.y -= 10
        
        if(this.inputReady){
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {  
                this.selectSound.play() 
                this.scene.stop('gameOverScene')
                this.scene.stop('playScene')
            
                this.scene.start('menuScene')
            }
            else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                this.selectSound.play()
                this.scene.stop('gameOverScene')
                this.scene.stop('playScene')
            
                this.scene.start('playScene')
            }
        }
    }

}