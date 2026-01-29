class Camera {
    constructor(x, y, z, fov = 53.13) {
        this.x = x
        this.y = y
        this.z = z
        this.fov = fov
    }

    follow(xTarget, yTarget, zTarget, followConst){
        this.x += (xTarget - this.x) * followConst * 1.5
        this.y += (yTarget - this.y) * followConst * 2
        this.z += (zTarget - this.z) * followConst
    }

    toString() {
        return `Point(x=${this.x}, y=${this.y}, z=${this.z}) | fov: ${this.fov}`
    }
    


}