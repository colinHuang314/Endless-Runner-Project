class Player{
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z
        this.playerPolys = [] // main component of player
        this.rotation = 0

        this.makePlayer()
    }

    makePlayer(){
        /*assumes no rotation and rotates later*/
    
        this.playerPolys = []
        
        // Update player position based on current camera
        this.playerCenter = new Point(this.x, this.y, this.z)

        // player parts
        let tipBase = []
        tipBase.push(new Point(this.x - 5, this.y, this.z + 10))
        tipBase.push(new Point(this.x + 5, this.y, this.z + 10))
        tipBase.push(new Point(this.x, this.y, this.z + 17))

        let wingLeft = []
        const leftTip = tipBase[0]
        wingLeft.push(leftTip)
        wingLeft.push(new Point(leftTip.x - 10, this.y, leftTip.z))
        wingLeft.push(new Point(leftTip.x - 20, this.y, leftTip.z - 8))
        wingLeft.push(new Point(leftTip.x, this.y, leftTip.z - 8))

        let wingRight = []
        const rightTip = tipBase[1]
        wingRight.push(rightTip)
        wingRight.push(new Point(rightTip.x + 10, this.y, rightTip.z))
        wingRight.push(new Point(rightTip.x + 20, this.y, rightTip.z - 8))
        wingRight.push(new Point(rightTip.x, this.y, rightTip.z - 8))
        
        let bodyLeft = []
        bodyLeft.push(leftTip)
        bodyLeft.push(wingLeft[3])
        bodyLeft.push(new Point(this.x, this.y, leftTip.z - 15))

        let bodyRight = []
        bodyRight.push(rightTip)
        bodyRight.push(wingRight[3])
        bodyRight.push(new Point(this.x, this.y, rightTip.z - 15))

        let bodyMiddle = []
        bodyMiddle.push(leftTip)
        bodyMiddle.push(rightTip)
        bodyMiddle.push(bodyLeft[2])

        let tailLeft = []
        tailLeft.push(bodyLeft[2])
        tailLeft.push(new Point(this.x - 7, this.y, leftTip.z - 20))
        tailLeft.push(new Point(this.x - 3, this.y, leftTip.z - 20))

        let tailRight = []
        tailRight.push(bodyRight[2])
        tailRight.push(new Point(this.x + 7, this.y, rightTip.z - 20))
        tailRight.push(new Point(this.x + 3, this.y, rightTip.z - 20))

        /////////////////////////////////////////////////////////////////////////////////
        //////////////////////////    3d parts         ///////////////////
        /////////////////////////////////////////////////////////////////////////////////

        let tipTopBack = []
        tipTopBack.push(tipBase[0], tipBase[1])
        tipTopBack.push(new Point(this.x, this.y - 3, this.z + 17))
        let tipTopLeft = [tipBase[0], tipBase[2], tipTopBack[2]]
        let tipTopRight = [tipBase[1], tipBase[2], tipTopBack[2]]


        let bodyTopLeft = [leftTip, bodyMiddle[2], tipTopBack[2]]
        let bodyTopRight = [rightTip, bodyMiddle[2], tipTopBack[2]]

        let tailLeftTop = []
        tailLeftTop.push(bodyLeft[2])
        tailLeftTop.push(new Point(this.x - 7, this.y - 2, leftTip.z - 20))
        tailLeftTop.push(new Point(this.x - 3, this.y - 2, leftTip.z - 20))

        let tailRightTop = []
        tailRightTop.push(bodyRight[2])
        tailRightTop.push(new Point(this.x + 7, this.y - 2, rightTip.z - 20))
        tailRightTop.push(new Point(this.x + 3, this.y - 2, rightTip.z - 20))

        let wingLeftTop = []
        wingLeftTop.push(leftTip)
        wingLeftTop.push(new Point(leftTip.x - 10, this.y - 2, leftTip.z))
        wingLeftTop.push(new Point(leftTip.x - 20, this.y - 2, leftTip.z - 8))
        wingLeftTop.push(new Point(leftTip.x, this.y - 2, leftTip.z - 8))

        let wingRightTop = []
        wingRightTop.push(rightTip)
        wingRightTop.push(new Point(rightTip.x + 10, this.y - 2, rightTip.z))
        wingRightTop.push(new Point(rightTip.x + 20, this.y - 2, rightTip.z - 8))
        wingRightTop.push(new Point(rightTip.x, this.y - 2, rightTip.z - 8))

        let underside = []
        underside.push(new Point(rightTip.x, rightTip.y + 2, rightTip.z))
        underside.push(new Point(leftTip.x, leftTip.y + 2, leftTip.z))
        underside.push(new Point(wingLeft[3].x, wingLeft[3].y + 2, wingLeft[3].z))
        underside.push(new Point(bodyMiddle[2].x, bodyMiddle[2].y + 2, bodyMiddle[2].z))
        underside.push(new Point(wingRight[3].x, wingRight[3].y + 2, wingRight[3].z))

        // combine parts
        this.playerPolys.push(underside)
        this.playerPolys.push(tipBase, wingLeft, wingRight, bodyLeft, bodyRight, bodyMiddle, tailLeft, tailRight)
        //this.playerPolys.push(tipTopBack, tipTopLeft, tipTopRight) // cant rlly see with body in way
        this.playerPolys.push(bodyTopLeft, bodyTopRight, tailLeftTop, tailRightTop, wingLeftTop, wingRightTop)

        // now rotate
        this.applyRotation()
    }

    // for update loop
    updatePosition(dx, dy, dz){
        this.x += dx
        this.y += dy
        this.z += dz
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
        for (const poly of this.playerPolys) {
            for (const point of poly) {
                if (rotatedPoints.has(point)){continue}
                this.rotatePoint(this.playerCenter.x, this.playerCenter.y, point, this.rotation)
                rotatedPoints.add(point)
            }
        }
    }

}