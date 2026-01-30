class Play extends Phaser.Scene{
    constructor(){
        super("playScene")
    }
    
    create(){
        this.helpers = new Helpers()
        this.debug = true

        this.frame = 1 // for debuging for now
        this.linesDrawn = 0

        // game
        this.score = 0
        this.obstacleSpawnChance = 0.1
        this.collectableSpawnChance = 0.33
        this.canJump = true

        // effects
        this.jitterEffect = true
        this.shakeEffect = false
        this.trailBlurEffect = true


        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '50px',
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
        // score display
        this.scoreText = this.add.text(game.config.width/2, 40, `Score: ${this.score}`, scoreConfig).setOrigin(0.5)
        scoreConfig.backgroundColor = '#b300bd'
        scoreConfig.color = '#000000'
        scoreConfig.fontSize = '30px'
        this.highScoreText = this.add.text(game.config.width - 120, 30, `High: ${highScore}`, scoreConfig).setOrigin(0.5)
        scoreConfig.backgroundColor = '#ff8c00'
        scoreConfig.color = '#000000'
        scoreConfig.fontSize = '26px'
        this.canJumpText = this.add.text(110, 35, `Jump: ${this.canJump}`, scoreConfig).setOrigin(0.5)

        // audio
        this.music = this.sound.add('music', { 
            volume: 0.3,
            loop: true 
        })
        this.shipNoise = this.sound.add('shipNoise', {
            volume: 2,
            loop: true
        })
        this.collect1 = this.sound.add('collect1', {volume: 1})
        this.collect2 = this.sound.add('collect2', {volume: 1})
        this.crash = this.sound.add('crash', {volume: 1})
        this.jump = this.sound.add('jumpSound', {volume: 1})
        this.speedUp = this.sound.add('speedUpSound', {volume: 1})

        this.music.play()
        this.shipNoise.play()

        // background animation
        this.bgParalax = 0.1
        this.bgCenter = [400, 400]
        this.bgAnimation = this.add.sprite(this.bgCenter[0], this.bgCenter[1], 'bgAnim')
        this.bgAnimation.setScale(1.4)
        this.bgAnimation.play('bgAnim')


        // cover middle of animation with black
        this.blackCircle = this.add.circle(this.bgCenter[0], this.bgCenter[1], 60, 0x000000)


        // add graphics after background
        /* i first tried drawing a transparent black rect over the whole screen each frame but it slowed down the game for the acculumating draw calls */
        if (this.trailBlurEffect){
            this.trailTexture = this.add.renderTexture(0, 0, 800, 600).setOrigin(0, 0)
            this.trailTexture.setBlendMode(Phaser.BlendModes.ADD)
            this.graphics = this.make.graphics({ x: 0, y: 0, add: false })
        }
        else{
            this.graphics = this.add.graphics()
        }


        // render consts
        this.widthConstant = 1600
        this.minWidth = 0.4  // acts like render distance too
        this.maxWidth = 50   //makes close objects transparent

            
        // camera
        this.camera = new Camera(20, -200, -500, 140)

        //camera physics
        this.followConst = 0.1


        // player
        this.crashed = false
        this.playerColor = 0x0000c0
        this.playerAlpha = 0.6
        this.playerLineColor = 0x7777ff
        this.playerLineAlpha = 1
        this.playerLineWidth = 2
        this.player = new Player(20, 20, -120)

        // player physics
        this.playerSpeed = 2
        this.rotationConst = 0.1
        this.maxTurnAngle = 30
        
        this.jumpStrength = 7.75
        this.gravityConst = 0.2
        this.yVelocity = 2 // could put in player
        this.grounded = false

        // collectables
        this.collectables = []

        // generate the first batch
        for (let i = 4; i < 20; i ++){
            const pyramidX = this.helpers.gaussianRandom(0, 220)
            const pyramidZ = this.player.z + i * 50
            let pyramidType = 'normal'
            let pyramidY = 240
            
            this.collectables.push(new Pyramid(pyramidX, pyramidY, pyramidZ, pyramidType))
        }

        //increase difficulty event
        this.time.addEvent({
            delay: 11000,
            loop: true,
            callback: () => {
                if(!this.crashed){
                    this.speedUp.play()

                    if (this.camera.fov < 142) this.camera.fov += 0.6
                    if (this.obstacleSpawnChance < 1) this.obstacleSpawnChance += 0.07
                    if (this.collectableSpawnChance < 1) this.collectableSpawnChance += 0.05

                    this.playerSpeed += 0.28
                    console.log(`speed Up fov:${this.camera.fov} | osc: ${this.obstacleSpawnChance} | csc ${this.collectableSpawnChance} |  player speed ${this.playerSpeed}`)
                }
            }
        })


        // obstacles
        this.obstacles = []
        this.barriers = []
        this.barriers.push(new RectPrism(-515, 125, this.player.z + 200, 'barrier'))
        this.barriers.push(new RectPrism(485, 125, this.player.z + 200, 'barrier'))
        this.barriers.push(new RectPrism(-515, 125, this.player.z + 200 + 250, 'barrier'))
        this.barriers.push(new RectPrism(485, 125, this.player.z + 200 + 250, 'barrier'))
        this.barriers.push(new RectPrism(-515, 125, this.player.z + 200 + 500, 'barrier'))
        this.barriers.push(new RectPrism(485, 125, this.player.z + 200 + 500, 'barrier'))
        this.barriers.push(new RectPrism(-515, 125, this.player.z + 200 + 750, 'barrier'))
        this.barriers.push(new RectPrism(485, 125, this.player.z + 200 + 750, 'barrier'))

        // first batch
        for (let i = 2; i < 5; i ++){
            const obstacleX = this.helpers.gaussianRandom(0, 220)
            const obstacleZ = this.player.z + i * 200
            let obstacleType = 'medium'
            let obstacleY = 215
            
            this.obstacles.push(new RectPrism(obstacleX, obstacleY, obstacleZ, obstacleType))
        }
        
        // make keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

        keyIncreaseFov = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
        keyDecreaseFov = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
    }

    update() {
        const startTime = performance.now()
        
        let playerMovementVector = new Phaser.Math.Vector2(0, 0)

    
        if (keyRIGHT.isDown && (!this.crashed)) {
            playerMovementVector.x += 2
            this.rotatePlayer(-this.maxTurnAngle)
            this.shipNoise.setVolume(4)
        }
        else if (keyLEFT.isDown && (!this.crashed)) {
            playerMovementVector.x -= 2
            this.rotatePlayer(this.maxTurnAngle)
            this.shipNoise.setVolume(4)
        }
        else{
            this.rotatePlayer(0)
            this.shipNoise.setVolume(2)
        }
        
        
        // jump
        if (this.grounded && (!this.crashed) && this.canJump && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.jump.play()
            this.yVelocity -= this.jumpStrength
            this.grounded = false
            this.canJump = false
        }
        if (!this.grounded) this.shipNoise.setVolume(4)


        this.applyGravity()

        if(this.crashed){
            this.applyCrashFriction()
            if(this.playerSpeed < 0.01){
                this.bgAnimation.anims.stop()
            }


        }
        if(this.playerSpeed <= 0){
            this.shakeEffect = false
            this.scene.pause('playScene')
            this.scene.launch('gameOverScene')

            console.log("GAME OVER") // game over
        }
        
        // fov control
        if (keyIncreaseFov.isDown) {this.camera.fov += 1}
        if (keyDecreaseFov.isDown) {this.camera.fov -= 1}

        // camera shake
        this.applyShakeEffect()
        

        // dont let player go too low (floor drawn at 250)
        if(this.player.y > 245) {
            this.player.y = 245
            this.yVelocity = 0
            this.grounded = true
            this.shipNoise.setVolume(2)

        }
        // left righ restriction
        if(this.player.x < -500){
            this.player.x = -500
        }else if(this.player.x > 500){
            this.player.x = 500
        }

        // forward movememt
        playerMovementVector.y += this.playerSpeed // the .y is actually z

        // move player on x
        this.player.x += playerMovementVector.x
        
        this.player.z += playerMovementVector.y // forward movement
        
        // update player points
        this.player.makePlayer()

        // camera follow
        this.camera.follow(this.player.x, this.player.y - 20, this.player.z - 20, this.followConst)

        // collision
        this.checkCollision()

        // change animation speed
        this.bgAnimation.anims.msPerFrame = 1000/60 * 2 / Math.sqrt(this.playerSpeed)


        this.scoreText.text = `Score: ${this.score}`
        this.highScoreText.text = `High: ${highScore}`
        this.canJumpText.text = `Jump: ${this.canJump ? "Charged" : "Empty"}`
        if (!this.canJump){
            this.canJumpText.setStyle({ backgroundColor: '#ff0000' })
        } else{
            this.canJumpText.setStyle({ backgroundColor: '#00ff00' })
        }

        //////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////

        // generation
        //barriers
        if(this.barriers.length < 8){
            this.barriers.push(new RectPrism(-515, 125, this.player.z + 750, 'barrier'))
            this.barriers.push(new RectPrism(485, 125, this.player.z + 750, 'barrier'))
        }
        // collectables
        if(this.frame % 10 == 0){
            if (Math.random() < this.collectableSpawnChance){
                let pyramidX = 25 * Math.round(this.helpers.gaussianRandom(0, 220) / 25) // round to nearest 25
                if (pyramidX < -490) pyramidX = -490
                else if (pyramidX > 465) pyramidX = 465
                const pyramidZ = this.player.z + 1000
                let pyramidY = 0
                let pyramidType = 'none' 

                if(Math.random() < 0.20){
                    pyramidType = 'high'
                    pyramidY = 100
                }
                else{
                    pyramidType = 'normal'
                    pyramidY = 240
                }

                this.collectables.push(new Pyramid(pyramidX, pyramidY, pyramidZ, pyramidType))
            }
        }
        // obstacles
        if(this.frame % 10 == 0){
            if(Math.random() < this.obstacleSpawnChance){
                const obyX = (Math.random() - 0.5) * 1000 - 15
                // const obyX = this.helpers.gaussianRandom(0, 220)
                const obyZ = this.player.z + 1000
                let obyY = 0
                let obyType = 'none'

                const rand = Math.random()
                if (rand < 0.07){
                    obyType = 'long wall'
                    obyY = 220
                }
                else if (rand < 0.15){
                    obyType = 'wide wall'
                    obyY = 220
                }
                else if(rand < 0.2){
                    obyType = 'large'
                    obyY = 200
                }
                else if(rand < 0.8){
                    obyType = 'medium'
                    obyY = 215
                }
                else{
                    obyType = 'small'
                    obyY = 225
                }

                this.obstacles.push(new RectPrism(obyX, obyY, obyZ, obyType))
            }
        }



        //////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////


        // small paralax effect
        this.bgAnimation.x = this.bgCenter[0] - this.camera.x * this.bgParalax
        this.bgAnimation.y = this.bgCenter[1] - this.camera.y * this.bgParalax

        // move circle with background
        this.blackCircle.x = this.bgAnimation.x
        this.blackCircle.y = this.bgAnimation.y

        // clear
        this.graphics.clear()

        // darken
        const trailLengthConst = 0.19 // alpha multiplier
        if(this.trailBlurEffect) this.trailTexture.fill(0x000000, trailLengthConst)

        //obja and player
        this.draw()

        //stamp
        if (this.trailBlurEffect) this.trailTexture.draw(this.graphics)


        // for debug
        const endTime = performance.now()
        const duration = endTime - startTime

        this.frame += 1
        if (this.debug && this.frame % (10) == 0){
            console.log(`Score: ${this.score} | Lines drawn: ${this.linesDrawn} | Update loop took: ${duration.toFixed(2)} ms`)
            if (this.frame >= this.fps) this.frame = 0 // reset
        }
    }

    draw() {
        this.linesDrawn = 0

        // floor
        this.drawFloor()

        // draw objects
        let seen = new Set()

        let objectsToDraw = [...this.collectables, ...this.obstacles, ...this.barriers]
        
        // sort in increasing order to draw in perspective
        /*https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers */
        objectsToDraw.sort(function(a, b) {
            return (a.z + a.sizeZ/2) - (b.z + b.sizeZ/2);
        })

        //collectables
        while (objectsToDraw.length){
            // choose point
            const object = objectsToDraw.pop()

            for (const point of object.points){
                //draw line connections
                for(const conn of point.connections){
                    if (!seen.has(conn)){
                        // both objects need the same variable names of color, alpha, relativeWidth
                        this.draw3DLine(point.x, point.y, point.z, conn.x, conn.y, conn.z, object.color, object.alpha, this.widthConstant * object.relativeWidth)
                    }
                }
                seen.add(point)
            }
        }

        // draw player
        this.drawPlayer()
    }
    
    /*collision between player and collectables or obstacles */
    checkCollision(){
        // collectables
        for (let i = 0; i < this.collectables.length; i++){
            if(this.collectables[i].points.length === 0) continue

            let [cx, cy, cz] = [this.collectables[i].x, this.collectables[i].y, this.collectables[i].z]
            let [sizeX, sizeY, sizeZ] = [this.collectables[i].sizeX, this.collectables[i].sizeY, this.collectables[i].sizeZ]
            //check if behind player
            if (cz < (this.player.z - 100)){
                this.collectables.splice(i, 1) // delete
                continue
            }
            // check all dimensions is order of relevance
            // uses magic numbers for player hitbox
            if (this.player.z + 10 > cz && this.player.z - 8 < cz + sizeZ){
                if (this.player.x + 10 > cx && this.player.x - 10 < cx + sizeX){
                    if (this.player.y + 2 > cy && this.player.y - 2 < cy + sizeY){
                        if (this.collectables[i].type === 'high'){
                            this.collect2.play() // sfx
                        }
                        else{
                            this.collect1.play() // sfx
                        }
                        this.score += this.collectables[i].pointValue

                        // update highscore
                        if (this.score > highScore){
                            highScore = this.score
                        }

                        this.canJump = true
                        this.collectables.splice(i, 1) // delete
                    }
                }
            }
        }

        //obstacles
        if (!this.crashed){
            for (let i = 0; i < this.obstacles.length; i++){
                if(this.obstacles[i].points.length === 0) continue

                let [cx, cy, cz] = [this.obstacles[i].x, this.obstacles[i].y, this.obstacles[i].z]
                let [sizeX, sizeY, sizeZ] = [this.obstacles[i].sizeX, this.obstacles[i].sizeY, this.obstacles[i].sizeZ]
                //check if behind player
                if (cz < (this.player.z - 300)){
                    this.obstacles.splice(i, 1) // delete
                    continue
                }
                // check all dimensions is order of relevance
                // uses magic numbers for player hitbox
                if (this.player.z + 10 > cz && this.player.z - 8 < cz + sizeZ){
                    if (this.player.x + 10 > cx && this.player.x - 10 < cx + sizeX){
                        if (this.player.y + 2 > cy && this.player.y - 2 < cy + sizeY){
                            this.crash.play()
                            this.crashed = true

                            this.music.stop()
                            this.shakeEffect = true
                            this.playerColor = 0xcc0000
                            this.playerAlpha = 0.3
                            this.playerLineColor = 0xff0000
                            console.log("CRASHED")
                        }
                    }
                }
            }
        }

        // barriers
        if (!this.crashed){
            for (let i = 0; i < this.barriers.length; i++){
                if(this.barriers[i].points.length === 0) continue

                let [cx, cy, cz] = [this.barriers[i].x, this.barriers[i].y, this.barriers[i].z]
                let [sizeX, sizeY, sizeZ] = [this.barriers[i].sizeX, this.barriers[i].sizeY, this.barriers[i].sizeZ]
                //check if behind player
                if (cz < (this.player.z - 250)){
                    this.barriers.splice(i, 1) // delete
                    continue
                }
                // check all dimensions is order of relevance
                // uses magic numbers for player hitbox
                if (this.player.z + 10 > cz && this.player.z - 8 < cz + sizeZ){
                    if (this.player.x + 10 > cx && this.player.x - 10 < cx + sizeX){
                        if (this.player.y + 2 > cy && this.player.y - 2 < cy + sizeY){
                            this.crash.play()
                            this.crashed = true

                            this.music.stop()
                            this.shakeEffect = true
                            this.playerColor = 0xcc0000
                            this.playerAlpha = 0.3
                            this.playerLineColor = 0xff0000
                            console.log("CRASHED")
                        }
                    }
                }
            }
        }
    }

    /*
    z dist from camera is plane of view (for 53.13 deg fov)

    scale position in plane of view to screen (800 by 600)
        zdist = z - camera.z
        x -> (x - [camera.x - zdist/2]) / zdist * 800
    */
    
    // coords mapped to camera
    getProjectedCoords(px, py, planeOfViewSize){
        if(planeOfViewSize === 0){
            planeOfViewSize = 0.03
        }
        let x = (px - (this.camera.x - planeOfViewSize/2)) / planeOfViewSize * this.game.config.width
        let y = (py - (this.camera.y - planeOfViewSize/2)) / planeOfViewSize * this.game.config.width

        let [jx, jy] = this.applyJitterEffect(x, y)
        x = jx
        y = jy

        return [x, y]
    }
    draw3DLine(p1x, p1y, p1z, p2x, p2y, p2z, color, alpha, widthConstant){
        let zDifference1 = (p1z - this.camera.z)
        let zDifference2 = (p2z - this.camera.z)

        if(zDifference1 <= 0 && zDifference2 <= 0){
            return
        }

        if(zDifference1 <= 0){
            const ratio = (-zDifference1) / (p2z - p1z)
            
            p1x = p1x + (p2x - p1x) * ratio
            p1y = p1y + (p2y - p1y) * ratio
            p1z = this.camera.z

            zDifference1 = 0
        }
        else if(zDifference2 <= 0){
            const ratio = (-zDifference2) / (p1z - p2z)
            
            p2x = p2x + (p1x - p2x) * ratio
            p2y = p2y + (p1y - p2y) * ratio
            p2z = this.camera.z

            zDifference2 = 0
        }

        const fovScalingFactor = 2 * Math.tan((this.camera.fov/2) * Math.PI / 180)

        let planeOfViewSize1 = zDifference1 * fovScalingFactor
        let planeOfViewSize2 = zDifference2 * fovScalingFactor

        let [projP1x, projP1y] = this.getProjectedCoords(p1x, p1y, planeOfViewSize1)
        let [projP2x, projP2y] = this.getProjectedCoords(p2x, p2y, planeOfViewSize2)

        const width = widthConstant / (((p1z + p2z)/2 - this.camera.z) * fovScalingFactor)


        if (width < this.minWidth){
            return
        }

        if (width > this.maxWidth){
            alpha /= 3
        }

        this.drawLinearLine(projP1x, projP1y, projP2x, projP2y, width, color, alpha)
        // this.drawLinearLine(projP1x + 2, projP1y - 2, projP2x + 2, projP2y - 2, width, 0x1020ff, alpha)
    }

    // simple line
    drawLinearLine(projX1, projY1, projX2, projY2, width, color, alpha) {
        this.graphics.lineStyle(width, color, alpha)
        this.graphics.beginPath()
        this.graphics.moveTo(projX1, projY1)
        this.graphics.lineTo(projX2, projY2)
        this.graphics.strokePath()

        this.linesDrawn += 1 // debug
    }
    
    // draws and fills flat shape using list of points
    drawPoly(poly, color, alpha, fill) {
        if(poly.length <= 1) return
        const fovScalingFactor = 2 * Math.tan((this.camera.fov/2) * Math.PI / 180)

        this.graphics.lineStyle(this.playerLineWidth, this.playerLineColor, this.playerLineAlpha)
        this.graphics.fillStyle(color, alpha)

        this.graphics.beginPath()

        const [p1x, p1y] = this.getProjectedCoords(poly[0].x, poly[0].y, (poly[0].z - this.camera.z) * fovScalingFactor)
        this.graphics.moveTo(p1x, p1y)

        for (let i = 1; i < poly.length; i++){
            const [px, py] = this.getProjectedCoords(poly[i].x, poly[i].y, (poly[i].z - this.camera.z) * fovScalingFactor)
            this.graphics.lineTo(px, py)

            this.linesDrawn += 1
        }        

        this.graphics.closePath()
        if(fill) this.graphics.fillPath()
        this.graphics.strokePath()
    }

    drawPlayer(){
        for(const poly of this.player.playerPolys){
            this.drawPoly(poly, this.playerColor, this.playerAlpha, true)
        }
    }

    /* horizontal lines */
    drawFloor(){
        const gridSize = 50
        const numLines = 15
        const floorY = 250
        const gridColor = 0xFF00FF
        const baseAlpha = 0.9

        const startZ = Math.floor(this.camera.z / gridSize) * gridSize

        for (let i = 0; i < numLines; i++) {
            const z = startZ + (i * gridSize)
            
            if (z < this.camera.z + 10) continue

            // calculate distance for fading
            const dist = z - this.camera.z
            
            const fade = Math.max(0, 1 - (dist / (numLines * gridSize)))
            
            this.draw3DLine(
                this.camera.x - 2000, floorY, z,
                this.camera.x + 2000, floorY, z,
                gridColor, baseAlpha * fade, this.widthConstant
            )
        }
    }
    /*
    for smooth rotation, rotate based off of how much more it needs to rotate
    */
    rotatePlayer(targetAngle){
        const rotationLeft = targetAngle - this.player.rotation
        this.player.rotation += rotationLeft * this.rotationConst
    }


    // each pixel of lines flicker
    applyJitterEffect(x, y){
        if (this.jitterEffect){
            if (Math.random() > 0.94) {
                x += (Math.random() - 0.5) * 3
                y += (Math.random() - 0.5) * 3
            }
        }
        return [x, y]

    }

    // shakes the camera like when an explosion happens maybe
    applyShakeEffect(){
        if (this.shakeEffect){
            if ((this.frame) % 2 == 0){
                const shakeMagnitude = 3
                this.camera.x += Math.random() * shakeMagnitude - shakeMagnitude/2
                this.camera.y += Math.random() * shakeMagnitude - shakeMagnitude/2
            }        
        }
    }

    applyGravity(){
        if (this.grounded) return

        this.yVelocity += this.gravityConst

        // custom jump physics
        if (this.yVelocity > 2 ){
            this.yVelocity += this.gravityConst * 0.7
        }

        // terminal velocity
        if (this.yVelocity > 16){
            this.yVelocity = 16
        }

        this.player.y += this.yVelocity
    }

    applyCrashFriction(){
        if(this.playerSpeed <= 0) return

        if (this.playerSpeed < 0.5){
            this.playerSpeed -= 0.02
        }
        else{
            this.playerSpeed *= 0.99
        }
    }
}
