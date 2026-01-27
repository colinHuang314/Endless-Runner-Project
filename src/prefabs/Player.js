class Player{
    constructor(camera){
        this.camera = camera

        this.playerTris = []

        const playerY = this.camera.y + 20

        // for collision
        this.playerCenter = new Point(camera.x, playerY, this.camera.z + 30)


        let playerTip = []
        playerTip.push(new Point(this.camera.x - 5, playerY, this.camera.z + 40))
        playerTip.push(new Point(this.camera.x + 5, playerY, this.camera.z + 40))
        playerTip.push(new Point(this.camera.x, playerY, this.camera.z + 47))

        let wingLeft01 = []
        const leftTip = playerTip[0]
        wingLeft01.push(leftTip)
        wingLeft01.push(new Point(leftTip.x - 10, playerY, leftTip.z))
        wingLeft01.push(new Point(leftTip.x - 20, playerY, leftTip.z - 8))

        let wingRight01 = []
        const rightTip = playerTip[1]
        wingRight01.push(rightTip)
        wingRight01.push(new Point(rightTip.x + 10, playerY, rightTip.z))
        wingRight01.push(new Point(rightTip.x + 20, playerY, rightTip.z - 8))

        let wingLeft02 = []
        wingLeft02.push(leftTip)
        wingLeft02.push(wingLeft01[2])
        wingLeft02.push(new Point(leftTip.x, playerY, leftTip.z - 8))

        let wingRight02 = []
        wingRight02.push(rightTip)
        wingRight02.push(wingRight01[2])
        wingRight02.push(new Point(rightTip.x, playerY, rightTip.z - 8))
        
        let bodyLeft = []
        bodyLeft.push(leftTip)
        bodyLeft.push(wingLeft02[2])
        bodyLeft.push(new Point(this.camera.x, playerY, leftTip.z - 15))

        let bodyRight = []
        bodyRight.push(rightTip)
        bodyRight.push(wingRight02[2])
        bodyRight.push(new Point(this.camera.x, playerY, rightTip.z - 15))

        let bodyMiddle = []
        bodyMiddle.push(leftTip)
        bodyMiddle.push(rightTip)
        bodyMiddle.push(bodyLeft[2])

        let tailLeft = []
        tailLeft.push(bodyLeft[2])
        tailLeft.push(new Point(this.camera.x - 7, playerY, leftTip.z - 20))
        tailLeft.push(new Point(this.camera.x - 3, playerY, leftTip.z - 20))

        let tailRight = []
        tailRight.push(bodyRight[2])
        tailRight.push(new Point(this.camera.x + 7, playerY, rightTip.z - 20))
        tailRight.push(new Point(this.camera.x + 3, playerY, rightTip.z - 20))

        // combine parts
        this.playerTris.push(playerTip)
        this.playerTris.push(wingLeft01)
        this.playerTris.push(wingRight01)
        this.playerTris.push(wingLeft02)
        this.playerTris.push(wingRight02)
        this.playerTris.push(bodyLeft)
        this.playerTris.push(bodyRight)
        this.playerTris.push(bodyMiddle)
        this.playerTris.push(tailLeft)
        this.playerTris.push(tailRight)
    }

}