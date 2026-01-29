class Play extends Phaser.Scene{
    constructor(){
        super("playScene")
    }
    preload(){    
        
    }
    
    create(){
        this.debug = true
        // effects
        this.jitterEffect = true
        this.turbulenceEffect = false
        this.trailBlurEffect = true

        this.frame = 1 // for debuging for now
        this.linesDrawn = 0

        // audio
        this.music = this.sound.add('music', { 
            volume: 0.5,
            loop: true 
        })
        this.shipNoise = this.sound.add('shipNoise', {volume: 2})
        this.collect1 = this.sound.add('collect1', {volume: 1})
        this.collect1 = this.sound.add('collect1', {volume: 1})

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
        this.camera = new Camera(0, 0, -150, 140)

        //camera physics
        this.followConst = 0.1


        // player
        this.playerColor = 0x0000c0
        this.playerAlpha = 0.6
        this.playerLineColor = 0x7777ff
        this.playerLineAlpha = 1
        this.playerLineWidth = 2
        this.player = new Player(0, 20, -120)

        // player physics
        this.playerSpeed = 2
        this.rotationConst = 0.1
        this.maxTurnAngle = 30
        
        this.jumpStrength = 10
        this.gravityConst = 0.2
        this.yVelocity = 2 // could put in player
        this.grounded = false

        // collectables
        this.collectables = []
        this.collectableColor = 0xff47a6
        this.collectableAlpha = 1
        this.cube1 = this.makeRectangularPrism(-50, -50, 0, 50, 50, 50)
        this.cube2 = this.makeRectangularPrism(-150, -50, 400, 50, 50, 50)
        this.cube3 = this.makeRectangularPrism(-50, -50, 800, 50, 50, 50)
        this.cube4 = this.makeRectangularPrism(-150, -50, 1200, 50, 50, 50)
        this.cube5 = this.makeRectangularPrism(-250, -50, 1600, 50, 50, 50)
        this.pyramid1 = this.makePyramid(0, 0, 500, 25, 25, 20)

        this.collectables.push(this.cube1, this.cube2, this.cube3, this.cube4, this.cube5, this.pyramid1)

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
        
        // left/right control
        if (keyRIGHT.isDown) {
            this.player.x += 2
            this.rotatePlayer(-this.maxTurnAngle)
            this.shipNoise.setVolume(4)
        }
        else if (keyLEFT.isDown) {
            this.player.x -= 2
            this.rotatePlayer(this.maxTurnAngle)
            this.shipNoise.setVolume(4)
        }
        else{
            this.rotatePlayer(0)
            this.shipNoise.setVolume(2)
        }
        
        // jump
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.yVelocity -= this.jumpStrength
            this.grounded = false
            this.shipNoise.setVolume(4)
            
        }

        this.applyGravity()
        
        // fov control
        if (keyIncreaseFov.isDown) {this.camera.fov += 1}
        if (keyDecreaseFov.isDown) {this.camera.fov -= 1}

        // camera shake
        this.applyTurbulenceEffect()
        

        // dont let player go too low (floor drawn at 250)
        if(this.player.y > 245) {
            this.player.y = 245
            this.yVelocity = 0
            this.grounded = true
            this.shipNoise.setVolume(2)

        }

        // forward movememt
        this.player.z += this.playerSpeed
        this.player.makePlayer() // update points

        // camera follow
        this.camera.follow(this.player.x, this.player.y - 20, this.player.z - 20, this.followConst)

        // collision
        this.checkCollision()

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
            console.log(`Lines drawn: ${this.linesDrawn} | Update loop took: ${duration.toFixed(2)} ms`)
            if (this.frame >= this.fps) this.frame = 0 // reset
        }
    }

    draw() {
        this.linesDrawn = 0

        // floor
        this.drawFloor()

        // draw lines
        let seen = new Set()

        let queue = []
        for (const item of this.collectables){
            // add all points of collectables
            queue.push(...item)
        }
        // queue.sort((a, b) => b.z - a.z)

        while (queue.length){
            // choose point
            const point = queue.pop()
            // console.log(String(point))

            //draw line connections
            
            for(const conn of point.connections){
                if (!seen.has(conn)){
                    this.draw3DLine(point.x, point.y, point.z, conn.x, conn.y, conn.z, this.collectableColor, this.collectableAlpha, this.widthConstant)
                }

            }
            seen.add(point)
            
        }

        // draw player
        this.drawPlayer()

        
        
    }
    
    /*collision between player and collectables or obstacles */
    // need to refactor
    // add player wing in hitbox
    checkCollision(){
        const pc = this.player.playerCenter

        for (let i = 0; i < this.collectables.length; i++){
            if(this.collectables[i].length === 0) continue

            let [cx, cy, cz] = [this.collectables[i][2].x, this.collectables[i][2].y, this.collectables[i][2].z] // refactor
            const size = 50 // need to refactor

            //check if behind camera
            if (cz < (this.camera.z - 100)){
                this.collectables.splice(i, 1) // delete
                continue
            }
            // check z first for speed
            if (pc.z > cz && pc.z < cz + size){
                if (pc.y > cy && pc.y < cy + size){
                    if (pc.x > cx && pc.x < cx + size){
                            this.collect1.play() // audio
                            this.collectables.splice(i, 1) // delete
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
            alpha /= 2
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


    /* returns all connected points of a rect prism in an array*/
    makeRectangularPrism(x, y, z, sizex, sizey, sizez){
        let frontFace = []
        frontFace.push(new Point(x+sizex, y+sizey, z))
        frontFace.push(new Point(x+sizex, y, z))
        frontFace.push(new Point(x, y, z))
        frontFace.push(new Point(x, y+sizey, z))
        this.connectPolygon(frontFace)

        let backFace = []
        backFace.push(new Point(x+sizex, y+sizey, z+sizez))
        backFace.push(new Point(x+sizex, y, z+sizez))
        backFace.push(new Point(x, y, z+sizez))
        backFace.push(new Point(x, y+sizey, z+sizez))
        this.connectPolygon(backFace)

        // conect to make cube
        for(let i = 0; i < 4; i++){
            frontFace[i].addConnection(backFace[i])
            backFace[i].addConnection(frontFace[i])
        }

        return [...frontFace, ...backFace]

    }

    makePyramid(x, y, z, sizex, sizey, sizez){
        let base = []
        base.push(new Point(x, y, z))
        base.push(new Point(x+sizex, y, z))
        base.push(new Point(x+sizex/2, y, z+sizez))
        this.connectPolygon(base)

        let tip = new Point(x + sizex/2, y-sizey, z + sizez/2)
        for(let i = 0; i < base.length; i++){
            base[i].addConnection(tip)
            tip.addConnection(base[i])
        }
        return[...base, tip]
    }

    connectPolygon(points){
        for(let i = 0; i < points.length; i++){
            if (i === (points.length - 1)){
                points[i].addConnection(points[0])
                points[0].addConnection(points[i])
            }
            else{
                points[i].addConnection(points[i+1])
                points[i+1].addConnection(points[i])
            }
        }
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
    applyTurbulenceEffect(){
        if (this.turbulenceEffect){
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
}
