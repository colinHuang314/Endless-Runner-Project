class Camera {
    constructor(x, y, z, fov = 53.13) {
        this.x = x
        this.y = y
        this.z = z
        this.fov = fov
    }


    toString() {
        return `Point(x=${this.x}, y=${this.y}, z=${this.z}) | fov: ${this.fov}`
    }
    


}