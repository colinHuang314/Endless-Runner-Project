class RectPrism{
    constructor(x, y, z, type){
        this.helpers = new Helpers()
        this.x = x
        this.y = y
        this.z = z
        this.type = type

        if (type === 'barrier'){
            this.sizeX = 20
            this.sizeY = 150
            this.sizeZ = 250
            this.color = 0xff0000
            this.alpha = 1
            this.relativeWidth = 4
        }
        else if (type === 'long wall'){
            this.sizeX = 30
            this.sizeY = 35
            this.sizeZ = 180
            this.color = 0xff0000
            this.alpha = 1
            this.relativeWidth = 4
        }
        else if (type === 'wide wall'){
            this.sizeX = 220
            this.sizeY = 35
            this.sizeZ = 30
            this.color = 0xff0000
            this.alpha = 1
            this.relativeWidth = 4
        }
        else if(type === 'large'){
            this.sizeX = 55
            this.sizeY = 50
            this.sizeZ = 55
            this.color = 0xff0000
            this.alpha = 1
            this.relativeWidth = 4
        }
        else if(type === 'medium'){
            this.sizeX = 45
            this.sizeY = 40
            this.sizeZ = 45
            this.color = 0xff0000
            this.alpha = 1
            this.relativeWidth = 3
        }
        else{
            this.sizeX = 35
            this.sizeY = 30
            this.sizeZ = 35
            this.color = 0xff0000
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