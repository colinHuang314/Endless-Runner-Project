class Point {
    constructor(x, y, z, connections = []) {
        this.x = x
        this.y = y
        this.z = z
        this.connections = connections
    }

    addConnection(point) {
        this.connections.push(point)
    }

    toString() {
        return `Point(x=${this.x}, y=${this.y}, z=${this.z}) | has ${this.connections.length} connections`
    }



}