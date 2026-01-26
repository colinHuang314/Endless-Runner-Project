class Camera {
    constructor(x, y, z, directionVector = [0, 0, 1], fov = 53.13) {
        this.x = x
        this.y = y
        this.z = z
        this.directionVector = directionVector
        this.fov = fov
    }


    toString() {
        return `Point(x=${this.x}, y=${this.y}, z=${this.z}) | Pointing (x=${this.directionVector[0]}, y=${this.directionVector[1]}, z=${this.directionVector[2]}) | fov: ${this.fov}`
    }
    


}