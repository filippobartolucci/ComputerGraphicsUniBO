class Scene {
    // Scene constructor
    constructor(canvas_id, json_path){
        // Getting WebGL context from canvas
        this.canvas = document.getElementById(canvas_id);
        this.gl = this.canvas.getContext("webgl");
        this.gl2d = this.canvas.getContext("2d");


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
        const position = [10,2,10], target = [0, 2, 0], up = [0, 1, 0];
        this.camera = new Camera(position, target, up);
        this.keys = {};

        // Light used in the scene
        this.light = {position : [3, 3, 3], color : [1.0, 1.0, 1.0], direction : [1,1,1]}
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
    scene.gl.enable(scene.gl.DEPTH_TEST);

    scene.key_controller();


    // Getting the projection matrix from the scene,
    // calculated only once
    let proj = scene.projectionMatrix()

    scene.mesh_list.forEach(m => {
        m.render(scene.gl, scene.program, proj, scene.camera, scene.light);
    });

    requestAnimationFrame(draw)
}

function addtouchcanvas(scene){
    scene.mouse = [];

    function mouseDown(e) {
        scene.mouse.drag = true;
        scene.mouse.old_x = e.pageX;
        scene.mouse.old_y = e.pageY;
        e.preventDefault();
    }

    function mouseUp(e){
        scene.mouse.drag=false;
    }

    function mouseMove(e) {
        if (!scene.mouse.drag){
            return false;
        }
        let dX=-(e.pageX-scene.mouse.old_x)*2*Math.PI/scene.canvas.width;
        scene.camera.pan(-dX * 0.1);

        let dY=-(e.pageY-scene.mouse.old_y)*2*Math.PI/scene.canvas.height;
        scene.camera.tilt(-dY * 0.1);

        scene.mouse.old_x=e.pageX;
        scene.mouse.old_y=e.pageY;

        e.preventDefault();
    }

    scene.canvas.addEventListener('touchstart',mouseDown,false);
    scene.canvas.addEventListener('touchmove',mouseMove,false);
    scene.canvas.addEventListener('touchend',mouseUp,false);
    scene.canvas.addEventListener('touchend',mouseUp,false);
    scene.canvas.addEventListener('mouseout',mouseUp,false);
    scene.canvas.onmousedown=mouseDown;
    scene.canvas.onmouseup=mouseUp;
    scene.canvas.mouseout=mouseUp;
    scene.canvas.onmousemove=mouseMove;
}