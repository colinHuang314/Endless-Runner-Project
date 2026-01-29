class RectPrism{
    constructor(x, y, z, type){
        this.helpers = new Helpers()
        this.x = x
        this.y = y
        this.z = z
        this.type = type

        if (type === 'short wall'){
            this.sizeX = 200
            this.sizeY = 35
            this.sizeZ = 30
            this.color = 0xff0000
            this.alpha = 1
            this.relativeWidth = 4
        }
        else if(type === 'large'){
            this.sizeX = 50
            this.sizeY = 50
            this.sizeZ = 50
            this.color = 0xff0000
            this.alpha = 1
            this.relativeWidth = 4
        }
        else if(type === 'medium'){
            this.sizeX = 40
            this.sizeY = 40
            this.sizeZ = 40
            this.color = 0xff1212
            this.alpha = 1
            this.relativeWidth = 3
        }
        else{
            this.sizeX = 30
            this.sizeY = 30
            this.sizeZ = 30
            this.color = 0xff2929
            this.alpha = 1
            this.relativeWidth = 3
        }

        // points
        let frontFace = []
        frontFace.push(new Point(x+this.sizeX, y + this.sizeY, z))
        frontFace.push(new Point(x+this.sizeX, y, z))
        frontFace.push(new Point(x, y, z))
        frontFace.push(new Point(x, y + this.sizeY, z))
        this.helpers.connectPolygon(frontFace)

        let backFace = []
        backFace.push(new Point(x+this.sizeX, y + this.sizeY, z+this.sizeZ))
        backFace.push(new Point(x+this.sizeX, y, z+this.sizeZ))
        backFace.push(new Point(x, y, z+this.sizeZ))
        backFace.push(new Point(x, y + this.sizeY, z+this.sizeZ))
        this.helpers.connectPolygon(backFace)

        // conect to make cube
        for(let i = 0; i < 4; i++){
            frontFace[i].addConnection(backFace[i])
            backFace[i].addConnection(frontFace[i])
        }

        this.points = [...frontFace, ...backFace]
    }
}