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
        this.gl.enable(this.gl.DEPTH_TEST);

        // Compiling vertex and fragment shader
        this.program = webglUtils.createProgramInfo(this.gl, ["3d-vertex-shader", "3d-fragment-shader"])

        this.mesh_list = []; // Array used to store all the mesh used in the scene
        this.load_mesh_json(json_path).then(() => {});

        this.fov = 45;
        // Creating a camera for this scene
        const position = [10,2,10], target = [0, 2, 0], up = [0, 1, 0];
        this.camera = new Camera(position, target, up);
        this.keys = {};

        // Light used in the scene
        this.light = {ambient: [0.1,0.1,0.1], color : [1.0, 1.0, 1.0], direction : [1,1,1]}


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

    // Compute the projection matrix
    projectionMatrix(){
        let fieldOfViewRadians = degToRad(this.fov);
        let aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        let zmin=0.1;
        return m4.perspective(fieldOfViewRadians, aspect, zmin, 200);
    }

    // Move the camera using keyboard
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
        if (this.keys["q"]){
            this.camera.pedestal(step)
        }
        if (this.keys["e"]){
            this.camera.pedestal(-step)
        }
        if (this.keys["h"]){
            this.camera.cant(-step)
        }
        if (this.keys["k"]){
            this.camera.cant(step)
        }
        if (this.keys["u"]){
            this.camera.pedestal(step)
        }
        if (this.keys["j"]){
            this.camera.pedestal(-step)
        }
        if (this.keys["ArrowUp"]){
            this.camera.tilt(step)
        }
        if (this.keys["ArrowDown"]){
            this.camera.tilt(-step)
        }
        if (this.keys["ArrowLeft"]){
            this.camera.pan(step)
        }
        if (this.keys["ArrowRight"]){
            this.camera.pan(-step)
        }
        if (this.keys["r"]){
            this.camera.align()
        }
    }

    // Change the type of camera, AnimatedCamera or Camera
    switch_camera(){
        if (this.camera instanceof AnimatedCamera){
            const position = [10,2,10], target = [0, 2, 0], up = [0, 1, 0];
            this.camera = new Camera(position, target, up);
        }else{
            this.camera = new AnimatedCamera();
        }
    }

}

// Draw everything in the scene on the canvas.
function draw() {

    // Resizing the canvas to the window size
    resizeCanvasToDisplaySize(scene.gl.canvas);
    scene.gl.viewport(0, 0, scene.gl.canvas.width, scene.gl.canvas.height);

    scene.key_controller();

    // Getting the projection matrix from the scene,
    // calculated only once
    let proj = scene.projectionMatrix()

    let view = scene.camera.getViewMatrix()
    scene.light.direction = m4.normalize(scene.light.direction);

    scene.mesh_list.forEach(m => {
        m.render(scene.gl, scene.program, proj, view, scene.camera, scene.light);
    });

    requestAnimationFrame(draw)
}