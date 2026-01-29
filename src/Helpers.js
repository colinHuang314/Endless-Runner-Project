class Helpers{
    constructor(){
    }

    /*https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve*/
    // Standard Normal variate using Box-Muller transform.
    gaussianRandom(mean=0, stdev=1) {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        // Transform to the desired mean and standard deviation:
        return z * stdev + mean;
    }

    connectPolygon(points){
        for(let i = 0; i < points.length; i++){
            if (i === (points.length - 1)){
                points[i].addConnection(points[0])
                points[0].addConnection(points[i])
            }
            else{
                points[i].addConnection(points[i+1])
                points[i+1].addConnection(points[i])
            }
        }
    }
}