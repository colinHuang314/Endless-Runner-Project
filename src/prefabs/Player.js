class Player{
    constructor(camera){
        this.camera = camera
        this.playerTris = [] // main component of player
        this.rotation = 0

        this.playerY = this.camera.y + 20

        // for collision
        this.playerCenter = new Point(this.camera.x, this.playerY, this.camera.z + 30)

        this.makePlayer()
    }

    makePlayer(){
        /*assumes no rotation and rotates later*/
    
        this.playerTris = []
        
        // Update player position based on current camera
        this.playerY = this.camera.y + 20
        this.playerCenter = new Point(this.camera.x, this.playerY, this.camera.z + 30)

        // player parts
        let playerTip = []
        playerTip.push(new Point(this.camera.x - 5, this.playerY, this.camera.z + 40))
        playerTip.push(new Point(this.camera.x + 5, this.playerY, this.camera.z + 40))
        playerTip.push(new Point(this.camera.x, this.playerY, this.camera.z + 47))

        let wingLeft01 = []
        const leftTip = playerTip[0]
        wingLeft01.push(leftTip)
        wingLeft01.push(new Point(leftTip.x - 10, this.playerY, leftTip.z))
        wingLeft01.push(new Point(leftTip.x - 20, this.playerY, leftTip.z - 8))

        let wingRight01 = []
        const rightTip = playerTip[1]
        wingRight01.push(rightTip)
        wingRight01.push(new Point(rightTip.x + 10, this.playerY, rightTip.z))
        wingRight01.push(new Point(rightTip.x + 20, this.playerY, rightTip.z - 8))

        let wingLeft02 = []
        wingLeft02.push(leftTip)
        wingLeft02.push(wingLeft01[2])
        wingLeft02.push(new Point(leftTip.x, this.playerY, leftTip.z - 8))

        let wingRight02 = []
        wingRight02.push(rightTip)
        wingRight02.push(wingRight01[2])
        wingRight02.push(new Point(rightTip.x, this.playerY, rightTip.z - 8))
        
        let bodyLeft = []
        bodyLeft.push(leftTip)
        bodyLeft.push(wingLeft02[2])
        bodyLeft.push(new Point(this.camera.x, this.playerY, leftTip.z - 15))

        let bodyRight = []
        bodyRight.push(rightTip)
        bodyRight.push(wingRight02[2])
        bodyRight.push(new Point(this.camera.x, this.playerY, rightTip.z - 15))

        let bodyMiddle = []
        bodyMiddle.push(leftTip)
        bodyMiddle.push(rightTip)
        bodyMiddle.push(bodyLeft[2])

        let tailLeft = []
        tailLeft.push(bodyLeft[2])
        tailLeft.push(new Point(this.camera.x - 7, this.playerY, leftTip.z - 20))
        tailLeft.push(new Point(this.camera.x - 3, this.playerY, leftTip.z - 20))

        let tailRight = []
        tailRight.push(bodyRight[2])
        tailRight.push(new Point(this.camera.x + 7, this.playerY, rightTip.z - 20))
        tailRight.push(new Point(this.camera.x + 3, this.playerY, rightTip.z - 20))

        // combine parts
        this.playerTris.push(playerTip, wingLeft01, wingRight01, wingLeft02, wingRight02, bodyLeft, bodyRight, bodyMiddle, tailLeft, tailRight)

        // now rotate
        this.applyRotation()
    }

    // for update loop
    updatePosition(camera){
        this.camera = camera
        this.makePlayer()
    }

    /*https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript */
    rotatePoint(cx, cy, point, angle){
        const radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (point.x - cx)) + (sin * (point.y - cy)) + cx,
        ny = (cos * (point.y - cy)) - (sin * (point.x - cx)) + cy;

        point.x = nx
        point.y = ny
    }

    applyRotation(){
        if (this.rotation === 0){return}

        // to not double rotate
        const rotatedPoints = new Set()

        // rotate every point
        for (const tri of this.playerTris) {
            for (const point of tri) {
                if (rotatedPoints.has(point)){continue}
                this.rotatePoint(this.playerCenter.x, this.playerCenter.y, point, this.rotation)
                rotatedPoints.add(point)
            }
        }
    }

}