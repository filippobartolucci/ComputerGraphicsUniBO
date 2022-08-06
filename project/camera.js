class Camera {
    constructor(pos, lookAt, up){
        this.position = pos
        this.forward = m4.normalize(m4.subtractVectors(lookAt, pos));
        this.right = m4.normalize(m4.cross(this.forward, up));
        this.up = m4.normalize(m4.cross(this.right, this.forward));
    }

    
    // Rotates a camera’s view up or down. 
    // You can tilt up or tilt down. 
    // This rotates about a camera’s u axis.
    tilt(){
        // var n = m4.subtractVectors(this.position, this.forward);
        // n = m4.normalize(n);

    }

    // Rotates the camera’s view horizontally about the camera’s eye location.
    // You can pan left or pan right.This rotates about a camera’s v axis.
    pan(){

    }

    // Tilts a camera sideways while maintaining its location and viewing direction.
    // You can cant left and cant right.
    // This is a rotation about a camera’s n axis.
    cant(){

    }

    // Moves a camera’s location laterally(left or right) while the camera’s direction of view is unchanged.
    // You can truck left or truck right.
    // This is a translation along a camera’s u axis.
    truck(dist){
        this.position[0] = this.position[0] + (this.right[0] * dist);
        this.position[1] = this.position[1] + (this.right[1] * dist);
        this.position[2] = this.position[2] + (this.right[2] * dist);
    }

    // Elevates or lowers a camera on its stand.
    // You can pedestal up and pedestal down.
    // This is a translation along a camera’s v axis.
    pedestal(dist){
        this.position[0] = this.position[0] + (this.up[0] * dist);
        this.position[1] = this.position[1] + (this.up[1] * dist);
        this.position[2] = this.position[2] + (this.up[2] * dist);
    }

    // Moves a camera closer to, or further from, the location it is looking at.
    // You can dolly in and dolly out.
    // This is a translation along a camera’s n axis.
    dolly(dist){
        this.position[0] = this.position[0] + (this.forward[0] * dist);
        this.position[1] = this.position[1] + (this.forward[1] * dist);
        this.position[2] = this.position[2] + (this.forward[2] * dist);
    }

    // Moves a camera in a circular path while maintaining the object it is looking at in the center of its view.
    // You can arc left and arc right.
    // This is a rotation about a vector in the direction of a camera’s v axis with the center of rotation at a camera’s center point.
    arc(){

    }

    getViewMatrix(){
        const look = m4.addVectors(this.position, this.forward);
        const cameraMatrix = m4.lookAt(this.position, look, this.up);
        return m4.inverse(cameraMatrix); // ViewMatrix
    };

}
