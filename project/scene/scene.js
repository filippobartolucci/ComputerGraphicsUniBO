class Scene {
    // Scene constructor
    constructor(canvas_id, json_path){

        // Getting WebGL context from canvas
        this.canvas = document.getElementById(canvas_id);
        this.gl = this.canvas.getContext("webgl");

        if (!this.gl) { // Check if WebGL is supported
            alert("WebGL not supported!");
            throw new Error("WebGL not supported!");
        }

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Compiling vertex and fragment shader
        this.program = webglUtils.createProgramInfo(this.gl, ["3d-vertex-shader", "3d-fragment-shader"])

        this.mesh_list = []; // Array used to store all the mesh used in the scene
        this.load_mesh_json(json_path).then(() => {});

        // Creating a camera for this scene
        // const position = [2.5, 0.5, 2.5], target = [0, 0, 0], up = [0, 1, 0];
        const position = [0,0,5], target = [0, 0, 0], up = [0, 1, 0];
        this.camera = new Camera(position, target, up);
        this.keys = {};

        // Light used in the scene
        this.light = {ambientLight : [0.0, 0.0, 0.0], colorLight : [1.0, 1.0, 1.0]}



    }

    // Function that loads a list of meshes from a json file
    // and then creates all the  mesh objects that will be used.
    async load_mesh_json(json_path){
        const response = await fetch(json_path);
        const json = await response.json();
        json.meshes.forEach(obj => {
            this.mesh_list.push(new MeshObj(obj, this.gl));
        });
    }

    move_camera(){
        let step = 0.1;
        switch (key){
            case "w":
                this.camera.dolly(step)
                break;
            case "s":
                this.camera.dolly(-step)
                break;
            case "d":
                this.camera.truck(step)
                break;
            case "a":
                this.camera.truck(-step)
                break;
            case "u":
                this.camera.pedestal(step)
                break;
            case "j":
                this.camera.pedestal(-step)
                break;
            case "h":
                this.camera.tilt(step)
                break;
            case "k":
                this.camera.pan(-step)
                break;
        }
    }

    // Compute the projection matrix
    projectionMatrix(){
        let fieldOfViewRadians = degToRad(45);
        let aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        let zmin=0.1;
        return m4.perspective(fieldOfViewRadians, aspect, zmin, 200);
    }

    key_controller(){
        let step = 0.05;

        if (this.keys["w"]){
            this.camera.dolly(step)
        }
        if (this.keys["s"]){
            this.camera.dolly(-step)
        }
        if (this.keys["a"]){
            this.camera.truck(-step)
        }
        if (this.keys["d"]){
            this.camera.truck(step)
        }
        if (this.keys["u"]){
            this.camera.pedestal(step)
        }
        if (this.keys["j"]){
            this.camera.pedestal(-step)
        }
        if (this.keys["h"]){
            let deg = degToRad(step*20)
            this.camera.pan(deg)
        }
        if (this.keys["k"]){
            let deg = degToRad(step*20)
            this.camera.pan(-deg)
        }
        if (this.keys["ArrowUp"]){
            step = step/2;
            this.camera.tilt(step)
        }
        if (this.keys["ArrowDown"]){
            step = step/2;
            this.camera.tilt(-step)
        }
    }

}

// Draw everything in the scene on the canvas.
function draw() {

    resizeCanvasToDisplaySize(scene.gl.canvas);
    scene.gl.viewport(0, 0, scene.gl.canvas.width, scene.gl.canvas.height);
    scene.gl.enable(scene.gl.DEPTH_TEST);

    scene.key_controller();

    scene.mesh_list.forEach(m => {
        m.render2(scene.gl, scene.program, scene.projectionMatrix(), scene.camera, scene.light);
    });

    requestAnimationFrame(draw)
}