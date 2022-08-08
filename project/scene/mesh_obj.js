class MeshObj {
    constructor(obj,gl) {
        this.name = obj.name;
        this.obj_source = obj.obj_source;
        this.mtl_source = obj.mtl_source;
        this.position = obj.position;

        this.mesh = []; // This object stores all the mesh information
        this.mesh.sourceMesh = this.obj_source; // .sourceMesh is used in load_mesh.js
        LoadMesh(gl, this.mesh).then(() => console.log(" - loadMesh " + this.name + " ok."));
    }

    // Function called to draw the mesh on the gl canvas
    render(){

    }


    async

}