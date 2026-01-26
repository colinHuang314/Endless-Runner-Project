class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene")
    }
    preload(){

    }
    
    create(){
        this.graphics = this.add.graphics()

        this.widthConstant = 600
        // acts like render distance too
        this.minWidth = 0.6
        //hides objects in face
        this.maxWidth = 50
        
        this.frame = 1
        
        this.camera = new Camera(0, 0, -100)

        this.cube1 = this.makeCube(-50, 0, 0, 100)
        this.cube2 = this.makeCube(-150, 0, 400, 100)
        this.cube3 = this.makeCube(-50, 0, 800, 100)
        this.cube4 = this.makeCube(-150, 0, 1200, 100)


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
        // forward/backward control
        if (keyUP.isDown) {this.camera.z += 4}
        if (keyDOWN.isDown) {this.camera.z -= 4}
        
        // left/right control
        if (keyRIGHT.isDown) {this.camera.x += 4}
        if (keyLEFT.isDown) {this.camera.x -= 4}
        
        // up/down control
        if (keySPACE.isDown) {this.camera.y -= 2}
        if (keySHIFT.isDown) {this.camera.y += 2}
        
        // fov control
        if (keyIncreaseFov.isDown) {this.camera.fov += 1}
        if (keyDecreaseFov.isDown) {this.camera.fov -= 1}


        this.graphics.clear()

        // camera shake
        if ((this.frame) % 15 == 0){
            this.camera.x += Math.random() * 2 - 1
            this.camera.y += Math.random() * 2 - 1
        }
        
        this.draw()

        this.frame += 1
        if (this.frame >= 15){
            this.frame = 0
        }
    }

    draw() {
        let seen = new Set()
        let queue = [...this.cube1, ...this.cube2, ...this.cube3, ...this.cube4]


        queue.sort((a, b) => b.z - a.   z)

        while (queue.length){
            // choose point
            const point = queue.pop()
            // console.log(String(point))

            //draw line connections
            for(const conn of point.connections){
                if (!seen.has(conn)){
                    this.draw3DLine(point.x, point.y, point.z, conn.x, conn.y, conn.z, 0xff0000, 1)
                }

            }
            seen.add(point)
            
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


    makeCube(x, y, z, size){
        let frontFace = []
        frontFace.push(new Point(x+size, y+size, z))
        frontFace.push(new Point(x+size, y, z))
        frontFace.push(new Point(x, y, z))
        frontFace.push(new Point(x, y+size, z))
        this.connectPolygon(frontFace)

        let backFace = []
        backFace.push(new Point(x+size, y+size, z+size))
        backFace.push(new Point(x+size, y, z+size))
        backFace.push(new Point(x, y, z+size))
        backFace.push(new Point(x, y+size, z+size))
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
}
