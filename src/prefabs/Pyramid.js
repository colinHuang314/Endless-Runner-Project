
class Pyramid{
    constructor(x, y, z, type){
        this.helpers = new Helpers()
        this.x = x
        this.y = y
        this.z = z
        this.type = type

        if(type === 'high'){
            this.pointValue = 50
            this.sizeX = 20
            this.sizeY = 20
            this.sizeZ = 20
            this.color = 0xfcf003
            this.alpha = 1
            this.relativeWidth = 1
        }
        else{
            this.pointValue = 10
            this.sizeX = 25
            this.sizeY = 25
            this.sizeZ = 25
            this.color = 0xff9900 // 0xff47a6
            this.alpha = 1
            this.relativeWidth = 1
        }

        // points
        let base = []
        base.push(new Point(x, y, z))
        base.push(new Point(x+this.sizeX, y, z))
        base.push(new Point(x+this.sizeX/2, y, z+this.sizeZ))
        this.helpers.connectPolygon(base)

        let tip = new Point(x + this.sizeX/2, y-this.sizeY, z + this.sizeZ/2)
        for(let i = 0; i < base.length; i++){
            base[i].addConnection(tip)
            tip.addConnection(base[i])
        }
        this.points = [...base, tip]
    }
}