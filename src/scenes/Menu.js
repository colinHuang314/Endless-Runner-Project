class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene")
    }
    preload(){        

    }
    
    create(){
        this.graphics = this.add.graphics()

        this.widthConstant = 2000
        // acts like render distance too
        this.minWidth = 0.4
        //hides objects in face
        this.maxWidth = 50
        
        this.frame = 1
        
        this.camera = new Camera(0, 0, -150, 140)


        // player
        this.playerColor = 0x0000bb
        this.playerAlpha = 0.6
        this.playerLineColor = 0x7777ff
        this.playerLineAlpha = 1
        this.playerLineWidth = 2
        this.player = new Player(this.camera)

        this.rotationConst = 0.1
        this.maxTurnAngle = 30

        // rect prisms
        this.cubeColor = 0xff47a6
        this.cubeAlpha = 1
        this.cube1 = this.makeRectangularPrism(-50, -50, 0, 100, 100, 100)
        this.cube2 = this.makeRectangularPrism(-150, -50, 400, 100, 100, 100)
        this.cube3 = this.makeRectangularPrism(-50, -50, 800, 100, 100, 100)
        this.cube4 = this.makeRectangularPrism(-150, -50, 1200, 100, 100, 100)


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

        // forward/backward control
        if (keyUP.isDown) {this.camera.z += 2}
        if (keyDOWN.isDown) {this.camera.z -= 2}
        
        // left/right control
        if (keyRIGHT.isDown) {
            this.camera.x += 2
            this.rotatePlayer(-this.maxTurnAngle)
        }
        else if (keyLEFT.isDown) {
            this.camera.x -= 2
            this.rotatePlayer(this.maxTurnAngle)
        }
        else{
            this.rotatePlayer(0)
        }
        
        // up/down control
        if (keySPACE.isDown) {this.camera.y -= 1}
        if (keySHIFT.isDown) {this.camera.y += 1}
        
        // fov control
        if (keyIncreaseFov.isDown) {this.camera.fov += 1}
        if (keyDecreaseFov.isDown) {this.camera.fov -= 1}


        // quick and dirty
        this.player.updatePosition(this.camera)

        this.graphics.clear()

        // camera shake (makes graphics choppy)
        // if ((this.frame) % 15 == 0){
        //     const shakeMagnitude = 4
        //     this.camera.x += Math.random() * shakeMagnitude - shakeMagnitude/2
        //     this.camera.y += Math.random() * shakeMagnitude - shakeMagnitude/2
        // }

        // quick check
        const pc = this.player.playerCenter
        if (pc.x > -50 && pc.x < 50){
            if (pc.y > 0 && pc.y < 100){
                if (pc.z > 0 && pc.z < 100){
                    console.log("hit first cube")
                    this.cube1 = []
                }
            }

        }
        
        this.draw()

        const endTime = performance.now()
        const duration = endTime - startTime

        this.frame += 1
        if (this.frame >= 15){
            console.log(`Update loop took: ${duration.toFixed(2)} ms`)
            this.frame = 0
        }


    }

    draw() {
        // lines
        let seen = new Set()
        let queue = [...this.cube1, ...this.cube2, ...this.cube3, ...this.cube4]


        queue.sort((a, b) => b.z - a.z)

        while (queue.length){
            // choose point
            const point = queue.pop()
            // console.log(String(point))

            //draw line connections
            
            for(const conn of point.connections){
                if (!seen.has(conn)){
                    this.draw3DLine(point.x, point.y, point.z, conn.x, conn.y, conn.z, this.cubeColor, this.cubeAlpha)
                }

            }
            seen.add(point)
            
        }

        // player
        this.drawPlayer()
        
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
        const x = (px - (this.camera.x - planeOfViewSize/2)) / planeOfViewSize * this.game.config.width
        const y = (py - (this.camera.y - planeOfViewSize/2)) / planeOfViewSize * this.game.config.width

        return [x, y]
    }
    draw3DLine(p1x, p1y, p1z, p2x, p2y, p2z, color, alpha){
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

        const width = this.widthConstant / (((p1z + p2z)/2 - this.camera.z) * fovScalingFactor)


        if (width < this.minWidth){
            return
        }

        if (width > this.maxWidth){
            alpha /= 2
        }

        this.drawLinearLine(projP1x, projP1y, projP2x, projP2y, width, color, alpha)
    }

    // simple line
    drawLinearLine(projX1, projY1, projX2, projY2, width, color, alpha) {
        this.graphics.lineStyle(width, color, alpha)
        this.graphics.beginPath()
        this.graphics.moveTo(projX1, projY1)
        this.graphics.lineTo(projX2, projY2)
        this.graphics.strokePath()
    }


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
        }

        return [...frontFace, ...backFace]

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


    drawTriangle(p1, p2, p3, color, alpha) {
        const fovScalingFactor = 2 * Math.tan((this.camera.fov/2) * Math.PI / 180)

        let [p1x, p1y] = this.getProjectedCoords(p1.x, p1.y, (p1.z - this.camera.z) * fovScalingFactor)
        let [p2x, p2y] = this.getProjectedCoords(p2.x, p2.y, (p2.z - this.camera.z) * fovScalingFactor)
        let [p3x, p3y] = this.getProjectedCoords(p3.x, p3.y, (p3.z - this.camera.z) * fovScalingFactor)

        this.graphics.lineStyle(this.playerLineWidth, this.playerLineColor, this.playerLineAlpha)
        this.graphics.fillStyle(color, alpha)

        this.graphics.beginPath()
        this.graphics.moveTo(p1x, p1y)
        this.graphics.lineTo(p2x, p2y)
        this.graphics.lineTo(p3x, p3y)
        this.graphics.closePath()
        this.graphics.fillPath()

        this.graphics.strokePath()
    }

    drawPlayer(){
        for(const tri of this.player.playerTris){
            this.drawTriangle(tri[0], tri[1], tri[2], this.playerColor, this.playerAlpha)
        }
    }

    /*
    for smooth rotation, rotate based off of how much more it needs to rotate
    */
    rotatePlayer(targetAngle){
        const rotationLeft = targetAngle - this.player.rotation
        this.player.rotation += rotationLeft * this.rotationConst
    }
}
